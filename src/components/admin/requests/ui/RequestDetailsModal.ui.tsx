"use client";
import { RequestRow } from "@/lib/admin/types";

type Props = {
  open: boolean;
  onClose: () => void;
  row?: RequestRow;
  onApprove?: () => void;
  onReject?: () => void;
};

export default function RequestDetailsModalUI({
  open,
  onClose,
  row,
  onApprove,
  onReject,
}: Props) {
  if (!open || !row) return null;
  const canAct = row.status === "Pending";

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Request {row.id}</h3>
          <button className="rounded border px-2 py-1 text-sm" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="Department" value={row.dept} />
          <Field label="Status" value={row.status} />
          <Field label="Date" value={row.date} />
          <Field label="Requester" value={row.requester ?? "—"} />
          <Field label="Vehicle" value={row.vehicle ?? "—"} />
          <Field label="Driver" value={row.driver ?? "—"} />
          <div className="col-span-2">
            <Field label="Purpose" value={row.purpose} />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          {canAct ? (
            <>
              <button
                className="rounded bg-green-600 px-3 py-1.5 text-sm text-white"
                onClick={onApprove}
              >
                Approve
              </button>
              <button
                className="rounded bg-red-600 px-3 py-1.5 text-sm text-white"
                onClick={onReject}
              >
                Reject
              </button>
            </>
          ) : (
            <span className="text-sm text-neutral-500">No actions available</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border bg-neutral-50 px-3 py-2">
      <div className="text-xs uppercase tracking-wide text-neutral-500">{label}</div>
      <div className="mt-0.5">{value}</div>
    </div>
  );
}
