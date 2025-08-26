"use client";

import MiniCalendar, { type CalendarEvent } from "@/components/faculty/MiniCalendar";

export default function RightRail() {
  const events: CalendarEvent[] = [
    { date: "2025-12-25", type: "trip" },
    { date: "2025-12-28", type: "maintenance" },
  ];

  return (
    <div className="space-y-4">
      <section className="rounded-xl border p-4">
        <div className="text-xs text-neutral-500">PROFILE • FACULTY</div>
        <div className="mt-1 text-lg font-semibold">Jolo Rosales</div>
        <div className="text-sm text-neutral-600">Code: FAC-11234</div>
        <div className="mt-2 inline-flex items-center gap-2 rounded-md bg-neutral-100 px-2 py-1 text-xs">
          <span>Lucena Campus</span>
        </div>
      </section>

      <section className="rounded-xl border p-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xl font-bold">5</div>
            <div className="text-xs text-neutral-500">Active Requests</div>
          </div>
          <div>
            <div className="text-xl font-bold">3</div>
            <div className="text-xs text-neutral-500">Vehicles Online</div>
          </div>
          <div>
            <div className="text-xl font-bold">4</div>
            <div className="text-xs text-neutral-500">Pending</div>
          </div>
        </div>
      </section>

      {/* Calendar card */}
      <section className="rounded-xl border bg-white p-3 w-full">
        <h3 className="font-medium mb-2">August 2025</h3>
        <MiniCalendar events={events} weekStartsOn={1} />
        <div className="mt-2 text-right text-xs text-neutral-500">
          full calendar
        </div>
      </section>
    </div>
  );
}
