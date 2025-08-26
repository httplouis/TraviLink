// src/lib/schedule.ts
export type VehicleType = "Bus" | "Van" | "Car";
export type VehicleStatus = "Available" | "Maintenance" | "Offline";

export type Vehicle = {
  id: string;
  name: string;
  type: VehicleType;
  campus: string;
  status: VehicleStatus;
};

export type Driver = {
  id: string;
  name: string;
  campus: string;
  online: boolean;
};

export type ScheduleStatus = "Scheduled" | "Approved" | "En Route" | "Completed" | "Cancelled";

export type ScheduleEvent = {
  id: string;
  title: string;
  tripId?: string;
  campus: string;
  start: string; // ISO
  end: string;   // ISO
  passengers?: number;
  status: ScheduleStatus;
  vehicleId?: string;
  driverId?: string;
  notes?: string;
};

export type ScheduleQuery = {
  search?: string;
  campus?: string;        // All | campus name
  statuses?: ScheduleStatus[];
  vehicleType?: VehicleType | "All";
  from?: string; // ISO
  to?: string;   // ISO
};

export const CAMPUSES = ["Lucena", "Candelaria", "Saman"];
export const SCHEDULE_STATUSES: ScheduleStatus[] = ["Scheduled", "Approved", "En Route", "Completed", "Cancelled"];
export const VEHICLE_TYPES: VehicleType[] = ["Bus", "Van", "Car"];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

export function seedVehicles(n = 14, seed = 21): Vehicle[] {
  const r = rng(seed);
  const arr: Vehicle[] = Array.from({ length: n }).map((_, i) => {
    const t = VEHICLE_TYPES[Math.floor(r() * VEHICLE_TYPES.length)];
    const c = CAMPUSES[Math.floor(r() * CAMPUSES.length)];
    const status: VehicleStatus = r() < 0.82 ? "Available" : r() < 0.92 ? "Maintenance" : "Offline";
    return { id: `VH-${100 + i}`, name: `${t} ${i + 1}`, type: t, campus: c, status };
  });
  return arr;
}

export function seedDrivers(n = 18, seed = 31): Driver[] {
  const r = rng(seed);
  const names = ["Leo Cruz", "Mara Santos", "Ben Ramos", "Ana Dela Peña", "Rafi Gomez", "Nina Reyes", "Paolo Tan", "Jolo Rosales", "Iris Yu", "Gio Lim", "Carlo Uy", "Luna Dee", "Kian Ong", "Ella Quinto", "Mina Park", "Omar dela Cruz", "Tori Vega", "Rhea Yu"];
  return Array.from({ length: n }).map((_, i) => {
    return {
      id: `DR-${200 + i}`,
      name: names[i % names.length],
      campus: CAMPUSES[Math.floor(r() * CAMPUSES.length)],
      online: r() < 0.7
    };
  });
}

export function seedSchedule(vehicles: Vehicle[], drivers: Driver[], n = 36, seed = 77): ScheduleEvent[] {
  const r = rng(seed);
  const now = new Date();
  const startWeek = startOfWeek(now);
  const endWeek = addDays(startWeek, 6);

  const titles = ["Campus Shuttle", "Field Activity", "Official Errand", "Department Trip", "Athletics Shuttle"];
  const list: ScheduleEvent[] = [];

  for (let i = 0; i < n; i++) {
    const day = addDays(startWeek, Math.floor(r() * 7));
    const hour = 7 + Math.floor(r() * 10); // between 7:00 and 17:00
    const dur = 60 + Math.floor(r() * 180); // 1–4hrs
    const start = new Date(day); start.setHours(hour, Math.floor(r() * 2) * 30, 0, 0);
    const end = addMinutes(start, dur);
    const campus = CAMPUSES[Math.floor(r() * CAMPUSES.length)];
    const title = titles[Math.floor(r() * titles.length)];
    const status: ScheduleStatus = r() < 0.15 ? "Scheduled" : r() < 0.55 ? "Approved" : r() < 0.7 ? "En Route" : r() < 0.9 ? "Completed" : "Cancelled";

    // Prefill some assignments
    const veh = vehicles.filter(v => v.campus === campus && v.status === "Available")[Math.floor(r() * 3)];
    const drv = drivers.filter(d => d.campus === campus)[Math.floor(r() * 3)];

    list.push({
      id: `EV-${1000 + i}`,
      title,
      tripId: r() < 0.7 ? `TR-${1200 + i}` : undefined,
      campus,
      start: start.toISOString(),
      end: end.toISOString(),
      passengers: 4 + Math.floor(r() * 30),
      status,
      vehicleId: veh?.id,
      driverId: drv?.id,
      notes: r() < 0.2 ? "Bring faculty IDs." : undefined
    });
  }

  return list
    .filter(e => new Date(e.start) >= startWeek && new Date(e.start) <= endWeek)
    .sort((a, b) => +new Date(a.start) - +new Date(b.start));
}

