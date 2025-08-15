import ScheduleTable from "@/components/ScheduleTable";

export default function DriverSchedule() {
  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">My Schedule</h1>
      <ScheduleTable />
    </div>
  );
}
