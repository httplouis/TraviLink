"use client";
import * as React from "react";
import type { Vehicle } from "@/lib/admin/vehicles/types";

export function VehicleDetailsModal({
  open,
  onClose,
  v,
}: {
  open: boolean;
  onClose: () => void;
  v: (Vehicle & {
    photoUrl?: string;
    assignedDriver?: string;
    driverDocs?: { label: string; url?: string }[];
    routePreviewUrl?: string;
    nextServiceISO?: string;
    maxLoadKg?: number;
    lastCheckIn?: string;
    notes?: string;
  }) | null;
}) {
  if (!open || !v) return null;

  const sections = [
    { key: "Vehicle details", content: (
      <div className="grid gap-2 text-sm">
        <div className="flex justify-between"><span>Plate</span><span className="font-medium">{v.plateNo}</span></div>
        <div className="flex justify-between"><span>Code</span><span>{v.code}</span></div>
        <div className="flex justify-between"><span>Brand/Model</span><span>{v.brand} {v.model}</span></div>
        <div className="flex justify-between"><span>Type</span><span>{v.type}</span></div>
        <div className="flex justify-between"><span>Capacity</span><span>{v.capacity}</span></div>
        <div className="flex justify-between"><span>Odometer</span><span>{v.odometerKm.toLocaleString()} km</span></div>
        <div className="flex justify-between"><span>Last service</span><span>{v.lastServiceISO}</span></div>
        <div className="flex justify-between"><span>Next service</span><span>{(v as any).nextServiceISO ?? "—"}</span></div>
      </div>
    )},
    { key: "Status", content: (
      <div className="grid gap-2 text-sm">
        <div className="rounded-lg border bg-gray-50 p-3">
          <div className="font-medium">Load status</div>
          <div className="mt-1 text-gray-600 text-sm">Example: 68% loaded / 32% available</div>
        </div>
        <div className="rounded-lg border bg-gray-50 p-3">
          <div className="font-medium">Last check-in/out</div>
          <div className="mt-1 text-gray-600 text-sm">{(v as any).lastCheckIn ?? "—"}</div>
        </div>
      </div>
    )},
    { key: "Assigned personnel", content: (
      <div className="text-sm">
        <div className="font-medium">Driver</div>
        <div className="text-gray-700">{(v as any).assignedDriver ?? "—"}</div>
      </div>
    )},
    { key: "Tools & Equipments", content: (
      <div className="text-sm text-gray-600">List of equipment can go here.</div>
    )},
    { key: "Comments/Notes", content: (
      <div className="text-sm whitespace-pre-wrap">{(v as any).notes ?? "—"}</div>
    )},
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <div className="text-lg font-semibold">{v.brand} {v.model}</div>
            <div className="text-sm text-gray-500">{v.plateNo}</div>
          </div>
          <button onClick={onClose} className="rounded-md border px-3 py-1.5">Close</button>
        </div>

        <div className="grid gap-4 p-4 lg:grid-cols-[360px,1fr]">
          <div className="space-y-3">
            <div className="overflow-hidden rounded-xl border bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {v.photoUrl ? <img src={v.photoUrl} alt="" className="w-full object-cover" /> : <div className="h-48" />}
            </div>

            <div className="rounded-xl border bg-white p-3 text-sm">
              <div className="font-medium">Driver documents</div>
              <div className="mt-2 grid gap-2">
                {((v as any).driverDocs ?? []).map((d: any) => (
                  <div key={d.label} className="flex items-center justify-between">
                    <span>{d.label}</span>
                    {d.url ? (
                      <a className="text-blue-600 hover:underline" href={d.url} target="_blank">View</a>
                    ) : <span className="text-gray-400">—</span>}
                  </div>
                ))}
                {((v as any).driverDocs ?? []).length === 0 && <div className="text-gray-500">No documents.</div>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Tabs mimic */}
            <div className="flex gap-3 border-b">
              {sections.map(s => (
                <button key={s.key} className="px-2 py-2 text-sm font-medium">{s.key}</button>
              ))}
            </div>
            <div className="space-y-4">
              {sections.map(s => (
                <div key={s.key} className="rounded-xl border bg-white p-4">{s.content}</div>
              ))}
              {/* Route preview placeholder */}
              <div className="rounded-xl border bg-white p-4">
                <div className="font-medium">Route preview</div>
                <div className="mt-2 h-48 rounded-lg bg-gray-100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
