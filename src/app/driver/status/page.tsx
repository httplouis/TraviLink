"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Truck,
  Moon,
  LogOut,
  Stethoscope,
} from "lucide-react";
import { PageHeader, PageBody } from "@/components/common/Page";

/* --------------------------- Types & Data --------------------------- */
type DriverStatus = "Available" | "On Trip" | "Off Duty" | "Sick" | "Leave";

const STATUSES: DriverStatus[] = [
  "Available",
  "On Trip",
  "Off Duty",
  "Sick",
  "Leave",
];

const tone = (s: DriverStatus) =>
  s === "Available"
    ? "bg-green-100 text-green-700"
    : s === "On Trip"
    ? "bg-sky-100 text-sky-700"
    : s === "Off Duty"
    ? "bg-neutral-100 text-neutral-700"
    : s === "Sick"
    ? "bg-amber-100 text-amber-700"
    : "bg-rose-100 text-rose-700";

/* --------------------------- UI Elements --------------------------- */
function StatusIcon({ s }: { s: DriverStatus }) {
  if (s === "Available") return <CheckCircle2 className="h-5 w-5 text-green-600" />;
  if (s === "On Trip") return <Truck className="h-5 w-5 text-sky-600" />;
  if (s === "Off Duty") return <Moon className="h-5 w-5 text-neutral-600" />;
  if (s === "Sick") return <Stethoscope className="h-5 w-5 text-amber-600" />;
  return <LogOut className="h-5 w-5 text-rose-600" />;
}

/* ------------------------------ Page ------------------------------ */
export default function UpdateStatus() {
  const [status, setStatus] = useState<DriverStatus>("Available");

  return (
    <>
      <PageHeader
        title="Update Driver Status"
        description="Select your current availability for trips."
        actions={
          <div className="flex gap-2">
            <button className="btn btn-primary">Save</button>
            <button className="btn btn-outline">View History</button>
          </div>
        }
      />

      <PageBody>
        {/* Current status */}
        <section className="rounded-xl ring-1 ring-neutral-200/70 bg-white shadow-sm">
          <div className="border-b border-neutral-200/80 px-4 py-3">
            <h2 className="font-medium">Current Status</h2>
            <p className="text-sm text-neutral-600">
              You are currently marked as:
              <span className={`ml-2 rounded px-2 py-0.5 text-xs ${tone(status)}`}>
                {status}
              </span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-5">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`flex flex-col items-center justify-center gap-2 rounded-lg border px-3 py-4 text-sm transition 
                ${status === s
                  ? "border-[#7a0019] bg-neutral-50 font-semibold"
                  : "border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                <StatusIcon s={s} />
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Quick actions */}
        <section className="mt-6 rounded-xl ring-1 ring-neutral-200/70 bg-white shadow-sm">
          <div className="border-b border-neutral-200/80 px-4 py-3">
            <h2 className="font-medium">Quick Actions</h2>
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              className="rounded-lg border border-neutral-200 bg-white p-4 text-left hover:border-[#7a0019] hover:bg-neutral-50"
              onClick={() => setStatus("Available")}
            >
              <p className="font-medium">Start Shift</p>
              <p className="text-sm text-neutral-600">Set as Available</p>
            </button>
            <button
              className="rounded-lg border border-neutral-200 bg-white p-4 text-left hover:border-[#7a0019] hover:bg-neutral-50"
              onClick={() => setStatus("On Trip")}
            >
              <p className="font-medium">Begin Trip</p>
              <p className="text-sm text-neutral-600">Mark as On Trip</p>
            </button>
            <button
              className="rounded-lg border border-neutral-200 bg-white p-4 text-left hover:border-[#7a0019] hover:bg-neutral-50"
              onClick={() => setStatus("Off Duty")}
            >
              <p className="font-medium">Take Break</p>
              <p className="text-sm text-neutral-600">Switch to Off Duty</p>
            </button>
          </div>
        </section>
      </PageBody>
    </>
  );
}
