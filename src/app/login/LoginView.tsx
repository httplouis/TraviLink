"use client";

import Link from "next/link";

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
    // lock screen & prevent page scroll
    <div className="fixed inset-0 flex flex-col font-sans bg-gradient-to-br from-gray-100 to-gray-200 h-dvh overflow-hidden">
    {/* Floating Help Button (bottom-left) */}
<button
  type="button"
  onClick={() => (window.location.href = "mailto:ictd@mseuf.edu.ph")}
  aria-label="Need Help?"
  className="group fixed bottom-6 left-8 z-50 grid place-items-center
             w-11 h-11 rounded-full bg-white text-red-900 shadow-md
             transition-transform duration-200 hover:scale-110 hover:shadow-lg
             focus-visible:scale-110"
>
  <span className="text-lg font-extrabold leading-none">?</span>

  {/* tooltip */}
  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2
                   rounded-md bg-red-900 text-white text-xs px-2 py-1
                   opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
    Need Help?
  </span>
</button>





      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Branding Strip */}
        <aside className="bg-red-900 text-white w-24 flex flex-col items-center py-8 shadow-lg">
          <div className="mb-8">
            <div className="bg-white rounded-full p-3 shadow-md">
              <div className="w-8 h-8 bg-red-900 rounded-full" />
            </div>
          </div>
          <div className="rotate-90 text-sm tracking-[0.3em] font-bold uppercase mt-16">
            TRAVILINK
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* LEFT information panel */}
          <section className="relative w-full lg:w-[55%] bg-white px-14 py-12 border-r border-gray-300 flex flex-col justify-between overflow-y-auto lg:overflow-hidden">
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 2a2 2 0 00-2 2v1h16V4a2 2 0 00-2-2H6zm14 5H4v11a2 2 0 002 2h12a2 2 0 002-2V7z" />
                  </svg>
                  Upcoming Reservation Dates
                </h2>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><strong>Aug 20–25:</strong> Faculty Conference Shuttle</li>
                  <li><strong>Sept 1–5:</strong> Student Organization Trip Slots</li>
                  <li><strong>Sept 12–15:</strong> University Sports Week Transport</li>
                </ul>
              </div>

              <div className="mb-10">
                <h2 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 5h18v14H3z" />
                  </svg>
                  Latest Transport Announcements
                </h2>
                <div className="grid gap-3 text-sm text-gray-700">
                  {[
                    "New electric shuttle buses arriving next month to reduce carbon emissions.",
                    "Reservation system maintenance: Aug 18, 12:00 AM–4:00 AM.",
                    "Peak hours reminder: Book rides at least 2 days in advance.",
                  ].map((news, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-md border hover:bg-gray-100 hover:shadow transition">
                      {news}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border hover:shadow transition">
                <h2 className="text-lg font-semibold mb-2 text-gray-900 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 11H5a2 2 0 00-2 2v6h18v-6a2 2 0 00-2-2zM7 9a5 5 0 0110 0v2H7z" />
                  </svg>
                  Data Privacy Notice
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  In compliance with RA 10173, all data is securely stored and
                  used solely for processing reservations and improving services.
                </p>
              </div>
            </div>

            {/* Removed the old "Need Help?" section */}
          </section>

          {/* RIGHT: login card with image background behind it */}
         <section
  className="w-full lg:w-[45%] relative flex items-center justify-center overflow-hidden"
  style={{
    backgroundImage: "url('/pattern-light.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
            {/* dark overlay for readability */}
            <div className="absolute inset-0 bg-black/65" />

            <form
              onSubmit={onSubmit}
              className="relative bg-white shadow-4xl rounded-xl p-10 w-96 border border-gray-200 z-10"
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
                <a href="#" className="text-red-900 hover:underline font-medium">Reset Password</a>{" "}
                |{" "}
                <Link href="/register" className="text-red-900 hover:underline font-medium">
                  Register Account
                </Link>
              </div>
            </form>
          </section>
        </main>
      </div>

      {/* Classy maroon footer */}
<footer className="w-full bg-red-900 text-white">
  <div className="mx-auto max-w-6xl px-4 py-1.5 text-center text-[11px] tracking-wide">
    © {new Date().getFullYear()} TraviLink · Enverga University
  </div>
</footer>



    </div>
  );
}
