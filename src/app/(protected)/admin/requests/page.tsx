"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { getRequestsData } from "@/lib/admin/repo";
import RequestsSummaryUI from "@/components/admin/requests/RequestsSummary.ui";
import RequestsTableUI from "@/components/admin/requests/RequestsTable.ui";
import FiltersBar from "@/components/admin/requests/filters/FiltersBar.container";
import RequestDetailsUI from "@/components/admin/requests/RequestDetails.ui";
import type { RequestRow, RequestsSummary, FilterState } from "@/components/admin/requests/types";

export default function RequestsPage() {
  const [raw, setRaw] = useState<RequestRow[]>([]);
  const [summary, setSummary] = useState<RequestsSummary | null>(null);

  const [filtered, setFiltered] = useState<RequestRow[]>([]);
  const [applied, setApplied] = useState<FilterState | null>(null);

  const [selected, setSelected] = useState<RequestRow | null>(null); // for modal

  useEffect(() => {
    getRequestsData().then(({ requests, summary }) => {
      setRaw(requests);
      setFiltered(requests);
      setSummary(summary);
    });
  }, []);

  // Approve/Reject (mock state update)
  const updateStatus = useCallback((id: string, next: RequestRow["status"]) => {
    setRaw((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)));
    setFiltered((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)));
    setSelected((s) => (s && s.id === id ? { ...s, status: next } : s));
    setSummary((s) =>
      s
        ? {
            pending:   count(next, "Pending", raw, id),
            approved:  count(next, "Approved", raw, id),
            completed: count(next, "Completed", raw, id),
            rejected:  count(next, "Rejected", raw, id),
          }
        : s
    );
  }, [raw]);

  function onApprove(id: string) { updateStatus(id, "Approved"); }
  function onReject(id: string) { updateStatus(id, "Rejected"); }

  const handleFiltered = useCallback(
    (rows: RequestRow[], appliedFilters: FilterState) => {
      setFiltered(rows);
      setApplied(appliedFilters);
    },
    []
  );

  if (!summary) return <div>Loading…</div>;

  return (
    <section className="space-y-6">
      <RequestsSummaryUI summary={summary} />

      <FiltersBar rows={raw} onFiltered={(rows, applied) => handleFiltered(rows, applied)} />

      <div className="flex gap-2">
        <button className="rounded bg-neutral-200 px-3 py-2 text-sm">Export CSV</button>
        <button className="rounded bg-neutral-900 px-3 py-2 text-sm text-white">Print</button>
      </div>

      <RequestsTableUI rows={filtered} onRowClick={(row) => setSelected(row)} />

      {/* details modal */}
      <RequestDetailsUI
        open={!!selected}
        onClose={() => setSelected(null)}
        request={selected}
        onApprove={onApprove}
        onReject={onReject}
      />

      {applied && (
        <p className="text-xs text-neutral-500">
          Showing {filtered.length} result(s){applied.mode === "apply" ? " · Apply mode" : " · Live mode"}
        </p>
      )}
    </section>
  );
}

/* --- helpers for summary mock update --- */
function count(next: RequestRow["status"], key: RequestRow["status"], list: RequestRow[], id: string) {
  // recompute counts by pretending 'id' now has 'next' status
  return list.reduce((acc, r) => {
    const status = r.id === id ? next : r.status;
    return acc + (status === key ? 1 : 0);
  }, 0);
}
