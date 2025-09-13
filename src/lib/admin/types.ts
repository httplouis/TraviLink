export type KPI = { label: string; value: number | string; caption?: string };

export type TrendPoint = { date: string; count: number };
export type StatusPoint = {
  status: "Pending" | "Approved" | "Completed" | "Rejected";
  count: number;
};

// NEW
export type UtilizationPoint = { label: string; percent: number }; // e.g. vehicle or dept
export type TripLogRow = {
  id: string;
  vehicle: string;
  driver: string;
  department: string;
  date: string; // YYYY-MM-DD
  distanceKm: number; // mock for now
};

export type RequestStatus = "Pending" | "Approved" | "Completed" | "Rejected";

export type RequestRow = {
  id: string;
  dept: "CCMS" | "HR" | "Registrar" | "Finance";
  purpose: string;
  date: string; // YYYY-MM-DD
  status: RequestStatus;
  requester?: string;
  vehicle?: string;
  driver?: string;
};

export type RequestsSummary = {
  pending: number;
  approved: number;
  completed: number;
  rejected: number;
};

export type FilterState = {
  status: "All" | RequestStatus;
  dept: "All" | "CCMS" | "HR" | "Registrar" | "Finance";
  from?: string;
  to?: string;
  search: string;
  mode: "auto" | "apply";
};

export type Pagination = {
  page: number; // 1-based
  pageSize: number; // rows per page
  total: number; // total filtered rows
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
