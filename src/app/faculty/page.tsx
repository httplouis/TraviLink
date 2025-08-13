"use client";
import Link from "next/link";
import { PageHeader, PageBody } from "@/components/common/Page";

type Status = "Pending" | "Approved" | "Assigned" | "Rejected";

const UPCOMING = [
  { id: "1", date: "2025-12-25 08:00", location: "Tagaytay", vehicle: "Bus", status: "Approved" as Status },
  { id: "2", date: "2025-12-28 09:30", location: "MSEUF Lucena", vehicle: "Van", status: "Pending" as Status },
  { id: "3", date: "2026-01-10 06:15", location: "Batangas", vehicle: "Bus", status: "Assigned" as Status },
];

const REQUESTS = [
  { id: "REQ-24012", created: "2025-12-18", purpose: "Faculty meeting", dest: "CCMS", status: "Pending" as Status },
  { id: "REQ-24013", created: "2025-12-05", purpose: "Event coordination", dest: "City Hall", status: "Approved" as Status },
];

const tone = (s: Status) =>
  s === "Approved" || s === "Assigned"
    ? "bg-green-100 text-green-700"
    : s === "Pending"
    ? "bg-amber-100 text-amber-700"
    : "bg-neutral-100 text-neutral-700";

export default function FacultyDashboard() {
  return (
    <>
      <PageHeader
        title="Faculty Dashboard"
        description="View schedules, track requests, and get updates."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/faculty/request" className="rounded-md bg-[#7a0019] text-white px-3 py-2 text-sm">New Request</Link>
            <Link href="/faculty/schedule" className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50">View Schedules</Link>
          </div>
        }
      />

      <PageBody>
        {/* 1 col on mobile, 2 cols (content + right rail) from lg */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
          {/* LEFT */}
          <div className="space-y-4 min-w-0">
            {/* Quick actions */}
            <div className="rounded-lg border border-neutral-200 bg-white p-3">
              <div className="flex flex-wrap gap-2">
                <Link href="/faculty/request" className="rounded-full border px-3 py-1.5 text-sm hover:bg-neutral-50">Submit a request</Link>
                <Link href="/faculty/schedule" className="rounded-full border px-3 py-1.5 text-sm hover:bg-neutral-50">Upcoming schedules</Link>
                <button className="rounded-full border px-3 py-1.5 text-sm hover:bg-neutral-50" onClick={() => alert("Open tracker (coming soon)")}>
                  Open tracker
                </button>
              </div>
            </div>

            {/* Upcoming schedules — horizontal scroll on small screens */}
            <section className="rounded-lg border border-neutral-200 bg-white">
              <div className="border-b px-4 py-3 flex items-center justify-between">
                <h2 className="font-medium">Upcoming Schedules</h2>
                <Link href="/faculty/schedule" className="text-sm text-[#7a0019] hover:underline">See all</Link>
              </div>

              <div className="p-3 overflow-x-auto">
                <div className="flex gap-3 min-w-max">
                  {UPCOMING.map((s) => (
                    <article key={s.id} className="w-72 sm:w-80 shrink-0 rounded-lg border border-neutral-200 bg-white p-3 hover:shadow-sm transition">
                      <div className="text-xs text-neutral-500">{s.vehicle}</div>
                      <div className="font-medium break-words">{s.location}</div>
                      <div className="text-sm text-neutral-600">{s.date}</div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded ${tone(s.status)}`}>{s.status}</span>
                        <Link href="/faculty/schedule" className="text-xs border rounded px-2 py-1 hover:bg-neutral-50">Details</Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* My Requests — read-only */}
            <section className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
              <div className="border-b px-4 py-3 flex items-center justify-between">
                <h2 className="font-medium">My Requests</h2>
                <Link href="/faculty/request" className="text-sm rounded border px-2 py-1 hover:bg-neutral-50">New Request</Link>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-neutral-50 text-neutral-700">
                    <tr>
                      <th className="text-left font-medium px-4 py-2">Request ID</th>
                      <th className="text-left font-medium px-4 py-2">Created</th>
                      <th className="text-left font-medium px-4 py-2">Purpose</th>
                      <th className="text-left font-medium px-4 py-2">Destination</th>
                      <th className="text-left font-medium px-4 py-2">Status</th>
                      <th className="text-left font-medium px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {REQUESTS.map((r, i) => (
                      <tr key={r.id} className={i % 2 ? "bg-white" : "bg-neutral-50/40"}>
                        <td className="px-4 py-2">{r.id}</td>
                        <td className="px-4 py-2">{r.created}</td>
                        <td className="px-4 py-2">{r.purpose}</td>
                        <td className="px-4 py-2">{r.dest}</td>
                        <td className="px-4 py-2">
                          <span className={`text-xs px-2 py-1 rounded ${tone(r.status)}`}>{r.status}</span>
                        </td>
                        <td className="px-4 py-2">
                          <button className="text-xs border rounded px-2 py-1 hover:bg-neutral-50">View</button>
                          {r.status === "Pending" && (
                            <button className="ml-2 text-xs border rounded px-2 py-1 hover:bg-neutral-50">Edit</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <aside className="space-y-4 min-w-0">
            <div className="rounded-lg bg-[#5c0013] text-white p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/10 grid place-items-center font-semibold">F</div>
                <div>
                  <div className="text-xs uppercase opacity-80">Profile • Faculty</div>
                  <div className="text-lg font-semibold">CCMS — Lucena</div>
                </div>
              </div>
              <div className="mt-3 flex gap-2 text-xs">
                <span className="rounded-full bg-white/10 px-2 py-1">Faculty</span>
                <span className="rounded-full bg-white/10 px-2 py-1">Lucena Campus</span>
              </div>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-white divide-y">
              <div className="px-4 py-3">
                Upcoming Trips
                <span className="float-right text-neutral-500">{UPCOMING.length}</span>
              </div>
              <div className="px-4 py-3">
                Pending Requests
                <span className="float-right text-neutral-500">
                  {REQUESTS.filter((r) => r.status === "Pending").length}
                </span>
              </div>
              <div className="px-4 py-3">
                Notifications
                <span className="float-right text-neutral-500">2</span>
              </div>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-white p-3">
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Quick note / request detail..." />
              <div className="mt-2 text-right">
                <button className="text-xs rounded border px-2 py-1 hover:bg-neutral-50">Save</button>
              </div>
            </div>
          </aside>
        </div>
      </PageBody>
    </>
  );
}
