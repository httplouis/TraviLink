"use client";
import * as React from "react";
import { VehiclesFilterBar } from "../filters/VehiclesFilterBar.ui";
import { VehiclesBulkBar } from "../toolbar/VehiclesBulkBar.ui";
import { VehiclesTable } from "../ui/VehiclesTable.ui";
import { VehiclesGrid } from "../ui/VehiclesGrid.ui";
import { VehicleFormModal } from "../forms/VehicleFormModal.ui";
import { VehiclesHeader } from "../filters/VehiclesHeader.ui";
import { VehicleDetailsModal } from "../ui/VehicleDetailsModal.ui";
import { useVehiclesScreen } from "../hooks/useVehiclesScreen";
import { VehiclesRepo } from "@/lib/admin/vehicles/store";
import { toCSV } from "@/lib/admin/vehicles/utils";

export default function VehiclesPageClient() {
  const {
    filters, setFilters,
    rows, selection, setSelection,
    form, setForm,
    view, setView,
    tab, setTab,
    refresh,
  } = useVehiclesScreen();

  const [openDetails, setOpenDetails] = React.useState<string | null>(null);

  const onClear = () => setFilters({});
  const onEdit = (id: string) => setForm({ mode: "edit", id });
  const onDelete = (id: string) => { VehiclesRepo.remove(id); refresh(); };
  const onDeleteSelected = () => { selection.forEach(VehiclesRepo.remove); setSelection([]); refresh(); };
  const onExportCSV = () => {
    const blob = new Blob([toCSV(rows)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob); 
    const a = document.createElement("a");
    a.href = url; 
    a.download = "vehicles.csv"; 
    a.click(); 
    URL.revokeObjectURL(url);
  };

  // counts for tabs
  const counts = React.useMemo(() => {
    return {
      all: VehiclesRepo.list({}).length,
      assigned: VehiclesRepo.list({}).filter(v => (v as any).assignedDriver).length,
      out_of_order: VehiclesRepo.list({}).filter(v => v.status === "inactive").length,
      available: VehiclesRepo.list({}).filter(v => v.status === "active" && !(v as any).assignedDriver).length,
      service_needed: VehiclesRepo.list({}).filter(v => {
        const due = (v as any).nextServiceISO as string | undefined;
        return due && new Date(due) <= new Date();
      }).length,
    };
  }, [rows]);

  const current = openDetails ? VehiclesRepo.get(openDetails) as any : null;

  // --- Reset sample handler (DEV only) ---
  const handleResetSample = () => {
    VehiclesRepo.resetToSample();
    setSelection([]);
    setFilters({});
    refresh();
  };

  return (
    <div className="space-y-4 p-4">
      <VehiclesHeader
        counts={counts as any}
        tab={tab}
        onTab={(t) => { setTab(t); }}
        view={view}
        onView={setView}
        onCreate={() => setForm({ mode: "create" })}
        onReset={handleResetSample}   // dev-only button
      />

      <VehiclesFilterBar value={filters} onChange={setFilters} onClear={onClear} />

      <div className="flex flex-col gap-3">
        {view === "table" ? (
          <>
            <VehiclesBulkBar
              selection={selection}
              rows={rows}
              onDeleteSelected={onDeleteSelected}
              onExportCSV={onExportCSV}
            />
            <VehiclesTable
              rows={rows}
              selection={selection}
              setSelection={setSelection}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </>
        ) : (
          <VehiclesGrid
            rows={rows as any}
            onEdit={onEdit}
            onDelete={onDelete}
            onOpenDetails={(id) => setOpenDetails(id)}
          />
        )}
      </div>

      {/* Create/Edit modal */}
      {form && (
        <VehicleFormModal
          open={!!form}
          initial={form.mode === "edit" ? (VehiclesRepo.get(form.id) ?? undefined) : undefined}
          onCancel={() => setForm(null)}
          onSubmit={(data) => {
            if (form.mode === "create") VehiclesRepo.create(data);
            else VehiclesRepo.update(form.id, data);
            setForm(null); 
            refresh();
          }}
        />
      )}

      {/* Details modal */}
      <VehicleDetailsModal
        open={!!openDetails}
        onClose={() => setOpenDetails(null)}
        v={current as any}
      />
    </div>
  );
}
