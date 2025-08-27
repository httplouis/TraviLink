"use client";

type StatProps = { value: number | string; label: string };

function Stat({ value, label }: StatProps) {
  return (
    <div className="rounded-xl border bg-white px-4 py-3 text-center">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs text-neutral-500">{label}</div>
    </div>
  );
}

export default function ProfileRail() {
  // static demo values — palitan mo kung may real data na
  const name = "Jolo Rosales";
  const code = "FAC-11234";
  const campus = "Lucena Campus";

  return (
    <div className="space-y-4">
      {/* maroon profile header */}
      <section className="rounded-2xl bg-[#7a0019] text-white p-4 shadow">
        <div className="text-xs opacity-90">PROFILE • FACULTY</div>
        <div className="mt-1 text-xl font-bold leading-tight">{name}</div>
        <div className="text-sm opacity-90">Code: {code}</div>
        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
          {campus}
        </div>
      </section>

      {/* quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <Stat value={5} label="Active Requests" />
        <Stat value={3} label="Vehicles Online" />
        <Stat value={4} label="Pending" />
      </div>
    </div>
  );
}
