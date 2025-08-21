"use client";
import { useState } from "react";
import Link from "next/link";
import { PageHeader, PageBody } from "@/components/common/Page";

type Form = {
  purpose: string;
  start: string;         // datetime-local
  end: string;           // datetime-local
  pickup: string;
  destination: string;
  passengers: number | "";
  notes: string;
};

type Errors = Partial<Record<keyof Form, string>>;

const inputCls =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300";
const labelCls = "text-sm font-medium text-neutral-700";
const sectionCls = "rounded-lg border bg-white p-4";

export default function FacultyRequestPage() {
  const [form, setForm] = useState<Form>({
    purpose: "",
    start: "",
    end: "",
    pickup: "",
    destination: "",
    passengers: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const update = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = (f: Form): Errors => {
    const e: Errors = {};
    if (!f.purpose.trim()) e.purpose = "Purpose is required.";
    if (!f.start) e.start = "Start date/time is required.";
    if (!f.end) e.end = "End date/time is required.";
    if (f.start && f.end && new Date(f.end) <= new Date(f.start))
      e.end = "End must be after start.";
    if (!f.pickup.trim()) e.pickup = "Pickup location is required.";
    if (!f.destination.trim()) e.destination = "Destination is required.";
    if (f.passengers === "" || Number(f.passengers) <= 0)
      e.passengers = "Passengers must be at least 1.";
    return e;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    // Simulate an API request
    await new Promise((r) => setTimeout(r, 700));
    const fakeId = `REQ-${Math.floor(Math.random() * 90000) + 10000}`;
    setSubmittedId(fakeId);
    setSubmitting(false);

    // Reset minimal fields but keep some context
    setForm((f) => ({
      ...f,
      purpose: "",
      notes: "",
      passengers: "",
    }));
  };

  return (
    <>
      <PageHeader
        title="New Transport Request"
        description="Fill out the details below to request a vehicle. (Vehicle assignment handled by Admin.)"
        actions={
          <Link
            href="/faculty"
            className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
          >
            Back to Dashboard
          </Link>
        }
      />

      <PageBody>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
          {/* FORM */}
          <form onSubmit={onSubmit} className="space-y-4 min-w-0">
            {/* Trip info */}
            <section className={sectionCls}>
              <h2 className="mb-3 font-medium">Trip Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Purpose *</label>
                  <input
                    className={inputCls}
                    placeholder="e.g., Faculty meeting"
                    value={form.purpose}
                    onChange={(e) => update("purpose", e.target.value)}
                  />
                  {errors.purpose && (
                    <p className="mt-1 text-xs text-red-600">{errors.purpose}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Passengers *</label>
                  <input
                    type="number"
                    min={1}
                    className={inputCls}
                    placeholder="e.g., 12"
                    value={form.passengers}
                    onChange={(e) =>
                      update("passengers", e.target.value === "" ? "" : Number(e.target.value))
                    }
                  />
                  {errors.passengers && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.passengers}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Start (Pickup) *</label>
                  <input
                    type="datetime-local"
                    className={inputCls}
                    value={form.start}
                    onChange={(e) => update("start", e.target.value)}
                  />
                  {errors.start && (
                    <p className="mt-1 text-xs text-red-600">{errors.start}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>End (Return) *</label>
                  <input
                    type="datetime-local"
                    className={inputCls}
                    value={form.end}
                    onChange={(e) => update("end", e.target.value)}
                  />
                  {errors.end && (
                    <p className="mt-1 text-xs text-red-600">{errors.end}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Pickup Location *</label>
                  <input
                    className={inputCls}
                    placeholder="e.g., CCMS Building"
                    value={form.pickup}
                    onChange={(e) => update("pickup", e.target.value)}
                  />
                  {errors.pickup && (
                    <p className="mt-1 text-xs text-red-600">{errors.pickup}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Destination *</label>
                  <input
                    className={inputCls}
                    placeholder="e.g., City Hall"
                    value={form.destination}
                    onChange={(e) => update("destination", e.target.value)}
                  />
                  {errors.destination && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.destination}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className={labelCls}>Notes (optional)</label>
                  <textarea
                    rows={4}
                    className={inputCls}
                    placeholder="Anything the dispatcher should know?"
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Actions */}
            <section className={sectionCls}>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-[#7a0019] px-4 py-2 text-sm text-white hover:opacity-95 disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Submit Request"}
                </button>
                <button
                  type="button"
                  className="rounded-md border px-4 py-2 text-sm hover:bg-neutral-50"
                  onClick={() => {
                    setForm({
                      purpose: "",
                      start: "",
                      end: "",
                      pickup: "",
                      destination: "",
                      passengers: "",
                      notes: "",
                    });
                    setErrors({});
                    setSubmittedId(null);
                  }}
                >
                  Reset
                </button>
                <Link
                  href="/faculty"
                  className="rounded-md border px-4 py-2 text-sm hover:bg-neutral-50"
                >
                  Cancel
                </Link>

                {submittedId && (
                  <span className="ml-auto text-sm text-green-700">
                    Request <span className="font-semibold">{submittedId}</span> submitted!
                  </span>
                )}
              </div>
            </section>
          </form>

          {/* SUMMARY / PREVIEW */}
          <aside className="space-y-4">
            <section className="rounded-lg border bg-white p-4">
              <h3 className="font-medium mb-3">Summary</h3>
              <dl className="text-sm space-y-2">
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral-600">Purpose</dt>
                  <dd className="text-right">{form.purpose || "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral-600">Start</dt>
                  <dd className="text-right">{form.start || "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral-600">End</dt>
                  <dd className="text-right">{form.end || "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral-600">Pickup</dt>
                  <dd className="text-right">{form.pickup || "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral-600">Destination</dt>
                  <dd className="text-right">{form.destination || "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral-600">Passengers</dt>
                  <dd className="text-right">
                    {form.passengers === "" ? "—" : form.passengers}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-lg border bg-white p-4">
              <h3 className="font-medium mb-2">Heads-up</h3>
              <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-1">
                <li>Requests are subject to dispatcher approval.</li>
                <li>Vehicle will be assigned by Admin based on availability.</li>
                <li>Editing is allowed while status is <span className="font-medium">Pending</span>.</li>
              </ul>
            </section>
          </aside>
        </div>
      </PageBody>
    </>
  );
}
