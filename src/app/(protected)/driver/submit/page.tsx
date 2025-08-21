"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader, PageBody } from "@/components/common/Page";

const LS_KEY = "travilink_maintenance";

export default function SubmitMaintenance() {
  const router = useRouter();
  const [form, setForm] = useState({
    vehicle: "Bus 1",
    title: "",
    date: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
    note: "",
  });

  function saveToStorage() {
    const raw = localStorage.getItem(LS_KEY);
    const items = raw ? JSON.parse(raw) : [];
    items.push({
      id: crypto.randomUUID(),
      vehicle: form.vehicle,
      title: form.title || "Maintenance",
      date: form.date,
      status: "Pending",
      note: form.note,
    });
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    saveToStorage();
    router.push("/driver/maintenance");
  }

  return (
    <>
      <PageHeader
        title="Submit a maintenance"
        description="Create a scheduled or reported maintenance item."
        actions={
          <button
            className="btn btn-outline"
            onClick={() => router.push("/driver/maintenance")}
          >
            Back to list
          </button>
        }
      />

      <PageBody>
        <form
          onSubmit={submit}
          className="rounded-xl ring-1 ring-neutral-200/70 bg-white shadow-sm p-5 grid gap-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="grid gap-1">
              <span className="text-sm text-neutral-600">Vehicle</span>
              <select
                className="rounded-xl border border-neutral-200/80 px-3 py-2"
                value={form.vehicle}
                onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
              >
                <option>Bus 1</option>
                <option>Van 1</option>
                <option>Bus 2</option>
              </select>
            </label>

            <label className="grid gap-1">
              <span className="text-sm text-neutral-600">Date</span>
              <input
                type="date"
                className="rounded-xl border border-neutral-200/80 px-3 py-2"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-sm text-neutral-600">Maintenance Title</span>
            <input
              className="rounded-xl border border-neutral-200/80 px-3 py-2"
              placeholder="e.g., Engine check, Brake service"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-neutral-600">Notes</span>
            <textarea
              className="min-h-[140px] rounded-xl border border-neutral-200/80 px-3 py-2"
              placeholder="Additional details…"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </label>

          <div className="flex justify-end">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </div>
        </form>
      </PageBody>
    </>
  );
}
