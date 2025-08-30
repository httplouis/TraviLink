"use client";

import Link from "next/link";
import { useState } from "react";

/* ---------- compact input + label ---------- */
export const Input = (props: React.ComponentProps<"input">) => (
  <input
    {...props}
    autoComplete="off"
    className={
      "w-full h-9 border border-gray-300 focus:ring-1 focus:ring-red-900 focus:border-gray-300 " +
      "px-3 rounded-md outline-none text-[13px] shadow-sm text-gray-900 placeholder-gray-500 " +
      (props.className ?? "")
    }
  />
);

export const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[12px] font-medium text-gray-800 mb-0.5">{children}</label>
);

/* ---------- types ---------- */
export type RolePick = "faculty" | "driver";
export type DriverStep = "phone" | "otp" | "profile";

type Props = {
  // shared
  role: RolePick;
  setRole: (r: RolePick) => void;
  loading: boolean;
  err: string | null;
  msg: string | null;
  onResend?: () => void;

  // faculty
  fFirst: string; setFFirst: (v: string) => void;
  fMiddle: string; setFMiddle: (v: string) => void;
  fLast: string; setFLast: (v: string) => void;
  fSuffix: string; setFSuffix: (v: string) => void;
  fDept: string; setFDept: (v: string) => void;
  fBirthdate: string; setFBirthdate: (v: string) => void;
  fAddress: string; setFAddress: (v: string) => void;
  fEmail: string; setFEmail: (v: string) => void;
  fPw: string; setFPw: (v: string) => void;
  fPwConfirm: string; setFPwConfirm: (v: string) => void;
  onFacultySubmit: (e: React.FormEvent) => void;

  // driver
  dStep: DriverStep;
  dPhone: string; setDPhone: (v: string) => void;
  dOtp: string; setDOtp: (v: string) => void;
  dFirst: string; setDFirst: (v: string) => void;
  dMiddle: string; setDMiddle: (v: string) => void;
  dLast: string; setDLast: (v: string) => void;
  dSuffix: string; setDSuffix: (v: string) => void;
  dAddress: string; setDAddress: (v: string) => void;
  verifiedPhone: string | null;
  onDriverSendOtp: (e: React.FormEvent) => void;
  onDriverVerify: (e: React.FormEvent) => void;
  onDriverSave: (e: React.FormEvent) => void;
};

