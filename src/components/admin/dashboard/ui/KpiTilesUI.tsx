"use client";
type KPI = { label: string; value: string; sub?: string; tone?: "ok"|"warn"|"bad" };
export default function KpiTilesUI({ items }: { items: KPI[] }) {
  const tone = (t?: KPI["tone"]) =>
    t === "ok" ? "border-emerald-200 bg-emerald-50"
    : t === "warn" ? "border-amber-200 bg-amber-50"
    : t === "bad" ? "border-red-200 bg-red-50"
    : "border-neutral-200 bg-white";
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {items.map((k, i) => (
        <div key={i} className={`rounded-lg border ${tone(k.tone)} p-3`}>
          <div className="text-xs text-neutral-500">{k.label}</div>
          <div className="text-2xl font-semibold leading-tight">{k.value}</div>
          {k.sub && <div className="text-[11px] text-neutral-500 mt-1">{k.sub}</div>}
        </div>
      ))}
    </div>
  );
}
