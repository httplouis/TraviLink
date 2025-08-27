// src/app/api/faculty/requests/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,          // server-only secret
  { auth: { persistSession: false } }
);

// Minimal validation (accepts either schedule OR start/end)
const RequestSchema = z.object({
  user_id: z.string().uuid(),
  purpose: z.string().min(1, "Purpose is required."),
  pickup: z.string().min(1, "Pickup is required."),         // UI field
  destination: z.string().min(1, "Destination is required."),
  schedule: z.string().datetime().optional(),               // if using single datetime
  start: z.string().datetime().optional(),                  // if using start/end fields
  end: z.string().datetime().optional(),
  passengers: z.union([z.number().int().min(1), z.null(), z.literal("")]).optional(),
  notes: z.string().optional().or(z.null()).or(z.literal("")),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.parse(body);

    // map UI → DB
    const origin = parsed.pickup;
    const passengers =
      parsed.passengers === "" ? null : parsed.passengers ?? null;

    // choose which time columns to write
    const useStartEnd = !!(parsed.start && parsed.end);
    const start_time = useStartEnd ? parsed.start! : parsed.schedule ?? null;
    const end_time   = useStartEnd ? parsed.end!   : null;

    // also keep old 'schedule' for backward-compat (optional)
    const schedule = parsed.schedule ?? parsed.start ?? null;

    const { data, error } = await supabase
      .from("trip_requests")
      .insert({
        user_id: parsed.user_id,
        purpose: parsed.purpose,
        origin,
        destination: parsed.destination,
        schedule,                   // keep if column exists
        start_time,
        end_time,
        passengers,
        notes: parsed.notes ?? null,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: err.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
