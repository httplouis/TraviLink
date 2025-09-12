"use client";
type Props = {
  selectedCount: number;
  disabled?: boolean;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  onExport: () => void;
  onClear: () => void;
};
export default function BulkBarUI({
  selectedCount,
  disabled,
  onApprove,
  onReject,
  onDelete,
  onExport,
  onClear,
}: Props) {
  if (selectedCount === 0) return null;

  return (
    <div className="mb-3 flex items-center justify-between rounded-lg border bg-white px-3 py-2">
      <div className="text-sm">
        <span className="font-medium">{selectedCount}</span> selected
      </div>
      <div className="flex items-center gap-2">
        <button
          className="rounded bg-green-600 px-2 py-1 text-sm text-white disabled:opacity-50"
          onClick={onApprove}
          disabled={disabled}
        >
          Approve
        </button>
        <button
          className="rounded bg-red-600 px-2 py-1 text-sm text-white disabled:opacity-50"
          onClick={onReject}
          disabled={disabled}
        >
          Reject
        </button>
        <button
          className="rounded border px-2 py-1 text-sm disabled:opacity-50"
          onClick={onDelete}
          disabled={disabled}
        >
          Delete
        </button>
        <button className="rounded border px-2 py-1 text-sm" onClick={onExport}>
          Export CSV
        </button>
        <button className="rounded border px-2 py-1 text-sm" onClick={onClear}>
          Clear
        </button>
      </div>
    </div>
  );
}
