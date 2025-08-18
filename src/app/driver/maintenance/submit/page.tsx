"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader, PageBody } from "@/components/common/Page";
import {
  addRecord,
  updateRecord,
  getById,
  BUILTIN_TYPES,
  type VehicleId,
  type MaintenanceRecord,
} from "@/lib/maintenance";

const VEHICLES: { id: VehicleId; label: string }[] = [
  { id: "bus-1", label: "Bus 1" },
  { id: "bus-2", label: "Bus 2" },
  { id: "van-1", label: "Van 1" },
];

type Mode = "builtin" | "custom";
type RepeatMode = "one" | "repeat";

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

  // Load for edit
  useEffect(() => {
    if (!editingId) return;
    const rec = getById(editingId);
    if (!rec) return;
    setVehicle(rec.vehicle);
    setDate(rec.date);
    setNotes(rec.notes || "");
    if (BUILTIN_TYPES.includes(rec.type)) {
      setMode("builtin");
      setBuiltinType(rec.type);
    } else {
      setMode("custom");
      setCustomType(rec.type);
    }
    if (rec.intervalMonths && rec.intervalMonths > 0) {
      setRepeatMode("repeat");
      setIntervalMonths(rec.intervalMonths);
    } else {
      setRepeatMode("one");
      setIntervalMonths("");
    }
  }, [editingId]);

  const effectiveType = useMemo(
    () => (mode === "builtin" ? builtinType : customType.trim()),
    [mode, builtinType, customType]
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const type = effectiveType;
    if (!type) {
      alert("Please enter a maintenance type.");
      return;
    }
    const payload: Omit<MaintenanceRecord, "id"> = {
      vehicle,
      type,
      date,
      notes: notes.trim() || undefined,
      intervalMonths:
        repeatMode === "repeat" && typeof intervalMonths === "number" && intervalMonths > 0
          ? intervalMonths
          : undefined,
    };

    if (editingId) {
      updateRecord(editingId, payload);
    } else {
      const id = crypto.randomUUID();
      addRecord({ id, ...payload });
    }

    // notify calendars in other tabs
    window.dispatchEvent(new StorageEvent("storage", { key: "travilink_maintenance" }));
    router.push("/driver/maintenance");
  }

  return (
    <>
      <PageHeader
        title={editingId ? "Edit maintenance" : "Submit a maintenance"}
        description="Schedule or report a maintenance item for a vehicle."
      />
      <PageBody>
        <form
          onSubmit={onSubmit}
          className="rounded-xl ring-1 ring-neutral-200/70 bg-white shadow-sm p-4 space-y-4 max-w-xl"
        >
          {/* Vehicle + Date */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <div className="text-sm font-medium mb-1">Vehicle</div>
              <select
                className="w-full rounded-lg border border-neutral-200 px-3 py-2"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value as VehicleId)}
              >
                {VEHICLES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <div className="text-sm font-medium mb-1">Date</div>
              <input
                type="date"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
          </div>

          {/* Type: built-in or custom */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <div className="text-sm font-medium mb-1">Type source</div>
              <select
                className="w-full rounded-lg border border-neutral-200 px-3 py-2"
                value={mode}
                onChange={(e) => setMode(e.target.value as Mode)}
              >
                <option value="builtin">Built‑in</option>
                <option value="custom">Custom</option>
              </select>
            </label>

            {mode === "builtin" ? (
              <label className="block">
                <div className="text-sm font-medium mb-1">Built‑in type</div>
                <select
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2"
                  value={builtinType}
                  onChange={(e) => setBuiltinType(e.target.value)}
                >
                  {BUILTIN_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="block">
                <div className="text-sm font-medium mb-1">Custom type</div>
                <input
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2"
                  placeholder="e.g., Engine Diagnostics"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                />
              </label>
            )}
          </div>

          {/* Repeat */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <div className="text-sm font-medium mb-1">When</div>
              <select
                className="w-full rounded-lg border border-neutral-200 px-3 py-2"
                value={repeatMode}
                onChange={(e) => setRepeatMode(e.target.value as RepeatMode)}
              >
                <option value="one">One‑time (no interval)</option>
                <option value="repeat">Repeats every…</option>
              </select>
            </label>

            <label className="block">
              <div className="text-sm font-medium mb-1">Interval (months)</div>
              <input
                type="number"
                min={1}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 disabled:bg-neutral-50"
                placeholder="e.g., 3"
                value={repeatMode === "repeat" ? (intervalMonths as number | "") : ""}
                onChange={(e) => {
                  const v = e.target.value;
                  setIntervalMonths(v === "" ? "" : Number(v));
                }}
                disabled={repeatMode !== "repeat"}
              />
            </label>
          </div>

          {/* Notes */}
          <label className="block">
            <div className="text-sm font-medium mb-1">Notes (optional)</div>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2"
              placeholder="Any details…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => router.push("/driver/maintenance")}
            >
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              {editingId ? "Save changes" : "Submit"}
            </button>
          </div>
        </form>
      </PageBody>
    </>
  );
}
