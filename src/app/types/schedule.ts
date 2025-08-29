export type Status = "Approved" | "Pending" | "Assigned";

export type DriverScheduleRow = {
  id: string;
  date: string;       // "YYYY-MM-DD HH:mm"
  location: string;
  vehicle: "Bus" | "Van";
  driver?: string;
  status: Status;
};
