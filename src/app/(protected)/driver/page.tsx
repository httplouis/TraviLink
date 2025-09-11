"use client";

import { useEffect } from "react";
import DashboardView, { type Metrics, type UpcomingRow } from "@/components/driver/dashboard/DashboardView";
import { CalendarDays, Wrench, BusFront, CheckCircle2, Activity, Clock } from "lucide-react";

const METRICS: Metrics = { trips: 4, online: 2, pending: 2 };

const UPCOMING: UpcomingRow[] = [
  { id: "1", date: "2025-12-25 08:00", location: "Tagaytay",      vehicle: "Bus", status: "Approved" },
  { id: "2", date: "2025-12-28 09:30", location: "MSEUF Lucena",  vehicle: "Van", status: "Pending"  },
  { id: "3", date: "2026-01-10 06:15", location: "Batangas",      vehicle: "Bus", status: "Assigned" },
];

export default function DriverDashboard() {
  // expose trips to MiniCalendar in right rail
  useEffect(() => {
    try {
      const trips = UPCOMING.map((u) => ({ date: u.date.slice(0, 10), label: `${u.location} (${u.vehicle})` }));
      localStorage.setItem("travilink_trips", JSON.stringify(trips));
      window.dispatchEvent(new StorageEvent("storage", { key: "travilink_trips" }));
    } catch {}
  }, []);

  return (
    <DashboardView
      metrics={METRICS}
      upcoming={UPCOMING}
      actions={[
        { icon: <CheckCircle2 className="h-5 w-5" />, title: "Upcoming Schedules", desc: "Preview your next trips with dates, time, and locations.", href: "/driver/schedule" },
        { icon: <Activity className="h-5 w-5" />,     title: "Submit Maintenance",  desc: "Create a quick maintenance log for your assigned vehicle.", href: "/driver/maintenance/submit" },
        { icon: <Clock className="h-5 w-5" />,        title: "Trip History",        desc: "Review completed trips and past assignments.", href: "/driver/history" },
      ]}
    />
  );
}
