"use client";

import Link from "next/link";
import React from "react";

type Props = {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  loading: boolean;
  err: string | null;
  onSubmit: (e: React.FormEvent) => void;
};

/* Bigger + clearer inputs */
const Input = (props: React.ComponentProps<"input">) => (
  <input
    {...props}
    autoComplete="off"
    className={
      "w-full h-12 border border-gray-300/90 bg-white/95 " +
      "rounded-lg px-4 pr-4 outline-none text-[15px] shadow-sm text-gray-900 placeholder-gray-500 " +
      "focus:ring-2 focus:ring-red-900/80 focus:border-red-900 " +
      "transition-all"
      + (props.className ? " " + props.className : "")
    }
  />
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[14px] font-semibold text-gray-800 mb-1.5">
    {children}
  </label>
);

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
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/pattern-light.jpg')" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/60" />

      {/* Floating Help Button */}
      <button
        type="button"
        onClick={() => (window.location.href = "mailto:ictd@mseuf.edu.ph")}
        aria-label="Need Help?"
        className="group fixed bottom-6 left-8 z-50 grid place-items-center
                   w-12 h-12 rounded-full bg-white text-red-900 shadow-md
                   transition-transform duration-200 hover:scale-110 hover:shadow-lg
                   focus-visible:scale-110"
      >
        <span className="text-lg font-extrabold leading-none">?</span>
        <span
          className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2
                     rounded-md bg-red-900 text-white text-xs px-2 py-1
                     opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
        >
          Need Help?
        </span>
      </button>

      {/* Centered Card + Footer */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl">
          <div className="bg-white/98 supports-[backdrop-filter]:backdrop-blur-md
                          rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.18)]
                          ring-1 ring-black/10 border border-white/70">
            <div className="px-10 pt-8 pb-8">
              {/* Header (bigger logo + stacked name, subtitle under) */}
              <div className="flex items-center gap-5">
                <img
                  src="/eulogo.png"
                  alt="Enverga University Logo"
                  className="w-20 h-20 md:w-24 md:h-24"
                />
                <div className="leading-tight">
                  <h1 className="font-extrabold text-red-900 tracking-tight leading-tight">
                    <span className="block text-[28px] md:text-[32px]">
                      Enverga
                    </span>
                    <span className="block text-[28px] md:text-[32px]">
                      University
                    </span>
                  </h1>
                  <p className="text-[13px] md:text-[14px] text-gray-600 mt-1">
                    TraviLink · Scheduling & Reservations
                  </p>
                </div>
              </div>

              <div className="h-px bg-gray-200/80 my-6" />

              <h2 className="text-[20px] font-bold text-gray-900 mb-4">
                User Login
              </h2>

              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <Label>Email</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {/* email icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 2v.01L12 11 4 6.01V6h16zM4 18V8.236l8 4.999 8-5V18H4z"/>
                      </svg>
                    </span>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@mseuf.edu.ph"
                      required
                      className="pl-11"
                    />
                  </div>
                </div>

                <div>
                  <Label>Password</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {/* lock icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 016 0v3H9z" />
                      </svg>
                    </span>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="pl-11 placeholder:tracking-widest placeholder:[letter-spacing:.35em]"
                    />
                  </div>
                </div>

                {err && (
                  <p role="alert" aria-live="polite" className="text-[13px] text-red-600">
                    {err}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-lg text-[15px] font-semibold text-white
                             bg-gradient-to-b from-red-900 to-red-800
                             shadow-sm hover:shadow transition-all
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white
                             active:scale-[0.99] disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Login"}
                </button>

                <div className="text-[13px] text-center text-gray-700">
                  <a href="#" className="text-red-900 underline-offset-4 hover:underline font-medium">
                    Reset Password
                  </a>{" "}
                  ·{" "}
                  <Link href="/register" className="text-red-900 underline-offset-4 hover:underline font-medium">
                    Register Account
                  </Link>
                </div>

                <div className="text-[12px] text-center text-gray-600">
                  <Link href="/privacy" className="hover:text-red-900 underline-offset-4 hover:underline">
                    Privacy
                  </Link>{" "}
                  •{" "}
                  <Link href="/terms" className="hover:text-red-900 underline-offset-4 hover:underline">
                    Terms
                  </Link>{" "}
                  •{" "}
                  <Link href="/contact" className="hover:text-red-900 underline-offset-4 hover:underline">
                    Contact
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Footer right under the card */}
          <p className="mt-4 text-center text-[12px] text-gray-700">
            © {new Date().getFullYear()} TraviLink · Enverga University
          </p>
        </div>
      </div>
    </div>
  );
}
