import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SRV = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function normalizePhone(p: string) {
  const d = p.replace(/\D/g, "");
  if (d.startsWith("09") && d.length === 11) return "+63" + d.slice(1);
  if (d.startsWith("9") && d.length === 10) return "+63" + d;
  if (d.startsWith("63")) return "+" + d;
  if (d.startsWith("+")) return d;
  return "+" + d;
}

function bad(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

export async function POST(req: NextRequest) {
  try {
    if (!URL || !SRV) return bad("Server missing Supabase env", 500);

    const body = await req.json().catch(() => ({}));
    const phone: string | undefined = body?.phone;
    const name: string | undefined = body?.name;
    const address: string | undefined = body?.address;

    if (!phone) return bad("Missing phone");
    if (!name || name.trim().length < 2) return bad("Please enter your full name.");

    const normalized = normalizePhone(phone);
    if (!/^\+63\d{10}$/.test(normalized)) {
      return bad("Invalid PH phone format. Use 09XXXXXXXXX (11 digits).");
    }

    const admin = createClient(URL, SRV, { auth: { persistSession: false } });

    // Synthetic email so NOT NULL email is satisfied in public.users
    const digits = normalized.replace(/\D/g, ""); // 639XXXXXXXXX
    const aliasEmail = `${digits}@drivers.local`;

    // 1) Create or find the auth user
    let authUserId: string | null = null;

    const created = await admin.auth.admin.createUser({
      email: aliasEmail,
      email_confirm: true,
      phone: normalized,
      phone_confirm: true,
      user_metadata: { role: "driver" },
    });

    if (created.data?.user) {
      authUserId = created.data.user.id;
    } else {
      const msg = (created.error?.message || "").toLowerCase();
      if (msg.includes("already") || msg.includes("exists")) {
        // listUsers to find by email (SDK has no getUserByEmail)
        let found: string | null = null;
        for (let page = 1; page <= 5 && !found; page++) {
          const list = await admin.auth.admin.listUsers({ page, perPage: 200 });
          if (list.error) break;
          const hit = list.data.users.find((u) => u.email === aliasEmail);
          if (hit) found = hit.id;
          if (!list.data.users.length) break;
        }
        if (!found) return bad("Auth user exists but could not be fetched", 500);
        authUserId = found;
      } else {
        return bad(created.error?.message || "Failed to create auth user", 500);
      }
    }

    // 2) Check if a public.users row already exists for this auth_user_id
    const existing = await admin
      .from("users")
      .select("id, role, email")
      .eq("auth_user_id", authUserId!)
      .maybeSingle();

    if (existing.error) return bad(existing.error.message, 500);

    if (existing.data) {
      // --- UPDATE branch: Do NOT touch 'role' (trigger would block it) ---
      const upd = await admin
        .from("users")
        .update({
          name: name.trim(),
          address: address?.trim() || null,
          phone: normalized,
          // email left as-is (already populated with alias email)
        })
        .eq("auth_user_id", authUserId!)
        .select("id, role, email")
        .single();

      if (upd.error) return bad(upd.error.message, 500);

      return NextResponse.json({
        ok: true,
        mode: "updated",
        user_id: upd.data.id,
        role: upd.data.role,
        email: upd.data.email,
        auth_user_id: authUserId,
      });
    } else {
      // --- INSERT branch: Set role once on create ---
      const ins = await admin
        .from("users")
        .insert({
          auth_user_id: authUserId!,
          email: aliasEmail,          // satisfy NOT NULL
          name: name.trim(),
          address: address?.trim() || null,
          phone: normalized,
          role: "driver",
          status: "pending",
        })
        .select("id, role, email")
        .single();

      if (ins.error) return bad(ins.error.message, 500);

      return NextResponse.json({
        ok: true,
        mode: "inserted",
        user_id: ins.data.id,
        role: ins.data.role,
        email: ins.data.email,
        auth_user_id: authUserId,
      });
    }
  } catch (e: any) {
    return bad(e?.message || "Unexpected server error", 500);
  }
}
