import Link from "next/link";
import { PageHeader, PageBody } from "@/components/common/Page";
import { Pencil, Trash2 } from "lucide-react";
import type { VehicleId, MaintenanceType, MaintenanceRecord } from "@/lib/maintenance";
import { formatHuman } from "@/lib/maintenance";

export type VehicleOption = { id: VehicleId; label: string };
export type RoutineRow = { type: MaintenanceType; months: number; next: string }; // ISO

type Props = {
  vehicles: VehicleOption[];
  vehicle: VehicleId;
  onVehicleChange: (id: VehicleId) => void;

  routine: RoutineRow[];                    // per selected vehicle
  scheduled: MaintenanceRecord[];           // already filtered/sorted by selected vehicle
  makeEditHref?: (r: MaintenanceRecord) => string;
  onDelete: (id: string) => void;
};

export default function MaintenanceView({
  vehicles,
  vehicle,
  onVehicleChange,
  routine,
  scheduled,
  makeEditHref = (r) => `/driver/maintenance/submit?id=${r.id}`,
  onDelete,
}: Props) {
  return (
    <>
      <PageHeader
        title="Maintenance"
        description="See routine tasks and your scheduled/reported maintenance."
        actions={<Link href="/driver/maintenance/submit" className="btn btn-primary">+ Submit a maintenance</Link>}
      />

      <PageBody>
        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_.9fr] gap-6">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Vehicle switcher */}
            <div className="rounded-xl ring-1 ring-neutral-200/70 bg-white shadow-sm p-3 flex items-center gap-3">
              <div className="text-sm font-medium">Vehicle:</div>
              <div className="flex gap-2">
                {vehicles.map((v) => (
                  <button
                    key={v.id}
                    className={`rounded-lg border px-3 py-1.5 text-sm ${
                      vehicle === v.id
                        ? "border-[#7a0019] text-[#7a0019] bg-[#7a0019]/5"
                        : "border-neutral-200 hover:bg-neutral-50"
                    }`}
                    onClick={() => onVehicleChange(v.id)}
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
                {routine.map((r) => (
                  <div key={r.type} className="px-4 py-3">
                    <div className="font-medium">{r.type}</div>
                    <div className="text-sm text-neutral-600">
                      Every {r.months} {r.months === 1 ? "month" : "months"}
                    </div>
                    <div className="text-sm text-neutral-600">
                      Next: {formatHuman(r.next)}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Scheduled / Reported */}
            <section className="rounded-xl ring-1 ring-neutral-200/70 bg-white shadow-sm">
              <div className="px-4 py-3 border-b border-neutral-200/80 font-medium">
                <span className="mr-2">📋</span>Scheduled / Reported
              </div>

              {scheduled.length === 0 ? (
                <div className="px-4 py-6 text-sm text-neutral-600">
                  No items yet. Submit a maintenance to schedule or report one.
                </div>
              ) : (
                <ul className="divide-y divide-neutral-200/70">
                  {scheduled.map((r) => (
                    <li key={r.id} className="px-4 py-3 grid grid-cols-[1fr_auto] items-center gap-3">
                      <div>
                        <div className="font-medium">
                          {r.type}{" "}
                          {!!r.intervalMonths && (
                            <span className="text-xs text-neutral-500">• every {r.intervalMonths} mo</span>
                          )}
                        </div>
                        <div className="text-sm text-neutral-600">
                          {formatHuman(r.date)}
                          {r.notes ? ` • ${r.notes}` : ""}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={makeEditHref(r)} className="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm hover:bg-neutral-50" title="Edit">
                          <Pencil className="h-4 w-4" /> Edit
                        </Link>
                        <button
                          onClick={() => onDelete(r.id)}
                          className="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm hover:bg-neutral-50 text-rose-700 border-rose-200"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" /> Delete
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
                <li>Use <b>Submit a maintenance</b> (or edit) for specific checks.</li>
                <li>Pick a <b>date</b> and optionally set it to <b>repeat</b> every N months.</li>
                <li>Submissions appear in <b>Scheduled / Reported</b> and on the calendar.</li>
              </ul>
            </section>
          </aside>
        </div>
      </PageBody>
    </>
  );
}
