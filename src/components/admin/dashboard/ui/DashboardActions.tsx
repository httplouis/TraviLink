"use client";

import type { RequestRow } from "@/lib/admin/types";

export default function DashboardActions({ rows }: { rows: RequestRow[] }) {
  const exportCsv = () => {
    const header = ["ID", "Requester", "Vehicle", "Date", "Status"];
    const body = rows.map(r => [r.id, r.requester, r.vehicle, r.date, r.status]);
    const csv = [header, ...body].map(cols => cols.map(esc).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "requests.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={exportCsv}
        className="rounded-md border px-3 py-1.5 text-sm bg-white hover:bg-neutral-50"
      >
        Export CSV
      </button>
      <button
        onClick={() => window.print()}
        className="rounded-md bg-neutral-900 text-white px-3 py-1.5 text-sm hover:bg-neutral-800"
      >
        Print
      </button>
    </div>
  );
}

function esc(v: string | number) {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
