"use client";
import { RequestRow } from "@/lib/admin/types";
import BulkBarUI from "@/components/admin/requests/ui/BulkBar.ui";
import { exportRequestsCsv } from "@/lib/admin/export";
import { approveRequests, rejectRequests, deleteRequests } from "@/lib/admin/requests/action";

type Props = {
  allRows: RequestRow[];               // (usually filteredRows)
  selectedIds: Set<string>;
  clearSelection: () => void;
  onAfterChange: (changedIds: string[], newStatus?: "Approved"|"Rejected") => void;
};

export default function BulkBarContainer({
  allRows,
  selectedIds,
  clearSelection,
  onAfterChange,
}: Props) {
  const ids = [...selectedIds];
  const selectedCount = ids.length;

  async function doApprove() {
    if (ids.length === 0) return;
    await approveRequests(ids);
    onAfterChange(ids, "Approved");
    clearSelection();
  }
  async function doReject() {
    if (ids.length === 0) return;
    await rejectRequests(ids);
    onAfterChange(ids, "Rejected");
    clearSelection();
  }
  async function doDelete() {
    if (ids.length === 0) return;
    await deleteRequests(ids);
    onAfterChange(ids); // consumer should remove rows
    clearSelection();
  }
  function doExport() {
    const rows = allRows.filter(r => selectedIds.has(r.id));
    exportRequestsCsv(rows);
  }

  return (
    <BulkBarUI
      selectedCount={selectedCount}
      onApprove={doApprove}
      onReject={doReject}
      onDelete={doDelete}
      onExport={doExport}
      onClear={clearSelection}
    />
  );
}
