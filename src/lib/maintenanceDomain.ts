// src/lib/maintenanceDomain.ts
export type MaintVehicleType = "Bus" | "Van" | "Car";
export type ServiceState = "In Service" | "Out of Service";

export type MaintVehicle = {
  id: string;
  name: string;
  type: MaintVehicleType;
  campus: string;
  plate: string;
  mileageKm: number;
  serviceState: ServiceState;
};

export type MaintSeverity = "Low" | "Medium" | "High" | "Critical";
export type MaintStatus = "Reported" | "Diagnosing" | "In Progress" | "Waiting Parts" | "Completed";

export const CAMPUSES = ["Lucena", "Candelaria", "Saman"];
export const VEHICLE_TYPES: MaintVehicleType[] = ["Bus", "Van", "Car"];
export const MAINT_STATUSES: MaintStatus[] = ["Reported", "Diagnosing", "In Progress", "Waiting Parts", "Completed"];
export const SEVERITIES: MaintSeverity[] = ["Low", "Medium", "High", "Critical"];

export type MaintenanceTicket = {
  id: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  campus: string;
  vehicleId: string;
  title: string;
  description: string;
  severity: MaintSeverity;
  status: MaintStatus;
  reporter: string;
  assignee?: string;      // e.g., "Mec. Cruz"
  dueDate?: string;       // ISO
  cost?: number;          // PHP
  parts?: string;
  photos?: string[];      // data URLs or URLs
  markOutOfService?: boolean;
};

export type MaintenanceQuery = {
  search?: string;
  campus?: string; // All | campus name
  types?: MaintVehicleType[];
  severities?: MaintSeverity[];
  statuses?: MaintStatus[];
  from?: string; // ISO inclusive
  to?: string;   // ISO inclusive
};

function rng(seed: number) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

export function seedMaintVehicles(n = 16, seed = 105): MaintVehicle[] {
  const r = rng(seed);
  const arr: MaintVehicle[] = Array.from({ length: n }).map((_, i) => {
    const type = VEHICLE_TYPES[Math.floor(r() * VEHICLE_TYPES.length)];
    const campus = CAMPUSES[Math.floor(r() * CAMPUSES.length)];
    const plate = `${String.fromCharCode(65 + Math.floor(r() * 26))}${String.fromCharCode(65 + Math.floor(r() * 26))}-${1000 + Math.floor(r() * 9000)}`;
    const mileage = 5_000 + Math.floor(r() * 95_000);
    const serviceState: ServiceState = r() < 0.88 ? "In Service" : "Out of Service";
    return {
      id: `VH-${110 + i}`,
      name: `${type} ${i + 1}`,
      type,
      campus,
      plate,
      mileageKm: mileage,
      serviceState
    };
  });
  return arr.sort((a, b) => a.id.localeCompare(b.id));
}

const SAMPLE_ISSUES = [
  "Brake pads grinding",
  "Aircon not cooling",
  "Engine overheating at idle",
  "Battery drops overnight",
  "Tire sidewall damage",
  "Check engine light",
  "Power steering noise",
  "Wiper motor intermittent",
  "Door lock jammed",
];

