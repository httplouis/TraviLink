"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SubmitView, { type Mode, type RepeatMode } from "@/components/driver/maintenance/submit/SubmitView";
import {
  addRecord, updateRecord, getById, BUILTIN_TYPES,
  type VehicleId, type MaintenanceRecord,
} from "@/lib/maintenance";

const VEHICLES: { id: VehicleId; label: string }[] = [
  { id: "bus-1", label: "Bus 1" },
  { id: "bus-2", label: "Bus 2" },
  { id: "van-1", label: "Van 1" },
];

export default function SubmitMaintenancePage() {
  const router = useRouter();
  const params = useSearchParams();
  const editingId = params.get("id");

  // form state
  const [vehicle, setVehicle] = useState<VehicleId>("bus-1");
  const [mode, setMode] = useState<Mode>("builtin");
  const [builtinType, setBuiltinType] = useState<string>(BUILTIN_TYPES[0]);
  const [customType, setCustomType] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("one");
  const [intervalMonths, setIntervalMonths] = useState<number | "">("");
  const [notes, setNotes] = useState("");

  // load edit data
  useEffect(() => {
    if (!editingId) return;
    const rec = getById(editingId);
    if (!rec) return;
    setVehicle(rec.vehicle);
    setDate(rec.date);
    setNotes(rec.notes || "");
    if (BUILTIN_TYPES.includes(rec.type)) {
      setMode("builtin"); setBuiltinType(rec.type);
    } else {
      setMode("custom"); setCustomType(rec.type);
    }
    if (rec.intervalMonths && rec.intervalMonths > 0) {
      setRepeatMode("repeat"); setIntervalMonths(rec.intervalMonths);
    } else {
      setRepeatMode("one"); setIntervalMonths("");
    }
  }, [editingId]);

  const effectiveType = useMemo(
    () => (mode === "builtin" ? builtinType : customType.trim()),
    [mode, builtinType, customType]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const type = effectiveType;
    if (!type) { alert("Please enter a maintenance type."); return; }

    const payload: Omit<MaintenanceRecord, "id"> = {
      vehicle, type, date,
      notes: notes.trim() || undefined,
      intervalMonths:
        repeatMode === "repeat" && typeof intervalMonths === "number" && intervalMonths > 0
          ? intervalMonths
          : undefined,
    };

    if (editingId) {
      updateRecord(editingId, payload);
    } else {
      addRecord({ id: crypto.randomUUID(), ...payload });
    }

    window.dispatchEvent(new StorageEvent("storage", { key: "travilink_maintenance" }));
    router.push("/driver/maintenance");
  }

  return (
    <SubmitView
      editing={!!editingId}
      vehicles={VEHICLES}
      mode={mode} setMode={setMode}
      builtinType={builtinType} setBuiltinType={setBuiltinType}
      customType={customType} setCustomType={setCustomType}
      vehicle={vehicle} setVehicle={setVehicle}
      date={date} setDate={setDate}
      repeatMode={repeatMode} setRepeatMode={setRepeatMode}
      intervalMonths={intervalMonths} setIntervalMonths={setIntervalMonths}
      notes={notes} setNotes={setNotes}
      builtinOptions={BUILTIN_TYPES}
      onCancel={() => router.push("/driver/maintenance")}
      onSubmit={handleSubmit}
    />
  );
}
