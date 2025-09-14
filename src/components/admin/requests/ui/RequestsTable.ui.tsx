// src/components/admin/requests/ui/RequestsTable.ui.tsx
"use client";

import * as React from "react";
import type { RequestRow, Pagination, FilterState } from "@/lib/admin/types";

type FilterControlsProps = {
  draft: FilterState;
  onDraftChange: (next: Partial<FilterState>) => void;
  onApply: () => void;
  onClearAll: () => void;
};

type Props = {
  /** Table-level search + sort + add new (toolbar above table) */
  tableSearch?: string;
  onTableSearch?: (q: string) => void;
  sortDir?: "asc" | "desc";
  onSortDirChange?: (d: "asc" | "desc") => void;
  onAddNew?: () => void;

  /** Headless filter controls injected from FiltersBar.container */
  filterControls: FilterControlsProps;

  /** Already paged rows */
  rows?: RequestRow[];
  pagination: Pagination;

  /** Selection */
  selectedIds?: Set<string>;
  onToggleOne: (id: string) => void;
  onToggleAllOnPage: (checked: boolean, idsOnPage: string[]) => void;

  /** UX */
  onRowClick?: (row: RequestRow) => void;
  onRowViewDetails?: (row: RequestRow) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  /** Must return a Promise; resolve = success, reject/throw = error */
  onApproveRow?: (id: string) => Promise<void>;
  onRejectRow?: (id: string) => Promise<void>;
};

type ToastKind = "success" | "error";
type RowToast = { kind: ToastKind; msg: string };

const statuses: Array<FilterState["status"]> = ["All", "Pending", "Approved", "Completed", "Rejected"];
const depts: Array<FilterState["dept"]> = ["All", "CCMS", "HR", "Registrar", "Finance"];

