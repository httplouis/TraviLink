/* ---------- Domain Types ---------- */
export type VehicleType = "Bus" | "Van" | "Car";
export type VehicleStatus = "available" | "maintenance" | "offline";

export type Vehicle = {
  id: string;
  name: string;
  type: VehicleType;
  status: VehicleStatus;
  note?: string;
};

export type Schedule = {
  id: string;
  dept: string;
  purpose: string;
  date: string;
  location: string;
  vehicle: string;
  driver?: string;
  status: "Approved" | "Pending" | "Assigned";
};

export type DriverStatus = "available" | "on_trip" | "off_duty" | "sick" | "leave";
export type Driver = {
  id: string;
  name: string;
  license: string;
  vehicleTypes: VehicleType[];
  status: DriverStatus;
  phone?: string;
  color?: string;
};

export type NotifType = "request" | "maintenance" | "driver" | "system";
export type Notif = {
  id: string;
  type: NotifType;
  title: string;
  body?: string;
  time: string;
  unread: boolean;
  severity?: "info" | "warning" | "danger";
};
