// src/app/(protected)/admin/schedule/SchedulePageClient.tsx
"use client";

import * as React from "react";
import { ScheduleRepo } from "@/lib/admin/schedule/store";
import type { Schedule } from "@/lib/admin/schedule/types";

import ScheduleTable from "@/components/admin/schedule/ui/ScheduleTable.ui";
import ScheduleToolbar from "@/components/admin/schedule/toolbar/ScheduleToolbar.ui";
import ScheduleDetailsModal from "@/components/admin/schedule/ui/ScheduleDetailsModal.ui";

import { useScheduleFilters } from "@/components/admin/schedule/hooks/useScheduleFilters";
import { DEFAULT_SCH_FILTERS, filterSchedules } from "@/lib/admin/schedule/filters";

import { useScheduleKpis } from "@/components/admin/schedule/kpi/useScheduleKpis";
import KpiGrid from "@/components/admin/schedule/ui/KpiGrid.ui";

// ✅ Use ONLY the container (it manages form state + validation)
import CreateScheduleDialog from "@/components/admin/schedule/forms/CreateScheduleDialogs.container";

export default function SchedulePageClient() {
  // Avoid SSR/CSR mismatch for anything touching localStorage
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  // State
  const [rows, setRows] = React.useState<Schedule[]>([]);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(15);
  const [q, setQ] = React.useState("");
  const [sort, setSort] = React.useState<"newest" | "oldest">("newest");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [open, setOpen] = React.useState(false);
  const [editRow, setEditRow] = React.useState<Schedule | null>(null);
  const [viewRow, setViewRow] = React.useState<Schedule | null>(null);

  const filters = useScheduleFilters(DEFAULT_SCH_FILTERS);
  const { kpis, refresh: refreshKpis } = useScheduleKpis();

  // Load repo after mount
  React.useEffect(() => {
    if (!hydrated) return;
    setRows(ScheduleRepo.list());
    refreshKpis();
  }, [hydrated, refreshKpis]);

  function refresh() {
    setRows(ScheduleRepo.list());
    refreshKpis();
  }

  const filtered = React.useMemo(() => {
    if (!hydrated) return [] as Schedule[];
    const base = filterSchedules(rows, { ...filters.applied, search: q });
    return [...base].sort((a, b) => {
      const tA = `${a.date}T${a.startTime}`;
      const tB = `${b.date}T${b.startTime}`;
      return sort === "newest" ? (tA < tB ? 1 : -1) : (tA > tB ? 1 : -1);
    });
  }, [hydrated, rows, filters.applied, q, sort]);

  const total = filtered.length;
  const pageRows = filtered.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

  const onToggleOne = (id: string, checked: boolean) =>
    setSelected((p) => {
      const n = new Set(p);
      checked ? n.add(id) : n.delete(id);
      return n;
    });

  const onToggleAll = (checked: boolean) =>
    setSelected((p) => {
      const n = new Set(p);
      pageRows.forEach((r) => (checked ? n.add(r.id) : n.delete(r.id)));
      return n;
    });

  // Skeleton while hydrating
  if (!hydrated) {
    return (
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-white p-4">
              <div className="h-4 w-28 animate-pulse rounded bg-neutral-200" />
              <div className="mt-2 h-8 w-12 animate-pulse rounded bg-neutral-200" />
            </div>
          ))}
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <div className="mb-3 h-6 w-40 animate-pulse rounded bg-neutral-200" />
          <div className="h-48 animate-pulse rounded bg-neutral-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <KpiGrid kpis={kpis} />

      <ScheduleTable
        rows={pageRows}
        pagination={{ page, pageSize, total }}
        selected={selected}
        onToggleOne={onToggleOne}
        onToggleAll={onToggleAll}
        onEdit={(r) => {
          setEditRow(r);
          setOpen(true);
        }}
        onDeleteMany={(ids) => {
          ScheduleRepo.removeMany(ids);
          setSelected(new Set());
          refresh();
        }}
        onSetStatus={(id, s) => {
          try {
            ScheduleRepo.setStatus(id, s);
            refresh();
          } catch (e: any) {
            alert(e?.message || "Cannot change status");
          }
        }}
        onPageChange={setPage}
        onView={(r) => setViewRow(r)}
        toolbar={
          <ScheduleToolbar
            q={q}
            onQChange={(v) => {
              setQ(v);
              setPage(1);
            }}
            sort={sort}
            onSortChange={(s) => {
              setSort(s);
              setPage(1);
            }}
            onAddNew={() => {
              setEditRow(null);
              setOpen(true);
            }}
            draft={filters.draft}
            onDraftChange={(n) => {
              filters.update(n);
              setPage(1);
            }}
            onApply={() => {
              filters.apply();
              setPage(1);
            }}
            onClearAll={() => {
              filters.clearAll();
              setPage(1);
            }}
          />
        }
      />

      {/* ✅ Only the container dialog here */}
      <CreateScheduleDialog
        open={open}
        initial={editRow ?? undefined}
        onClose={() => setOpen(false)}
        onSubmit={(data) => {
          try {
            if (editRow) {
              ScheduleRepo.update(editRow.id, data);
            } else {
              ScheduleRepo.create(data);
            }
            setOpen(false);
            refresh();
          } catch (err: any) {
            alert(err?.message || "Cannot save schedule.");
          }
        }}
      />

      <ScheduleDetailsModal
        open={!!viewRow}
        data={viewRow || undefined}
        onClose={() => setViewRow(null)}
      />
    </div>
  );
}
