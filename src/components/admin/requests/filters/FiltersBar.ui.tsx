"use client";

import * as React from "react";
import type { FilterState } from "@/lib/admin/types";

type Props = {
  // full "controlled draft" API
  draft: FilterState;
  activeChips: any[];
  onDraftChange: (next: Partial<FilterState>) => void;
  onClearAll: () => void;
  onApply: () => void;
  onResetDraft: () => void;
  resultCount: number;
};

const statuses: Array<FilterState["status"]> = ["All", "Pending", "Approved", "Completed", "Rejected"];
const depts: Array<FilterState["dept"]> = ["All", "CCMS", "HR", "Registrar", "Finance"];

export default function FiltersBarUI({
  draft,
  activeChips,
  onDraftChange,
  onClearAll,
  onApply,
  onResetDraft,
  resultCount,
}: Props) {
  const set = <K extends keyof FilterState>(k: K, val: FilterState[K]) =>
    onDraftChange({ [k]: val } as Partial<FilterState>);

  // IMPORTANT: always pass "" to <input type="date"> when "cleared"
  const fromVal = draft.from || "";
  const toVal = draft.to || "";

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border bg-white p-3">
      <div className="flex flex-col">
        <label className="text-xs text-neutral-500">Status</label>
        <select className="rounded border px-2 py-1" value={draft.status} onChange={(e) => set("status", e.target.value as any)}>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-neutral-500">Department</label>
        <select className="rounded border px-2 py-1" value={draft.dept} onChange={(e) => set("dept", e.target.value as any)}>
          {depts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-neutral-500">From</label>
        <input
          className="rounded border px-2 py-1"
          type="date"
          value={fromVal}
          onChange={(e) => set("from", e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-neutral-500">To</label>
        <input
          className="rounded border px-2 py-1"
          type="date"
          value={toVal}
          onChange={(e) => set("to", e.target.value)}
        />
      </div>

      <div className="flex grow flex-col">
        <label className="text-xs text-neutral-500">Search</label>
        <input
          className="w-full rounded border px-2 py-1"
          placeholder="Search by id, purpose, dept..."
          value={draft.search}
          onChange={(e) => set("search", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-neutral-500">Mode</label>
        <select className="rounded border px-2 py-1" value={draft.mode} onChange={(e) => set("mode", e.target.value as any)}>
          <option value="auto">Auto</option>
          <option value="apply">Apply</option>
        </select>

        <button
          className="rounded border px-3 py-1 text-sm"
          onClick={onApply}
          disabled={draft.mode !== "apply"}
        >
          Apply
        </button>

        {/* NEW: Clear hard-resets everything (including dates) */}
        <button className="rounded border px-3 py-1 text-sm" onClick={onClearAll}>
          Clear
        </button>
      </div>
          // Inside FiltersBarUI toolbar, near Apply/Clear
<div className="flex items-end gap-2 ml-auto">
  <button
    className="rounded border px-3 py-1 text-sm"
    onClick={() => window.dispatchEvent(new CustomEvent("requests.saveView"))}
  >
    Save View
  </button>
  <select
    className="rounded border px-2 py-1 text-sm"
    onChange={(e) =>
      window.dispatchEvent(new CustomEvent("requests.applyView", { detail: e.target.value }))
    }
    defaultValue=""
  >
    <option value="" disabled>
      Saved Views
    </option>
    {(JSON.parse(localStorage.getItem("tl.requests.views") || "[]") as Array<{name:string, state:any}>).map((v) => (
      <option key={v.name} value={v.name}>{v.name}</option>
    ))}
  </select>
</div>

      <div className="ml-auto text-xs text-neutral-500">
        Showing {resultCount}
      </div>
    </div>
  );
}
