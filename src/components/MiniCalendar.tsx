"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CalEvent = { date: string; type: "trip" | "maintenance"; label?: string };

const MAINT_KEY = "travilink_maintenance";
const TRIPS_KEY = "travilink_trips";

export default function MiniCalendar() {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [events, setEvents] = useState<CalEvent[]>([]);

  function loadEvents() {
    const all: CalEvent[] = [];

    // maintenance
    try {
      const rawM = localStorage.getItem(MAINT_KEY);
      if (rawM) {
        const list = JSON.parse(rawM) as { date: string; vehicle: string; type: string }[];
        all.push(
          ...list.map((i) => ({
            date: i.date,
            type: "maintenance" as const,
            label: `${i.vehicle.replace("-", " ").toUpperCase()} — ${i.type}`,
          }))
        );
      }
    } catch {}

    // trips
    try {
      const rawT = localStorage.getItem(TRIPS_KEY);
      if (rawT) {
        const trips = JSON.parse(rawT) as { date: string; label?: string }[];
        all.push(
          ...trips.map((t) => ({
            date: t.date.slice(0, 10),
            type: "trip" as const,
            label: t.label || "Trip",
          }))
        );
      }
    } catch {}

    setEvents(all);
  }

  useEffect(() => {
    loadEvents();
    const onStorage = (e: StorageEvent) => {
      if (e.key === MAINT_KEY || e.key === TRIPS_KEY) loadEvents();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const first = new Date(view.y, view.m, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  const days = useMemo(() => {
    const arr: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [view.y, view.m]);

  function prevMonth() {
    setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }));
  }
  function nextMonth() {
    setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 }));
  }

  function eventsFor(d: Date) {
    const key = d.toISOString().slice(0, 10);
    return events.filter((e) => e.date === key);
  }

  return (
    <section className="rounded-xl ring-1 ring-neutral-200/70 bg-white shadow-sm">
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-200/80">
        <button onClick={prevMonth} className="p-1 rounded hover:bg-neutral-100" aria-label="Previous month">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-medium">
          {new Date(view.y, view.m, 1).toLocaleString(undefined, { month: "long", year: "numeric" })}
        </div>
        <button onClick={nextMonth} className="p-1 rounded hover:bg-neutral-100" aria-label="Next month">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-[11px] text-neutral-600 px-3 pt-2 pb-1">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (<div key={d}>{d}</div>))}
      </div>

      <div className="grid grid-cols-7 gap-1 p-3 pt-0">
        {days.map((d, i) => {
          const inMonth = d.getMonth() === view.m;
          const isToday = d.toDateString() === new Date().toDateString();
          const evts = eventsFor(d);
          const title = evts.map((e) => e.label || (e.type === "trip" ? "Trip" : "Maintenance")).join("\n");

          return (
            <div
              key={i}
              title={title || undefined}
              className={[
                "relative h-12 rounded-lg border text-xs p-1.5 text-right",
                inMonth ? "bg-white border-neutral-200/80 text-neutral-800" : "bg-neutral-50 border-neutral-100 text-neutral-400",
                isToday ? "ring-1 ring-[#7a0019]" : "",
              ].join(" ")}
            >
              {d.getDate()}
              <div className="absolute left-1.5 bottom-1.5 flex gap-1">
                {evts.some((e) => e.type === "trip") && <span className="h-2 w-2 rounded-full bg-green-600" />}
                {evts.some((e) => e.type === "maintenance") && <span className="h-2 w-2 rounded-full bg-rose-600" />}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-3 py-2 border-t border-neutral-200/80 text-[11px]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-600" /> Trips</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-600" /> Maintenance</span>
        </div>
        <a href="/driver/schedule" className="text-[#7a0019] hover:underline">full calendar</a>
      </div>
    </section>
  );
}
