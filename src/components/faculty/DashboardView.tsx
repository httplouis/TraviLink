"use client";

import Link from "next/link";
import {
  ArrowRight,
  BusFront,
  CalendarDays,
  Megaphone,
  Timer,
  CheckCircle2,
  MapPin,
  IdCard,
} from "lucide-react";

/* ---------- Types ---------- */
export type Status = "Pending" | "Approved" | "Assigned" | "Rejected";

export type UpcomingItem = {
  id: string;
  date: string;       // "YYYY-MM-DD HH:mm"
  location: string;
  vehicle: string;    // Bus / Van / Car …
  status: Status;
};

export type NotificationItem = { id: string; text: string; time: string };

export type Metrics = { upcoming: number; pending: number; approved: number };

export type Profile = {
  name: string;
  code: string;
  role: "Faculty" | "Driver" | "Admin";
  campus: string;
  avatar?: string;
};

const badgeTone = (s: Status) =>
  s === "Approved"
    ? "bg-green-100 text-green-700"
    : s === "Pending"
    ? "bg-amber-100 text-amber-700"
    : s === "Assigned"
    ? "bg-blue-100 text-blue-700"
    : "bg-neutral-100 text-neutral-700";

/* ---------- Small UI blocks ---------- */
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
      className="group relative block h-full overflow-hidden rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-[#7a0019] hover:shadow-md"
    >
      {/* top accent line */}
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

/* kept for other pages if you reuse it */
function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <section className="rounded-xl bg-[#7a0019] text-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-white/60"
          />
        ) : (
          <div className="grid h-12 w-12 place-items-center rounded-full bg-white/10">
            <IdCard className="h-6 w-6" />
          </div>
        )}
        <div>
          <div className="text-sm/none opacity-80">PROFILE • {profile.role.toUpperCase()}</div>
          <div className="font-semibold text-lg">{profile.name}</div>
          <div className="text-xs opacity-90">Code: {profile.code}</div>
        </div>
      </div>
      <div className="mt-3 inline-flex items-center rounded-full bg-white/10 px-2 py-1 text-xs">
        {profile.campus}
      </div>
    </section>
  );
}

/* ---------- Page View (center column only) ---------- */
export default function DashboardView({
  metrics,
  upcoming,
  notifications,
}: {
  metrics: Metrics;
  upcoming: UpcomingItem[];
  notifications: NotificationItem[];
  profile: Profile; // kept in types for convenience; not rendered here
  rightStats: { label: string; value: number }[]; // rendered by ProfileRail on the right
}) {
  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Faculty Transport Portal</h1>
          <p className="text-sm text-neutral-600">
            See upcoming trips, submit requests, and track approvals.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/faculty/request" className="btn btn-primary">New Request</Link>
          <Link href="/faculty/schedule" className="btn btn-outline">View Schedule</Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard icon={<CalendarDays className="h-5 w-5" />} label="Upcoming Trips" value={metrics.upcoming} />
        <MetricCard icon={<Timer className="h-5 w-5" />}         label="Pending Requests" value={metrics.pending} />
        <MetricCard icon={<CheckCircle2 className="h-5 w-5" />}  label="Approved"         value={metrics.approved} />
      </div>

      {/* Primary actions (equal height) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 items-stretch">
        <ActionCard
          icon={<CalendarDays className="h-5 w-5" />}
          title="Upcoming Schedules"
          desc="Preview your next trips with dates, time, and locations."
          href="/faculty/schedule"
        />
        <ActionCard
          icon={<BusFront className="h-5 w-5" />}
          title="Request a Trip"
          desc="Create a request with pickup, destination and passenger count."
          href="/faculty/request"
        />
        <ActionCard
          icon={<Megaphone className="h-5 w-5" />}
          title="Announcements"
          desc="See approvals and schedule changes as they happen."
          href="/faculty/notifications"
        />
      </div>

      {/* Upcoming & Notifications */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-xl bg-white shadow-sm ring-1 ring-neutral-200/70">
          <div className="flex items-center justify-between border-b border-neutral-200/80 px-4 py-3">
            <h2 className="font-medium">Upcoming</h2>
            <Link href="/faculty/schedule" className="text-sm text-[#7a0019]">See all</Link>
          </div>
          <div className="divide-y divide-neutral-200/70">
            {upcoming.map((s) => (
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
                <span className={`rounded px-2 py-1 text-xs ${badgeTone(s.status)}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-white shadow-sm ring-1 ring-neutral-200/70">
          <div className="flex items-center justify-between border-b border-neutral-200/80 px-4 py-3">
            <h2 className="font-medium">Notifications</h2>
            <Link href="/faculty/notifications" className="text-sm text-[#7a0019]">View all</Link>
          </div>
          <div className="divide-y divide-neutral-200/70">
            {notifications.map((n) => (
              <div key={n.id} className="px-4 py-3">
                <div className="text-sm">{n.text}</div>
                <div className="text-xs text-neutral-500">{n.time}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
