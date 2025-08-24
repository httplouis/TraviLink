"use client";

import Link from "next/link";
import {
  ArrowRight,
  BusFront,
  CalendarDays,
  Megaphone,
  Timer,
  CheckCircle2,
} from "lucide-react";
import { PageHeader, PageBody } from "@/components/common/Page";

/* --------------------------- demo data (static) --------------------------- */
type Status = "Pending" | "Approved" | "Assigned" | "Rejected";

const METRICS = {
  upcoming: 3,
  pending: 1,
  approved: 1,
};

const UPCOMING = [
  { id: "1", date: "2025-12-25 08:00", location: "Tagaytay", vehicle: "Bus", status: "Approved" as Status },
  { id: "2", date: "2025-12-28 09:30", location: "MSEUF Lucena", vehicle: "Van", status: "Pending" as Status },
  { id: "3", date: "2026-01-10 06:15", location: "Batangas", vehicle: "Bus", status: "Assigned" as Status },
];

const NOTIFS = [
  { id: "n1", text: "Your request REQ-24013 was approved.", time: "2h ago" },
  { id: "n2", text: "Schedule update: Bus departs 30 mins earlier.", time: "1d ago" },
];

const tone = (s: Status) =>
  s === "Approved" || s === "Assigned"
    ? "bg-green-100 text-green-700"
    : s === "Pending"
    ? "bg-amber-100 text-amber-700"
    : "bg-neutral-100 text-neutral-700";

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
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#7a0019]/10 text-[#7a0019]">
          {icon}
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500">
            {label}
          </div>
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
      className="group relative block rounded-xl border bg-white p-5 shadow-sm transition hover:border-[#7a0019] hover:shadow-md overflow-hidden"
    >
      {/* top accent line (clips correctly with overflow-hidden) */}
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

export default function FacultyDashboard() {
  return (
    <>
      <PageHeader
        title="Faculty Transport Portal"
        description="Request campus vehicles in a few clicks. View upcoming trips and get real-time updates."
        actions={
          <div className="flex gap-2">
            <Link href="/faculty/request" className="btn btn-primary">
              New Request
            </Link>
            <Link href="/faculty/schedule" className="btn btn-outline">
              View Schedule
            </Link>
          </div>
        }
      />

      <PageBody>
        {/* metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <MetricCard
            icon={<CalendarDays className="h-5 w-5" />}
            label="Upcoming Trips"
            value={METRICS.upcoming}
          />
          <MetricCard
            icon={<Timer className="h-5 w-5" />}
            label="Pending Requests"
            value={METRICS.pending}
          />
          <MetricCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Approved"
            value={METRICS.approved}
          />
        </div>

        {/* action cards */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <ActionCard
            icon={<BusFront className="h-5 w-5" />}
            title="Request a Trip"
            desc="Make a request with pickup, destination, and passenger count."
            href="/faculty/request"
          />
          <ActionCard
            icon={<CalendarDays className="h-5 w-5" />}
            title="See Your Schedule"
            desc="Check upcoming trips, times, and assigned status."
            href="/faculty/schedule"
          />
          <ActionCard
            icon={<Megaphone className="h-5 w-5" />}
            title="Stay Updated"
            desc="See approvals and schedule changes as they happen."
            href="/faculty/notifications"
          />
        </div>

        {/* two-column: upcoming + notifications */}
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* upcoming list */}
          <section className="rounded-xl border bg-white">
            <div className="border-b px-4 py-3 flex items-center justify-between">
              <h2 className="font-medium">Upcoming</h2>
              <Link href="/faculty/schedule" className="text-sm text-[#7a0019]">
                See all
              </Link>
            </div>
            <div className="divide-y">
              {UPCOMING.map((s) => (
                <div key={s.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-neutral-500">{s.vehicle}</div>
                    <div className="font-medium">{s.location}</div>
                    <div className="text-sm text-neutral-600">{s.date}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${tone(s.status)}`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* notifications */}
          <section className="rounded-xl border bg-white">
            <div className="border-b px-4 py-3 flex items-center justify-between">
              <h2 className="font-medium">Notifications</h2>
              <Link href="/faculty/notifications" className="text-sm text-[#7a0019]">
                View all
              </Link>
            </div>
            <div className="divide-y">
              {NOTIFS.map((n) => (
                <div key={n.id} className="px-4 py-3">
                  <div className="text-sm">{n.text}</div>
                  <div className="text-xs text-neutral-500">{n.time}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </PageBody>
    </>
  );
}
