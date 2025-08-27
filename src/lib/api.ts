// src/lib/api.ts
type TripRequestCreate = {
  purpose: string;
  origin: string;
  destination: string;
  schedule: string | null;
  start_time?: string | null;    // optional mirror
  end_time?: string | null;      // keep null if not used
  passengers?: number | null;
  notes?: string | null;
  status?: "pending" | "approved" | "rejected" | "cancelled";
};

export async function createTripRequest(input: TripRequestCreate) {
  const r = await fetch("/api/faculty/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j?.ok === false) {
    // If backend accidentally returns HTML (Unexpected token '<'), throw generic error
    const msg = typeof j?.error === "string" ? j.error : `Request failed (HTTP ${r.status})`;
    throw new Error(msg);
  }
  return { id: j?.id ?? j?.data?.id };
}
