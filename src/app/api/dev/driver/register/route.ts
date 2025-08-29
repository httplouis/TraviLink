-- ===============================
-- Users: structured name fields
-- ===============================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1) Helper IMMUTABLE formatters (used by generated columns & triggers)
CREATE OR REPLACE FUNCTION public._name_full(p_first text, p_middle text, p_last text, p_suffix text)
RETURNS text
LANGUAGE sql IMMUTABLE AS $$
  SELECT btrim(concat_ws(' ',
    NULLIF(p_first,''),
    NULLIF(p_middle,''),
    NULLIF(p_last,''),
    NULLIF(p_suffix,'')
  ))
$$;

CREATE OR REPLACE FUNCTION public._name_last_first(p_first text, p_middle text, p_last text, p_suffix text)
RETURNS text
LANGUAGE sql IMMUTABLE AS $$
  SELECT btrim(
    concat_ws(', ',
      NULLIF(p_last,''),
      btrim(concat_ws(' ', NULLIF(p_first,''), NULLIF(p_middle,'')))
    )
    || CASE WHEN NULLIF(p_suffix,'') IS NOT NULL THEN ' '||p_suffix ELSE '' END
  )
$$;

-- 2) Columns
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS first_name     text,
  ADD COLUMN IF NOT EXISTS middle_name    text,
  ADD COLUMN IF NOT EXISTS last_name      text,
  ADD COLUMN IF NOT EXISTS suffix         text,
  ADD COLUMN IF NOT EXISTS preferred_name text;

-- 3) Generated display columns
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS name_full text
    GENERATED ALWAYS AS (public._name_full(first_name, middle_name, last_name, suffix)) STORED;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS name_last_first text
    GENERATED ALWAYS AS (public._name_last_first(first_name, middle_name, last_name, suffix)) STORED;

-- 4) Best-effort parser for legacy full names
CREATE OR REPLACE FUNCTION public.split_name(fullname text,
  OUT first_name text, OUT middle_name text, OUT last_name text, OUT suffix text)
LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
  s text := btrim(coalesce(fullname,''));
  tokens text[];
  n int;
  rest text;
  maybe_suffix text;
BEGIN
  IF s = '' THEN
    first_name := NULL; middle_name := NULL; last_name := NULL; suffix := NULL;
    RETURN;
  END IF;

  -- If it looks like "Last, First [Middle] [Suffix]"
  IF position(',' IN s) > 0 THEN
    last_name := btrim(split_part(s, ',', 1));
    rest := btrim(split_part(s, ',', 2));
    tokens := regexp_split_to_array(rest, '\s+');
    n := array_length(tokens,1);

    IF n >= 1 THEN first_name := tokens[1]; END IF;
    IF n >= 3 THEN
      -- check last token for suffix
      maybe_suffix := tokens[n];
      IF lower(maybe_suffix) IN ('jr','sr','ii','iii','iv','v','phd','md') THEN
        suffix := maybe_suffix;
        last_name := coalesce(last_name, btrim(split_part(s, ',', 1)));
        IF n >= 2 THEN middle_name := array_to_string(tokens[2:n-1],' '); END IF;
      ELSE
        middle_name := array_to_string(tokens[2:n],' ');
      END IF;
    ELSIF n = 2 THEN
      middle_name := tokens[2];
    END IF;

    RETURN;
  END IF;

  -- Otherwise: "First [Middle ...] Last [Suffix?]"
  tokens := regexp_split_to_array(s, '\s+');
  n := array_length(tokens,1);

  IF n = 1 THEN
    first_name := tokens[1]; RETURN;
  ELSIF n = 2 THEN
    first_name := tokens[1]; last_name := tokens[2]; RETURN;
  ELSE
    -- Suffix check on last token
    maybe_suffix := tokens[n];
    IF lower(maybe_suffix) IN ('jr','sr','ii','iii','iv','v','phd','md') THEN
      suffix := maybe_suffix;
      last_name := tokens[n-1];
      first_name := tokens[1];
      IF n > 3 THEN middle_name := array_to_string(tokens[2:n-2],' '); END IF;
    ELSE
      suffix := NULL;
      last_name := tokens[n];
      first_name := tokens[1];
      IF n > 2 THEN middle_name := array_to_string(tokens[2:n-1],' '); END IF;
    END IF;
    RETURN;
  END IF;
