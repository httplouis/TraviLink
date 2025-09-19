"use client";
import * as React from "react";
import type { Vehicle } from "@/lib/admin/vehicles/types";
import { VehiclesRepo } from "@/lib/admin/vehicles/store";
import { validate } from "@/lib/admin/vehicles/utils";
import { Brand } from "../ui/constants";
import { FileUpload } from "@/components/common/file_upload/FileUpload.ui";
import { Input, NumberInput, DateInput, Select } from "../ui/inputs/TinyInputs";

type FormShape = Omit<Vehicle, "id" | "createdAt" | "updatedAt"> & { photoUrl?: string };

export function VehicleFormModal({
  open,
  initial,
  onCancel,
  onSubmit,
}: {
  open: boolean;
  initial?: Partial<Vehicle>;
  onCancel: () => void;
  onSubmit: (data: FormShape) => void;
}) {
  const [form, setForm] = React.useState<FormShape>(() => ({
    plateNo: initial?.plateNo ?? "",
    code: initial?.code ?? "",
    brand: initial?.brand ?? "",
    model: initial?.model ?? "",
    type: (initial?.type as any) ?? VehiclesRepo.constants.types[0],
    capacity: initial?.capacity ?? 1,
    status: (initial?.status as any) ?? VehiclesRepo.constants.statuses[0],
    odometerKm: initial?.odometerKm ?? 0,
    lastServiceISO: initial?.lastServiceISO ?? new Date().toISOString().slice(0, 10),
    notes: initial?.notes ?? "",
    photoUrl: (initial as any)?.photoUrl ?? "",
  }));
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setForm({
      plateNo: initial?.plateNo ?? "",
      code: initial?.code ?? "",
      brand: initial?.brand ?? "",
      model: initial?.model ?? "",
      type: (initial?.type as any) ?? VehiclesRepo.constants.types[0],
      capacity: initial?.capacity ?? 1,
      status: (initial?.status as any) ?? VehiclesRepo.constants.statuses[0],
      odometerKm: initial?.odometerKm ?? 0,
      lastServiceISO: initial?.lastServiceISO ?? new Date().toISOString().slice(0, 10),
      notes: initial?.notes ?? "",
      photoUrl: (initial as any)?.photoUrl ?? "",
    });
    setErr(null);
  }, [open, initial]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(form as any);
    if (v) { setErr(v); return; }
    onSubmit(form);
  };

  if (!open) return null;

   return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* IMPORTANT: flex-col + overflow handling */}
      <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col">
        {/* Sticky header */}
        <div className="flex items-center justify-between border-b px-4 py-3 bg-white sticky top-0 z-10">
          <h2 className="text-lg font-semibold">{initial ? "Edit Vehicle" : "Add Vehicle"}</h2>
          <button onClick={onCancel} className="rounded-md border px-3 py-1.5">Close</button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4">
          <form onSubmit={submit} className="grid gap-3">
            {err && (
              <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {err}
              </div>
            )}

            {/* Photo (common component) */}
            <FileUpload
              label="Photo"
              preview={form.photoUrl}
              onChange={(_file, url) => setForm(f => ({ ...f, photoUrl: url }))}
              accept="image/*"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Plate No." value={form.plateNo} onChange={v => setForm(f => ({ ...f, plateNo: v }))} />
              <Input label="Vehicle Code" value={form.code} onChange={v => setForm(f => ({ ...f, code: v }))} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Brand" value={form.brand} onChange={v => setForm(f => ({ ...f, brand: v }))} />
              <Input label="Model" value={form.model} onChange={v => setForm(f => ({ ...f, model: v }))} />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Select
                label="Type"
                value={form.type as any}
                options={VehiclesRepo.constants.types as any}
                onChange={v => setForm(f => ({ ...f, type: v as any }))}
              />
              <NumberInput
                label="Capacity"
                value={form.capacity}
                min={1}
                onChange={v => setForm(f => ({ ...f, capacity: v }))}
              />
              <Select
                label="Status"
                value={form.status as any}
                options={VehiclesRepo.constants.statuses as any}
                onChange={v => setForm(f => ({ ...f, status: v as any }))}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <NumberInput
                label="Odometer (km)"
                value={form.odometerKm}
                min={0}
                onChange={v => setForm(f => ({ ...f, odometerKm: v }))}
              />
              <DateInput
                label="Last Service"
                value={form.lastServiceISO}
                onChange={v => setForm(f => ({ ...f, lastServiceISO: v }))}
              />
              <Input
                label="Notes (optional)"
                value={form.notes ?? ""}
                onChange={v => setForm(f => ({ ...f, notes: v }))}
              />
            </div>
          </form>
        </div>

        {/* Sticky footer */}
        <div className="border-t bg-white px-4 py-3 sticky bottom-0 z-10">
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onCancel} className="rounded-md border bg-white px-3 py-1.5">
              Cancel
            </button>
            <button
              onClick={(e) => { e.preventDefault(); submit(e as any); }}
              className="rounded-md px-3 py-1.5 text-white"
              style={{ background: Brand }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}