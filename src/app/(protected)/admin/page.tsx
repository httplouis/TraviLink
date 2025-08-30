"use client";
import KpiTiles from "@/components/admin/dashboard/containers/KpiTiles";
import LiveNow from "@/components/admin/dashboard/containers/LiveNow";
import UpcomingTables from "@/components/admin/dashboard/containers/UpcomingTables";
import HealthRail from "@/components/admin/dashboard/containers/HealthRail";
import MapSnapshot from "@/components/admin/dashboard/containers/MapSnapshot";

export default function AdminDashboardPage() {
  return (
    <>
      {/* action strip under topbar */}
      <div className="sticky top-0 z-10 -mx-1 px-1 pb-2 bg-gradient-to-b from-white/80 to-white/60 backdrop-blur border-b border-neutral-200/70">
        <div className="flex flex-wrap items-center gap-2">
          <button className="h-9 rounded-md border px-3 text-sm hover:bg-neutral-50">+ New Request</button>
          <button className="h-9 rounded-md border px-3 text-sm hover:bg-neutral-50">+ Schedule</button>
          <button className="h-9 rounded-md border px-3 text-sm hover:bg-neutral-50">+ Maintenance</button>
        </div>
      </div>

      <div className="space-y-4 pt-3">
        <KpiTiles />

        {/* grid: main + right health rail */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-8 space-y-4">
            <LiveNow />
            <UpcomingTables />
          </div>
          <div className="xl:col-span-4 space-y-4">
            <HealthRail />
            <MapSnapshot />
          </div>
        </div>
      </div>
    </>
  );
}
