"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { RequestRow, Pagination } from "@/lib/admin/types";

import ToastProvider, { useToast } from "@/components/common/ToastProvider";
import RequestsSummaryUI from "@/components/admin/requests/ui/RequestsSummary.ui";
import FiltersBarContainer from "@/components/admin/requests/containers/FiltersBar.container";
import BulkBarContainer, { BulkBarHandle } from "@/components/admin/requests/containers/BulkBar.container";
import RequestsTableUI from "@/components/admin/requests/ui/RequestsTable.ui";
import RequestDetailsModalUI from "@/components/admin/requests/ui/RequestDetailsModal.ui";
import ConfirmUI from "@/components/admin/requests/ui/Confirm.ui";

import { exportRequestsCsv } from "@/lib/admin/export";
import { approveRequests, rejectRequests, deleteRequests } from "@/lib/admin/requests/action";
import { REQUESTS } from "@/lib/admin/requests/data";

function PageInner() {
  const toast = useToast();
  const bulkRef = useRef<BulkBarHandle>(null);

  // SOURCE rows (mock)
  const [allRows, setAllRows] = useState<RequestRow[]>(() => [...REQUESTS]);

  // FILTERED rows
  const [filteredRows, setFilteredRows] = useState<RequestRow[]>(() => allRows);
  useEffect(() => setFilteredRows(allRows), [allRows]);

  // SELECTION
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const clearSelection = () => setSelected(new Set());

  // PAGINATION
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 5,
    total: allRows.length,
  });
  useEffect(() => {
    setPagination((p) => {
      const total = filteredRows.length;
      const maxPage = Math.max(1, Math.ceil(total / p.pageSize) || 1);
      return { ...p, total, page: Math.min(p.page, maxPage) };
    });
    clearSelection();
  }, [filteredRows]);

  const pageRows = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    return filteredRows.slice(start, start + pagination.pageSize);
  }, [filteredRows, pagination.page, pagination.pageSize]);

  // DETAILS + CONFIRM
  const [openDetails, setOpenDetails] = useState(false);
  const [activeRow, setActiveRow] = useState<RequestRow | undefined>();
  const openRow = (r: RequestRow) => { setActiveRow(r); setOpenDetails(true); };

  const [confirm, setConfirm] = useState<{ open: boolean; kind?: "approve" | "reject"; id?: string }>({ open: false });

  // ---------- Optimistic patch ----------
  function patchStatus(ids: string[], status?: "Approved" | "Rejected") {
    setAllRows((prev) =>
      status
        ? prev.map((r) => (ids.includes(r.id) ? { ...r, status } : r))
        : prev.filter((r) => !ids.includes(r.id))
    );
    setFilteredRows((prev) =>
      status
        ? prev.map((r) => (ids.includes(r.id) ? { ...r, status } : r))
        : prev.filter((r) => !ids.includes(r.id))
    );
  }

  // ---------- Single row actions ----------
  async function approveOne(id: string) {
    const snapAll = [...allRows];
    const snapFiltered = [...filteredRows];
    patchStatus([id], "Approved");
    try {
      await approveRequests([id]);
      toast({ kind: "success", message: `Request ${id} approved.` });
    } catch {
      setAllRows(snapAll); setFilteredRows(snapFiltered);
      toast({ kind: "error", message: `Failed to approve ${id}.` });
    }
  }

  async function rejectOne(id: string) {
    const snapAll = [...allRows];
    const snapFiltered = [...filteredRows];
    patchStatus([id], "Rejected");
    try {
      await rejectRequests([id]);
      toast({ kind: "success", message: `Request ${id} rejected.` });
    } catch {
      setAllRows(snapAll); setFilteredRows(snapFiltered);
      toast({ kind: "error", message: `Failed to reject ${id}.` });
    }
  }

  const doConfirm = async () => {
    const id = confirm.id!;
    if (confirm.kind === "approve") await approveOne(id);
    if (confirm.kind === "reject") await rejectOne(id);
    setConfirm({ open: false });
  };

  // ---------- Bulk actions ----------
  async function bulkApprove(ids: string[]) {
    if (!ids.length) return;
    const snapAll = [...allRows];
    const snapFiltered = [...filteredRows];
    patchStatus(ids, "Approved");
    try {
      await approveRequests(ids);
      toast({ kind: "success", message: `Approved ${ids.length} selected.` });
    } catch {
      setAllRows(snapAll); setFilteredRows(snapFiltered);
      toast({ kind: "error", message: "Failed to approve selected." });
    }
  }

  async function bulkReject(ids: string[]) {
    if (!ids.length) return;
    const snapAll = [...allRows];
    const snapFiltered = [...filteredRows];
    patchStatus(ids, "Rejected");
    try {
      await rejectRequests(ids);
      toast({ kind: "success", message: `Rejected ${ids.length} selected.` });
    } catch {
      setAllRows(snapAll); setFilteredRows(snapFiltered);
      toast({ kind: "error", message: "Failed to reject selected." });
    }
  }

  async function bulkDelete(ids: string[]) {
    if (!ids.length) return;
    const snapAll = [...allRows];
    const snapFiltered = [...filteredRows];
    patchStatus(ids, undefined);
    try {
      await deleteRequests(ids);
      toast({ kind: "success", message: `Deleted ${ids.length} selected.` });
    } catch {
      setAllRows(snapAll); setFilteredRows(snapFiltered);
      toast({ kind: "error", message: "Failed to delete selected." });
    }
  }

  function bulkExport(rows: RequestRow[]) {
    try {
      exportRequestsCsv(rows);
      toast({ kind: "success", message: `Exported ${rows.length} row(s).` });
    } catch {
      toast({ kind: "error", message: "Export failed." });
    }
  }

  // ---------- Shortcuts ----------
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        bulkRef.current?.approveSelected();
      }
      if (e.key === "a") { e.preventDefault(); setSelected(new Set([...selected, ...pageRows.map(r => r.id)])); }
      if (e.key === "x") { e.preventDefault(); clearSelection(); }
      if (e.key === "ArrowLeft")  setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }));
      if (e.key === "ArrowRight") setPagination(p => ({ ...p, page: p.page + 1 }));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pageRows, selected]);

  // KPI
  const summary = useMemo(() => ({
    pending:   filteredRows.filter((r) => r.status === "Pending").length,
    approved:  filteredRows.filter((r) => r.status === "Approved").length,
    completed: filteredRows.filter((r) => r.status === "Completed").length,
    rejected:  filteredRows.filter((r) => r.status === "Rejected").length,
  }), [filteredRows]);

  return (
    <div className="space-y-4">
      <RequestsSummaryUI summary={summary} />
      <FiltersBarContainer rows={allRows} onFiltered={setFilteredRows} />

      <BulkBarContainer
        ref={bulkRef}
        allRows={filteredRows}
        selectedIds={selected}
        clearSelection={clearSelection}
        onApproveSelected={bulkApprove}
        onRejectSelected={bulkReject}
        onDeleteSelected={bulkDelete}
        onExportSelected={bulkExport}
      />

      <RequestsTableUI
        rows={pageRows}
        pagination={pagination}
        selectedIds={selected}
        onToggleOne={(id) =>
          setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
          })
        }
        onToggleAllOnPage={(checked, idsOnPage) =>
          setSelected((prev) => {
            const next = new Set(prev);
            idsOnPage.forEach((id) => (checked ? next.add(id) : next.delete(id)));
            return next;
          })
        }
        onRowClick={openRow}
        onPageChange={(page) => setPagination((p) => ({ ...p, page }))}
        onPageSizeChange={(pageSize) => setPagination((p) => ({ ...p, page: 1, pageSize }))}
        onApproveRow={(id) => approveOne(id)}
        onRejectRow={(id) => rejectOne(id)}
      />

      <RequestDetailsModalUI
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        row={activeRow}
        onApprove={() => activeRow && setConfirm({ open: true, kind: "approve", id: activeRow.id })}
        onReject={()  => activeRow && setConfirm({ open: true, kind: "reject",  id: activeRow.id })}
      />

      <ConfirmUI
        open={confirm.open}
        title={confirm.kind === "approve" ? "Approve request?" : "Reject request?"}
        message={confirm.kind === "approve" ? "This will mark the request as Approved." : "This will mark the request as Rejected."}
        confirmText={confirm.kind === "approve" ? "Approve" : "Reject"}
        confirmClass={confirm.kind === "approve" ? "bg-green-600 text-white" : "bg-red-600 text-white"}
        onCancel={() => setConfirm({ open: false })}
        onConfirm={doConfirm}
      />
    </div>
  );
}

export default function AdminRequestsPage() {
  return (
    <ToastProvider>
      <PageInner />
    </ToastProvider>
  );
}
