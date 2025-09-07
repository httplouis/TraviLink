"use client";
import { RequestRow } from "./types";

export default function RequestsTableUI({
  rows,
  onRowClick,
}: {
  rows: RequestRow[];
  onRowClick?: (row: RequestRow) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 text-neutral-600">
          <tr>
            <Th>ID</Th>
            <Th>Department</Th>
            <Th>Purpose</Th>
            <Th>Date</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody className="[&_tr:nth-child(even)]:bg-neutral-50/50">
          {rows.map((r) => (
            <tr
              key={r.id}
              className="border-t hover:bg-neutral-50 cursor-pointer"
              onClick={() => onRowClick?.(r)}
            >
              <Td>
                <span className="text-blue-600 underline-offset-2">{r.id}</span>
              </Td>
              <Td>{r.dept}</Td>
              <Td className="max-w-[420px] truncate">{r.purpose}</Td>
              <Td className="tabular-nums">{r.date}</Td>
              <Td>{statusTag(r.status)}</Td>
              <Td className="text-right" onClick={(e) => e.stopPropagation()}>
                {r.status === "Pending" ? (
                  <div className="space-x-2">
                    <button className="rounded bg-green-600 px-2 py-1 text-xs text-white">Approve</button>
                    <button className="rounded bg-red-600 px-2 py-1 text-xs text-white">Reject</button>
                  </div>
                ) : (
                  <span className="text-neutral-400">—</span>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, className = "" }: any) {
  return <th className={`px-4 py-3 text-left font-medium ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: any) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}

function statusTag(s: RequestRow["status"]) {
  const c: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    Completed: "bg-blue-100 text-blue-800",
    Rejected: "bg-red-100 text-red-800",
  };
  return <span className={`rounded px-2 py-1 text-xs font-medium ${c[s]}`}>{s}</span>;
}
