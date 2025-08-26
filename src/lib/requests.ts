// src/lib/requests.ts
export type RequestStatus = "Pending" | "Approved" | "Rejected";
export type Priority = "Normal" | "Urgent";

export type RequestItem = {
  id: string;
  createdAt: string;          // ISO timestamp
  neededOn: string;           // ISO date/time of requested trip
  requester: string;          // faculty/staff name
  department: string;         // e.g., CCMS
  campus: string;             // e.g., Lucena
  origin: string;
  destination: string;
  passengers: number;
  purpose: string;
  priority: Priority;
  status: RequestStatus;
  notes?: string;
};

export type RequestsQuery = {
  search?: string;
  statuses?: RequestStatus[];
  campus?: string;
  from?: string; // ISO date inclusive
  to?: string;   // ISO date inclusive
  urgentOnly?: boolean;
};

export const REQUEST_STATUSES: RequestStatus[] = ["Pending", "Approved", "Rejected"];

const CAMPUSES = ["Lucena", "Candelaria", "Saman"];
const DEPTS = ["CCMS", "CBA", "COE", "CAS"];
const NAMES = ["Jolo Rosales", "Mara Santos", "Ana Dela Peña", "Ben Cruz", "Lea Ramos", "Rafi Gomez"];
const PLACES = ["Main Gate", "IT Building", "COE Hall", "City Hall", "Provincial Capitol", "Sports Complex", "Terminal"];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

export function seedRequests(n = 80, seed = 7): RequestItem[] {
  const r = rng(seed);
  const now = Date.now();
  const list: RequestItem[] = Array.from({ length: n }).map((_, i) => {
    const created = new Date(now - Math.floor(r() * 1000 * 60 * 60 * 24 * 45)); // last 45 days
    const when = new Date(created.getTime() + Math.floor(r() * 1000 * 60 * 60 * 24 * 20));
    const status: RequestStatus =
      r() < 0.6 ? "Pending" : r() < 0.8 ? "Approved" : "Rejected";
    const priority: Priority = r() < 0.2 ? "Urgent" : "Normal";

    return {
      id: `REQ-${1000 + i}`,
      createdAt: created.toISOString(),
      neededOn: when.toISOString(),
      requester: NAMES[Math.floor(r() * NAMES.length)],
      department: DEPTS[Math.floor(r() * DEPTS.length)],
      campus: CAMPUSES[Math.floor(r() * CAMPUSES.length)],
      origin: PLACES[Math.floor(r() * PLACES.length)],
      destination: PLACES[Math.floor(r() * PLACES.length)],
      passengers: 4 + Math.floor(r() * 36),
      purpose: r() < 0.5 ? "Department activity" : "Official errand",
      priority,
      status,
    };
  });

  // newest first by createdAt
  return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function filterRequests(data: RequestItem[], q: RequestsQuery): RequestItem[] {
  return data.filter((it) => {
    if (q.search) {
      const s = q.search.toLowerCase();
      const hay = `${it.id} ${it.requester} ${it.department} ${it.campus} ${it.origin} ${it.destination} ${it.purpose}`.toLowerCase();
      if (!hay.includes(s)) return false;
    }
    if (q.statuses?.length && !q.statuses.includes(it.status)) return false;
    if (q.campus && q.campus !== "All" && it.campus !== q.campus) return false;
    if (q.urgentOnly && it.priority !== "Urgent") return false;
    if (q.from && new Date(it.createdAt) < new Date(q.from)) return false;
    if (q.to) {
      const d = new Date(q.to);
      d.setHours(23, 59, 59, 999);
      if (new Date(it.createdAt) > d) return false;
    }
    return true;
  });
}

export function exportRequestsCSV(rows: RequestItem[]): string {
  const esc = (v: string | number) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = [
    "ID","CreatedAt","NeededOn","Status","Priority","Requester","Department","Campus",
    "Origin","Destination","Passengers","Purpose","Notes"
  ];
  const body = rows.map(r => [
    r.id,
    new Date(r.createdAt).toISOString(),
    new Date(r.neededOn).toISOString(),
    r.status,
    r.priority,
    r.requester,
    r.department,
    r.campus,
    r.origin,
    r.destination,
    r.passengers,
    r.purpose,
    r.notes ?? ""
  ].map(esc).join(","));
  return [head.join(","), ...body].join("\n");
}
