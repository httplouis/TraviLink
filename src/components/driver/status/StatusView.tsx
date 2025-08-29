import Link from "next/link";
import { PageHeader, PageBody } from "@/components/common/Page";
import { DRIVER_STATUSES, DriverStatus } from "@/app/types/driver";
import { StatusIcon, tone } from "@/lib/data/driverStatus";

type Props = {
  status: DriverStatus;
  onChange: (s: DriverStatus) => void;
  onSave?: () => void;
  onViewHistoryHref?: string;     // or use onViewHistory?: () => void
};

export default function StatusView({ status, onChange, onSave, onViewHistoryHref="/driver/history" }: Props) {
  return (
    <>
      <PageHeader
        title="Update Driver Status"
        description="Select your current availability for trips."
        actions={
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={onSave}>Save</button>
            <Link className="btn btn-outline" href={onViewHistoryHref}>View History</Link>
          </div>
        }
      />

      <PageBody>
        <section className="rounded-xl ring-1 ring-neutral-200/70 bg-white shadow-sm">
          <div className="border-b border-neutral-200/80 px-4 py-3">
            <h2 className="font-medium">Current Status</h2>
            <p className="text-sm text-neutral-600">
              You are currently marked as:
              <span className={`ml-2 rounded px-2 py-0.5 text-xs ${tone(status)}`}>{status}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-5">
            {DRIVER_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => onChange(s)}
                className={`flex flex-col items-center justify-center gap-2 rounded-lg border px-3 py-4 text-sm transition 
                  ${status === s ? "border-[#7a0019] bg-neutral-50 font-semibold" : "border-neutral-200 hover:bg-neutral-50"}`}
              >
                <StatusIcon s={s} />
                {s}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-xl ring-1 ring-neutral-200/70 bg-white shadow-sm">
          <div className="border-b border-neutral-200/80 px-4 py-3">
            <h2 className="font-medium">Quick Actions</h2>
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <button className="rounded-lg border border-neutral-200 bg-white p-4 text-left hover:border-[#7a0019] hover:bg-neutral-50" onClick={() => onChange("Available")}>
              <p className="font-medium">Start Shift</p>
              <p className="text-sm text-neutral-600">Set as Available</p>
            </button>
            <button className="rounded-lg border border-neutral-200 bg-white p-4 text-left hover:border-[#7a0019] hover:bg-neutral-50" onClick={() => onChange("On Trip")}>
              <p className="font-medium">Begin Trip</p>
              <p className="text-sm text-neutral-600">Mark as On Trip</p>
            </button>
            <button className="rounded-lg border border-neutral-200 bg-white p-4 text-left hover:border-[#7a0019] hover:bg-neutral-50" onClick={() => onChange("Off Duty")}>
              <p className="font-medium">Take Break</p>
              <p className="text-sm text-neutral-600">Switch to Off Duty</p>
            </button>
          </div>
        </section>
      </PageBody>
    </>
  );
}
