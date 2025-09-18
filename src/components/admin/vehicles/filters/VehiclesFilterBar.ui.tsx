// File: src/components/admin/vehicles/filters/VehiclesFilterBar.ui.tsx
"use client";
import * as React from "react";
import { Search } from "lucide-react";
import type { VehicleFilters } from "@/lib/admin/vehicles/types";
import { VehiclesRepo } from "@/lib/admin/vehicles/store";


export function VehiclesFilterBar({ value, onChange, onClear }: { value: VehicleFilters; onChange: (v: VehicleFilters) => void; onClear: () => void; }) {
return (
<div className="flex flex-wrap items-center gap-2 rounded-lg border p-2 bg-white">
<div className="flex items-center gap-2 px-2 py-1.5 rounded-md border">
<Search size={16} className="opacity-60" />
<input placeholder="Search plate, code, brand, model…" className="outline-none text-sm" value={value.search ?? ""} onChange={e => onChange({ ...value, search: e.target.value })} />
</div>
<select className="rounded-md border px-2 py-1.5 text-sm bg-white" value={value.type ?? ""} onChange={e => onChange({ ...value, type: e.target.value as any })}>
<option value="">All Types</option>
{VehiclesRepo.constants.types.map(t => <option key={t} value={t}>{t}</option>)}
</select>
<select className="rounded-md border px-2 py-1.5 text-sm bg-white" value={value.status ?? ""} onChange={e => onChange({ ...value, status: e.target.value as any })}>
<option value="">All Status</option>
{VehiclesRepo.constants.statuses.map(s => <option key={s} value={s}>{s}</option>)}
</select>
<button onClick={onClear} className="ml-auto text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50" title="Clear filters">Clear</button>
</div>
);
}