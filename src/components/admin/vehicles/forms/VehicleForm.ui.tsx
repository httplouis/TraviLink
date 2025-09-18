"use client";
import * as React from "react";
import type { Vehicle } from "@/lib/admin/vehicles/types";
import { VehiclesRepo } from "@/lib/admin/vehicles/store";
import { validate } from "@/lib/admin/vehicles/utils";
import { Brand } from "../ui/constants";
import { Input, NumberInput, DateInput, Select } from "../ui/inputs/TinyInputs";


export function VehicleForm({ initial, onCancel, onSubmit }: { initial?: Partial<Vehicle>; onCancel: () => void; onSubmit: (data: Omit<Vehicle, "id"|"createdAt"|"updatedAt">) => void; }) {
const [form, setForm] = React.useState<Omit<Vehicle, "id"|"createdAt"|"updatedAt">>(() => ({
plateNo: initial?.plateNo ?? "",
code: initial?.code ?? "",
brand: initial?.brand ?? "",
model: initial?.model ?? "",
type: (initial?.type as any) ?? VehiclesRepo.constants.types[0],
capacity: initial?.capacity ?? 1,
status: (initial?.status as any) ?? VehiclesRepo.constants.statuses[0],
odometerKm: initial?.odometerKm ?? 0,
lastServiceISO: initial?.lastServiceISO ?? new Date().toISOString().slice(0,10),
notes: initial?.notes ?? "",
}));
const [err, setErr] = React.useState<string | null>(null);


const submit = (e: React.FormEvent) => {
e.preventDefault();
const v = validate(form as any);
if (v) { setErr(v); return; }
onSubmit(form);
};


return (
<form onSubmit={submit} className="grid gap-3">
{err && <div className="rounded-md bg-rose-50 text-rose-700 px-3 py-2 text-sm">{err}</div>}
<div className="grid sm:grid-cols-2 gap-3">
<Input label="Plate No." value={form.plateNo} onChange={v => setForm(f => ({...f, plateNo: v}))} />
<Input label="Vehicle Code" value={form.code} onChange={v => setForm(f => ({...f, code: v}))} />
</div>
<div className="grid sm:grid-cols-2 gap-3">
<Input label="Brand" value={form.brand} onChange={v => setForm(f => ({...f, brand: v}))} />
<Input label="Model" value={form.model} onChange={v => setForm(f => ({...f, model: v}))} />
</div>
<div className="grid sm:grid-cols-3 gap-3">
<Select label="Type" value={form.type as any} options={VehiclesRepo.constants.types as any} onChange={v => setForm(f => ({...f, type: v as any}))} />
<NumberInput label="Capacity" value={form.capacity} min={1} onChange={v => setForm(f => ({...f, capacity: v}))} />
<Select label="Status" value={form.status as any} options={VehiclesRepo.constants.statuses as any} onChange={v => setForm(f => ({...f, status: v as any}))} />
</div>
<div className="grid sm:grid-cols-3 gap-3">
<NumberInput label="Odometer (km)" value={form.odometerKm} min={0} onChange={v => setForm(f => ({...f, odometerKm: v}))} />
<DateInput label="Last Service" value={form.lastServiceISO} onChange={v => setForm(f => ({...f, lastServiceISO: v}))} />
<Input label="Notes (optional)" value={form.notes ?? ""} onChange={v => setForm(f => ({...f, notes: v}))} />
</div>
<div className="flex justify-end gap-2 pt-2">
<button type="button" onClick={onCancel} className="px-3 py-1.5 rounded-md border bg-white">Cancel</button>
<button type="submit" className="px-3 py-1.5 rounded-md text-white" style={{ background: Brand }}>Save</button>
</div>
</form>
);
}