END $$;

-- 5) Trigger to keep 'name' (legacy) in sync with parts
CREATE OR REPLACE FUNCTION public.users_names_sync()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  f text; m text; l text; sfx text;
BEGIN
  -- If 'name' was set/changed and parts are blank, parse into parts
  IF TG_OP IN ('INSERT','UPDATE') AND (NEW.name IS NOT NULL) AND
     (coalesce(NEW.first_name,'') = '' AND coalesce(NEW.last_name,'') = '') THEN
    SELECT * INTO f,m,l,sfx FROM public.split_name(NEW.name);
    NEW.first_name  := coalesce(NULLIF(NEW.first_name,''),  f);
    NEW.middle_name := coalesce(NULLIF(NEW.middle_name,''), m);
    NEW.last_name   := coalesce(NULLIF(NEW.last_name,''),   l);
    NEW.suffix      := coalesce(NULLIF(NEW.suffix,''),      sfx);
  END IF;

  -- Always normalize legacy 'name' from parts
  NEW.name := public._name_full(NEW.first_name, NEW.middle_name, NEW.last_name, NEW.suffix);

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_users_names_sync ON public.users;
CREATE TRIGGER trg_users_names_sync
BEFORE INSERT OR UPDATE OF name, first_name, middle_name, last_name, suffix ON public.users
FOR EACH ROW EXECUTE FUNCTION public.users_names_sync();

-- 6) Backfill from existing 'name' (only fills blanks)
UPDATE public.users u
SET first_name  = COALESCE(u.first_name,  (public.split_name(u.name)).first_name),
    middle_name = COALESCE(u.middle_name, (public.split_name(u.name)).middle_name),
    last_name   = COALESCE(u.last_name,   (public.split_name(u.name)).last_name),
    suffix      = COALESCE(u.suffix,      (public.split_name(u.name)).suffix)
WHERE u.name IS NOT NULL
  AND (u.first_name IS NULL OR u.last_name IS NULL);

-- 7) Indexes for quick lookup (and fuzzy search if desired)
CREATE INDEX IF NOT EXISTS users_last_first_idx
  ON public.users (lower(last_name), lower(first_name));

CREATE INDEX IF NOT EXISTS users_last_trgm_idx
  ON public.users USING gin (last_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS users_first_trgm_idx
  ON public.users USING gin (first_name gin_trgm_ops);

-- 8) Helper: find by \"Last, First [Middle?]\" (case-insensitive; middle can be initial)
CREATE OR REPLACE FUNCTION public.find_users_by_lfm(last_name text, first_name text, middle text DEFAULT NULL)
RETURNS TABLE(id uuid, email text, name_last_first text, name_full text)
LANGUAGE sql STABLE AS $$
  SELECT u.id, u.email, u.name_last_first, u.name_full
  FROM public.users u
  WHERE lower(u.last_name)  = lower(coalesce(last_name,''))
    AND lower(u.first_name) = lower(coalesce(first_name,''))
    AND (
      middle IS NULL
      OR left(lower(coalesce(u.middle_name,'')), 1) = left(lower(middle), 1)
    )
  ORDER BY u.last_name, u.first_name, coalesce(u.middle_name,'')
$$;

-- 9) Update me view to expose new fields
CREATE OR REPLACE VIEW public.me AS
SELECT
  u.id,
  u.name,              -- legacy full name (kept in sync)
  u.name_full,
  u.name_last_first,
  u.first_name,
  u.middle_name,
  u.last_name,
  u.suffix,
  u.preferred_name,
  u.email,
  u.role::text AS role,
  u.department,
  u.department_id,
  u.status,
  u.created_at,
  u.auth_user_id,
  u.phone,
  u.birthdate,
  u.address
FROM public.users u
WHERE u.auth_user_id = auth.uid();
