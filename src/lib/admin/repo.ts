import type { DashboardData } from "./types";
import { getDashboardData as getMock } from "./adapters/mock";
// import { getDashboardData as getReal } from "./adapters/real";

const USE_MOCK = process.env.NEXT_PUBLIC_TRAVILINK_USE_MOCK !== "false";

export async function getDashboardData(): Promise<DashboardData> {
  if (USE_MOCK) return getMock();
  // return getReal();
  return getMock();
}


import { getRequestsData as mockRequests } from "./adapters/mock";

export async function getRequestsData() {
  // later: switch to real API here
  return mockRequests();
}

