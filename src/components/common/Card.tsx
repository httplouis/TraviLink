"use client";

export default function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 md:p-6 shadow-sm">
      <h2 className="text-[15px] md:text-base font-semibold mb-3 md:mb-4">{title}</h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
