"use client";

import * as React from "react";
import { ArrowDownAZ, ArrowUpAZ, Plus } from "lucide-react";
import FilterDropdownUI from "../filters/FilterDropdown.ui";

type Props = {
  tableSearch: string;
  onTableSearch?: (q: string) => void;

  sortDir: "asc" | "desc";
  onSortDirChange?: (d: "asc" | "desc") => void;

  onAddNew: () => void;

  filterControls: {
    draft: import("@/lib/admin/types").FilterState;
    onDraftChange: (n: Partial<import("@/lib/admin/types").FilterState>) => void;
    onApply: () => void;
    onClearAll: () => void;
  };
};

export default function RequestsToolbar({
  tableSearch,
  onTableSearch,
  sortDir,
  onSortDirChange,
  onAddNew,
  filterControls,
}: Props) {
  const { draft, onDraftChange, onApply, onClearAll } = filterControls;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-3 py-2">
      {/* left: search + filter */}
      <div className="flex items-center gap-2">
        <input
          value={tableSearch}
          onChange={(e) => onTableSearch?.(e.target.value)}
          placeholder="Search requests…"
          className="h-9 w-[220px] rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#7a1f2a]/40"
        />

        <FilterDropdownUI
          draft={draft}
          onDraftChange={onDraftChange}
          onApply={onApply}
          onClearAll={onClearAll}
        />
      </div>

      {/* right: sort + add */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() =>
            onSortDirChange?.(sortDir === "desc" ? "asc" : "desc")
          }
          className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-700 shadow-sm hover:bg-neutral-50"
          aria-label="Toggle sort direction"
        >
          {sortDir === "desc" ? <ArrowDownAZ size={16} /> : <ArrowUpAZ size={16} />}
          {sortDir === "desc" ? "Newest first" : "Oldest first"}
        </button>

        <button
          type="button"
          onClick={onAddNew}
          className="inline-flex items-center gap-2 rounded-md bg-[#7a1f2a] px-3 py-2 text-sm font-medium text-white hover:opacity-95"
        >
          <Plus size={16} />
          Add New
        </button>
      </div>
    </div>
  );
}
