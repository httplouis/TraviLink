export type KPI = { label: string; value: number | string; caption?: string };

export type TrendPoint = { date: string; count: number };
export type StatusPoint = { status: "Pending"|"Approved"|"Completed"|"Rejected"; count: number };

// NEW
export type UtilizationPoint = { label: string; percent: number }; // e.g. vehicle or dept
export type TripLogRow = {
  id: string;
  vehicle: string;
  driver: string;
  department: string;
  date: string;       // YYYY-MM-DD
  distanceKm: number; // mock for now
};

export type RequestRow = {
  id: string;
  requester: string;
  vehicle: string;
  date: string;
  status: "Pending" | "Approved" | "Completed" | "Rejected";
};

export type DeptUsage = { dept: string; count: number };

export type DashboardData = {
  kpis: KPI[];
  requestsByDay: TrendPoint[];
  statusBreakdown: StatusPoint[];
  utilization: UtilizationPoint[];
  deptUsage: DeptUsage[];
  recentRequests: RequestRow[];
  recentTrips: TripLogRow[];
};

