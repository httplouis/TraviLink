// src/app/(protected)/admin/requests/page.tsx (excerpt inside your client component)
"use client";
import { useMemo, useState, useCallback, useEffect } from "react";
import BulkBarContainer from "@/components/admin/requests/containers/BulkBar.container";
import RequestDetailsModalUI from "@/components/admin/requests/ui/RequestDetailsModal.ui";
import ConfirmUI from "@/components/admin/requests/ui/Confirm.ui";
import RequestsTableUI from "@/components/admin/requests/RequestsTable.ui"; // your table UI
import { RequestRow, Pagination } from "@/lib/admin/types";
import { approveRequests, rejectRequests } from "@/lib/admin/requests/action";

// assume: rowsFiltered = the result from your FiltersBarContainer (existing)
export default function RequestsPageClient({
  rowsFiltered,
}: { rowsFiltered: RequestRow[] }) {
  // selection
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const clearSelection = () => setSelected(new Set());

  // pagination (keep your existing state if you already have it)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1, pageSize: 5, total: rowsFiltered.length,
  });
  useEffect(() => {
    setPagination(p => ({ ...p, total: rowsFiltered.length, page: 1 }));
  }, [rowsFiltered]);

  const pageRows = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    return rowsFiltered.slice(start, start + pagination.pageSize);
  }, [rowsFiltered, pagination.page, pagination.pageSize]);

  // details modal
  const [openDetails, setOpenDetails] = useState(false);
  const [activeRow, setActiveRow] = useState<RequestRow | undefined>();
  const openRow = (r: RequestRow) => { setActiveRow(r); setOpenDetails(true); };

  // single-row confirm modal
  const [confirm, setConfirm] = useState<{open:boolean; kind?: "approve"|"reject"; id?: string}>({open:false});
  const doConfirm = async () => {
    const id = confirm.id!;
    if (confirm.kind === "approve") { await approveRequests([id]); mutateRow(id, "Approved"); }
    if (confirm.kind === "reject")  { await rejectRequests([id]);  mutateRow(id, "Rejected"); }
    setConfirm({open:false});
  };

  // local copy for mutations (you can lift this up to repo/store if you want)
  const [mutableRows, setMutableRows] = useState<RequestRow[]>(rowsFiltered);
  useEffect(() => setMutableRows(rowsFiltered), [rowsFiltered]);

  function mutateRow(id: string, status: "Approved"|"Rejected") {
    setMutableRows(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }
  const handleAfterBulk = (ids: string[], newStatus?: "Approved"|"Rejected") => {
    if (!ids.length) return;
    setMutableRows(prev => prev
      .filter(r => !(newStatus === undefined && ids.includes(r.id))) // delete case
      .map(r => ids.includes(r.id) && newStatus ? { ...r, status: newStatus } : r)
    );
  };

  // keyboard helpers
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "a") { e.preventDefault(); setSelected(new Set([...selected, ...pageRows.map(r=>r.id)])); }
      if (e.key === "x") { e.preventDefault(); clearSelection(); }
      if (e.key === "Escape") { setOpenDetails(false); setConfirm({open:false}); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, pageRows]);

  return (
    <div>
      {/* BULK BAR */}
      <BulkBarContainer
        allRows={mutableRows}
        selectedIds={selected}
        clearSelection={clearSelection}
        onAfterChange={handleAfterBulk}
      />

      {/* TABLE */}
      <RequestsTableUI
        rows={pageRows}
        pagination={{ ...pagination, total: mutableRows.length }}
        selectedIds={selected}
        onToggleOne={(id) => setSelected(prev => {
          const next = new Set(prev);
          next.has(id) ? next.delete(id) : next.add(id);
          return next;
        })}
        onToggleAllOnPage={(checked, idsOnPage) => {
          setSelected(prev => {
            const next = new Set(prev);
            idsOnPage.forEach(id => checked ? next.add(id) : next.delete(id));
            return next;
          });
        }}
        onRowClick={openRow}
        onPageChange={(page) => setPagination(p => ({ ...p, page }))}
        onPageSizeChange={(pageSize) => setPagination(p => ({ ...p, page: 1, pageSize }))}
        // inline row actions (optional)
        onApproveRow={(id) => setConfirm({ open:true, kind:"approve", id })}
        onRejectRow={(id)  => setConfirm({ open:true, kind:"reject",  id })}
      />

      {/* DETAILS MODAL */}
      <RequestDetailsModalUI
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        row={activeRow}
        onApprove={() => activeRow && setConfirm({open:true, kind:"approve", id: activeRow.id})}
        onReject={() => activeRow && setConfirm({open:true, kind:"reject",  id: activeRow.id})}
      />

      {/* CONFIRM MODAL */}
      <ConfirmUI
        open={confirm.open}
        title={confirm.kind === "approve" ? "Approve request?" : "Reject request?"}
        message={
          confirm.kind === "approve"
            ? "This will mark the request as Approved."
            : "This will mark the request as Rejected."
        }
        confirmText={confirm.kind === "approve" ? "Approve" : "Reject"}
        confirmClass={confirm.kind === "approve" ? "bg-green-600 text-white" : "bg-red-600 text-white"}
        onCancel={() => setConfirm({open:false})}
        onConfirm={doConfirm}
      />
    </div>
  );
}
