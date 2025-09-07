"use client";
import type { RequestRow } from "@/lib/admin/types";

export default function ExportCsvButton({ rows, filename = "requests.csv" }:{
  rows: RequestRow[]; filename?: string;
}) {
  const onClick = () => {
    const header = ["ID","Requester","Vehicle","Date","Status"];
    const body = rows.map(r => [r.id, r.requester, r.vehicle, r.date, r.status]);
    const csv = [header, ...body].map(cols => cols.map(esc).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button onClick={onClick} className="rounded-md border px-3 py-1.5 text-sm bg-white hover:bg-neutral-50">
      Export CSV
    </button>
  );
}
function esc(v: string|number) {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
