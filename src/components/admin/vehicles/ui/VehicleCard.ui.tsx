"use client";
import * as React from "react";
import type { Vehicle } from "@/lib/admin/vehicles/types";
import { Edit, Trash2, ChevronRight } from "lucide-react";

export function VehicleCard({
  v,
  onEdit,
  onDelete,
  onOpenDetails,
}: {
  v: Vehicle & {
    photoUrl?: string;
    lastCheckIn?: string;
    maxLoadKg?: number;
    assignedDriver?: string;
    nextServiceISO?: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenDetails: (id: string) => void;
}) {
  const badge =
    v.status === "active"
      ? "bg-green-100 text-green-700"
      : v.status === "maintenance"
      ? "bg-amber-100 text-amber-700"
      : "bg-gray-200 text-gray-700";

  return (
    <div className="rounded-xl border bg-white p-3 shadow-sm">
      <div className="aspect-[16/7] overflow-hidden rounded-lg bg-gray-50">
        {v.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={v.photoUrl} alt={v.model} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">Vehicle photo</div>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <div className="text-sm text-gray-500">{v.brand} {v.model}</div>
          <div className="text-base font-semibold">{v.plateNo}</div>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs ${badge}`}>{v.status}</span>
      </div>

      <div className="mt-2 grid gap-1 text-sm text-gray-600">
        <div className="flex justify-between"><span>Last check-in/out</span><span>{v.lastCheckIn ?? "—"}</span></div>
        <div className="flex justify-between"><span>Max. load capacity</span><span>{v.maxLoadKg ? `${v.maxLoadKg.toLocaleString()} kg` : "—"}</span></div>
        <div className="flex justify-between"><span>Assigned driver</span><span>{v.assignedDriver ?? "—"}</span></div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => onOpenDetails(v.id)}
          className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          View details <ChevronRight size={16} />
        </button>
        <div className="flex items-center gap-1.5">
          <button onClick={() => onEdit(v.id)} className="rounded-md border p-1.5 hover:bg-gray-50" title="Edit"><Edit size={16} /></button>
          <button onClick={() => onDelete(v.id)} className="rounded-md border p-1.5 hover:bg-gray-50" title="Delete"><Trash2 size={16} /></button>
        </div>
      </div>
    </div>
  );
}
