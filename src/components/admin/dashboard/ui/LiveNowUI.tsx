"use client";
type LiveTrip = { vehicle: string; driver: string; eta: string; delay?: number };
export default function LiveNowUI({ trips, driversOnDuty }: { trips: LiveTrip[]; driversOnDuty: number; }) {
  return (
    <div className="rounded-lg border p-3 bg-white">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Live now</div>
        <div className="text-sm text-neutral-600">{driversOnDuty} drivers on duty</div>
      </div>
      <ul className="mt-2 divide-y">
        {trips.map((t, i) => (
          <li key={i} className="py-2 text-sm flex items-center justify-between">
            <div>
              <div className="font-medium">{t.vehicle}</div>
              <div className="text-neutral-500">Driver: {t.driver}</div>
            </div>
            <div className="text-right">
              <div>ETA {t.eta}</div>
              {t.delay ? <div className="text-red-600 text-xs">+{t.delay} mins</div> : <div className="text-emerald-600 text-xs">on time</div>}
            </div>
          </li>
        ))}
      </ul>
      <button className="mt-2 h-9 rounded-md border px-3 text-sm hover:bg-neutral-50">Dispatch</button>
    </div>
  );
}
