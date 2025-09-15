"use client";

import * as React from "react";
import type { RequestRow, Pagination, FilterState } from "@/lib/admin/types";
import StatusBadge from "./StatusBadge";
import PaginationUI from "./Pagination";
import RequestsToolbar from "@/components/admin/requests/toolbar/RequestsToolbar.ui";


type Props = {
  rows: RequestRow[];
  pagination: Pagination;

  // header controls
  tableSearch: string;
  onTableSearch?: (q: string) => void;
  sortDir?: "asc" | "desc";
  onSortDirChange?: (d: "asc" | "desc") => void;
  onAddNew?: () => void;

  // filters
  filterControls: {
    draft: FilterState;
    onDraftChange: (n: Partial<FilterState>) => void;
    onApply: () => void;
    onClearAll: () => void;
  };

  // selection
  selectedIds?: Set<string>;
  onToggleOne: (id: string) => void;
  onToggleAllOnPage: (checked: boolean, idsOnPage: string[]) => void;

  // row UX
  onRowClick?: (row: RequestRow) => void;
  onRowViewDetails?: (row: RequestRow) => void;

  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  onApproveRow?: (id: string) => Promise<void>;
  onRejectRow?: (id: string) => Promise<void>;
};

export default function RequestsTable({
  rows,
  pagination,
  tableSearch,
  onTableSearch,
  sortDir = "desc",
  onSortDirChange,
  onAddNew,
  filterControls,
  selectedIds,
  onToggleOne,
  onToggleAllOnPage,
  onRowClick,
  onRowViewDetails,
  onPageChange,
  onPageSizeChange,
  onApproveRow,
  onRejectRow,
}: Props) {
  const set = selectedIds ?? new Set<string>();
  const idsOnPage = rows.map((r) => r.id);
  const allChecked = idsOnPage.length > 0 && idsOnPage.every((id) => set.has(id));
  const indeterminate = !allChecked && idsOnPage.some((id) => set.has(id));

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <RequestsToolbar
        tableSearch={tableSearch}
        onTableSearch={onTableSearch}
        sortDir={sortDir}
        onSortDirChange={onSortDirChange}
        onAddNew={onAddNew ?? (() => {})}
        filterControls={filterControls}
      />

      <div className="overflow-x-auto">
  <table className="w-full text-sm table-fixed">
    {/* ✅ ADD THIS, replace any old <colgroup> */}
    <colgroup>
      {[
        44,      // checkbox
        110,     // ID
        140,     // Department
        null,    // Purpose (flex)
        170,     // Received
        120,     // Date
        120,     // Status
        150,     // Actions
      ].map((w, i) => (
        <col key={i} style={w ? { width: w } : undefined} />
      ))}
    </colgroup>

        <thead className="sticky top-0 z-10 bg-neutral-50/90 backdrop-blur supports-[backdrop-filter]:bg-neutral-50/60">
            <tr className="text-neutral-600">
              <Th>
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={(el) => {
                    if (el) el.indeterminate = indeterminate;
                  }}
                  onChange={(e) => onToggleAllOnPage(e.currentTarget.checked, idsOnPage)}
                />
              </Th>
              <Th>ID</Th>
              <Th>Department</Th>
              <Th className="truncate">Purpose</Th>
              <Th>Received</Th>
              <Th>Date</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>

          <tbody className="[&_tr:nth-child(even)]:bg-neutral-50/40">
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-t border-neutral-200 hover:bg-neutral-50/80"
                onClick={() => onRowClick?.(r)}
              >
                <Td onClick={(e) => e.stopPropagation()}>
                  <input
                    aria-label={`Select ${r.id}`}
                    type="checkbox"
                    checked={set.has(r.id)}
                    onChange={() => onToggleOne(r.id)}
                  />
                </Td>

                <Td onClick={(e) => e.stopPropagation()}>
                  <button
                    className="text-[13px] font-semibold text-blue-700 underline-offset-2 hover:underline"
                    onClick={() => onRowClick?.(r)}
                  >
                    {r.id}
                  </button>
                </Td>

                <Td>{r.dept}</Td>

                {/* Purpose locks to the column width and truncates */}
                <Td className="truncate" title={r.purpose}>
                  {r.purpose}
                </Td>

                {/* Keep numbers/dates single-line so the column width is stable */}
                <Td className="tabular-nums whitespace-nowrap">
                  {(r as any).receivedAt ?? (r as any).createdAt ?? "—"}
                </Td>
                <Td className="tabular-nums whitespace-nowrap">{r.date}</Td>

                <Td>
                  <StatusBadge status={r.status} />
                </Td>

                <Td className="text-right" onClick={(e) => e.stopPropagation()}>
                  {r.status === "Pending" ? (
                    <div className="inline-flex gap-2">
                      <button
                        className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs text-white"
                        onClick={() => onApproveRow?.(r.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs text-white"
                        onClick={() => onRejectRow?.(r.id)}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-neutral-400">—</span>
                  )}
                </Td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <Td className="py-12 text-center text-neutral-500" colSpan={8}>
                  No requests to show.
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
        <div className="text-xs text-neutral-500">
          Page {pagination.page} of {Math.max(1, Math.ceil(pagination.total / pagination.pageSize))}
          {" · "}Showing {Math.min(pagination.pageSize, rows.length)} of {pagination.total}
        </div>
        <PaginationUI
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onPage={onPageChange}
          onSize={onPageSizeChange}
        />
      </div>
    </div>
  );
}

/* tiny cells */
function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 text-left text-xs font-semibold ${className}`}>{children}</th>;
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
    <td
      className={`px-4 py-3 align-middle text-[13px] text-neutral-800 ${className}`}
      colSpan={colSpan}
      {...rest}
    >
      {children}
    </td>
  );
}
