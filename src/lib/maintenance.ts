// Client-side maintenance store (swap for API later if needed)

export type VehicleId = "bus-1" | "bus-2" | "van-1";

/**
 * We allow custom types, so `type` is just a string.
 * For built-ins, we keep a recommended interval in DEFAULT_INTERVALS below.
 */
export type MaintenanceType = string;

export type MaintenanceRecord = {
  id: string;
  vehicle: VehicleId;
  type: MaintenanceType;      // e.g., "Change Oil" or "My Special Check"
  date: string;               // ISO "YYYY-MM-DD" — the performed/scheduled date
  notes?: string;

  /**
   * Optional repeating interval (months). If present, we use this to compute the
   * next due date (overrides default interval for built-ins).
   * - undefined => one-time; nextDueFrom only uses defaults for built-ins
   * - 0 or negative is treated like one-time
   */
  intervalMonths?: number;
};

const KEY = "travilink_maintenance";

/** Built-in types & default intervals (months) */
export const DEFAULT_INTERVALS: Record<string, number> = {
  "Change Oil": 3,
  "Tire Airing/Rotation": 1,
  "Brake Inspection": 6,
  "Coolant Check": 6,
};

export const BUILTIN_TYPES: string[] = Object.keys(DEFAULT_INTERVALS);

export function readAll(): MaintenanceRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MaintenanceRecord[]) : [];
  } catch {
    return [];
  }
}

export function writeAll(list: MaintenanceRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

/** CRUD */
export function addRecord(rec: MaintenanceRecord) {
  const list = readAll();
  list.push(rec);
  writeAll(list);
}

export function updateRecord(id: string, patch: Partial<MaintenanceRecord>) {
  const list = readAll();
  const idx = list.findIndex((r) => r.id === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...patch };
    writeAll(list);
  }
}

export function removeRecord(id: string) {
  const list = readAll().filter((r) => r.id !== id);
  writeAll(list);
}

export function getById(id: string) {
  return readAll().find((r) => r.id === id);
}

export function byVehicle(vehicle: VehicleId) {
  return readAll().filter((r) => r.vehicle === vehicle);
}

export function lastOf(vehicle: VehicleId, type: MaintenanceType) {
  const list = byVehicle(vehicle)
    .filter((r) => r.type === type)
    .sort((a, b) => a.date.localeCompare(b.date));
  return list[list.length - 1];
}

/**
 * Compute next due from last record for a vehicle/type.
 * Priority:
 *  1) lastRecord.intervalMonths if provided and > 0
 *  2) DEFAULT_INTERVALS[type] if built-in
 *  3) undefined if no interval info
 */
export function nextDueFrom(
  vehicle: VehicleId,
  type: MaintenanceType
): string | undefined {
  const last = lastOf(vehicle, type);
  if (!last) return undefined;

  const effectiveMonths =
    (last.intervalMonths ?? 0) > 0
      ? last.intervalMonths!
      : DEFAULT_INTERVALS[type] ?? 0;

  if (effectiveMonths <= 0) return undefined;

  const d = new Date(last.date);
  d.setMonth(d.getMonth() + effectiveMonths);
  return d.toISOString().slice(0, 10);
}

export function formatHuman(dateISO?: string) {
  if (!dateISO) return "—";
  const d = new Date(dateISO + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
