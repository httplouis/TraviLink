"use client";
import { useState } from "react";

const statuses = ["Available", "On Trip", "Off Duty", "Sick", "Leave"] as const;

export default function DriverStatus() {
  const [value, setValue] = useState<(typeof statuses)[number]>("Available");
  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Update Status</h1>
      <div className="card p-5">
        <div className="grid sm:grid-cols-5 gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setValue(s)}
              className={`btn ${value === s ? "btn-solid" : ""}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="mt-4 text-sm text-tl.gray3">Current: <span className="font-medium">{value}</span></div>
      </div>
    </div>
  );
}
