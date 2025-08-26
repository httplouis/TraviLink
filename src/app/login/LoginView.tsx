"use client";

import Link from "next/link";
import styles from "./login.module.css";

type Props = {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  loading: boolean;
  err: string | null;
  onSubmit: (e: React.FormEvent) => void;
};

export default function LoginView({
  email,
  password,
  setEmail,
  setPassword,
  loading,
  err,
  onSubmit,
}: Props) {
  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Sidebar Branding Strip */}
      <aside className="bg-red-900 text-white w-24 flex flex-col items-center py-8 shadow-lg">
        <div className="mb-8">
          <div className="bg-white rounded-full p-3 shadow-md">
            <div className="w-8 h-8 bg-red-900 rounded-full" />
          </div>
        </div>
        <div className="rotate-90 text-sm tracking-[0.3em] font-bold uppercase mt-16">
          TraviLink
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Information Section */}
        <section className="relative w-full lg:w-[55%] bg-white px-14 py-12 border-r border-gray-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern-light.png')] opacity-10 pointer-events-none" />

          <div className="flex-1 relative z-10">
            <div className="mb-10">
              <h1 className="text-5xl font-extrabold text-red-900 tracking-tight drop-shadow-sm">
                TraviLink
              </h1>
              <p className="text-gray-700 mt-3 text-lg italic">
                University Vehicle Scheduling & Reservation Portal
              </p>
            </div>

            <p className="text-base text-gray-700 leading-relaxed mb-10 max-w-xl border-l-4 border-red-900 pl-4 bg-red-50/30 rounded-md">
              Schedule and reserve university transportation with ease. Stay
              informed about vehicle availability, guidelines, and campus
              transport updates.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 mb-8 rounded-md shadow-sm hover:shadow-md transition-all">
              <h2 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Upcoming Reservation Dates
              </h2>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  <strong>Aug 20–25:</strong> Faculty Conference Shuttle
                </li>
                <li>
                  <strong>Sept 1–5:</strong> Student Organization Trip Slots
                </li>
                <li>
                  <strong>Sept 12–15:</strong> University Sports Week Transport
                </li>
              </ul>
            </div>

            <div className="mb-10">
              <h2 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 20H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v11a2 2 0 01-2 2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 10h10M7 14h7"
                  />
                </svg>
                Latest Transport Announcements
              </h2>
              <div className="grid gap-3 text-sm text-gray-700">
                {[
                  "New electric shuttle buses arriving next month to reduce carbon emissions.",
                  "Reservation system maintenance: Aug 18, 12:00 AM–4:00 AM.",
                  "Peak hours reminder: Book rides at least 2 days in advance.",
                ].map((news, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-md border hover:bg-gray-100 hover:shadow transition"
                  >
                    {news}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md border hover:shadow transition">
              <h2 className="text-lg font-semibold mb-2 text-gray-900 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <rect
                    x="5"
                    y="11"
                    width="14"
                    height="10"
                    rx="2"
                    ry="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 018 0v4" />
                </svg>
                Data Privacy Notice
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                In compliance with RA 10173, all data is securely stored and
                used solely for processing reservations and improving services.
              </p>
            </div>
          </div>

          <div className="mt-10 border-t pt-5 text-sm relative z-10">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">Need Help?</h2>
            <p className="text-gray-700 leading-relaxed">
              For assistance, email:
              <br />
              <span className="text-red-900 font-semibold">ictd@mseuf.edu.ph</span>
            </p>
          </div>
        </section>

        {/* Right Login Section */}
        <section
          className={`w-full lg:w-[45%] flex items-center justify-center relative ${styles.hero}`}
        >
          <div className="absolute inset-0 bg-black/40" />

          <form
            onSubmit={onSubmit}
            className="relative bg-white shadow-2xl rounded-xl p-10 w-96 border border-gray-200 z-10"
          >
            <div className="flex items-center gap-2 mb-6">
              <img src="/eulogo.png" alt="Enverga University Logo" className="w-20 h-20" />
              <h3 className="font-extrabold text-red-900 tracking-tight text-3xl leading-none uppercase">
                <span className="block">Enverga</span>
                <span className="block">University</span>
              </h3>
            </div>

            <h2 className="text-xl font-bold border-b pb-3 mb-6 text-gray-800">User Login</h2>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 focus:ring-2 focus:ring-red-900 focus:border-red-900 p-3 rounded-md outline-none text-sm shadow-sm text-gray-900 placeholder-gray-400"
                placeholder="you@mseuf.edu.ph"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 focus:ring-2 focus:ring-red-900 focus:border-red-900 p-3 rounded-md outline-none text-sm shadow-sm text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            {err && <p className="text-sm text-red-600 mb-3">{err}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-red-900 text-white w-full py-3 rounded-md hover:bg-red-800 transition-all font-medium text-sm shadow-md disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <div className="text-xs mt-5 text-center text-gray-600">
              <a href="#" className="text-red-900 hover:underline font-medium">
                Reset Password
              </a>{" "}
              |{" "}
              <Link href="/register" className="text-red-900 hover:underline font-medium">
                Register Account
              </Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
