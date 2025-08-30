"use client";
type Row = { dept: string; purpose: string; date: string; location: string; vehicle: string; status: string; };
export default function UpcomingTablesUI({ schedules, approvals, maintenance }: {
  schedules: Row[]; approvals: Row[]; maintenance: Row[];
}) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
      <Card title="Next 7 days schedules" className="xl:col-span-7">
        <Table rows={schedules} />
      </Card>
      <div className="xl:col-span-5 space-y-3">
        <Card title="Pending approvals"><Table rows={approvals} compact /></Card>
        <Card title="Maintenance bookings"><Table rows={maintenance} compact /></Card>
      </div>
    </div>
  );
}

function Card({ title, children, className="" }: any) {
  return (
    <div className={`rounded-lg border bg-white ${className}`}>
      <div className="flex items-center justify-between border-b px-3 py-2">
        <div className="font-semibold">{title}</div>
        <div className="flex gap-2">
          <button className="h-8 rounded-md border px-3 text-sm hover:bg-neutral-50">Export</button>
          <button className="h-8 rounded-md border px-3 text-sm hover:bg-neutral-50">Open</button>
        </div>
      </div>
      <div className="p-2">{children}</div>
    </div>
  );
}

function Table({ rows, compact = false }: { rows: Row[]; compact?: boolean }) {
  return (
    <div className="max-h-[420px] overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-white">
          <tr className="[&>th]:text-left [&>th]:px-2 [&>th]:py-2 text-neutral-600">
            <th>Department</th><th>Purpose</th><th>Date</th><th>Location</th><th>Vehicle</th><th>Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((r, i) => (
            <tr key={i} className={`hover:bg-neutral-50 ${compact ? "[&>td]:py-1.5" : ""}`}>
              <td className="px-2 py-2">{r.dept}</td>
              <td className="px-2 py-2">{r.purpose}</td>
              <td className="px-2 py-2">{r.date}</td>
              <td className="px-2 py-2">{r.location}</td>
              <td className="px-2 py-2">{r.vehicle}</td>
              <td className="px-2 py-2">
                <span className="rounded-full border px-2 py-0.5 text-xs">{r.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
