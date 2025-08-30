"use client";
type Item = { label: string; count: number; tone?: "warn"|"bad" };
export default function HealthRailUI({ items }: { items: Item[] }) {
  const tone = (t?: Item["tone"]) => t==="bad" ? "bg-red-50 border-red-200" : t==="warn" ? "bg-amber-50 border-amber-200" : "bg-neutral-50 border-neutral-200";
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className={`rounded-md border px-3 py-2 text-sm ${tone(it.tone)}`}>
          <span className="font-medium">{it.label}</span>
          <span className="float-right rounded-full border bg-white px-2 text-xs">{it.count}</span>
        </div>
      ))}
    </div>
  );
}
