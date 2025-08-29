"use client";

import { useEffect, useMemo, useState } from "react";
import MaintenanceView, { type VehicleOption, type RoutineRow } from "@/components/driver/maintenance/MaintenanceView";
import {
  readAll,
  byVehicle,
  nextDueFrom,
  DEFAULT_INTERVALS,
  removeRecord,
  type VehicleId,
  type MaintenanceType,
  type MaintenanceRecord,
} from "@/lib/maintenance";

const VEHICLES: VehicleOption[] = [
  { id: "bus-1", label: "Bus 1" },
  { id: "bus-2", label: "Bus 2" },
  { id: "van-1", label: "Van 1" },
];

export default function MaintenancePage() {
  const [vehicle, setVehicle] = useState<VehicleId>("bus-1");
  const [all, setAll] = useState<MaintenanceRecord[]>(readAll());

  // cross-tab/localStorage sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "travilink_maintenance") setAll(readAll());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // list for the selected vehicle
  const scheduled = useMemo(
    () => byVehicle(vehicle).sort((a, b) => a.date.localeCompare(b.date)),
    [vehicle, all]
  );

  // routine rows computed for the selected vehicle
  const routine: RoutineRow[] = useMemo(() => {
  return Object.keys(DEFAULT_INTERVALS).map((k) => {
    const type = k as MaintenanceType;
    const months = DEFAULT_INTERVALS[type] ?? 0;
    const next = nextDueFrom(vehicle, type);
    return { type, months, next };
  });
  }, [vehicle, all]);

  function handleDelete(id: string) {
    if (!confirm("Delete this maintenance record?")) return;
    removeRecord(id);
    setAll(readAll()); // refresh local copy
    window.dispatchEvent(new StorageEvent("storage", { key: "travilink_maintenance" }));
  }

  return (
    <MaintenanceView
      vehicles={VEHICLES}
      vehicle={vehicle}
      onVehicleChange={setVehicle}
      routine={routine}
      scheduled={scheduled}
      onDelete={handleDelete}
    />
  );
}
