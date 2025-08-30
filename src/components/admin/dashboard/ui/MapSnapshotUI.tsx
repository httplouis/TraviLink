"use client";
// Placeholder mini-map box. Replace with your map lib when ready.
export default function MapSnapshotUI({ items }: { items: { name: string; status: string }[] }) {
  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="font-semibold mb-2">Map snapshot</div>
      <div className="h-40 rounded-md bg-[linear-gradient(90deg,#f3f4f6_1px,transparent_1px),linear-gradient(#f3f4f6_1px,transparent_1px)] bg-[size:16px_16px] grid place-items-center text-neutral-500">
        (mini map placeholder)
      </div>
      <ul className="mt-2 text-sm">
        {items.map((it, i) => (
          <li key={i} className="flex items-center justify-between py-1">
            <span>{it.name}</span><span className="text-xs rounded-full border px-2">{it.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