export function filterSchedule(events: ScheduleEvent[], q: ScheduleQuery, vehicles: Vehicle[], drivers: Driver[]): ScheduleEvent[] {
  const byIdVehicle = new Map(vehicles.map(v => [v.id, v]));
  const byIdDriver = new Map(drivers.map(d => [d.id, d]));

  return events.filter(e => {
    if (q.search) {
      const s = q.search.toLowerCase();
      const veh = e.vehicleId ? byIdVehicle.get(e.vehicleId)?.name ?? "" : "";
      const drv = e.driverId ? byIdDriver.get(e.driverId)?.name ?? "" : "";
      const hay = `${e.title} ${e.tripId ?? ""} ${veh} ${drv} ${e.campus}`.toLowerCase();
      if (!hay.includes(s)) return false;
    }
    if (q.campus && q.campus !== "All" && e.campus !== q.campus) return false;
    if (q.statuses?.length && !q.statuses.includes(e.status)) return false;
    if (q.vehicleType && q.vehicleType !== "All") {
      if (!e.vehicleId) return false;
      const v = byIdVehicle.get(e.vehicleId);
      if (!v || v.type !== q.vehicleType) return false;
    }
    if (q.from && new Date(e.end) < new Date(q.from)) return false;
    if (q.to && new Date(e.start) > new Date(q.to)) return false;
    return true;
  });
}

export function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

export function findConflicts(events: ScheduleEvent[], target: ScheduleEvent): { vehicle: ScheduleEvent[]; driver: ScheduleEvent[] } {
  const ts = new Date(target.start), te = new Date(target.end);
  const vehicle = target.vehicleId
    ? events.filter(e => e.id !== target.id && e.vehicleId === target.vehicleId && overlaps(new Date(e.start), new Date(e.end), ts, te))
    : [];
  const driver = target.driverId
    ? events.filter(e => e.id !== target.id && e.driverId === target.driverId && overlaps(new Date(e.start), new Date(e.end), ts, te))
    : [];
  return { vehicle, driver };
}

export function autoAssignForEvent(event: ScheduleEvent, vehicles: Vehicle[], drivers: Driver[], events: ScheduleEvent[]): { vehicleId?: string; driverId?: string } {
  const start = new Date(event.start), end = new Date(event.end);
  const veh = vehicles
    .filter(v => v.campus === event.campus && v.status === "Available")
    .find(v => events.every(e => !(e.vehicleId === v.id && overlaps(new Date(e.start), new Date(e.end), start, end))));
  const drv = drivers
    .filter(d => d.campus === event.campus && d.online)
    .find(d => events.every(e => !(e.driverId === d.id && overlaps(new Date(e.start), new Date(e.end), start, end))));
  return { vehicleId: veh?.id, driverId: drv?.id };
}

export function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Mon=0
  x.setHours(0,0,0,0);
  x.setDate(x.getDate() - day);
  return x;
}
export function endOfWeek(d: Date) {
  const x = startOfWeek(d);
  x.setDate(x.getDate() + 6);
  x.setHours(23,59,59,999);
  return x;
}
export function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
export function addMinutes(d: Date, n: number) {
  const x = new Date(d);
  x.setMinutes(x.getMinutes() + n);
  return x;
}
export function formatDayKey(d: Date) {
  return d.toISOString().slice(0,10);
}
