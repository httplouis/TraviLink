import type { TripLogRow } from "@/lib/admin/types";

export default function TripLogsTable({ rows }: { rows: TripLogRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 text-neutral-600">
          <tr>
            <Th className="w-[110px]">Trip ID</Th>
            <Th>Vehicle</Th>
            <Th>Driver</Th>
            <Th>Department</Th>
            <Th className="w-[140px]">Date</Th>
            <Th className="w-[120px] text-right">Distance (km)</Th>
          </tr>
        </thead>
        <tbody className="[&_tr:nth-child(even)]:bg-neutral-50/40">
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <Td>{r.id}</Td>
              <Td>{r.vehicle}</Td>
              <Td>{r.driver}</Td>
              <Td>{r.department}</Td>
              <Td className="tabular-nums">{r.date}</Td>
              <Td className="tabular-nums text-right">{r.distanceKm.toFixed(1)}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Th({ children, className = "" }: any) {
  return <th className={`text-left font-medium px-4 py-3 whitespace-nowrap ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: any) {
  return <td className={`px-4 py-3 whitespace-nowrap ${className}`}>{children}</td>;
}
