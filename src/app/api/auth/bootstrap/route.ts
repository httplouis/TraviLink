import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST() {
  const h = await headers();
  const auth = h.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;
  if (!token) return NextResponse.json({ error: "missing token" }, { status: 401 });

  const supabase = createClient(URL, KEY, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: userData, error: uErr } = await supabase.auth.getUser();
  if (uErr || !userData.user) {
    return NextResponse.json({ error: uErr?.message ?? "unauthenticated" }, { status: 401 });
  }

  const uid = userData.user.id;
  const email = userData.user.email;

  // create-if-missing
  const { data: existing, error: e1 } = await supabase
    .from("users")
    .select("role")
    .eq("auth_user_id", uid)
    .maybeSingle();

  let role = existing?.role as "admin"|"driver"|"faculty"|undefined;

  if (!existing) {
    const { data: inserted, error: e2 } = await supabase
      .from("users")
      .insert({ auth_user_id: uid, email, status: "active", role: "faculty" })
      .select("role")
      .single();
    if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });
    role = inserted.role as any;
  }

  // optional: short-lived role cookie (5 minutes) to speed up subsequent landings
  const c = await cookies();
  c.set({
    name: "tl_role",
    value: role ?? "faculty",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 5,
    path: "/",
  });

  return NextResponse.json({ role: (role ?? "faculty") as "admin"|"driver"|"faculty" });
}
