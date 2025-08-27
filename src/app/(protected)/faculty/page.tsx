import DashboardView, {
  Metrics,
  UpcomingItem,
  NotificationItem,
  Profile,
} from "@/components/faculty/DashboardView";

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
  };

  const rightStats = [
    { label: "Active Requests", value: 5 },
    { label: "Vehicles Online", value: 3 },
    { label: "Pending Approvals", value: 4 },
  ];

  return (
    <DashboardView
      metrics={metrics}
      upcoming={upcoming}
      notifications={notifications}
      profile={profile}
      rightStats={rightStats}
    />
  );
}
