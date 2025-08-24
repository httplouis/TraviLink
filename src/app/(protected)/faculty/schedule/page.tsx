"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader, PageBody } from "@/components/common/Page";

type Vehicle = "Car" | "Van" | "Bus";
type Status = "Pending" | "Approved" | "Assigned" | "Completed" | "Rejected";

type Trip = {
  id: string;
  start: string;   // ISO
  end: string;     // ISO
  vehicle: Vehicle;
  destination: string;
  note?: string;
  status: Status;
};

const TRIPS: Trip[] = [
  { id: "SCH-1001", start: "2025-12-25T08:00", end: "2025-12-25T12:00", vehicle: "Bus", destination: "Tagaytay", status: "Approved" },
  { id: "SCH-1002", start: "2025-12-28T09:30", end: "2025-12-28T13:30", vehicle: "Van", destination: "MSEUF Lucena", status: "Pending" },
  { id: "SCH-1003", start: "2026-01-10T06:15", end: "2026-01-10T10:00", vehicle: "Bus", destination: "Batangas", status: "Assigned" },
  { id: "SCH-0994", start: "2025-11-29T07:30", end: "2025-11-29T11:00", vehicle: "Car", destination: "San Pablo", status: "Completed" },
  { id: "SCH-0990", start: "2025-11-15T14:00", end: "2025-11-15T16:30", vehicle: "Van", destination: "City Hall", status: "Rejected" },
];

const badge = (s: Status) =>
  s === "Approved" || s === "Assigned"
    ? "bg-green-100 text-green-700"
    : s === "Pending"
    ? "bg-amber-100 text-amber-700"
    : s === "Completed"
    ? "bg-neutral-200 text-neutral-700"
    : "bg-rose-100 text-rose-700";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString([], { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });

export default function FacultySchedulePage() {
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");
  const [q, setQ] = useState("");
  const [veh, setVeh] = useState<"" | Vehicle>("");
  const [stat, setStat] = useState<"" | Status>("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const now = new Date();

  const filtered = useMemo(() => {
    return TRIPS.filter((t) => {
      // upcoming vs history
      const isUpcoming = new Date(t.start) >= now;
      if (tab === "upcoming" && !isUpcoming) return false;
      if (tab === "history" && isUpcoming) return false;

      // text search
      const hay = `${t.id} ${t.destination} ${t.vehicle} ${t.status}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;

      if (veh && t.vehicle !== veh) return false;
      if (stat && t.status !== stat) return false;

      if (from && new Date(t.start) < new Date(from)) return false;
      if (to && new Date(t.start) > new Date(to + "T23:59:59")) return false;

      return true;
    }).sort((a, b) => +new Date(a.start) - +new Date(b.start));
  }, [tab, q, veh, stat, from, to, now]);

  const exportCsv = () => {
    const rows = [
      ["ID", "Start", "End", "Vehicle", "Destination", "Status"],
      ...filtered.map((t) => [t.id, t.start, t.end, t.vehicle, t.destination, t.status]),
    ];
    const csv = rows.map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `faculty-schedule-${tab}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        title="Schedule"
        description="Your upcoming and past trips."
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTab("upcoming")}
              className={`px-3 py-2 text-sm rounded-md border ${tab === "upcoming" ? "bg-[#7a0019] text-white border-[#7a0019]" : "hover:bg-neutral-50"}`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setTab("history")}
              className={`px-3 py-2 text-sm rounded-md border ${tab === "history" ? "bg-[#7a0019] text-white border-[#7a0019]" : "hover:bg-neutral-50"}`}
            >
              History
            </button>
            <Link href="/faculty/request" className="rounded-md bg-[#7a0019] text-white px-3 py-2 text-sm">
              New Request
            </Link>
          </div>
        }
      />

      <PageBody>
        {/* Filters */}
        <div className="rounded-lg border bg-white p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
            <div className="xl:col-span-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
                placeholder="Search destination, ID, vehicle…"
              />
            </div>
            <div>
              <select
                value={veh}
                onChange={(e) => setVeh(e.target.value as Vehicle | "")}
                className="w-full rounded-md border px-3 py-2 text-sm"
              >
                <option value="">All vehicles</option>
                <option value="Car">Car</option>
                <option value="Van">Van</option>
                <option value="Bus">Bus</option>
              </select>
            </div>
            <div>
              <select
                value={stat}
                onChange={(e) => setStat(e.target.value as Status | "")}
                className="w-full rounded-md border px-3 py-2 text-sm"
              >
                <option value="">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Assigned">Assigned</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm">
            <div className="text-neutral-600">
              Showing <span className="font-medium">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""}
            </div>
            <div className="flex gap-2">
              <button onClick={exportCsv} className="rounded-md border px-3 py-1.5 hover:bg-neutral-50">
                Export CSV
              </button>
              <button
                onClick={() => {
                  setQ(""); setVeh(""); setStat(""); setFrom(""); setTo("");
                }}
                className="rounded-md border px-3 py-1.5 hover:bg-neutral-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results: mobile cards */}
        <div className="md:hidden grid gap-3 mt-4">
          {filtered.map((t) => (
            <div key={t.id} className="rounded-lg border bg-white p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{t.destination}</div>
                <span className={`text-xs px-2 py-1 rounded ${badge(t.status)}`}>{t.status}</span>
              </div>
              <div className="mt-1 text-sm text-neutral-600">{t.vehicle}</div>
              <div className="mt-1 text-sm text-neutral-600">{fmtDate(t.start)} → {fmtDate(t.end)}</div>
              <div className="mt-3 flex gap-2">
                <Link href={`/faculty/request`} className="text-xs border rounded px-2 py-1 hover:bg-neutral-50">Details</Link>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-lg border bg-white p-4 text-sm text-neutral-600">No results.</div>
          )}
        </div>

        {/* Results: desktop table */}
        <div className="hidden md:block mt-4 overflow-x-auto">
          <table className="min-w-full text-sm bg-white border rounded-lg overflow-hidden">
            <thead className="bg-neutral-50">
              <tr className="text-neutral-700">
                <th className="text-left font-medium px-4 py-2">ID</th>
                <th className="text-left font-medium px-4 py-2">Start</th>
                <th className="text-left font-medium px-4 py-2">End</th>
                <th className="text-left font-medium px-4 py-2">Vehicle</th>
                <th className="text-left font-medium px-4 py-2">Destination</th>
                <th className="text-left font-medium px-4 py-2">Status</th>
                <th className="text-left font-medium px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((t) => (
                <tr key={t.id} className="bg-white">
                  <td className="px-4 py-2">{t.id}</td>
                  <td className="px-4 py-2">{fmtDate(t.start)}</td>
                  <td className="px-4 py-2">{fmtDate(t.end)}</td>
                  <td className="px-4 py-2">{t.vehicle}</td>
                  <td className="px-4 py-2">{t.destination}</td>
                  <td className="px-4 py-2">
                    <span className={`text-xs px-2 py-1 rounded ${badge(t.status)}`}>{t.status}</span>
                  </td>
                  <td className="px-4 py-2">
                    <Link href={`/faculty/request`} className="text-xs border rounded px-2 py-1 hover:bg-neutral-50">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-neutral-500">
                    No results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PageBody>
    </>
  );
}
