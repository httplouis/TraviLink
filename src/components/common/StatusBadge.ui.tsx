"use client";
export function StatusBadge({ value }: { value: string }) {
  const cls =
    value === "active"
      ? "bg-green-100 text-green-700"
      : value === "maintenance"
      ? "bg-amber-100 text-amber-700"
      : "bg-gray-200 text-gray-700";
  return <span className={`rounded-full px-2 py-0.5 text-xs ${cls}`}>{value}</span>;
}
