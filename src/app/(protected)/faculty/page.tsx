import DashboardView, {
  Metrics,
  UpcomingItem,
  NotificationItem,
  Profile,
} from "@/components/faculty/DashboardView";
import { type CalendarEvent } from "@/components/faculty/MiniCalendar";


export default async function FacultyDashboardPage() {
  // TODO: fetch from Supabase later
  const metrics: Metrics = { upcoming: 3, pending: 1, approved: 1 };

  const upcoming: UpcomingItem[] = [
    { id: "1", date: "2025-12-25 08:00", location: "Tagaytay",     vehicle: "Bus", status: "Approved" },
    { id: "2", date: "2025-12-28 09:30", location: "MSEUF Lucena", vehicle: "Van", status: "Pending"  },
    { id: "3", date: "2026-01-10 06:15", location: "Batangas",     vehicle: "Bus", status: "Assigned" },
  ];

  const notifications: NotificationItem[] = [
    { id: "n1", text: "Your request REQ-24013 was approved.",         time: "2h ago" },
    { id: "n2", text: "Schedule update: Bus departs 30 mins earlier.", time: "1d ago" },
  ];

  const profile: Profile = {
    name: "Jolo Rosales",
    code: "FAC-11234",
    role: "Faculty",
    campus: "Lucena Campus",
    // avatar: "/some-avatar.png",
  };

  const rightStats = [
    { label: "Active Requests", value: 5 },
    { label: "Vehicles Online", value: 3 },
    { label: "Pending Approvals", value: 4 },
  ];

  const events: CalendarEvent[] = [
    { id: "e1", date: "2025-12-25", title: "Trip to Tagaytay", color: "bg-[#22863a]" }, // trip
    { id: "e2", date: "2025-12-28", title: "Trip to MSEUF Lucena", color: "bg-[#22863a]" },
    { id: "e3", date: "2026-01-10", title: "Trip to Batangas", color: "bg-[#22863a]" },
    // if you ever mark maintenance in faculty view:
    { id: "e4", date: "2025-12-27", title: "Vehicle Maintenance", color: "bg-[#c23b22]" },
  ];

  return (
    <DashboardView
      metrics={metrics}
      upcoming={upcoming}
      notifications={notifications}
      profile={profile}
      rightStats={rightStats}
      events={events}
    />
  );
}