export default function RegisterView({
  role, setRole, loading, err, msg, onResend,
  fFirst, setFFirst, fMiddle, setFMiddle, fLast, setFLast, fSuffix, setFSuffix,
  fDept, setFDept, fBirthdate, setFBirthdate, fAddress, setFAddress,
  fEmail, setFEmail, fPw, setFPw, fPwConfirm, setFPwConfirm, onFacultySubmit,
  dStep, dPhone, setDPhone, dOtp, setDOtp, dFirst, setDFirst, dMiddle, setDMiddle,
  dLast, setDLast, dSuffix, setDSuffix, dAddress, setDAddress,
  verifiedPhone, onDriverSendOtp, onDriverVerify, onDriverSave,
}: Props) {
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="relative min-h-screen font-sans">
      {/* Background image + overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/pattern-light.jpg')" }}
      />
      <div className="fixed inset-0 z-10 bg-black/40" />

      {/* Content wrapper */}
      <div className="relative z-20 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg ring-1 ring-black/10">
            <div className="px-6 py-4">
              {/* header */}
              <div className="flex items-center gap-3">
                <img src="/eulogo.png" alt="Enverga University Logo" className="w-9 h-9" />
                <div>
                  <h1 className="text-[16px] font-extrabold text-red-900 leading-none">
                    Enverga University
                  </h1>
                  <p className="text-[10px] text-gray-600">
                    TraviLink · Scheduling & Reservations
                  </p>
                </div>
              </div>

              <div className="h-px bg-gray-200 my-3" />

              {/* Tabs */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setRole("faculty")}
                  disabled={loading}
                  className={`rounded-md h-8 text-[12px] font-medium border transition ${
                    role === "faculty"
                      ? "bg-red-900 text-white border-red-900"
                      : "bg-white text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Faculty / Staff
                </button>
                <button
                  type="button"
                  onClick={() => setRole("driver")}
                  disabled={loading}
                  className={`rounded-md h-8 text-[12px] font-medium border transition ${
                    role === "driver"
                      ? "bg-red-900 text-white border-red-900"
                      : "bg-white text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Driver
                </button>
              </div>

              {/* Stage area: keep height stable */}
              <div className="relative w-full min-h-[520px]">
                {/* FACULTY */}
                <div
                  className={`absolute inset-0 transition-opacity duration-200 ${
                    role === "faculty" ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <form onSubmit={onFacultySubmit} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>First name</Label>
                        <Input value={fFirst} onChange={(e) => setFFirst(e.target.value)} required />
                      </div>
                      <div>
                        <Label>Middle name</Label>
                        <Input value={fMiddle} onChange={(e) => setFMiddle(e.target.value)} />
                      </div>
                      <div>
                        <Label>Last name</Label>
                        <Input value={fLast} onChange={(e) => setFLast(e.target.value)} required />
                      </div>
                      <div>
                        <Label>Suffix <span className="text-gray-500">(optional)</span></Label>
                        <Input value={fSuffix} onChange={(e) => setFSuffix(e.target.value)} placeholder="Jr., III, etc." />
                      </div>
                      <div>
                        <Label>Department <span className="text-gray-500">(optional)</span></Label>
                        <Input value={fDept} onChange={(e) => setFDept(e.target.value)} />
                      </div>
                      <div>
                        <Label>Birthdate</Label>
                        <Input type="date" value={fBirthdate} onChange={(e) => setFBirthdate(e.target.value)} required />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input type="email" value={fEmail} onChange={(e) => setFEmail(e.target.value)} required />
                      </div>

                      {/* password with toggle (only here) */}
                      <div className="relative">
                        <Label>Password</Label>
                        <Input
                          type={showPw ? "text" : "password"}
                          value={fPw}
                          onChange={(e) => setFPw(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw((v) => !v)}
                          className="absolute right-3 top-[28px] text-[10px] text-gray-600 hover:text-red-900"
                        >
                          {showPw ? "Hide" : "Show"}
                        </button>
                        <p className="text-[10px] text-gray-600 mt-0.5">8+ chars, 1 number, 1 symbol.</p>
                      </div>

                      <div>
                        <Label>Confirm Password</Label>
                        <Input type="password" value={fPwConfirm} onChange={(e) => setFPwConfirm(e.target.value)} required />
                      </div>

                      <div className="md:col-span-2">
                        <Label>Address</Label>
                        <Input value={fAddress} onChange={(e) => setFAddress(e.target.value)} required />
                      </div>
                    </div>

                    {err && <p className="text-[12px] text-red-600">{err}</p>}
                    {msg && <p className="text-[12px] text-green-700">{msg}</p>}

                    <button
                      disabled={loading}
                      className="bg-red-900 text-white w-full h-9 rounded-md hover:bg-red-800 transition text-[12px] font-medium shadow-sm disabled:opacity-60"
                    >
                      {loading ? "Creating..." : "Register"}
                    </button>

                    {!!onResend && (
                      <button
                        type="button"
                        onClick={onResend}
                        disabled={loading}
                        className="mt-1 w-full text-center text-[12px] text-red-900 underline disabled:opacity-60"
                      >
                        Resend confirmation
                      </button>
                    )}

                    <p className="text-[11px] text-gray-700 text-center mt-1">
                      Already have an account?{" "}
                      <Link href="/login" className="text-red-900 hover:underline font-medium">
                        Login
                      </Link>
                    </p>
                  </form>
                </div>

                {/* DRIVER */}
                <div
                  className={`absolute inset-0 transition-opacity duration-200 ${
                    role === "driver" ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-[11px] text-gray-800">
                      <span className={`px-2 py-0.5 rounded ${dStep === "phone" ? "bg-gray-200" : ""}`}>1. Phone</span>
                      <span>→</span>
                      <span className={`px-2 py-0.5 rounded ${dStep === "otp" ? "bg-gray-200" : ""}`}>2. Code</span>
                      <span>→</span>
                      <span className={`px-2 py-0.5 rounded ${dStep === "profile" ? "bg-gray-200" : ""}`}>3. Profile</span>
                    </div>

                    {dStep === "phone" && (
                      <form onSubmit={onDriverSendOtp} className="space-y-3">
                        <div>
                          <Label>Phone number</Label>
                          <Input
                            placeholder="09XXXXXXXXX"
                            value={dPhone}
                            onChange={(e) => setDPhone(e.target.value)}
                            required
                          />
                        </div>
                        {err && <p className="text-[12px] text-red-600">{err}</p>}
                        {msg && <p className="text-[12px] text-green-700">{msg}</p>}
                        <button
                          disabled={loading}
                          className="bg-red-900 text-white w-full h-9 rounded-md hover:bg-red-800 transition text-[12px] font-medium shadow-sm disabled:opacity-60"
                        >
                          {loading ? "Sending..." : "Send Code"}
                        </button>
                      </form>
                    )}

                    {dStep === "otp" && (
                      <form onSubmit={onDriverVerify} className="space-y-3">
                        <div>
                          <Label>SMS code</Label>
                          <Input value={dOtp} onChange={(e) => setDOtp(e.target.value)} required />
                        </div>
                        {err && <p className="text-[12px] text-red-600">{err}</p>}
                        {msg && <p className="text-[12px] text-green-700">{msg}</p>}
                        <button
                          disabled={loading}
                          className="bg-red-900 text-white w-full h-9 rounded-md hover:bg-red-800 transition text-[12px] font-medium shadow-sm disabled:opacity-60"
                        >
                          {loading ? "Verifying..." : "Verify"}
                        </button>
                      </form>
                    )}

                    {dStep === "profile" && (
                      <form onSubmit={onDriverSave} className="space-y-3">
                        <p className="text-[12px] text-gray-600">
                          Verified phone: <span className="font-medium">{verifiedPhone ?? "—"}</span>
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label>First name</Label>
                            <Input value={dFirst} onChange={(e) => setDFirst(e.target.value)} required />
                          </div>
                          <div>
                            <Label>Middle name</Label>
                            <Input value={dMiddle} onChange={(e) => setDMiddle(e.target.value)} />
                          </div>
                          <div>
                            <Label>Last name</Label>
                            <Input value={dLast} onChange={(e) => setDLast(e.target.value)} required />
                          </div>
                          <div>
                            <Label>Suffix <span className="text-gray-500">(optional)</span></Label>
                            <Input value={dSuffix} onChange={(e) => setDSuffix(e.target.value)} placeholder="Jr., III, etc." />
                          </div>
                          <div className="md:col-span-2">
                            <Label>Address</Label>
                            <Input
                              value={dAddress}
                              onChange={(e) => setDAddress(e.target.value)}
                              placeholder="House No., Street, Barangay, City"
                              required
                            />
                          </div>
                        </div>

                        {err && <p className="text-[12px] text-red-600">{err}</p>}
                        {msg && <p className="text-[12px] text-green-700">{msg}</p>}
                        <button
                          disabled={loading}
                          className="bg-red-900 text-white w-full h-9 rounded-md hover:bg-red-800 transition text-[12px] font-medium shadow-sm disabled:opacity-60"
                        >
                          {loading ? "Saving..." : "Save Profile"}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-2 text-center text-[10px] text-white/90">
            © {new Date().getFullYear()} TraviLink · Enverga University
          </p>
        </div>
      </div>
    </div>
  );
}
