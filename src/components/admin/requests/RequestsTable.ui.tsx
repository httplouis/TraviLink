"use client";
import React from "react";
import { RequestRow, Pagination } from "@/lib/admin/types";

export default function RequestsTableUI({
  rows,
  pagination,
  selectedIds,
  onToggleOne,
  onToggleAllOnPage,
  onRowClick,
  onPageChange,
  onPageSizeChange,
}: {
  rows: RequestRow[];               // already paged rows
  pagination: Pagination;
  selectedIds: Set<string>;
  onToggleOne: (id: string) => void;
  onToggleAllOnPage: (checked: boolean, idsOnPage: string[]) => void;
  onRowClick?: (row: RequestRow) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onApproveRow?: (id: string) => void;   // NEW
  onRejectRow?: (id: string) => void;    
}) {
  const idsOnPage = rows.map((r) => r.id);
  const allChecked = idsOnPage.every((id) => selectedIds.has(id)) && idsOnPage.length > 0;
  const indeterminate = !allChecked && idsOnPage.some((id) => selectedIds.has(id));

  function onApproveRow(id: string): void {
    throw new Error("Function not implemented.");
  }

  function onRejectRow(id: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 text-neutral-600">
          <tr>
            <Th className="w-10">
              <input
                aria-label="Select all on page"
                type="checkbox"
                checked={allChecked}
                // function ref must be typed to avoid implicit any
                ref={(el: HTMLInputElement | null) => {
                  if (el) el.indeterminate = indeterminate;
                }}
                // type the change event
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
          {rows.map((r) => (
            <tr
              key={r.id}
              className="border-t hover:bg-neutral-50 cursor-pointer"
              onClick={() => onRowClick?.(r)}
            >
              <Td
                className="w-10"
                onClick={(e: React.MouseEvent<HTMLTableCellElement>) => e.stopPropagation()}
              >
                <input
                  aria-label={`Select ${r.id}`}
                  type="checkbox"
                  checked={selectedIds.has(r.id)}
                  onChange={() => onToggleOne(r.id)}
                />
              </Td>
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
      <button className="rounded bg-green-600 px-2 py-1 text-xs text-white" onClick={() => onApproveRow?.(r.id)}>
        Approve
      </button>
      <button className="rounded bg-red-600 px-2 py-1 text-xs text-white" onClick={() => onRejectRow?.(r.id)}>
        Reject
      </button>
    </div>
  ) : (
    <span className="text-neutral-400">—</span>
  )}
</Td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
        <div className="text-xs text-neutral-500">
          Page {pagination.page} of {Math.max(1, Math.ceil(pagination.total / pagination.pageSize))} ·{" "}
          Showing {rows.length} of {pagination.total}
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
            className="rounded border px-2 py-1 text-sm disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
            onClick={() => onPageChange(pagination.page + 1)}
            className="rounded border px-2 py-1 text-sm disabled:opacity-50"
          >
            Next
          </button>
          <select
            className="ml-2 rounded border px-2 py-1 text-sm"
            value={pagination.pageSize}
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

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 text-left font-medium ${className}`}>{children}</th>;
}
function Td({
  children,
  className = "",
  ...rest
}: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-4 py-3 align-middle ${className}`} {...rest}>
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
