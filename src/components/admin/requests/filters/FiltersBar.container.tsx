"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import FiltersBarUI from "./FiltersBar.ui";
import { FilterState, RequestRow } from "../types";

const DEFAULTS: FilterState = {
  status: "All",
  dept: "All",
  search: "",
  from: undefined,
  to: undefined,
  mode: "auto",
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

  // compute filtered with APPLIED state (pure)
  const filtered = useMemo(() => filterRows(rows, applied), [rows, applied]);

  // keep latest onFiltered in a ref so effect doesn’t re-run just because its identity changes
  const onFilteredRef = useRef(onFiltered);
  useEffect(() => {
    onFilteredRef.current = onFiltered;
  }, [onFiltered]);

  // call parent AFTER render, and only when data actually changed
  const prevPayload = useRef<string>("");
  useEffect(() => {
    const payloadKey = JSON.stringify({
      ids: filtered.map((r) => r.id), // stable, cheap enough
      applied,
      draft,
    });
    if (payloadKey !== prevPayload.current) {
      prevPayload.current = payloadKey;
      onFilteredRef.current(filtered, applied, draft);
    }
  }, [filtered, applied, draft]);

  function onDraftChange(next: Partial<FilterState>) {
    const nextDraft = { ...draft, ...next };
    setDraft(nextDraft);
    if (nextDraft.mode === "auto") setApplied(nextDraft);
  }
  function onApply() { setApplied(draft); }
  function onResetDraft() { setDraft(applied); }
  function onClearAll() { setDraft(DEFAULTS); setApplied(DEFAULTS); }

  const activeChips = chipsFrom(applied, () => setApplied(DEFAULTS), (patch) => {
    const cleared: FilterState = { ...applied, ...patch };
    setApplied(cleared);
    setDraft((d) => (d.mode === "apply" ? cleared : d));
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

/* helpers */
function filterRows(rows: RequestRow[], f: FilterState): RequestRow[] {
  return rows.filter((r) => {
    const statusOk = f.status === "All" || r.status === f.status;
    const deptOk = f.dept === "All" || r.dept === f.dept;
    const search = f.search.trim().toLowerCase();
    const searchOk =
      !search || r.id.toLowerCase().includes(search) || r.purpose.toLowerCase().includes(search);
    const fromOk = !f.from || r.date >= f.from!;
    const toOk = !f.to || r.date <= f.to!;
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
  if (f.dept !== "All") chips.push({ label: `Dept: ${f.dept}`, onClear: () => clearOne({ dept: "All" }) });
  if (f.from) chips.push({ label: `From: ${f.from}`, onClear: () => clearOne({ from: undefined }) });
  if (f.to) chips.push({ label: `To: ${f.to}`, onClear: () => clearOne({ to: undefined }) });
  if (f.search) chips.push({ label: `Search: ${f.search}`, onClear: () => clearOne({ search: "" }) });
  return chips;
}
