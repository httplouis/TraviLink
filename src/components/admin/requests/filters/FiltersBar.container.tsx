"use client";
import { useMemo, useState } from "react";
import FiltersBarUI from "./FiltersBar.ui";
import { FilterState, RequestRow } from "../types";

const DEFAULTS: FilterState = {
  status: "All",
  dept: "All",
  search: "",
  from: undefined,
  to: undefined,
  mode: "auto", // live by default
};

export default function FiltersBarContainer({
  rows,
  onFiltered,
}: {
  rows: RequestRow[];
  onFiltered: (filtered: RequestRow[], applied: FilterState, draft: FilterState) => void;
}) {
  const [applied, setApplied] = useState<FilterState>(DEFAULTS);
  const [draft, setDraft] = useState<FilterState>(DEFAULTS);

  // compute filtered using APPLIED state
  const filtered = useMemo(() => filterRows(rows, applied), [rows, applied]);

  // notify parent when filtered set changes
  useMemo(() => {
    onFiltered(filtered, applied, draft);
  }, [filtered, applied, draft, onFiltered]);

  // live update in auto mode
  function onDraftChange(next: Partial<FilterState>) {
    const nextDraft = { ...draft, ...next };
    setDraft(nextDraft);
    if (nextDraft.mode === "auto") {
      setApplied(nextDraft);
    }
  }

  function onApply() {
    setApplied(draft);
  }

  function onResetDraft() {
    setDraft(applied); // go back to last applied
  }

  function onClearAll() {
    setDraft(DEFAULTS);
    setApplied(DEFAULTS);
  }

  const activeChips = chipsFrom(applied, () => setApplied(DEFAULTS), (pat) => {
    // clear individual chip by pattern key
    const cleared: FilterState = { ...applied, ...pat };
    setApplied(cleared);
    if (draft.mode === "apply") setDraft(cleared);
  });

  return (
    <FiltersBarUI
      draft={draft}
      activeChips={activeChips}
      onDraftChange={onDraftChange}
      onClearAll={onClearAll}
      onApply={onApply}
      onResetDraft={onResetDraft}
      resultCount={filterRows(rows, draft).length}
    />
  );
}

/* ---------- helpers ---------- */

function filterRows(rows: RequestRow[], f: FilterState): RequestRow[] {
  return rows.filter((r) => {
    const statusOk = f.status === "All" || r.status === f.status;
    const deptOk = f.dept === "All" || r.dept === f.dept;
    const search = f.search.trim().toLowerCase();
    const searchOk =
      !search ||
      r.id.toLowerCase().includes(search) ||
      r.purpose.toLowerCase().includes(search);
    const fromOk = !f.from || r.date >= f.from;
    const toOk = !f.to || r.date <= f.to;
    // AND condition across fields
    return statusOk && deptOk && searchOk && fromOk && toOk;
  });
}

function chipsFrom(
  f: FilterState,
  clearAll: () => void,
  clearOne: (patch: Partial<FilterState>) => void
) {
  const chips: { label: string; onClear: () => void }[] = [];
  if (f.status !== "All") chips.push({ label: `Status: ${f.status}`, onClear: () => clearOne({ status: "All" }) });
  if (f.dept !== "All")   chips.push({ label: `Dept: ${f.dept}`,     onClear: () => clearOne({ dept: "All" }) });
  if (f.from)             chips.push({ label: `From: ${f.from}`,     onClear: () => clearOne({ from: undefined }) });
  if (f.to)               chips.push({ label: `To: ${f.to}`,         onClear: () => clearOne({ to: undefined }) });
  if (f.search)           chips.push({ label: `Search: ${f.search}`, onClear: () => clearOne({ search: "" }) });
  // allow Clear all if any
  if (chips.length > 1) chips.push({ label: "•", onClear: clearAll }); // visual spacer for consistency
  return chips;
}
