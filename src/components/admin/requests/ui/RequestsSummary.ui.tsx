import { RequestsSummary } from "@/lib/admin/types";

export default function RequestsSummaryUI({ summary }: { summary: RequestsSummary }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card label="Pending"   value={summary.pending}   color="bg-yellow-50" bar="bg-yellow-300" />
      <Card label="Approved"  value={summary.approved}  color="bg-green-50"  bar="bg-green-300"  />
      <Card label="Completed" value={summary.completed} color="bg-blue-50"   bar="bg-blue-300"   />
      <Card label="Rejected"  value={summary.rejected}  color="bg-red-50"    bar="bg-red-300"    />
    </div>
  );
}

function Card({ label, value, color, bar }: { label: string; value: number; color: string; bar: string }) {
  return (
    <div className={`rounded-xl border bg-white p-4`}>
      <div className="text-sm text-neutral-500">{label}</div>
      <div className="mt-1 flex items-end justify-between">
        <div className="text-3xl font-semibold">{value}</div>
      </div>
      <div className={`mt-3 h-2 w-full rounded ${bar}`}></div>
    </div>
  );
}