export default function RequestsTableUI({
  tableSearch = "",
  onTableSearch,
  sortDir = "desc",
  onSortDirChange,
  onAddNew,
  filterControls,
  rows,
  pagination,
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
  const safeRows: RequestRow[] = Array.isArray(rows) ? rows : [];
  const safeSet: Set<string> = selectedIds instanceof Set ? selectedIds : new Set<string>();

  const safePagination = {
    page: pagination?.page ?? 1,
    pageSize: pagination?.pageSize ?? 15,
    total: pagination?.total ?? safeRows.length,
  };

  const idsOnPage = safeRows.map((r) => r.id);
  const allChecked = idsOnPage.length > 0 && idsOnPage.every((id) => safeSet.has(id));
  const indeterminate = !allChecked && idsOnPage.some((id) => safeSet.has(id));

  // per-row pending + inline toast
  const [pendingRow, setPendingRow] = React.useState<string | null>(null);
  const [toasts, setToasts] = React.useState<Record<string, RowToast | undefined>>({});
  const [openMenuFor, setOpenMenuFor] = React.useState<string | null>(null);

  React.useEffect(() => {
    function onDocClick() {
      setOpenMenuFor(null);
      setFilterOpen(false);
      hide("req-sort-menu");
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  function pushToast(id: string, toast: RowToast) {
    setToasts((m) => ({ ...m, [id]: toast }));
    window.setTimeout(() => {
      setToasts((m) => {
        const copy = { ...m };
        delete copy[id];
        return copy;
      });
    }, 2200);
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

  // ----- Filter popover (inline with Search) -----
  const [filterOpen, setFilterOpen] = React.useState(false);
  const { draft, onDraftChange, onApply, onClearAll } = filterControls;

  // Saved Views hydration (safe client-only)
  const [hydrated, setHydrated] = React.useState(false);
  const [savedViews, setSavedViews] = React.useState<Array<{ name: string; state: any }>>([]);
  React.useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem("tl.requests.views");
      const parsed = raw ? JSON.parse(raw) : [];
      setSavedViews(Array.isArray(parsed) ? parsed : []);
    } catch {
      setSavedViews([]);
    }
    function onStorage(e: StorageEvent) {
      if (e.key === "tl.requests.views") {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : [];
          setSavedViews(Array.isArray(parsed) ? parsed : []);
        } catch {}
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function dispatch(name: "requests.saveView" | "requests.applyView", detail?: any) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* HEADER with Search + Filter + Sort + Add */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <input
            className="min-w-[220px] flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm md:max-w-md"
            placeholder="Search requests…"
            value={tableSearch}
            onChange={(e) => onTableSearch?.(e.target.value)}
          />

        {/* Filter button (inline) */}
          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-700 shadow-sm hover:bg-neutral-50"
              onClick={(e) => {
                e.stopPropagation();
                setFilterOpen((s) => !s);
              }}
            >
              <span className="inline-block h-[10px] w-[10px] rounded-[2px] border border-neutral-400" />
              Filter <span>▾</span>
            </button>

            {filterOpen && (
              <div
                className="absolute left-0 z-30 mt-2 w-[320px] rounded-xl border border-neutral-200 bg-white p-3 text-sm shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-neutral-600">Status</label>
                    <select
                      className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-2"
                      value={draft.status}
                      onChange={(e) => onDraftChange({ status: e.target.value as any })}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-neutral-600">Department</label>
                    <select
                      className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-2"
                      value={draft.dept}
                      onChange={(e) => onDraftChange({ dept: e.target.value as any })}
                    >
                      {depts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-600">From</label>
                      <input
                        type="date"
                        className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-2"
                        value={draft.from || ""}
                        onChange={(e) => onDraftChange({ from: e.target.value || "" })}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-600">To</label>
                      <input
                        type="date"
                        className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-2"
                        value={draft.to || ""}
                        onChange={(e) => onDraftChange({ to: e.target.value || "" })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-neutral-600">Mode</label>
                    <select
                      className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-2"
                      value={draft.mode}
                      onChange={(e) => onDraftChange({ mode: e.target.value as any })}
                    >
                      <option value="auto">Auto (instant)</option>
                      <option value="apply">Apply (manual)</option>
                    </select>
                  </div>

                  {/* Saved Views */}
                  <div className="pt-2">
                    <div className="mb-1 text-xs font-medium text-neutral-600">Saved Views</div>
                    <div className="flex gap-2">
                      <button
                        className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:opacity-50"
                        onClick={() => dispatch("requests.saveView")}
                        disabled={!hydrated}
                      >
                        Save View
                      </button>
                      <select
                        className="flex-1 rounded-lg border border-neutral-300 bg-white px-2 py-2 text-sm text-neutral-700 shadow-sm transition disabled:opacity-50"
                        defaultValue=""
                        disabled={!hydrated || savedViews.length === 0}
                        onChange={(e) => dispatch("requests.applyView", e.target.value)}
                      >
                        <option value="" disabled>
                          Saved Views
                        </option>
                        {savedViews.map((v) => (
                          <option key={v.name} value={v.name}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 shadow-sm hover:bg-neutral-50"
                      onClick={() => {
                        onClearAll();
                        setFilterOpen(false);
                      }}
                    >
                      Clear All
                    </button>
                    <button
                      className="rounded-lg bg-[#7a1f2a] px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#6b1b26]"
                      onClick={() => {
                        if (draft.mode === "apply") onApply();
                        setFilterOpen(false);
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-700 shadow-sm hover:bg-neutral-50"
              onClick={(e) => {
                e.stopPropagation();
                toggle("req-sort-menu");
              }}
            >
              <span className="i">⇅</span>
              {sortDir === "desc" ? "Newest First" : "Oldest First"}
              <span>▾</span>
            </button>
            <div
              id="req-sort-menu"
              className="absolute right-0 z-20 mt-1 hidden w-40 overflow-hidden rounded-lg border border-neutral-200 bg-white text-sm shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={`block w-full px-3 py-2 text-left hover:bg-neutral-50 ${sortDir === "desc" ? "bg-neutral-50" : ""}`}
                onClick={() => {
                  onSortDirChange?.("desc");
                  hide("req-sort-menu");
                }}
              >
                Newest First
              </button>
              <button
                className={`block w-full px-3 py-2 text-left hover:bg-neutral-50 ${sortDir === "asc" ? "bg-neutral-50" : ""}`}
                onClick={() => {
                  onSortDirChange?.("asc");
                  hide("req-sort-menu");
                }}
              >
                Oldest First
              </button>
            </div>
          </div>

          {/* Add New */}
          <button
            type="button"
            className="rounded-lg bg-[#7a1f2a] px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#6b1b26]"
            onClick={onAddNew}
          >
            + Add New
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-neutral-50/90 backdrop-blur supports-[backdrop-filter]:bg-neutral-50/60">
            <tr className="text-neutral-600">
              <Th className="w-10">
                <input
                  aria-label="Select all on page"
                  type="checkbox"
                  checked={allChecked}
                  ref={(el: HTMLInputElement | null) => {
                    if (el) el.indeterminate = indeterminate;
                  }}
                  onChange={(e) => onToggleAllOnPage(e.currentTarget.checked, idsOnPage)}
                />
              </Th>
              <Th>ID</Th>
              <Th>Department</Th>
              <Th className="max-w-[420px]">Purpose</Th>
              <Th>Received</Th>
              <Th>Date</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>

          <tbody className="[&_tr:nth-child(even)]:bg-neutral-50/40">
            {safeRows.map((r) => {
              const isPending = pendingRow === r.id;
              const toast = toasts[r.id];

              const received = (r as any).receivedAt ?? (r as any).createdAt ?? "—";

              return (
                <tr
                  key={r.id}
                  className="border-t border-neutral-200 hover:bg-neutral-50/80"
                  onClick={() => onRowClick?.(r)}
                >
                  <Td className="w-10" onClick={(e) => e.stopPropagation()}>
                    <input
                      aria-label={`Select ${r.id}`}
                      type="checkbox"
                      checked={safeSet.has(r.id)}
                      onChange={() => onToggleOne(r.id)}
                    />
                  </Td>

                  <Td onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="text-[13px] font-semibold text-blue-700 underline-offset-2 hover:underline focus:underline focus:outline-none"
                      aria-label={`Open details for ${r.id}`}
                      onClick={() => onRowClick?.(r)}
                    >
                      {r.id}
                    </button>
                  </Td>

                  <Td>{r.dept}</Td>
                  <Td className="truncate">{r.purpose}</Td>
                  <Td className="tabular-nums">{received}</Td>
                  <Td className="tabular-nums">{r.date}</Td>
                  <Td>
                    <StatusBadge status={r.status} />
                  </Td>

                  <Td className={`relative text-right ${toast ? "pr-16" : ""}`} onClick={(e) => e.stopPropagation()}>
                    {/* Inline row toast bubble */}
                    {toast && (
                      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2">
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-medium shadow-sm ${
                            toast.kind === "success" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {toast.msg}
                        </span>
                      </div>
                    )}

                    <div className="inline-flex items-center gap-2">
                      {r.status === "Pending" ? (
                        <>
                          <button
                            className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                            disabled={isPending}
                            onClick={() => doApprove(r.id)}
                          >
                            {isPending ? "…" : "Approve"}
                          </button>
                          <button
                            className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-medium text-white shadow-sm hover:bg-rose-700 disabled:opacity-50"
                            disabled={isPending}
                            onClick={() => doReject(r.id)}
                          >
                            {isPending ? "…" : "Reject"}
                          </button>
                        </>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}

                      {/* Kebab menu */}
                      <div className="relative">
                        <button
                          className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-700 hover:bg-neutral-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuFor((prev) => (prev === r.id ? null : r.id));
                          }}
                        >
                          ⋯
                        </button>
                        {openMenuFor === r.id && (
                          <div
                            className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-neutral-200 bg-white text-sm shadow-md"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button className="block w-full px-3 py-2 text-left hover:bg-neutral-50" onClick={() => onRowViewDetails?.(r)}>
                              View Details
                            </button>
                            <button
                              className="block w-full px-3 py-2 text-left hover:bg-neutral-50"
                              onClick={() => doApprove(r.id)}
                              disabled={r.status !== "Pending"}
                            >
                              Approve
                            </button>
                            <button
                              className="block w-full px-3 py-2 text-left hover:bg-neutral-50"
                              onClick={() => doReject(r.id)}
                              disabled={r.status !== "Pending"}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Td>
                </tr>
              );
            })}

            {safeRows.length === 0 && (
              <tr>
                <Td className="py-12 text-center text-neutral-500" colSpan={8}>
                  No requests to show.
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
        <div className="text-xs text-neutral-500">
          Page {safePagination.page} of {Math.max(1, Math.ceil(safePagination.total / safePagination.pageSize))} · Showing{" "}
          {safeRows.length} of {safePagination.total}
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={safePagination.page <= 1}
            onClick={() => onPageChange(safePagination.page - 1)}
            className="rounded-lg border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-700 shadow-sm disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={safePagination.page >= Math.ceil(safePagination.total / safePagination.pageSize)}
            onClick={() => onPageChange(safePagination.page + 1)}
            className="rounded-lg border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-700 shadow-sm disabled:opacity-50"
          >
            Next
          </button>
          <select
            className="ml-2 rounded-lg border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-700 shadow-sm"
            value={safePagination.pageSize}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
          >
            {[15, 20, 50].map((n) => (
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
function toggle(id: string) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle("hidden");
}
function hide(id: string) {
  const el = document.getElementById(id);
  if (el) el.classList.add("hidden");
}

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
    <td className={`px-4 py-3 align-middle text-[13px] text-neutral-800 ${className}`} colSpan={colSpan} {...rest}>
      {children}
    </td>
  );
}

function StatusBadge({ status }: { status: RequestRow["status"] }) {
  const c: Record<RequestRow["status"], string> = {
    Pending: "bg-amber-100 text-amber-800",
    Approved: "bg-emerald-100 text-emerald-800",
    Completed: "bg-blue-100 text-blue-800",
    Rejected: "bg-rose-100 text-rose-800",
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c[status]}`}>{status}</span>;
}
