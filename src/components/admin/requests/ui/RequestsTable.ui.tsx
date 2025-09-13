// src/components/admin/requests/ui/RequestsTable.ui.tsx
"use client";

import * as React from "react";
import type { RequestRow, Pagination } from "@/lib/admin/types";

type Props = {
  /** Already paged rows */
  rows?: RequestRow[];
  pagination: Pagination;

  /** Selection */
  selectedIds?: Set<string>;
  onToggleOne: (id: string) => void;
  onToggleAllOnPage: (checked: boolean, idsOnPage: string[]) => void;

  /** UX */
  onRowClick?: (row: RequestRow) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  /** Must return a Promise; resolve = success, reject/throw = error */
  onApproveRow?: (id: string) => Promise<void>;
  onRejectRow?: (id: string) => Promise<void>;
};

type ToastKind = "success" | "error";
type RowToast = { kind: ToastKind; msg: string };

export default function RequestsTableUI({
  rows,
  pagination,
  selectedIds,
  onToggleOne,
  onToggleAllOnPage,
  onRowClick,
  onPageChange,
  onPageSizeChange,
  onApproveRow,
  onRejectRow,
}: Props) {
  const safeRows: RequestRow[] = Array.isArray(rows) ? rows : [];
  const safeSet: Set<string> =
    selectedIds instanceof Set ? selectedIds : new Set<string>();

  const safePagination = {
    page: pagination?.page ?? 1,
    pageSize: pagination?.pageSize ?? 5,
    total: pagination?.total ?? safeRows.length,
  };

  const idsOnPage = safeRows.map((r) => r.id);
  const allChecked =
    idsOnPage.length > 0 && idsOnPage.every((id) => safeSet.has(id));
  const indeterminate =
    !allChecked && idsOnPage.some((id) => safeSet.has(id));

  // per-row pending + inline toast
  const [pendingRow, setPendingRow] = React.useState<string | null>(null);
  const [toasts, setToasts] = React.useState<
    Record<string, RowToast | undefined>
  >({});

  function pushToast(id: string, toast: RowToast) {
    setToasts((m) => ({ ...m, [id]: toast }));
    window.setTimeout(() => {
      setToasts((m) => {
        const copy = { ...m };
        delete copy[id];
        return copy;
      });
    }, 2500);
  }

  async function doApprove(id: string) {
    if (!onApproveRow || pendingRow) return;
    try {
      setPendingRow(id);
      await onApproveRow(id);
      pushToast(id, { kind: "success", msg: "Approved" });
    } catch {
      pushToast(id, { kind: "error", msg: "Failed" });
    } finally {
      setPendingRow(null);
    }
  }

  async function doReject(id: string) {
    if (!onRejectRow || pendingRow) return;
    try {
      setPendingRow(id);
      await onRejectRow(id);
      pushToast(id, { kind: "success", msg: "Rejected" });
    } catch {
      pushToast(id, { kind: "error", msg: "Failed" });
    } finally {
      setPendingRow(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 bg-neutral-50 text-neutral-600">
          <tr>
            <Th className="w-10">
              <input
                aria-label="Select all on page"
                type="checkbox"
                checked={allChecked}
                ref={(el: HTMLInputElement | null) => {
                  if (el) el.indeterminate = indeterminate;
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onToggleAllOnPage(e.target.checked, idsOnPage)
                }
              />
            </Th>
            <Th>ID</Th>
            <Th>Department</Th>
            <Th>Purpose</Th>
            <Th>Date</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>

        <tbody className="[&_tr:nth-child(even)]:bg-neutral-50/50">
          {safeRows.map((r) => {
            const isPending = pendingRow === r.id;
            const toast = toasts[r.id];

            return (
              <tr
                key={r.id}
                className="border-t hover:bg-neutral-50 cursor-pointer"
                onClick={() => onRowClick?.(r)}
              >
                <Td
                  className="w-10"
                  onClick={(e: React.MouseEvent<HTMLTableCellElement>) =>
                    e.stopPropagation()
                  }
                >
                  <input
                    aria-label={`Select ${r.id}`}
                    type="checkbox"
                    checked={safeSet.has(r.id)}
                    onChange={() => onToggleOne(r.id)}
                  />
                </Td>

                <Td>
                  <span className="text-blue-600 underline-offset-2">
                    {r.id}
                  </span>
                </Td>
                <Td>{r.dept}</Td>
                <Td className="max-w-[420px] truncate">{r.purpose}</Td>
                <Td className="tabular-nums">{r.date}</Td>
                <Td>{statusTag(r.status)}</Td>

                <Td
                  className={`relative text-right ${toast ? "pr-16" : ""}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Inline row toast bubble */}
                  {toast && (
                    <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2">
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium shadow ${
                          toast.kind === "success"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {toast.msg}
                      </span>
                    </div>
                  )}

                  {r.status === "Pending" ? (
                    <div className="space-x-2">
                      <button
                        className="rounded bg-green-600 px-2 py-1 text-xs text-white disabled:opacity-50"
                        disabled={isPending}
                        onClick={() => doApprove(r.id)}
                      >
                        {isPending ? "…" : "Approve"}
                      </button>
                      <button
                        className="rounded bg-red-600 px-2 py-1 text-xs text-white disabled:opacity-50"
                        disabled={isPending}
                        onClick={() => doReject(r.id)}
                      >
                        {isPending ? "…" : "Reject"}
                      </button>
                    </div>
                  ) : (
                    <span className="text-neutral-400">—</span>
                  )}
                </Td>
              </tr>
            );
          })}

          {safeRows.length === 0 && (
            <tr>
              <Td className="py-10 text-center text-neutral-500" colSpan={7}>
                No requests to show.
              </Td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
        <div className="text-xs text-neutral-500">
          Page {safePagination.page} of{" "}
          {Math.max(1, Math.ceil(safePagination.total / safePagination.pageSize))}
          {" · "}
          Showing {safeRows.length} of {safePagination.total}
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={safePagination.page <= 1}
            onClick={() => onPageChange(safePagination.page - 1)}
            className="rounded border px-2 py-1 text-sm disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={
              safePagination.page >=
              Math.ceil(safePagination.total / safePagination.pageSize)
            }
            onClick={() => onPageChange(safePagination.page + 1)}
            className="rounded border px-2 py-1 text-sm disabled:opacity-50"
          >
            Next
          </button>
          <select
            className="ml-2 rounded border px-2 py-1 text-sm"
            value={safePagination.pageSize}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onPageSizeChange(parseInt(e.target.value, 10))
            }
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

/* ---------- tiny helpers ---------- */

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={`px-4 py-3 text-left font-medium ${className}`}>{children}</th>
  );
}

function Td({
  children,
  className = "",
  colSpan,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
} & React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-4 py-3 align-middle ${className}`} colSpan={colSpan} {...rest}>
      {children}
    </td>
  );
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
