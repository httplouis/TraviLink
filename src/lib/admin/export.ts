import type { RequestRow } from "@/components/admin/requests/types";

// converts rows to CSV string
export function rowsToCsv(rows: RequestRow[]): string {
  const header = ["ID","Department","Purpose","Date","Status","Requester","Vehicle","Driver"];
  const escape = (v: any) => {
    if (v === undefined || v === null) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = rows.map(r => [
    r.id, r.dept, r.purpose, r.date, r.status, r.requester ?? "", r.vehicle ?? "", r.driver ?? ""
  ].map(escape).join(","));
  return [header.join(","), ...lines].join("\n");
}

// triggers a download on client
export function triggerDownload(filename: string, content: string, mime = "text/csv;charset=utf-8") {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