export function seedMaintenanceTickets(vehicles: MaintVehicle[], n = 36, seed = 205): MaintenanceTicket[] {
  const r = rng(seed);
  const names = ["Jolo Rosales", "Mara Santos", "Ben Cruz", "Lea Ramos", "Ana Dela Peña", "Rafi Gomez"];
  const assignees = ["Mec. Cruz", "Mec. Uy", "Mec. Dima", "Mec. Santos", "Mec. Lee"];
  const now = Date.now();

  const list: MaintenanceTicket[] = Array.from({ length: n }).map((_, i) => {
    const v = vehicles[Math.floor(r() * vehicles.length)];
    const created = new Date(now - Math.floor(r() * 1000 * 60 * 60 * 24 * 25)); // last 25 days
    const sev: MaintSeverity = r() < 0.15 ? "Low" : r() < 0.5 ? "Medium" : r() < 0.8 ? "High" : "Critical";
    const status: MaintStatus = r() < 0.3 ? "Reported" : r() < 0.55 ? "Diagnosing" : r() < 0.75 ? "In Progress" : r() < 0.9 ? "Waiting Parts" : "Completed";
    const due = new Date(created.getTime() + (3 + Math.floor(r() * 7)) * 86400000);

    return {
      id: `MT-${1400 + i}`,
      createdAt: created.toISOString(),
      updatedAt: created.toISOString(),
      campus: v.campus,
      vehicleId: v.id,
      title: SAMPLE_ISSUES[Math.floor(r() * SAMPLE_ISSUES.length)],
      description: "Auto-reported by driver app and confirmed by admin. Needs inspection.",
      severity: sev,
      status,
      reporter: names[Math.floor(r() * names.length)],
      assignee: r() < 0.7 ? assignees[Math.floor(r() * assignees.length)] : undefined,
      dueDate: r() < 0.7 ? due.toISOString() : undefined,
      cost: r() < 0.5 ? Math.floor(1000 + r() * 15000) : undefined,
      parts: r() < 0.4 ? "Brake pads; Cabin filter" : undefined,
      markOutOfService: sev === "Critical" ? true : r() < 0.2 ? true : false,
    };
  });

  // newest first by updatedAt
  return list.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
}

export function filterMaintenanceTickets(data: MaintenanceTicket[], q: MaintenanceQuery, vehicles: MaintVehicle[]): MaintenanceTicket[] {
  const byVehicle = new Map(vehicles.map(v => [v.id, v]));
  return data.filter((t) => {
    if (q.search) {
      const s = q.search.toLowerCase();
      const v = byVehicle.get(t.vehicleId);
      const hay = `${t.id} ${t.title} ${t.description} ${t.reporter} ${v?.name ?? ""} ${v?.plate ?? ""}`.toLowerCase();
      if (!hay.includes(s)) return false;
    }
    if (q.campus && q.campus !== "All" && t.campus !== q.campus) return false;
    if (q.statuses?.length && !q.statuses.includes(t.status)) return false;
    if (q.severities?.length && !q.severities.includes(t.severity)) return false;

    if (q.types?.length) {
      const v = byVehicle.get(t.vehicleId);
      if (!v || !q.types.includes(v.type)) return false;
    }
    if (q.from && new Date(t.createdAt) < new Date(q.from)) return false;
    if (q.to) {
      const end = new Date(q.to);
      end.setHours(23, 59, 59, 999);
      if (new Date(t.createdAt) > end) return false;
    }
    return true;
  });
}

export function exportMaintenanceCSV(rows: MaintenanceTicket[], vehicles: MaintVehicle[]): string {
  const byVehicle = new Map(vehicles.map(v => [v.id, v]));
  const esc = (v: string | number | undefined | null) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = [
    "TicketID","CreatedAt","UpdatedAt","Campus","VehicleID","VehicleName","Type","Plate","MileageKm","ServiceState","Severity","Status","Reporter","Assignee","DueDate","Cost","Parts","Title","Description","OOS"
  ];
  const body = rows.map(r => {
    const v = byVehicle.get(r.vehicleId);
    return [
      r.id,
      new Date(r.createdAt).toISOString(),
      new Date(r.updatedAt).toISOString(),
      r.campus,
      r.vehicleId,
      v?.name ?? "",
      v?.type ?? "",
      v?.plate ?? "",
      v?.mileageKm ?? "",
      v?.serviceState ?? "",
      r.severity,
      r.status,
      r.reporter,
      r.assignee ?? "",
      r.dueDate ? new Date(r.dueDate).toISOString() : "",
      r.cost ?? "",
      r.parts ?? "",
      r.title,
      r.description,
      r.markOutOfService ? "Yes" : "No",
    ].map(esc).join(",");
  });
  return [head.join(","), ...body].join("\n");
}

// helpers
export function updateVehicleServiceState(vehicles: MaintVehicle[], vehicleId: string, state: ServiceState) {
  return vehicles.map(v => v.id === vehicleId ? { ...v, serviceState: state } : v);
}

export function advanceMaintStatus(s: MaintStatus): MaintStatus {
  const order: MaintStatus[] = ["Reported","Diagnosing","In Progress","Waiting Parts","Completed"];
  const idx = order.indexOf(s);
  return order[Math.min(order.length - 1, Math.max(0, idx + 1))];
}
