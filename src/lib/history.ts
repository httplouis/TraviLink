// src/lib/history.ts
export type HistoryType =
  | "Trip Request"
  | "Approval"
  | "Assignment"
  | "Trip Update"
  | "Maintenance"
  | "Login";

export type HistoryStatus = "Pending" | "Approved" | "Rejected" | "Completed" | "Cancelled" | "Info";

export type HistoryItem = {
  id: string;
  ts: string; // ISO string
  type: HistoryType;
  status: HistoryStatus;
  actor: string;      // e.g., "Mara Santos (Admin)"
  department?: string;
  title: string;      // short headline
  details: string;    // longer text
  ref?: { kind: "trip" | "vehicle" | "user"; id: string };
};

export type HistoryQuery = {
  search?: string;
  types?: HistoryType[];
  statuses?: HistoryStatus[];
  from?: string; // ISO date (inclusive)
  to?: string;   // ISO date (inclusive)
};

export const HISTORY_TYPES: HistoryType[] = [
  "Trip Request",
  "Approval",
  "Assignment",
  "Trip Update",
  "Maintenance",
  "Login",
];

export const HISTORY_STATUSES: HistoryStatus[] = [
  "Pending",
  "Approved",
  "Rejected",
  "Completed",
  "Cancelled",
  "Info",
];

function rand(seed: number) {
  let s = seed;
  return () => {
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

export function seedHistory(count = 120, seedVal = 42): HistoryItem[] {
  const r = rand(seedVal);
  const names = ["Jolo Rosales", "Mara Santos", "Ben Cruz", "Ana Dela Peña", "Rafi Gomez", "Lea Ramos"];
  const depts = ["CCMS", "CBA", "COE", "CAS"];

  const pick = <T,>(arr: T[]) => arr[Math.floor(r() * arr.length)];
  const now = Date.now();

  const items: HistoryItem[] = Array.from({ length: count }).map((_, i) => {
    const type = pick(HISTORY_TYPES);
    const statusPool: HistoryStatus[] =
      type === "Trip Request" ? ["Pending", "Approved", "Rejected"] :
      type === "Approval" ? ["Approved", "Rejected"] :
      type === "Assignment" ? ["Info"] :
      type === "Trip Update" ? ["Completed", "Cancelled", "Info"] :
      type === "Maintenance" ? ["Info"] :
      ["Info"];

    const status = pick(statusPool);
    const when = new Date(now - Math.floor(r() * 1000 * 60 * 60 * 24 * 60)); // ~past 60 days

    const refKind = pick(["trip", "vehicle", "user"] as const);
    const refId = refKind === "trip" ? `TR-${1000 + i}` : refKind === "vehicle" ? `VH-${100 + i % 20}` : `USR-${i % 50}`;

    const title =
      type === "Trip Request" ? `Trip requested by ${pick(names)}` :
      type === "Approval" ? `Request ${status.toLowerCase()} by ${pick(names)}` :
      type === "Assignment" ? `Driver assigned to trip ${refId}` :
      type === "Trip Update" ? `Trip ${status.toLowerCase()} (${refId})` :
      type === "Maintenance" ? `Vehicle ${refId} flagged for maintenance` :
      `Successful login`;

    const details =
      type === "Trip Request"
        ? "Faculty submitted a new trip request with tentative date and passenger count."
        : type === "Approval"
        ? "Admin reviewed the request and made a decision."
        : type === "Assignment"
        ? "System matched available driver and vehicle to the approved request."
        : type === "Trip Update"
        ? "Trip status changed after driver report."
        : type === "Maintenance"
        ? "Periodic inspection shows vehicle needs attention."
        : "User authenticated via email and 2FA.";

    return {
      id: cryptoRandomId(i),
      ts: when.toISOString(),
      type,
      status,
      actor: `${pick(names)} (Admin)`,
      department: pick(depts),
      title,
      details,
      ref: { kind: refKind, id: refId },
    };
  });

  // newest first
  return items.sort((a, b) => +new Date(b.ts) - +new Date(a.ts));
}

export function filterHistory(data: HistoryItem[], q: HistoryQuery): HistoryItem[] {
  return data.filter((it) => {
    if (q.search) {
      const s = q.search.toLowerCase();
      const hay = `${it.title} ${it.details} ${it.actor} ${it.department ?? ""} ${it.ref?.id ?? ""}`.toLowerCase();
      if (!hay.includes(s)) return false;
    }
    if (q.types && q.types.length && !q.types.includes(it.type)) return false;
    if (q.statuses && q.statuses.length && !q.statuses.includes(it.status)) return false;
    if (q.from && new Date(it.ts) < new Date(q.from)) return false;
    if (q.to) {
      const end = new Date(q.to);
      end.setHours(23, 59, 59, 999);
      if (new Date(it.ts) > end) return false;
    }
    return true;
  });
}

export function exportHistoryCSV(rows: HistoryItem[]): string {
  const esc = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const head = [
    "ID","Timestamp","Type","Status","Actor","Department","Title","Details","RefKind","RefId"
  ];
  const body = rows.map(r =>
    [
      r.id,
      new Date(r.ts).toISOString(),
      r.type,
      r.status,
      r.actor,
      r.department ?? "",
      r.title,
      r.details,
      r.ref?.kind ?? "",
      r.ref?.id ?? ""
    ].map(esc).join(",")
  );
  return [head.join(","), ...body].join("\n");
}

function cryptoRandomId(i: number): string {
  // short, deterministic-ish fallback id
  return `hist_${(i + 1).toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
