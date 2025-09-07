// src/components/admin/dashboard/KpiTile.tsx
"use client";

type Props = {
  label: string;
  value: number | string;
  sub?: string;
};

export default function KpiTile({ label, value, sub }: Props) {
  return (
    <div className="tl-card p-4">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {sub ? <div className="text-xs text-neutral-500 mt-0.5">{sub}</div> : null}
    </div>
  );
}
