export type VehicleStatus = "available" | "maintenance" | "offline";
export type DriverBadge = "Available" | "On Trip" | "Off Duty" | "Sick" | "Leave";

export type Vehicle = {
  id: string;
  name: string;
  type: "Bus" | "Van" | "Car";
  status: VehicleStatus;
};

export type Schedule = {
  id: string;
  date: string;       // ISO
  time: string;       // HH:MM
  location: string;
  vehicle: "Bus" | "Van" | "Car";
  status: "Approved" | "Pending" | "Assigned";
  requester: string;
  driver?: string;
};

export const DRIVER = {
  id: "D22-11451",
  name: "Jolo Rosales",
  campus: "Lucena Campus",
  dept: "CCMS",
  badges: ["Faculty", "Lucena Campus"],
  availability: "Available" as DriverBadge,
  phone: "090x-xxx-xxxx",
  license: "Professional",
  canDrive: ["Bus", "Van", "Car"],
};

export const VEHICLES: Vehicle[] = [
  { id: "v1", name: "Bus 1", type: "Bus", status: "available" },
  { id: "v2", name: "Van 1", type: "Van", status: "maintenance" },
  { id: "v3", name: "Bus 2", type: "Bus", status: "available" },
];

export const UPCOMING: Schedule[] = [
  {
    id: "sch-24012",
    date: "2025-12-25",
    time: "08:00",
    location: "Tagaytay",
    vehicle: "Bus",
    status: "Approved",
    requester: "Hans / CCMS",
    driver: "Jolo Rosales",
  },
  {
    id: "sch-24013",
    date: "2025-12-28",
    time: "09:30",
    location: "MSEUF Lucena",
    vehicle: "Van",
    status: "Pending",
    requester: "Hans / CCMS",
  },
  {
    id: "sch-24014",
    date: "2026-01-10",
    time: "06:30",
    location: "Batangas",
    vehicle: "Bus",
    status: "Assigned",
    requester: "Hans / CCMS",
  },
];
