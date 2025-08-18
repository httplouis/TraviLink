"use client";

import ProfilePanel from "@/components/ProfilePanel";
import type { ComponentProps } from "react";
import MiniCalendar from "@/components/MiniCalendar";

/** Import the prop type from ProfilePanel for safety */
type ProfilePanelProps = ComponentProps<typeof ProfilePanel>;

type RightRailProps = {
  /** Optional profile override; we’ll fill sane defaults */
  profile?: Partial<ProfilePanelProps>;
  /** KPIs shown above the calendar */
  kpis?: {
    requests: number;
    online: number;
    pending: number;
  };
  /** NOTE: tripsForCalendar is no longer used; MiniCalendar reads from localStorage */
};

function KPI({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-neutral-200/70 shadow-sm p-4 text-center">
      <div className="text-2xl font-semibold leading-tight">{value}</div>
      <div className="mt-1 text-sm text-neutral-600">{label}</div>
    </div>
  );
}

export default function RightRail({
  profile,
  kpis = { requests: 5, online: 3, pending: 4 },
}: RightRailProps) {
  // Build a definite profile object for ProfilePanel
  const p: ProfilePanelProps = {
    role: profile?.role ?? "DRIVER",
    name: profile?.name ?? "Driver",
    code: profile?.code ?? "—",
    faculty: profile?.faculty ?? "Driver",
    campus: profile?.campus ?? "Lucena Campus",
    watermarkSrc: profile?.watermarkSrc ?? "/euwhite.png",
  };

  return (
    <aside className="w-full xl:w-[320px] shrink-0 space-y-4 xl:sticky xl:top-20">
      <ProfilePanel {...p} />

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <KPI label="Active Requests" value={kpis.requests} />
        <KPI label="Vehicles Online" value={kpis.online} />
        <KPI label="Pending Approvals" value={kpis.pending} />
      </div>

      {/* Mini calendar — no props */}
      <MiniCalendar />
    </aside>
  );
}
