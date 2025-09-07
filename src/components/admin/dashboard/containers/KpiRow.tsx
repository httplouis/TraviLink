type KPI = { label: string; value: string; caption?: string };

export default function KpiRow({ items }: { items: KPI[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((k) => (
        <div key={k.label} className="rounded-lg border bg-white p-4">
          <div className="text-xs text-neutral-500">{k.label}</div>
          <div className="mt-1 text-2xl font-semibold">{k.value}</div>
          {k.caption && <div className="mt-1 text-xs text-neutral-500">{k.caption}</div>}
        </div>
      ))}
    </div>
  );
}
