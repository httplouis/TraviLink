"use client";
import * as React from "react";
import { Download, Trash2 } from "lucide-react";
import type { Vehicle } from "@/lib/admin/vehicles/types";


export function VehiclesBulkBar({ selection, rows, onDeleteSelected, onExportCSV }: { selection: string[]; rows: Vehicle[]; onDeleteSelected: () => void; onExportCSV: () => void; }) {
const any = selection.length > 0;
return (
<div className="flex items-center gap-2">
<button disabled={!any} onClick={onDeleteSelected} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border bg-white disabled:opacity-50" title="Delete selected">
<Trash2 size={16} /> Delete
</button>
<button onClick={onExportCSV} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border bg-white">
<Download size={16} /> Export CSV
</button>
<span className="ml-auto text-sm text-gray-600">Showing <b>{rows.length}</b> item(s){any ? ` • Selected ${selection.length}` : ""}</span>
</div>
);
}