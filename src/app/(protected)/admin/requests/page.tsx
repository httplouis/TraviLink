"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getRequestsData } from "@/lib/admin/repo";
import FiltersBar from "@/components/admin/requests/filters/FiltersBar.container";
import RequestsSummaryUI from "@/components/admin/requests/RequestsSummary.ui";
import RequestsTableUI from "@/components/admin/requests/RequestsTable.ui";
import BulkBarUI from "@/components/admin/requests/BulkBar.ui";
import RequestDetailsUI from "@/components/admin/requests/RequestDetails.ui";
import type { RequestRow, RequestsSummary, FilterState, Pagination } from "@/lib/admin/types";
import { rowsToCsv, triggerDownload } from "@/lib/admin/export";

export default function RequestsPage() {
  // raw + filtered
  const [raw, setRaw] = useState<RequestRow[]>([]);
  const [summary, setSummary] = useState<RequestsSummary | null>(null);
  const [filtered, setFiltered] = useState<RequestRow[]>([]);
  const [applied, setApplied] = useState<FilterState | null>(null);

  // selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // pagination
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // details
  const [selectedRow, setSelectedRow] = useState<RequestRow | null>(null);

  useEffect(() => {
    getRequestsData().then(({ requests, summary }) => {
      setRaw(requests);
      setFiltered(requests);
      setSummary(summary);
    });
  }, []);

  // when filters change, reset selection & pagination
  const handleFiltered = useCallback(
    (rows: RequestRow[], appliedFilters: FilterState) => {
      setFiltered(rows);
      setApplied(appliedFilters);
      setSelectedIds(new Set());
      setPage(1);
    },
    []
  );

  // compute paged rows
  const pagination: Pagination = useMemo(() => ({
    page, pageSize, total: filtered.length
  }), [page, pageSize, filtered.length]);

  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // selection handlers
  function toggleOne(id: string) {
    setSelectedIds(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }
  function toggleAllOnPage(checked: boolean, idsOnPage: string[]) {
    setSelectedIds(prev => {
      const n = new Set(prev);
      idsOnPage.forEach(id => checked ? n.add(id) : n.delete(id));
      return n;
    });
  }
  function clearSelection() {
    setSelectedIds(new Set());
  }

  // mock status updates (bulk + single)
  function updateStatus(ids: string[], next: RequestRow["status"]) {
    setRaw(prev => prev.map(r => ids.includes(r.id) ? { ...r, status: next } : r));
    setFiltered(prev => prev.map(r => ids.includes(r.id) ? { ...r, status: next } : r));
    if (selectedRow && ids.includes(selectedRow.id)) setSelectedRow({ ...selectedRow, status: next });
    // recompute summary
    setSummary(s => (s ? {
      pending:   recount(raw, ids, next, "Pending"),
      approved:  recount(raw, ids, next, "Approved"),
      completed: recount(raw, ids, next, "Completed"),
      rejected:  recount(raw, ids, next, "Rejected"),
    } : s));
  }
  const bulkApprove = () => { if (selectedIds.size) updateStatus([...selectedIds], "Approved"); };
  const bulkReject  = () => { if (selectedIds.size) updateStatus([...selectedIds], "Rejected"); };

  const onApproveSingle = (id: string) => updateStatus([id], "Approved");
  const onRejectSingle  = (id: string) => updateStatus([id], "Rejected");

  // export/print respect current selection; if none, export current filtered page
  const exportCsv = () => {
    const toExport = selectedIds.size
      ? filtered.filter(r => selectedIds.has(r.id))
      : pagedRows;
    const csv = rowsToCsv(toExport);
    triggerDownload("requests.csv", csv);
  };
  const printView = () => {
    // simple print of current page/selection; you can style via @media print in admin.css
    window.print();
  };

  if (!summary) return <div>Loading…</div>;

  return (
    <section className="space-y-6">
      {/* KPIs */}
      <RequestsSummaryUI summary={summary} />

      {/* Filters */}
      <FiltersBar rows={raw} onFiltered={(rows, a) => handleFiltered(rows, a)} />

      {/* Bulk bar (shows only if selected) */}
      <BulkBarUI
        count={selectedIds.size}
        onApprove={bulkApprove}
        onReject={bulkReject}
        onClear={clearSelection}
        onExportCsv={exportCsv}
        onPrint={printView}
      />

      {/* Table */}
      <RequestsTableUI
        rows={pagedRows}
        pagination={pagination}
        selectedIds={selectedIds}
        onToggleOne={toggleOne}
        onToggleAllOnPage={toggleAllOnPage}
        onRowClick={(row) => setSelectedRow(row)}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
      />

      {/* Details modal (single) */}
      <RequestDetailsUI
        open={!!selectedRow}
        onClose={() => setSelectedRow(null)}
        request={selectedRow}
        onApprove={(id) => onApproveSingle(id)}
        onReject={(id) => onRejectSingle(id)}
      />

      {/* foot hint */}
      <p className="text-xs text-neutral-500">
        Showing {pagedRows.length} of {filtered.length} filtered · Page {page}
      </p>
    </section>
  );
}

/* helper for summary recompute on mock update */
function recount(list: RequestRow[], ids: string[], next: RequestRow["status"], key: RequestRow["status"]) {
  return list.reduce((acc, r) => {
    const status = ids.includes(r.id) ? next : r.status;
    return acc + (status === key ? 1 : 0);
  }, 0);
}
