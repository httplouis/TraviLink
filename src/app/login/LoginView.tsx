"use client";

import Link from "next/link";
import * as React from "react";

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
  const [showPw, setShowPw] = React.useState(false);
  const [remember, setRemember] = React.useState(false);

  return (
    <div className="fixed inset-0 font-sans h-dvh overflow-hidden">
      {/* Background image layer */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/pattern-light.jpg" /* put the image file under /public */
          alt="Campus background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* Floating Help Button (bottom-left) */}
      <button
        type="button"
        onClick={() => (window.location.href = "mailto:ictd@mseuf.edu.ph")}
        aria-label="Need Help?"
        className="group fixed bottom-6 left-8 z-50 grid place-items-center
                   w-12 h-12 rounded-full bg-white text-red-900 shadow-md
                   transition-transform duration-200 hover:scale-110 hover:shadow-lg
                   focus-visible:scale-110"
      >
        <span className="text-xl font-extrabold leading-none">?</span>
        <span
          className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2
                     rounded-md bg-red-900 text-white text-xs px-2 py-1
                     opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
        >
          Need Help?
        </span>
      </button>

      {/* Centered login card */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-6 sm:p-8">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl
                     backdrop-blur grid grid-cols-1 md:grid-cols-[340px_minmax(0,1fr)] gap-0 bg-transparent"
        >
          {/* Left panel (brand / crest) */}
          <div className="relative hidden md:flex items-center justify-center rounded-l-2xl">
            <div className="absolute inset-0">
              <img
                src="/pattern-light.jpg"
                alt="Panel background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#7A0010]/75" />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center px-8 py-14 gap-4">
              <div className="w-36 h-36 rounded-2xl overflow-hidden shadow-md bg-white grid place-items-center">
                <img
                  src="/eulogo.png"
                  alt="Enverga University Logo"
                  className="w-32 h-32 object-contain"
                />
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-extrabold text-white leading-tight tracking-tight">
                  Enverga University
                </h3>
                <p className="text-sm text-white/80">Lucena Campus</p>
              </div>

              <div className="mt-8 w-full">
                <div className="mx-auto w-full rounded-lg bg-white/90 text-gray-700 text-center text-sm py-3 shadow">
                  {new Date().toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Right panel (form) */}
          <div className="relative p-8 sm:p-10 bg-white/90 backdrop-blur rounded-r-2xl">
            <div className="mb-8 flex items-center gap-3">
              <div className="grid place-items-center w-11 h-11 rounded-full bg-gray-100 text-red-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5.333 0-8 2.667-8 8h2c0-4.418 1.791-6 6-6s6 1.582 6 6h2c0-5.333-2.667-8-8-8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Sign in</h2>
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative group">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-900 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5.333 0-8 2.667-8 8h2c0-4.418 1.791-6 6-6s6 1.582 6 6h2c0-5.333-2.667-8-8-8z" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 border border-gray-300 focus:ring-2 focus:ring-red-900 focus:border-red-900 rounded-md outline-none text-base shadow-sm text-gray-900 placeholder-gray-400 pl-11 pr-4"
                  placeholder="you@mseuf.edu.ph"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="block text-base font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-900 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 016 0v3H9z" />
                  </svg>
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-12 rounded-md border border-gray-300 text-base outline-none shadow-sm text-gray-900
                             focus:ring-2 focus:ring-red-900 focus:border-red-900 pl-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded hover:bg-gray-100 text-gray-500"
                >
                  {showPw ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.707 2.293L2.293 3.707l3.22 3.22C3.66 8.17 2 12 2 12s3 7 10 7c2.107 0 3.9-.54 5.383-1.37l2.91 2.91 1.414-1.414-18-18zM12 17c-2.761 0-5-2.239-5-5 0-.6.109-1.174.304-1.705l6.401 6.401A4.96 4.96 0 0112 17zm7.696-2.295A12.61 12.61 0 0022 12s-3-7-10-7c-1.297 0-2.493.198-3.59.53l1.7 1.7c.61-.13 1.255-.2 1.89-.2 2.761 0 5 2.239 5 5 0 .635-.07 1.28-.2 1.89l1.896 1.896z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Options row: show password + remember me */}
            <div className="mb-7 flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-base text-gray-700 select-none">
                <input
                  type="checkbox"
                  className="accent-red-900 scale-110"
                  checked={showPw}
                  onChange={(e) => setShowPw(e.target.checked)}
                />
                Show Password
              </label>
              <label className="flex items-center gap-2 text-base text-gray-700 select-none">
                <input
                  type="checkbox"
                  className="accent-red-900 scale-110"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
            </div>

            {err && <p className="text-base text-red-600 mb-4">{err}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-red-900 text-white w-full h-12 rounded-md hover:bg-red-800 transition-all font-semibold text-base shadow-md disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <div className="mt-6 flex items-center justify-between gap-3 text-base">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-50"
              >
                Register Account
              </Link>
              <a href="#" className="text-red-900 hover:underline">
                Forgot Password
              </a>
            </div>

            <div className="mt-6 text-sm text-center text-gray-600">
              <Link href="/privacy" className="hover:text-red-900 underline-offset-4 hover:underline">Privacy</Link>
              {" "}•{" "}
              <Link href="/terms" className="hover:text-red-900 underline-offset-4 hover:underline">Terms</Link>
              {" "}•{" "}
              <Link href="/contact" className="hover:text-red-900 underline-offset-4 hover:underline">Contact</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
