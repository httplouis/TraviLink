import type { DriverProfile } from "@/app/types/driverProfile";
import { DRIVER as DRIVER_SEED } from "@/lib/mock";

const LS_KEY = "travilink_driver_profile";

function splitName(full?: string) {
  if (!full) return { firstName: "", lastName: "" };
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts.slice(0, -1).join(" "), lastName: parts.slice(-1)[0] };
}

export function seedFromMock(): DriverProfile {
  const { firstName, lastName } = splitName(DRIVER_SEED?.name);
  return {
    firstName,
    lastName,
    email: (DRIVER_SEED as any)?.email ?? "",
    campus: DRIVER_SEED?.campus ?? "",
    dept: DRIVER_SEED?.dept ?? "",
    phone: DRIVER_SEED?.phone ?? "",
    license: DRIVER_SEED?.license ?? "",
    canDrive: Array.isArray(DRIVER_SEED?.canDrive) ? DRIVER_SEED.canDrive : [],
    badges: Array.isArray(DRIVER_SEED?.badges) ? DRIVER_SEED.badges : [],
    avatar: undefined,
    notifyEmail: true,
    notifyPush: true,
  };
}

export function loadProfile(): DriverProfile {
  if (typeof window === "undefined") return seedFromMock();
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return seedFromMock();
    return { ...seedFromMock(), ...(JSON.parse(raw) as DriverProfile) };
  } catch {
    return seedFromMock();
  }
}

export function saveProfile(p: DriverProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(p));
}
