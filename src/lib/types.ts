export type TripRequestStatus = "pending" | "approved" | "rejected" | "cancelled";
export type TripRequest = {
  id: string;
  user_id: string;
  purpose: string;
  origin: string;
  destination: string;
  schedule: string; // timestamptz ISO
  passengers?: number | null;
  notes?: string | null;
  status: TripRequestStatus;
  created_at: string;
  start_time?: string | null;
  end_time?: string | null;
  updated_at?: string | null;
};
