import type { DashboardData } from "../types";

const API_BASE = process.env.NEXT_PUBLIC_TRAVILINK_API_URL || "http://localhost:4000";

export async function getDashboardData(): Promise<DashboardData> {
  const [kpis, trend, status, recent] = await Promise.all([
    fetchJSON(`${API_BASE}/admin/kpis`),
    fetchJSON(`${API_BASE}/admin/requests/trend?days=8`),
    fetchJSON(`${API_BASE}/admin/requests/status`),
    fetchJSON(`${API_BASE}/admin/requests/recent?limit=50`),
  ]);
  return { kpis, requestsByDay: trend, statusBreakdown: status, recentRequests: recent };
}

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, cache: "no-store" });
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  return res.json() as Promise<T>;
}
