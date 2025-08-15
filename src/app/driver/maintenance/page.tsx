"use client";
import { useState } from "react";

export default function Maintenance() {
  const [form, setForm] = useState({ vehicle: "Bus 1", issue: "", note: "" });

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Submit Maintenance</h1>
      <div className="card p-5 grid gap-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-sm text-tl.gray3">Vehicle</span>
            <select
              className="border border-tl-line rounded-xl px-3 py-2"
              value={form.vehicle}
              onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
            >
              <option>Bus 1</option>
              <option>Van 1</option>
              <option>Bus 2</option>
            </select>
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-tl.gray3">Issue</span>
            <input
              className="border border-tl-line rounded-xl px-3 py-2"
              placeholder="Ex. Brake check, Engine light on"
              value={form.issue}
              onChange={(e) => setForm({ ...form, issue: e.target.value })}
            />
          </label>
        </div>
        <label className="grid gap-1">
          <span className="text-sm text-tl.gray3">Notes</span>
          <textarea
            rows={4}
            className="border border-tl-line rounded-xl px-3 py-2"
            placeholder="Additional details…"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </label>
        <div>
          <button className="btn btn-solid">Submit</button>
        </div>
      </div>
    </div>
  );
}
