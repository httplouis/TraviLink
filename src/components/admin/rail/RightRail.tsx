// src/components/admin/rail/RightRail.tsx
"use client";

export default function RightRail() {
  return (
    <div className="p-3 space-y-3">
      {/* Profile card */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[var(--admin-brand)] text-white flex items-center justify-center font-bold">A</div>
          <div>
            <div className="text-sm font-semibold">F22-33538</div>
            <div className="text-xs text-neutral-500">Department: CCMS</div>
          </div>
        </div>

        {/* KPI row */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: "Active", value: 5 },
            { label: "Online", value: 3 },
            { label: "Approvals", value: 4 },
          ].map((k) => (
            <div key={k.label} className="kpi-tile text-center py-2">
              <div className="value">{k.value}</div>
              <div className="title">{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Health & Alerts */}
      <div className="tl-card">
        <div className="tl-card-header">
          <div className="text-sm font-semibold">Health & Alerts</div>
        </div>
        <div className="tl-card-body space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 h-2 w-2 rounded-full bg-amber-500"></span>
            <span>2 driver licenses expiring</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 h-2 w-2 rounded-full bg-blue-500"></span>
            <span>1 PM due this week</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 h-2 w-2 rounded-full bg-rose-500"></span>
            <span>Low fuel card balance: 3</span>
          </div>
        </div>
      </div>

      {/* Quick action */}
      <div className="tl-card">
        <div className="tl-card-header">
          <div className="text-sm font-semibold">Quick action / note…</div>
        </div>
        <div className="tl-card-body">
          <textarea
            placeholder="Type and save…"
            className="w-full min-h-[96px] rounded-md border border-neutral-200 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-brand)]"
          />
          <div className="mt-2 flex justify-end">
            <button className="btn btn-primary px-3 py-1.5">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
