import { supabase } from "@/lib/supabaseClient";
import type { DriverScheduleRow } from "@/app/types/schedule";

export async function getDriverSchedule(userId: string): Promise<DriverScheduleRow[]> {
  // sample shape – adjust table/column names to your schema
  const { data, error } = await supabase
    .from("trips") // or a view like v_driver_schedule
    .select("id, start_time, destination, vehicle_type, driver:user_id(name), status")
    .eq("driver_id", userId)
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((t) => ({
    id: t.id,
    date: new Date(t.start_time).toISOString().slice(0, 16).replace("T", " "),
    location: t.destination,
    vehicle: (t.vehicle_type ?? "Bus") as DriverScheduleRow["vehicle"],
    driver: t.driver?.name ?? "",
    status: (t.status ?? "Pending") as DriverScheduleRow["status"],
  }));
}

