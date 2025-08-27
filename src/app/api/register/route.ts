// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, password, role = "faculty", department = null } = body;

  const cookieStore = cookies();
  const res = NextResponse.json({ ok: true });

  const supabase = createServerClient(supabaseUrl, supabaseAnon, {
    cookies: {
      get: (key: string) => cookieStore.get(key)?.value,
      set: (key: string, value: string, options: any) =>
        res.cookies.set({ name: key, value, ...options }),
      remove: (key: string, options: any) =>
        res.cookies.set({ name: key, value: "", ...options, maxAge: 0 }),
    },
  });

  // 1. Create auth account
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name }, // optional metadata
    },
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  const authUser = data.user;
  if (!authUser) {
    return NextResponse.json({ ok: false, error: "Auth user not created" }, { status: 400 });
  }

  // 2. Insert profile in public.users
  const { error: insertError } = await supabase.from("users").insert({
    name,
    email,
    role,
    department,
    status: "active",
    auth_user_id: authUser.id,
  });

  if (insertError) {
    return NextResponse.json({ ok: false, error: insertError.message }, { status: 500 });
  }

  return res;
}
