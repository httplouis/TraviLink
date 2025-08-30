"use client";
import HealthRailUI from "../ui/HealthRailUI";
export default function HealthRail() {
  return <HealthRailUI items={[
    { label: "Expiring licenses (30d)", count: 2, tone: "warn" },
    { label: "OR/CR renewals", count: 1 },
    { label: "PM due this week", count: 1, tone: "warn" },
    { label: "Policy breaches", count: 0 },
  ]} />;
}
