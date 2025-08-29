import { PageHeader, PageBody } from "@/components/common/Page";
import type { VehicleId } from "@/lib/maintenance";

export type Mode = "builtin" | "custom";
export type RepeatMode = "one" | "repeat";

type VehicleOpt = { id: VehicleId; label: string };

type Props = {
  editing: boolean;
  vehicles: VehicleOpt[];
  mode: Mode;
  setMode: (m: Mode) => void;
  builtinType: string;
  setBuiltinType: (v: string) => void;
  customType: string;
  setCustomType: (v: string) => void;
  vehicle: VehicleId;
  setVehicle: (v: VehicleId) => void;
  date: string;
  setDate: (v: string) => void;
  repeatMode: RepeatMode;
  setRepeatMode: (v: RepeatMode) => void;
  intervalMonths: number | "";
  setIntervalMonths: (v: number | "") => void;
  notes: string;
  setNotes: (v: string) => void;
  builtinOptions: string[];
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function SubmitView({
  editing,
  vehicles,
  mode, setMode,
  builtinType, setBuiltinType,
  customType, setCustomType,
  vehicle, setVehicle,
  date, setDate,
  repeatMode, setRepeatMode,
  intervalMonths, setIntervalMonths,
  notes, setNotes,
  builtinOptions,
  onCancel, onSubmit,
}: Props) {
  return (
    <>
      <PageHeader
        title={editing ? "Edit maintenance" : "Submit a maintenance"}
        description="Schedule or report a maintenance item for a vehicle."
      />
      <PageBody>
        <form
          onSubmit={onSubmit}
          className="rounded-xl ring-1 ring-neutral-200/70 bg-white shadow-sm p-4 space-y-4 max-w-xl"
        >
          {/* Vehicle + Date */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <div className="text-sm font-medium mb-1">Vehicle</div>
              <select
                className="w-full rounded-lg border border-neutral-200 px-3 py-2"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value as VehicleId)}
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <div className="text-sm font-medium mb-1">Date</div>
              <input
                type="date"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
          </div>

          {/* Type: built-in or custom */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <div className="text-sm font-medium mb-1">Type source</div>
              <select
                className="w-full rounded-lg border border-neutral-200 px-3 py-2"
                value={mode}
                onChange={(e) => setMode(e.target.value as Mode)}
              >
                <option value="builtin">Built-in</option>
                <option value="custom">Custom</option>
              </select>
            </label>

            {mode === "builtin" ? (
              <label className="block">
                <div className="text-sm font-medium mb-1">Built-in type</div>
                <select
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2"
                  value={builtinType}
                  onChange={(e) => setBuiltinType(e.target.value)}
                >
                  {builtinOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
            ) : (
              <label className="block">
                <div className="text-sm font-medium mb-1">Custom type</div>
                <input
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2"
                  placeholder="e.g., Engine Diagnostics"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                />
              </label>
            )}
          </div>

          {/* Repeat */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <div className="text-sm font-medium mb-1">When</div>
              <select
                className="w-full rounded-lg border border-neutral-200 px-3 py-2"
                value={repeatMode}
                onChange={(e) => setRepeatMode(e.target.value as any)}
              >
                <option value="one">One-time (no interval)</option>
                <option value="repeat">Repeats every…</option>
              </select>
            </label>

            <label className="block">
              <div className="text-sm font-medium mb-1">Interval (months)</div>
              <input
                type="number"
                min={1}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 disabled:bg-neutral-50"
                placeholder="e.g., 3"
                value={repeatMode === "repeat" ? (intervalMonths as number | "") : ""}
                onChange={(e) => {
                  const v = e.target.value;
                  setIntervalMonths(v === "" ? "" : Number(v));
                }}
                disabled={repeatMode !== "repeat"}
              />
            </label>
          </div>

          {/* Notes */}
          <label className="block">
            <div className="text-sm font-medium mb-1">Notes (optional)</div>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2"
              placeholder="Any details…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>

          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-outline" onClick={onCancel}>
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              {editing ? "Save changes" : "Submit"}
            </button>
          </div>
        </form>
      </PageBody>
    </>
  );
}
