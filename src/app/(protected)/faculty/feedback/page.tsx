"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader, PageBody } from "@/components/common/Page";
// Update the import path if the actual file is named 'feedbackView.tsx' (lowercase 'f'), or adjust to the correct path and casing.
import FeedbackView from "@/components/faculty/feedback/FeedbackView";

/* ------------ Types used only by the container ------------ */
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

/* ------------ Simple validators (can be moved to utils) ------------ */
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);

    // TODO: replace with real API call — e.g., POST /api/feedback
    await new Promise((r) => setTimeout(r, 700));

    setSubmitting(false);
    setSuccessId(`FB-${Math.floor(Math.random() * 90000) + 10000}`);

    // keep contact preference; clear other fields
    setForm((f) => ({
      ...f,
      category: "",
      rating: 0,
      subject: "",
      message: "",
      attachment: null,
    }));
  };

  const onReset = () => {
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
  };

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
        <FeedbackView
          /* values */
          category={form.category}
          rating={form.rating}
          subject={form.subject}
          message={form.message}
          anonymous={form.anonymous}
          contact={form.contact}
          attachmentName={form.attachment?.name ?? ""}
          /* errors */
          errors={errors}
          /* flags */
          submitting={submitting}
          successId={successId}
          /* handlers */
          onChangeCategory={(v) => update("category", v)}
          onChangeRating={(v) => update("rating", v)}
          onChangeSubject={(v) => update("subject", v)}
          onChangeMessage={(v) => update("message", v)}
          onToggleAnonymous={(v) => update("anonymous", v)}
          onChangeContact={(v) => update("contact", v)}
          onFile={(file?: File | undefined) => update("attachment", file ?? null)}
          onSubmit={onSubmit}
          onReset={onReset}
        />
      </PageBody>
    </>
  );
}
