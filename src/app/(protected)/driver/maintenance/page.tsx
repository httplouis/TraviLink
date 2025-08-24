"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PageHeader, PageBody } from "@/components/common/Page";
import {
  readAll,
  byVehicle,
  formatHuman,
  nextDueFrom,
  DEFAULT_INTERVALS,
  removeRecord,
  type VehicleId,
  type MaintenanceType,
  type MaintenanceRecord,
} from "@/lib/maintenance";
import { Pencil, Trash2 } from "lucide-react";

const VEHICLES: { id: VehicleId; label: string }[] = [
  { id: "bus-1", label: "Bus 1" },
  { id: "bus-2", label: "Bus 2" },
  { id: "van-1", label: "Van 1" },
];

const ROUTINE: string[] = Object.keys(DEFAULT_INTERVALS);

export default function MaintenancePage() {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<VehicleId>("bus-1");
  const [all, setAll] = useState<MaintenanceRecord[]>(readAll());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "travilink_maintenance") setAll(readAll());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const scheduledForVehicle = useMemo(
    () => byVehicle(vehicle).sort((a, b) => a.date.localeCompare(b.date)),
    [vehicle, all]
  );

  function onDelete(id: string) {
    if (!confirm("Delete this maintenance record?")) return;
    removeRecord(id);
    // refresh in-place
    setAll(readAll());
    // also notify calendar in other tabs
    window.dispatchEvent(new StorageEvent("storage", { key: "travilink_maintenance" }));
  }

  return (
    <>
      <PageHeader
        title="Maintenance"
        description="See routine tasks and your scheduled/reported maintenance."
        actions={
          <Link href="/driver/maintenance/submit" className="btn btn-primary">
            + Submit a maintenance
          </Link>
        }
      />

      <PageBody>
        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_.9fr] gap-6">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Vehicle switcher */}
            <div className="rounded-xl ring-1 ring-neutral-200/70 bg-white shadow-sm p-3 flex items-center gap-3">
              <div className="text-sm font-medium">Vehicle:</div>
              <div className="flex gap-2">
                {VEHICLES.map((v) => (
                  <button
                    key={v.id}
                    className={`rounded-lg border px-3 py-1.5 text-sm ${
                      vehicle === v.id
                        ? "border-[#7a0019] text-[#7a0019] bg-[#7a0019]/5"
                        : "border-neutral-200 hover:bg-neutral-50"
                    }`}
                    onClick={() => setVehicle(v.id)}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Routine / Fixed Interval */}
            <section className="rounded-xl ring-1 ring-neutral-200/70 bg-white shadow-sm">
              <div className="px-4 py-3 border-b border-neutral-200/80 font-medium">
                <span className="mr-2">🛠️</span>Routine / Fixed Interval
              </div>
              <div className="divide-y divide-neutral-200/70">
                {ROUTINE.map((t) => {
                  const months = DEFAULT_INTERVALS[t] ?? 0;
                  const next = nextDueFrom(vehicle, t as MaintenanceType);
                  return (
                    <div key={t} className="px-4 py-3">
                      <div className="font-medium">{t}</div>
                      <div className="text-sm text-neutral-600">
                        Every {months} {months === 1 ? "month" : "months"}
                      </div>
                      <div className="text-sm text-neutral-600">
                        Next for <b>{VEHICLES.find((v) => v.id === vehicle)?.label}</b>:{" "}
                        {formatHuman(next)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Scheduled / Reported */}
            <section className="rounded-xl ring-1 ring-neutral-200/70 bg-white shadow-sm">
              <div className="px-4 py-3 border-b border-neutral-200/80 font-medium">
                <span className="mr-2">📋</span>Scheduled / Reported
              </div>
              {scheduledForVehicle.length === 0 ? (
                <div className="px-4 py-6 text-sm text-neutral-600">
                  No items yet. Submit a maintenance to schedule or report one.
                </div>
              ) : (
                <ul className="divide-y divide-neutral-200/70">
                  {scheduledForVehicle.map((r) => (
                    <li
                      key={r.id}
                      className="px-4 py-3 grid grid-cols-[1fr_auto] items-center gap-3"
                    >
                      <div>
                        <div className="font-medium">
                          {r.type}{" "}
                          {r.intervalMonths && r.intervalMonths > 0 && (
                            <span className="text-xs text-neutral-500">
                              • every {r.intervalMonths} mo
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-neutral-600">
                          {formatHuman(r.date)}
                          {r.notes ? ` • ${r.notes}` : ""}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/driver/maintenance/submit?id=${r.id}`}
                          className="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm hover:bg-neutral-50"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => onDelete(r.id)}
                          className="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm hover:bg-neutral-50 text-rose-700 border-rose-200"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* RIGHT — help card */}
          <aside className="space-y-6">
            <section className="rounded-xl ring-1 ring-neutral-200/70 bg-white shadow-sm p-4">
              <div className="font-medium mb-2">How it works</div>
              <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-2">
                <li>
                  Use <b>Submit a maintenance</b> (or edit) for specific checks —
                  either built-in types or your own custom name.
                </li>
                <li>
                  Pick a <b>date</b> and optionally set it to <b>repeat</b> every N months.
                </li>
                <li>
                  Submissions appear in <b>Scheduled / Reported</b> and on the calendar
                  (red dot, hover for details).
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </PageBody>
    </>
  );
}
