"use client";
import MapSnapshotUI from "../ui/MapSnapshotUI";
export default function MapSnapshot() {
  return <MapSnapshotUI items={[
    { name: "Bus 1", status: "On Trip" },
    { name: "Bus 3", status: "On Trip" },
    { name: "Van 1", status: "Maintenance" },
  ]} />;
}
