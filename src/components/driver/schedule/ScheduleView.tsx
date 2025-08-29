import Link from "next/link";
import { CalendarDays, MapPin, BusFront, User2, BadgeCheck, Clock, Edit3 } from "lucide-react";
import { PageHeader, PageBody } from "@/components/common/Page";
import { statusTone } from "@/lib/data/statusTone";
import type { DriverScheduleRow } from "@/app/types/schedule";

type Props = {
  rows: DriverScheduleRow[];
  // optional overrides so you can wire custom handlers later (e.g., modals)
  makeViewHref?: (row: DriverScheduleRow) => string;
  makeUpdateHref?: (row: DriverScheduleRow) => string;
  title?: string;
  description?: string;
};

export default function ScheduleView({
  rows,
  makeViewHref = (r) => `/driver/schedule/${r.id}`,
  makeUpdateHref = (r) => `/driver/status?trip=${r.id}`,
  title = "My Schedule",
  description = "See upcoming assignments, check details, and keep your status up to date.",
}: Props) {
  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          <div className="flex gap-2">
            <Link href="/driver/status" className="btn btn-primary">Update Status</Link>
            <Link href="/driver/history" className="btn btn-outline">Trip History</Link>
          </div>
        }
      />

      <PageBody>
        <section className="rounded-2xl ring-1 ring-neutral-200/70 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-neutral-200/80">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-[var(--brand,#7a0019)]" />
              <h2 className="font-semibold">Upcoming Schedules</h2>
            </div>
            <div className="hidden md:flex items-center gap-3 text-xs text-neutral-500">
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-600/80" /> Approved</span>
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-600/80" /> Pending</span>
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-600/80" /> Assigned</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50/70 text-neutral-600">
                <tr className="border-b border-neutral-200/70">
                  <th className="px-4 sm:px-5 py-3 text-left font-medium">Date</th>
                  <th className="px-4 sm:px-5 py-3 text-left font-medium">Location</th>
                  <th className="px-4 sm:px-5 py-3 text-left font-medium">Vehicle</th>
                  <th className="px-4 sm:px-5 py-3 text-left font-medium">Driver</th>
                  <th className="px-4 sm:px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-4 sm:px-5 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-200/70">
                {rows.map((r) => {
                  const [d, t] = r.date.split(" ");
                  return (
                    <tr key={r.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="px-4 sm:px-5 py-3 min-w-[140px]">
                        <div className="font-medium">{d}</div>
                        <div className="text-xs text-neutral-500">{t}</div>
                      </td>

                      <td className="px-4 sm:px-5 py-3 min-w-[180px]">
                        <div className="flex items-center gap-2">
                          <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-neutral-100">
                            <MapPin className="h-4 w-4 text-neutral-700" />
                          </span>
                          <div className="font-medium">{r.location}</div>
                        </div>
                      </td>

                      <td className="px-4 sm:px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-neutral-100">
                            <BusFront className="h-4 w-4 text-neutral-700" />
                          </span>
                          <span>{r.vehicle}</span>
                        </div>
                      </td>

                      <td className="px-4 sm:px-5 py-3">
                        <div className="flex items-center gap-2 text-neutral-800">
                          <User2 className="h-4 w-4 text-neutral-500" />
                          {r.driver ? r.driver : <span className="text-neutral-400">—</span>}
                        </div>
                      </td>

                      <td className="px-4 sm:px-5 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusTone(r.status)}`}>
                          {r.status === "Approved" && <BadgeCheck className="h-3.5 w-3.5" />}
                          {r.status === "Pending" && <Clock className="h-3.5 w-3.5" />}
                          {r.status === "Assigned" && <BusFront className="h-3.5 w-3.5" />}
                          {r.status}
                        </span>
                      </td>

                      <td className="px-4 sm:px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Link href={makeViewHref(r)} className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50">
                            View
                          </Link>
                          <Link href={makeUpdateHref(r)} className="inline-flex items-center gap-1 rounded-full border border-[#7a0019]/20 bg-[#7a0019]/10 px-3 py-1.5 text-xs font-medium text-[#7a0019] hover:bg-[#7a0019]/15">
                            <Edit3 className="h-3.5 w-3.5" />
                            Update
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </PageBody>
    </>
  );
}
