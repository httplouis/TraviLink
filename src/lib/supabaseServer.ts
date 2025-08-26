import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function getSupabaseServer() {
  const cookieStore = await cookies(); // Next 15: dynamic API must be awaited

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Must return string | undefined
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // Must accept CookieOptions
        set(name: string, value: string, options: CookieOptions) {
          // In some server contexts cookies() can be read-only; ignore errors
          try {
            cookieStore.set({ name, value, ...options });
          } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options, maxAge: 0 });
          } catch {}
        },
      },
    }
  );
}
