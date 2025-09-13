// src/components/admin/requests/containers/FiltersBar.container.tsx
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FiltersBarUI from "../filters/FiltersBar.ui";
import type { FilterState, RequestRow } from "@/lib/admin/types";

const DEFAULTS: FilterState = {
  status: "All",
  dept: "All",
  search: "",
  from: "",
  to: "",
  mode: "auto",
};

function parseParams(sp: URLSearchParams): FilterState {
  return {
    status: (sp.get("status") as FilterState["status"]) || "All",
    dept: (sp.get("dept") as FilterState["dept"]) || "All",
    from: sp.get("from") || "",
    to: sp.get("to") || "",
    search: sp.get("search") || "",
    mode: (sp.get("mode") as FilterState["mode"]) || "auto",
  };
}
function toParams(f: FilterState) {
  const p = new URLSearchParams();
  if (f.status !== "All") p.set("status", f.status);
  if (f.dept !== "All") p.set("dept", f.dept);
  if (f.from) p.set("from", f.from);
  if (f.to) p.set("to", f.to);
  if (f.search) p.set("search", f.search);
  if (f.mode && f.mode !== "auto") p.set("mode", f.mode);
  return p;
}

export default function FiltersBarContainer({
  rows,
  onFiltered,
}: {
  rows: RequestRow[];
  onFiltered: (filtered: RequestRow[]) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mounted = useRef(false);

  // init from URL (or defaults)
  const [applied, setApplied] = useState<FilterState>(() => parseParams(searchParams as any) || DEFAULTS);
  const [draft, setDraft] = useState<FilterState>(() => parseParams(searchParams as any) || DEFAULTS);

  // compute filtered rows
  const filtered = useMemo(() => filterRows(rows ?? [], applied), [rows, applied]);
  useEffect(() => {
  function saveView() {
    const views: Array<{ name: string; state: FilterState }> =
      JSON.parse(localStorage.getItem("tl.requests.views") || "[]");
    const name = prompt("Save filters as…", "My Dept Pending");
    if (!name) return;
    const next = [...views.filter(v => v.name !== name), { name, state: applied }];
    localStorage.setItem("tl.requests.views", JSON.stringify(next));
  }
  function applyView(e: Event) {
    const name = (e as CustomEvent<string>).detail;
    const views: Array<{ name: string; state: FilterState }> =
      JSON.parse(localStorage.getItem("tl.requests.views") || "[]");
    const found = views.find(v => v.name === name);
    if (found) {
      setDraft(found.state);
      setApplied(found.state);
    }
  }
  window.addEventListener("requests.saveView", saveView as any);
  window.addEventListener("requests.applyView", applyView as any);
  return () => {
    window.removeEventListener("requests.saveView", saveView as any);
    window.removeEventListener("requests.applyView", applyView as any);
  };
}, [applied]);

  // push to parent on change
  useEffect(() => {
    if (!mounted.current) return;
    onFiltered(filtered);
  }, [filtered, onFiltered]);

  // write filters to URL when applied changes
  useEffect(() => {
    if (!mounted.current) return;
    const params = toParams(applied);
    const url = params.toString() ? `${pathname}?${params}` : pathname;
    router.replace(url, { scroll: false });
  }, [applied, pathname, router]);

  // initial mount: notify parent and mark mounted
  useEffect(() => {
    onFiltered(filtered);
    mounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onDraftChange(next: Partial<FilterState>) {
    const nextDraft = { ...draft, ...next };
    setDraft(nextDraft);
    if (nextDraft.mode === "auto") setApplied(nextDraft); // realtime apply
  }

  function onApply() {
    setApplied(draft);
  }
  function onClearAll() {
    setDraft(DEFAULTS);
    setApplied(DEFAULTS);
  }
  function onResetDraft() {
    setDraft(applied);
  }

  return (
    <FiltersBarUI
      draft={draft}
      activeChips={[]} // optional if you have chips
      onDraftChange={onDraftChange}
      onApply={onApply}
      onClearAll={onClearAll}
      onResetDraft={onResetDraft}
      resultCount={filterRows(rows ?? [], draft).length}
      // Saved views (next section) hooks live here too
    />
  );
}

function filterRows(rows: RequestRow[], f: FilterState): RequestRow[] {
  return (rows ?? []).filter((r) => {
    const okStatus = f.status === "All" || r.status === f.status;
    const okDept = f.dept === "All" || r.dept === f.dept;
    const q = (f.search ?? "").trim().toLowerCase();
    const okSearch =
      !q || r.id.toLowerCase().includes(q) || r.purpose.toLowerCase().includes(q) || r.dept.toLowerCase().includes(q);
    const okFrom = !f.from || r.date >= f.from;
    const okTo = !f.to || r.date <= f.to;
    return okStatus && okDept && okSearch && okFrom && okTo;
  });
}
