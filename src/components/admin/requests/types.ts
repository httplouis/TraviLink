export type RequestStatus = "Pending" | "Approved" | "Completed" | "Rejected";

export type RequestRow = {
  id: string;
  dept: "CCMS" | "HR" | "Registrar" | "Finance";
  purpose: string;
  date: string; // ISO (YYYY-MM-DD)
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
  // high-signal filters shown as controls
  status: "All" | RequestStatus;
  dept: "All" | "CCMS" | "HR" | "Registrar" | "Finance";
  from?: string; // ISO
  to?: string;   // ISO
  search: string;

  // advanced logic toggles (extensible)
  mode: "auto" | "apply"; // auto = live as you type; apply = needs Apply
};

export type FiltersChange = {
  draft: FilterState;      // currently edited (not yet applied if mode=apply)
  applied: FilterState;    // actually applied to the table
  activeCount: number;     // number of active non-default filters
};
