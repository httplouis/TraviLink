// src/app/api/me/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET() {
  const cookieStore = cookies();
  const headerList = headers();

  const supabase = createServerClient(supabaseUrl, supabaseAnon, {
    cookies: {
      get: (key: string) => cookieStore.get(key)?.value,
    },
    headers: {
      get: (key: string) => headerList.get(key) ?? undefined,
    },
  });

  // 1. get auth user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { ok: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  // 2. fetch profile row from public.users
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (profileError) {
    return NextResponse.json(
      { ok: false, error: "Profile not found", auth: user },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    auth: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
    },
    profile,
  });
}
