import Image from "next/image";

export const metadata = { title: "Privacy • TraviLink" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold text-red-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-neutral-700">
        How we collect, use, and protect your data (RA 10173 compliant)…
      </p>

      {/* Centered placeholder image (not full screen) */}
      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-xl rounded-xl overflow-hidden shadow-md border">
          <Image
            src="/monkey-1.jpg"     // ← put this in /public
            alt="Privacy"
            width={1200}                 // intrinsic size (keeps quality)
            height={675}                 // ~16:9
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </div>

      {/* Body */}
      <section className="prose prose-sm mt-8">
        <h2>Introduction</h2>
        <p>/* TODO: fill in real policy content */</p>
      </section>
    </main>
  );
}
