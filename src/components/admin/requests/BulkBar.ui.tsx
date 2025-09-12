"use client";

export default function BulkBarUI({
  count,
  onApprove,
  onReject,
  onClear,
  onExportCsv,
  onPrint,
}: {
  count: number;
  onApprove: () => void;
  onReject: () => void;
  onClear: () => void;
  onExportCsv: () => void;
  onPrint: () => void;
}) {
  if (count === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white px-3 py-2">
      <div className="text-sm">
        <span className="font-medium">{count}</span> selected
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onApprove} className="rounded bg-green-600 px-3 py-1.5 text-sm text-white">
          Approve
        </button>
        <button onClick={onReject} className="rounded bg-red-600 px-3 py-1.5 text-sm text-white">
          Reject
        </button>
        <div className="mx-1 h-5 w-px bg-neutral-200" />
        <button onClick={onExportCsv} className="rounded bg-neutral-200 px-3 py-1.5 text-sm">
          Export CSV
        </button>
        <button onClick={onPrint} className="rounded bg-neutral-800 px-3 py-1.5 text-sm text-white">
          Print
        </button>
        <div className="mx-1 h-5 w-px bg-neutral-200" />
        <button onClick={onClear} className="rounded bg-neutral-100 px-3 py-1.5 text-sm">
          Clear selection
        </button>
      </div>
    </div>
  );
}
