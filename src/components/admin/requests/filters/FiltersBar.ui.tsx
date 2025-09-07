"use client";
import { FilterState } from "../types";

type Chip = { label: string; onClear: () => void };

type Props = {
  draft: FilterState;             // the form's current values
  activeChips: Chip[];            // chips to render under the bar
  onDraftChange: (next: Partial<FilterState>) => void;
  onClearAll: () => void;
  onApply: () => void;
  onResetDraft: () => void;
  resultCount?: number;           // optional: show count on Apply
};

export default function FiltersBarUI({
  draft, activeChips, onDraftChange, onClearAll, onApply, onResetDraft, resultCount,
}: Props) {
  const active = activeChips.length > 0;

  return (
    <div className="space-y-3">
      {/* primary controls row */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* search */}
        <input
          type="text"
          placeholder="Search by ID or Purpose…"
          className="border rounded px-3 py-2 text-sm flex-1 min-w-[220px]"
          value={draft.search}
          onChange={(e) => onDraftChange({ search: e.target.value })}
        />

        {/* status */}
        <select
          value={draft.status}
          onChange={(e) => onDraftChange({ status: e.target.value as FilterState["status"] })}
          className="border rounded px-2 py-2 text-sm"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Completed</option>
          <option>Rejected</option>
        </select>

        {/* dept */}
        <select
          value={draft.dept}
          onChange={(e) => onDraftChange({ dept: e.target.value as FilterState["dept"] })}
          className="border rounded px-2 py-2 text-sm"
        >
          <option>All</option>
          <option>CCMS</option>
          <option>HR</option>
          <option>Registrar</option>
          <option>Finance</option>
        </select>

        {/* date range */}
        <input
          type="date"
          value={draft.from ?? ""}
          onChange={(e) => onDraftChange({ from: e.target.value })}
          className="border rounded px-2 py-2 text-sm"
        />
        <input
          type="date"
          value={draft.to ?? ""}
          onChange={(e) => onDraftChange({ to: e.target.value })}
          className="border rounded px-2 py-2 text-sm"
        />

        {/* mode: auto vs apply */}
        <select
          value={draft.mode}
          onChange={(e) => onDraftChange({ mode: e.target.value as FilterState["mode"] })}
          className="border rounded px-2 py-2 text-xs text-neutral-600"
          title="Apply mode"
        >
          <option value="auto">Auto</option>
          <option value="apply">Apply</option>
        </select>

        {/* apply/reset visible when mode=apply */}
        {draft.mode === "apply" && (
          <div className="flex gap-2">
            <button
              onClick={onApply}
              className="px-3 py-2 rounded bg-neutral-900 text-white text-sm"
            >
              Apply{typeof resultCount === "number" ? ` (${resultCount})` : ""}
            </button>
            <button
              onClick={onResetDraft}
              className="px-3 py-2 rounded bg-neutral-200 text-sm"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* active chips + clear all */}
      {active && (
        <div className="flex flex-wrap items-center gap-2">
          {activeChips.map((c, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-sm"
            >
              {c.label}
              <button
                className="text-neutral-500 hover:text-neutral-800"
                onClick={c.onClear}
                aria-label={`Remove ${c.label}`}
              >
                ×
              </button>
            </span>
          ))}
          <button onClick={onClearAll} className="text-xs text-red-600 underline">
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
