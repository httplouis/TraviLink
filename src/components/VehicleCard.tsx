"use client";
import { ClipboardList, Info, Wrench } from "lucide-react";
import type { Vehicle } from "@/app/lib/mock";

function StatusPill({ s }: { s: Vehicle["status"] }) {
  const map = {
    available: "bg-green-50 text-green-700 border-green-200",
    maintenance: "bg-amber-50 text-amber-700 border-amber-200",
    offline: "bg-gray-100 text-gray-700 border-gray-200",
  };
  const label = s === "maintenance" ? "Maintenance" : s === "available" ? "Available" : "Offline";
  return <span className={`pill ${map[s]}`}>{label}</span>;
}

export default function VehicleCard({ v }: { v: Vehicle }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-tl.gray3">{v.type}</div>
          <div className="text-lg font-semibold">{v.name}</div>
        </div>
        <StatusPill s={v.status} />
      </div>

      <div className="h-24 my-4 grid place-items-center rounded-xl border border-dashed border-tl-line bg-gray-50 text-tl.gray4 text-sm">
        Vehicle image
      </div>

      <div className="flex gap-2">
        <button className="btn">
          <ClipboardList size={16} /> Schedule
        </button>
        <button className="btn">
          <Info size={16} /> Details
        </button>
        <button className="btn" disabled={v.status !== "maintenance"}>
          <Wrench size={16} /> Fix log
        </button>
      </div>
    </div>
  );
}
