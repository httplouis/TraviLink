import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Generic bootstrap
 * - Works for admin/driver/faculty
 * - Creates public.users row if missing
 * - Patches missing fields from auth.user_metadata (name, department, birthdate, address)
 * - Returns role and sets a short-lived tl_role cookie
 */
export async function POST() {
  try {
    const h = await headers();
    const auth = h.get("authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;
    if (!token) {
      return NextResponse.json({ error: "missing token" }, { status: 401 });
    }

    const supabase = createClient(URL, KEY, {
      auth: { persistSession: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    // who is this?
    const { data: who, error: uErr } = await supabase.auth.getUser();
    if (uErr || !who?.user) {
      return NextResponse.json(
        { error: uErr?.message ?? "unauthenticated" },
        { status: 401 }
      );
    }

    const authUser = who.user;
    const uid = authUser.id;
    const email = authUser.email ?? undefined;
    const meta = (authUser.user_metadata ?? {}) as {
      role?: string;
      name?: string;
      department?: string | null;
      birthdate?: string | null; // yyyy-mm-dd expected
      address?: string | null;
      phone?: string | null;
    };

    // 1) See if a profile already exists for this auth user
    const { data: existing, error: selErr } = await supabase
      .from("users")
      .select("id, role, name, email, department, birthdate, address, phone")
      .eq("auth_user_id", uid)
      .maybeSingle();
    if (selErr) {
      return NextResponse.json({ error: selErr.message }, { status: 500 });
    }

    // Role precedence:
    //   existing.role (if exists) >
    //   metadata.role (if valid) >
    //   default "faculty"
    const validRoles = new Set(["admin", "driver", "faculty", "staff"]);
    const roleFromMeta =
      meta.role && validRoles.has(meta.role) ? (meta.role as "admin" | "driver" | "faculty" | "staff") : undefined;
    const roleFinal: "admin" | "driver" | "faculty" | "staff" =
      (existing?.role as any) ?? roleFromMeta ?? "faculty";

    if (!existing) {
      // 2) Create-if-missing (RLS insert_self should allow this with the user's JWT)
      const { error: insErr } = await supabase.from("users").upsert(
        {
          auth_user_id: uid,
          email: email ?? null,
          role: roleFinal,
          status: "active",
          name: meta.name ?? "",
          department: meta.department ?? null,
          birthdate: meta.birthdate ?? null, // NEW
          address: meta.address ?? null,     // NEW
          phone: meta.phone ?? null,
        },
        { onConflict: "auth_user_id" }
      );
      if (insErr) {
        return NextResponse.json({ error: insErr.message }, { status: 500 });
      }
    } else {
      // 3) Patch only missing/empty fields from metadata (idempotent & safe)
      const patch: Record<string, any> = {};
      if (!existing.email && email) patch.email = email;
      if (!existing.name && meta.name) patch.name = meta.name;
      if (!existing.department && meta.department) patch.department = meta.department;
      if (!existing.birthdate && meta.birthdate) patch.birthdate = meta.birthdate;
      if (!existing.address && meta.address) patch.address = meta.address;
      if (!existing.phone && meta.phone) patch.phone = meta.phone;

      // allow role change only if there is none yet AND metadata provided a valid one
      if (!existing.role && roleFromMeta) patch.role = roleFromMeta;

      if (Object.keys(patch).length > 0) {
        const { error: updErr } = await supabase
          .from("users")
          .update(patch)
          .eq("auth_user_id", uid);
        if (updErr) {
          return NextResponse.json({ error: updErr.message }, { status: 500 });
        }
      }
    }

    // short-lived role cookie (5 minutes) to speed up subsequent redirects
    const c = await cookies();
    c.set({
      name: "tl_role",
      value: roleFinal,
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 5,
      path: "/",
    });

    return NextResponse.json({ role: roleFinal });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "bootstrap failed" },
      { status: 500 }
    );
    }
}
