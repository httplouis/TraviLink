"use client";
import React, { useMemo } from "react";

/** One event on a given calendar date. */
export type CalendarEvent = {
  /** ISO date: "YYYY-MM-DD" */
  date: string;
  /** categorize to color the dot; extend as needed */
  type?: "trip" | "maintenance";
};

type Props = {
  /** Which month to show; defaults to current month */
  date?: Date;
  /** Events to mark with dots under the day number */
  events?: CalendarEvent[];
  /** 0 = Sunday, 1 = Monday */
  weekStartsOn?: 0 | 1;
};

export default function MiniCalendar({
  date = new Date(),
  events = [],
  weekStartsOn = 1, // Monday by default
}: Props) {
  // Map events by date -> { trip?: boolean; maintenance?: boolean; count: number }
  const eventMap = useMemo(() => {
    const map: Record<string, { trip?: boolean; maintenance?: boolean; count: number }> = {};
    for (const ev of events) {
      const k = ev.date;
      if (!map[k]) map[k] = { count: 0 };
      map[k].count += 1;
      if (ev.type === "maintenance") map[k].maintenance = true;
      else map[k].trip = true;
    }
    return map;
  }, [events]);

  const { year, month, days, startOffset } = useMemo(() => {
    const y = date.getFullYear();
    const m = date.getMonth(); // 0=Jan
    const first = new Date(y, m, 1);
    const dow = first.getDay(); // 0..6
    const start = (dow - weekStartsOn + 7) % 7; // align to weekStartsOn
    const count = new Date(y, m + 1, 0).getDate();
    return { year: y, month: m, days: count, startOffset: start };
  }, [date, weekStartsOn]);

  const monthStr = String(month + 1).padStart(2, "0");
  const cells: (number | null)[] = Array.from({ length: startOffset + days }, (_, i) => {
    const d = i - startOffset + 1;
    return d > 0 ? d : null;
  });

  const weekLabels =
    weekStartsOn === 1
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="tl-cal w-full select-none">
      {/* week header */}
      <div className="tl-cal-grid mb-2">
        {weekLabels.map((w) => (
          <div key={w} className="text-[11px] text-neutral-500 text-center">
            {w}
          </div>
        ))}
      </div>

      {/* days grid */}
      <div className="tl-cal-grid">
        {cells.map((d, idx) => {
          if (d === null) {
            return <div key={`empty-${idx}`} className="h-10 rounded-md border border-transparent" />;
          }
          const dayStr = String(d).padStart(2, "0");
          const k = `${year}-${monthStr}-${dayStr}`;
          const mark = eventMap[k];

          return (
            <div
              key={`d-${idx}`}
              className="h-10 rounded-md border border-neutral-200 bg-white grid grid-rows-[1fr_auto] place-items-center text-sm hover:bg-neutral-50 transition"
              title={mark ? `${mark.count} event(s)` : undefined}
            >
              <span className="leading-none pt-1">{d}</span>
              <div className="flex items-center gap-1 pb-1">
                {mark?.trip && (
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#22863a" }} />
                )}
                {mark?.maintenance && (
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#d73a49" }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
