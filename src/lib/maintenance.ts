// Client-side maintenance store (timezone-safe date math, ID-safe updates)

export type VehicleId = "bus-1" | "bus-2" | "van-1";
export type MaintenanceType = string;

export type MaintenanceRecord = {
  id: string;
  vehicle: VehicleId;
  type: MaintenanceType;      // e.g., "Change Oil" or "My Special Check"
  date: string;               // ISO "YYYY-MM-DD"
  notes?: string;
  /**
   * Optional repeating interval (months). If present and > 0, overrides defaults.
   * <= 0 or undefined => treated as one-time.
   */
  intervalMonths?: number;
};

const KEY = "travilink_maintenance";

/** Built-in types & default intervals (months) */
export const DEFAULT_INTERVALS = {
  "Change Oil": 3,
  "Tire Airing/Rotation": 1,
  "Brake Inspection": 6,
  "Coolant Check": 6,
} as const;

export const BUILTIN_TYPES = Object.keys(DEFAULT_INTERVALS) as Array<
  keyof typeof DEFAULT_INTERVALS
>;

function isBrowser(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

function pad2(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

/** Pure string-based month addition: no Date/timezone surprises */
function addMonthsISO(iso: string, months: number): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) throw new Error(`Invalid ISO date: ${iso}`);
  const y = parseInt(m[1], 10);
  const mo = parseInt(m[2], 10);
  const d = parseInt(m[3], 10);

  let nmo = mo + months;
  let ny = y + Math.floor((nmo - 1) / 12);
  nmo = ((nmo - 1) % 12) + 1;

  // Clamp day to the last valid day of the target month
  const lastDay = new Date(ny, nmo, 0).getDate();
  const nd = Math.min(d, lastDay);

  return `${ny}-${pad2(nmo)}-${pad2(nd)}`;
}

export function readAll(): MaintenanceRecord[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? (JSON.parse(raw) as MaintenanceRecord[]) : [];
    // Light sanity filter
    return Array.isArray(data)
      ? data.filter(
          (r) =>
            r &&
            typeof r.id === "string" &&
            typeof r.vehicle === "string" &&
            typeof r.type === "string" &&
            typeof r.date === "string"
        )
      : [];
  } catch {
    return [];
  }
}

export function writeAll(list: MaintenanceRecord[]) {
  if (!isBrowser()) return;
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
    // Never allow ID to be changed through patch
    const { id: _ignore, ...safePatch } = patch;
    list[idx] = { ...list[idx], ...safePatch };
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
    .slice()
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

  const custom = (last.intervalMonths ?? 0) > 0 ? last.intervalMonths! : 0;
  const builtin = (DEFAULT_INTERVALS as Record<string, number>)[type] ?? 0;
  const months = custom || builtin;
  if (months <= 0) return undefined;

  try {
    return addMonthsISO(last.date, months);
  } catch {
    return undefined;
  }
}

export function formatHuman(dateISO?: string) {
  if (!dateISO) return "—";
  // Use noon local time to dodge DST / midnight parsing quirks
  const d = new Date(`${dateISO}T12:00:00`);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
