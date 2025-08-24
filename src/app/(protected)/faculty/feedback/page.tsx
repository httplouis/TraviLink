"use client";
import { useState } from "react";
import Link from "next/link";
import { PageHeader, PageBody } from "@/components/common/Page";

type Form = {
  category: string;
  rating: number;         // 0–5
  subject: string;
  message: string;
  anonymous: boolean;
  contact: string;        // email or phone (optional if anonymous)
  attachment?: File | null;
};

type Errors = Partial<Record<keyof Form, string>>;

const section = "rounded-lg border bg-white p-4";
const input = "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300";
const label = "text-sm font-medium text-neutral-700";
const hint = "text-xs text-neutral-500";

export default function FacultyFeedbackPage() {
  const [form, setForm] = useState<Form>({
    category: "",
    rating: 0,
    subject: "",
    message: "",
    anonymous: false,
    contact: "",
    attachment: null,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  const update = <K extends keyof Form>(key: K, val: Form[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhone = (v: string) => /^(\+?\d{10,15}|0\d{9,10})$/.test(v.replace(/\s|-/g, ""));

  const validate = (f: Form): Errors => {
    const e: Errors = {};
    if (!f.category) e.category = "Please pick a category.";
    if (!f.message.trim() || f.message.trim().length < 10) e.message = "Please write at least 10 characters.";
    if (!f.anonymous && f.contact.trim() && !(isEmail(f.contact) || isPhone(f.contact))) {
      e.contact = "Enter a valid email or phone, or leave blank.";
    }
    return e;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    // Simulated API call
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSuccessId(`FB-${Math.floor(Math.random() * 90000) + 10000}`);

    // keep contact preference for next time; clear other fields
    setForm((f) => ({
      ...f,
      category: "",
      rating: 0,
      subject: "",
      message: "",
      attachment: null,
    }));
  };

  const onFile = (file?: File) => update("attachment", file ?? null);

  return (
    <>
      <PageHeader
        title="Feedback"
        description="Send feedback about the transport service."
        actions={
          <Link href="/faculty" className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50">
            Back to Dashboard
          </Link>
        }
      />

      <PageBody>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
          {/* LEFT: FORM */}
          <form onSubmit={onSubmit} className="space-y-4 min-w-0">
            <section className={section}>
              <h2 className="mb-3 font-medium">Tell us more</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Category */}
                <div>
                  <label className={label}>Category *</label>
                  <select
                    className={input}
                    value={form.category}
                    onChange={(e) => update("category", e.target.value)}
                  >
                    <option value="">Select…</option>
                    <option>Bug</option>
                    <option>Feature Request</option>
                    <option>Driver Experience</option>
                    <option>Schedule / Booking</option>
                    <option>App UI/UX</option>
                    <option>Other</option>
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
                </div>

                {/* Rating */}
                <div>
                  <label className={label}>Rating (optional)</label>
                  <Stars value={form.rating} onChange={(v) => update("rating", v)} />
                  <p className={hint}>How was your overall experience? 1–5 stars.</p>
                </div>

                {/* Subject */}
                <div className="md:col-span-2">
                  <label className={label}>Subject (optional)</label>
                  <input
                    className={input}
                    placeholder="e.g., Request form is confusing"
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                  />
                </div>

                {/* Message */}
                <div className="md:col-span-2">
                  <label className={label}>Message *</label>
                  <textarea
                    rows={6}
                    className={input}
                    placeholder="Describe the issue or suggestion in detail…"
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
                </div>

                {/* Attachment */}
                <div>
                  <label className={label}>Attachment (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm"
                    onChange={(e) => onFile(e.target.files?.[0])}
                  />
                  <p className={hint}>Add a screenshot/photo (PNG/JPG), max ~2MB.</p>
                  {form.attachment && (
                    <p className="mt-1 text-xs text-neutral-600">Selected: {form.attachment.name}</p>
                  )}
                </div>

                {/* Identity */}
                <div className="space-y-1">
                  <label className={label}>Identity & contact</label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.anonymous}
                      onChange={(e) => update("anonymous", e.target.checked)}
                    />
                    Submit anonymously
                  </label>
                  {!form.anonymous && (
                    <>
                      <input
                        className={`${input} mt-2`}
                        placeholder="Your email or phone (optional)"
                        value={form.contact}
                        onChange={(e) => update("contact", e.target.value)}
                      />
                      {errors.contact && <p className="mt-1 text-xs text-red-600">{errors.contact}</p>}
                      <p className={hint}>We’ll contact you if we need more details.</p>
                    </>
                  )}
                </div>
              </div>
            </section>

            <section className={section}>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-[#7a0019] px-4 py-2 text-sm text-white hover:opacity-95 disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send Feedback"}
                </button>
                <button
                  type="button"
                  className="rounded-md border px-4 py-2 text-sm hover:bg-neutral-50"
                  onClick={() => {
                    setForm({
                      category: "",
                      rating: 0,
                      subject: "",
                      message: "",
                      anonymous: false,
                      contact: "",
                      attachment: null,
                    });
                    setErrors({});
                    setSuccessId(null);
                  }}
                >
                  Reset
                </button>

                {successId && (
                  <span className="ml-auto text-sm text-green-700">
                    Thanks! Feedback <span className="font-semibold">{successId}</span> submitted.
                  </span>
                )}
              </div>
            </section>
          </form>

          {/* RIGHT: Tips */}
          <aside className="space-y-4">
            <section className="rounded-lg bg-[#5c0013] text-white p-4">
              <div className="text-lg font-semibold">We’re listening </div>
              <p className="mt-1 text-sm opacity-90">
                Your feedback helps improve scheduling, notifications, and trip coordination.
              </p>
              <ul className="mt-3 text-sm space-y-1 opacity-90 list-disc pl-5">
                <li>Include dates and request IDs when relevant.</li>
                <li>Attach screenshots for UI problems.</li>
                <li>Suggest how we can make it better.</li>
              </ul>
            </section>

            <section className={section}>
              <h3 className="font-medium mb-2">What happens next?</h3>
              <ol className="list-decimal pl-5 text-sm text-neutral-700 space-y-1">
                <li>We log your feedback for review.</li>
                <li>Admins may reach out if more info is needed.</li>
                <li>Fixes and improvements appear in release notes.</li>
              </ol>
            </section>
          </aside>
        </div>
      </PageBody>
    </>
  );
}

/* ---------------- Stars (no extra deps) ---------------- */
function Stars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
          onClick={() => onChange(i === value ? 0 : i)}
          className={`h-8 w-8 grid place-items-center rounded hover:bg-neutral-100 ${i <= value ? "text-amber-500" : "text-neutral-300"}`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.786 1.401 8.163L12 18.897l-7.335 3.863 1.401-8.163L.132 9.211l8.2-1.193z"/>
          </svg>
        </button>
      ))}
    </div>
  );
}
