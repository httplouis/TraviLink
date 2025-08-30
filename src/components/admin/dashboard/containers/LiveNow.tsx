"use client";
import LiveNowUI from "../ui/LiveNowUI";
export default function LiveNow() {
  return <LiveNowUI driversOnDuty={4} trips={[
    { vehicle: "Bus 1", driver: "J. Rosales", eta: "10:35", delay: 3 },
    { vehicle: "Van 2", driver: "M. Santos", eta: "11:10" },
  ]} />;
}
