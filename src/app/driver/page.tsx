"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BusFront,
  CalendarDays,
  Wrench,
  MapPin,
  Clock,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { PageHeader, PageBody } from "@/components/common/Page";

/* --------------------------- demo data (static) --------------------------- */
type Status = "Pending" | "Approved" | "Assigned";

const METRICS = { trips: 4, online: 2, pending: 2 };

const UPCOMING = [
  { id: "1", date: "2025-12-25 08:00", location: "Tagaytay", vehicle: "Bus", status: "Approved" as Status },
  { id: "2", date: "2025-12-28 09:30", location: "MSEUF Lucena", vehicle: "Van", status: "Pending" as Status },
  { id: "3", date: "2026-01-10 06:15", location: "Batangas", vehicle: "Bus", status: "Assigned" as Status },
];

const tone = (s: Status) =>
  s === "Approved"
    ? "bg-green-100 text-green-700"
    : s === "Pending"
    ? "bg-amber-100 text-amber-700"
    : "bg-blue-100 text-blue-700";

/* ------------------------------ UI Elements ------------------------------ */

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-neutral-200/70">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#7a0019]/10 text-[#7a0019]">
          {icon}
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500">{label}</div>
          <div className="text-lg font-semibold">{value}</div>
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  desc,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-[#7a0019] hover:shadow-md"
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-[#7a0019] transition-transform duration-300 group-hover:scale-x-100" />
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-lg bg-[#7a0019]">
        <div className="text-white">{icon}</div>
      </div>
      <div className="font-semibold">{title}</div>
      <p className="mt-1 text-sm text-neutral-600">{desc}</p>
      <div className="mt-3 flex items-center gap-1 text-[#7a0019]">
        <span className="text-sm">More</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

/* --------------------------------- Page --------------------------------- */

export default function DriverDashboard() {
  // Save trips so MiniCalendar (in right rail) can read and display green dots everywhere
  useEffect(() => {
    try {
      const trips = UPCOMING.map((u) => ({
        date: u.date.slice(0, 10),
        label: `${u.location} (${u.vehicle})`,
      }));
      localStorage.setItem("travilink_trips", JSON.stringify(trips));
      // trigger other tabs to refresh
      window.dispatchEvent(new StorageEvent("storage", { key: "travilink_trips" }));
    } catch {}
  }, []);

  return (
    <>
      <PageHeader
        title="Driver Transport Portal"
        description="See upcoming trips, update your status, and log maintenance."
        actions={
          <div className="flex gap-2">
            <Link href="/driver/status" className="btn btn-primary">
              Update Status
            </Link>
            <Link href="/driver/schedule" className="btn btn-outline">
              View Schedule
            </Link>
          </div>
        }
      />

      <PageBody>
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard icon={<CheckCircle2 className="h-5 w-5" />} label="Trips" value={METRICS.trips} />
            <MetricCard icon={<Activity className="h-5 w-5" />} label="Online" value={METRICS.online} />
            <MetricCard icon={<Clock className="h-5 w-5" />} label="Pending" value={METRICS.pending} />
          </div>

          {/* Primary actions */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ActionCard
              icon={<CalendarDays className="h-5 w-5" />}
              title="Upcoming Schedules"
              desc="Preview your next trips with dates, time, and locations."
              href="/driver/schedule"
            />
            <ActionCard
              icon={<Wrench className="h-5 w-5" />}
              title="Submit Maintenance"
              desc="Create a quick maintenance log for your assigned vehicle."
              href="/driver/maintenance/submit"
            />
            <ActionCard
              icon={<BusFront className="h-5 w-5" />}
              title="Trip History"
              desc="Review completed trips and past assignments."
              href="/driver/history"
            />
          </div>

          {/* Upcoming + Quick note */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Upcoming */}
            <section className="rounded-xl ring-1 ring-neutral-200/70 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-200/80 px-4 py-3">
                <h2 className="font-medium">Upcoming</h2>
                <Link href="/driver/schedule" className="text-sm text-[#7a0019]">
                  See all
                </Link>
              </div>
              <div className="divide-y divide-neutral-200/70">
                {UPCOMING.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-neutral-100">
                        <MapPin className="h-5 w-5 text-neutral-700" />
                      </div>
                      <div>
                        <div className="text-sm text-neutral-500">{s.vehicle}</div>
                        <div className="font-medium">{s.location}</div>
                        <div className="text-sm text-neutral-600">{s.date}</div>
                      </div>
                    </div>
                    <span className={`rounded px-2 py-1 text-xs ${tone(s.status)}`}>{s.status}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick note */}
            <section className="rounded-xl ring-1 ring-neutral-200/70 bg-white shadow-sm">
              <div className="border-b border-neutral-200/80 px-4 py-3">
                <h2 className="font-medium">Quick note</h2>
              </div>
              <div className="p-4">
                <input
                  className="w-full rounded-xl border border-neutral-200/80 px-3 py-2 outline-none focus:ring-2 focus:ring-[#7a0019]/15 focus:border-[#7a0019]/60 placeholder:text-neutral-400"
                  placeholder="Add a quick action / note..."
                />
                <div className="mt-2 flex justify-end">
                  <button className="btn btn-outline">Save</button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </PageBody>
    </>
  );
}
