import ScheduleView from "@/components/driver/schedule/ScheduleView";
import type { DriverScheduleRow } from "@/app/types/schedule";

// TEMP demo data – replace with real fetch later
const ROWS: DriverScheduleRow[] = [
  { id: "1", date: "2025-12-25 08:00", location: "Tagaytay", vehicle: "Bus", driver: "Jolo Rosales", status: "Approved" },
  { id: "2", date: "2025-12-28 09:30", location: "MSEUF Lucena", vehicle: "Van", driver: "", status: "Pending" },
  { id: "3", date: "2026-01-10 06:30", location: "Batangas", vehicle: "Bus", driver: "", status: "Assigned" },
];

export default async function DriverSchedulePage() {
  // example for later:
  // const rows = await getDriverSchedule(userId);
  return <ScheduleView rows={ROWS} />;
}
