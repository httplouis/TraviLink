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
  const set = <K extends keyof FilterState>(k: K, val: FilterState[K]) => onDraftChange({ [k]: val } as Partial<FilterState>);
  const fromVal = draft.from || "";
  const toVal = draft.to || "";

  // popover state
  const [open, setOpen] = React.useState(false);

  // ----- Safe Saved Views -----
  type SavedView = { name: string; state: any };
  const [hydrated, setHydrated] = React.useState(false);
  const [savedViews, setSavedViews] = React.useState<SavedView[]>([]);
  React.useEffect(() => {
    setHydrated(true);
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem("tl.requests.views") : null;
      const parsed = raw ? JSON.parse(raw) : [];
      setSavedViews(Array.isArray(parsed) ? parsed : []);
    } catch {
      setSavedViews([]);
    }
    function onStorage(e: StorageEvent) {
      if (e.key === "tl.requests.views") {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : [];
          setSavedViews(Array.isArray(parsed) ? parsed : []);
        } catch {}
      }
    }
    if (typeof window !== "undefined") {
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    }
  }, []);

  function dispatch(name: "requests.saveView" | "requests.applyView", detail?: any) {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent(name, { detail }));
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white/90 p-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left: Filter dropdown & Sort placeholder lives in table; here we only keep Filter */}
        <div className="relative">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-700 shadow-sm hover:bg-neutral-50"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((s) => !s);
            }}
          >
            {/* tiny funnel icon substitute */}
            <span className="inline-block h-[10px] w-[10px] rounded-[2px] border border-neutral-400" />
            Filter
            <span>▾</span>
          </button>

          {/* Popover */}
          {open && (
            <div
              className="absolute left-0 z-30 mt-2 w-[320px] rounded-xl border border-neutral-200 bg-white p-3 text-sm shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-600">Status</label>
                  <select
                    className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-2"
                    value={draft.status}
                    onChange={(e) => set("status", e.target.value as any)}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-600">Department</label>
                  <select
                    className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-2"
                    value={draft.dept}
                    onChange={(e) => set("dept", e.target.value as any)}
                  >
                    {depts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-neutral-600">From</label>
                    <input
                      type="date"
                      className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-2"
                      value={fromVal}
                      onChange={(e) => set("from", e.target.value || "")}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-neutral-600">To</label>
                    <input
                      type="date"
                      className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-2"
                      value={toVal}
                      onChange={(e) => set("to", e.target.value || "")}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-600">Mode</label>
                  <select
                    className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-2"
                    value={draft.mode}
                    onChange={(e) => set("mode", e.target.value as any)}
                  >
                    <option value="auto">Auto (instant)</option>
                    <option value="apply">Apply (manual)</option>
                  </select>
                </div>

                {/* Saved Views */}
                <div className="pt-2">
                  <div className="mb-1 text-xs font-medium text-neutral-600">Saved Views</div>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:opacity-50"
                      onClick={() => dispatch("requests.saveView")}
                      disabled={!hydrated}
                    >
                      Save View
                    </button>
                    <select
                      className="flex-1 rounded-lg border border-neutral-300 bg-white px-2 py-2 text-sm text-neutral-700 shadow-sm transition disabled:opacity-50"
                      defaultValue=""
                      disabled={!hydrated || savedViews.length === 0}
                      onChange={(e) => dispatch("requests.applyView", e.target.value)}
                    >
                      <option value="" disabled>
                        Saved Views
                      </option>
                      {savedViews.map((v) => (
                        <option key={v.name} value={v.name}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 shadow-sm hover:bg-neutral-50"
                    onClick={() => {
                      onClearAll();
                      setOpen(false);
                    }}
                  >
                    Clear All
                  </button>
                  <button
                    className="rounded-lg bg-[#7a1f2a] px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#6b1b26]"
                    onClick={() => {
                      if (draft.mode === "apply") onApply();
                      setOpen(false);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: results pill */}
        <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-neutral-600">
          Showing {resultCount}
        </span>
      </div>
    </div>
  );
}
