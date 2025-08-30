"use client";
import KpiTilesUI from "../ui/KpiTilesUI";
export default function KpiTiles() {
  const items = [
    { label: "Pending approvals", value: "5", tone: "warn" as const },
    { label: "Trips today", value: "12", sub: "10 on-time / 2 delayed", tone: "ok" as const },
    { label: "Vehicles available", value: "8", sub: "1 under maintenance" },
    { label: "Active drivers", value: "6" },
    { label: "Incidents", value: "0", tone: "ok" as const },
    { label: "7-day requests", value: "42" },
  ];
  return <KpiTilesUI items={items} />;
}
