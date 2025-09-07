import type { DashboardData } from "../types";
import type { RequestRow, RequestsSummary } from "@/components/admin/requests/types";

export async function getDashboardData(): Promise<DashboardData> {
  return {
    kpis: [
      { label: "Vehicles", value: 32 },
      { label: "Open Requests", value: 14, caption: "↓ 3 vs last week" },
      { label: "Trips Today", value: 9 },
      { label: "Maintenance", value: "2 due" },
    ],
    requestsByDay: [
      { date: "Aug 30", count: 11 }, { date: "Aug 31", count: 5 },
      { date: "Sep 1", count: 7 },   { date: "Sep 2", count: 8 },
      { date: "Sep 3", count: 12 },  { date: "Sep 4", count: 10 },
      { date: "Sep 5", count: 9 },   { date: "Sep 6", count: 13 },
    ],
    statusBreakdown: [
      { status: "Pending", count: 6 },
      { status: "Approved", count: 12 },
      { status: "Completed", count: 9 },
      { status: "Rejected", count: 2 },
    ],
    utilization: [
      { label: "Bus-03", percent: 76 },
      { label: "Van-12", percent: 64 },
      { label: "SUV-04", percent: 42 },
      { label: "Van-08", percent: 38 },
      { label: "Bus-01", percent: 31 },
    ],
    deptUsage: [
      { dept: "CCMS", count: 12 },
      { dept: "HR", count: 8 },
      { dept: "Registrar", count: 5 },
      { dept: "Finance", count: 3 },
    ],
    recentRequests: [
      { id: "RQ-1021", requester: "J. Santos", vehicle: "Van-12", date: "2025-09-05", status: "Pending" },
      { id: "RQ-1019", requester: "M. Reyes", vehicle: "Bus-03", date: "2025-09-05", status: "Approved" },
    ],
    recentTrips: [
      { id: "TR-2101", vehicle: "Bus-03", driver: "R. Dizon", department: "CCMS", date: "2025-09-06", distanceKm: 18.2 },
      { id: "TR-2098", vehicle: "Van-12", driver: "J. Ramos", department: "HR", date: "2025-09-06", distanceKm: 7.5 },
      { id: "TR-2093", vehicle: "SUV-04", driver: "M. Cruz", department: "Registrar", date: "2025-09-05", distanceKm: 12.1 },
    ],
  };
}


export async function getRequestsData(): Promise<{ summary: RequestsSummary; requests: RequestRow[] }> {
  const requests: RequestRow[] = [
    { id: "RQ-1021", dept: "CCMS",      purpose: "Seminar",            date: "2025-09-10", status: "Pending"   },
    { id: "RQ-1019", dept: "HR",        purpose: "Orientation",        date: "2025-09-12", status: "Approved"  },
    { id: "RQ-1017", dept: "Registrar", purpose: "Enrollment Support", date: "2025-09-08", status: "Completed" },
    { id: "RQ-1016", dept: "Finance",   purpose: "Audit Trip",         date: "2025-09-09", status: "Rejected"  },
    { id: "RQ-1015", dept: "CCMS",      purpose: "Training",           date: "2025-09-06", status: "Approved"  },
    { id: "RQ-1014", dept: "HR",        purpose: "Hiring Event",       date: "2025-09-05", status: "Pending"   },
  ];

  const summary: RequestsSummary = {
    pending:   requests.filter(r => r.status === "Pending").length,
    approved:  requests.filter(r => r.status === "Approved").length,
    completed: requests.filter(r => r.status === "Completed").length,
    rejected:  requests.filter(r => r.status === "Rejected").length,
  };

  return { summary, requests };
}
