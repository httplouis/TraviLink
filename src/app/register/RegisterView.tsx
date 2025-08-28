"use client";

import Link from "next/link";

/* ---------- compact input + label ---------- */
export const Input = (props: React.ComponentProps<"input">) => (
  <input
    {...props}
    autoComplete="off"
    className={
      "w-full h-10 border border-gray-300 focus:ring-2 focus:ring-red-900 focus:border-red-900 " +
      "px-3 rounded-md outline-none text-[13px] shadow-sm text-gray-900 placeholder-gray-500 " +
      (props.className ?? "")
    }
  />
);

export const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[12px] font-medium text-gray-800 mb-1">
    {children}
  </label>
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
  fName: string; setFName: (v: string) => void;
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
  dName: string; setDName: (v: string) => void;
  dAddress: string; setDAddress: (v: string) => void;
  verifiedPhone: string | null;
  onDriverSendOtp: (e: React.FormEvent) => void;
  onDriverVerify: (e: React.FormEvent) => void;
  onDriverSave: (e: React.FormEvent) => void;
};

export default function RegisterView({
  role, setRole, loading, err, msg, onResend,
  fName, setFName, fDept, setFDept, fBirthdate, setFBirthdate, fAddress, setFAddress,
  fEmail, setFEmail, fPw, setFPw, fPwConfirm, setFPwConfirm, onFacultySubmit,
  dStep, dPhone, setDPhone, dOtp, setDOtp, dName, setDName, dAddress, setDAddress,
  verifiedPhone, onDriverSendOtp, onDriverVerify, onDriverSave,
}: Props) {
  return (
    <div
      className="min-h-dvh w-full relative overflow-hidden"
      style={{
        backgroundImage: "url('/pattern-light.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="min-h-dvh grid place-items-center py-8">
          <div className="w-full max-w-[42rem]">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl ring-1 ring-black/10">
              <div className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <img src="/eulogo.png" alt="Enverga University Logo" className="w-11 h-11" />
                  <div>
                    <h1 className="text-[18px] font-extrabold text-red-900 leading-none">
                      Enverga University
                    </h1>
                    <p className="text-[11px] text-gray-600">TraviLink · Scheduling & Reservations</p>
                  </div>
                </div>

                <div className="h-px bg-gray-200 my-4" />

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setRole("faculty")}
                    className={`rounded-md h-9 text-[13px] font-medium border ${
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
                    className={`rounded-md h-9 text-[13px] font-medium border ${
                      role === "driver"
                        ? "bg-red-900 text-white border-red-900"
                        : "bg-white text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Driver
                  </button>
                </div>

                {/* FACULTY */}
                {role === "faculty" && (
                  <form onSubmit={onFacultySubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Full name</Label>
                        <Input value={fName} onChange={(e) => setFName(e.target.value)} required />
                      </div>
                      <div>
                        <Label>Department (optional)</Label>
                        <Input value={fDept} onChange={(e) => setFDept(e.target.value)} />
                      </div>
                      <div>
                        <Label>Birthdate</Label>
                        <Input
                          type="date"
                          value={fBirthdate}
                          onChange={(e) => setFBirthdate(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={fEmail}
                          onChange={(e) => setFEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                      <div>
                        <Label>Password</Label>
                        <Input type="password" value={fPw} onChange={(e) => setFPw(e.target.value)} required />
                        <p className="text-[10px] text-gray-600 mt-1">8+ chars, 1 number, 1 symbol.</p>
                      </div>
                      <div>
                        <Label>Confirm Password</Label>
                        <Input type="password" value={fPwConfirm} onChange={(e) => setFPwConfirm(e.target.value)} required />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Address</Label>
                        <Input value={fAddress} onChange={(e) => setFAddress(e.target.value)} placeholder="House No., Street, Barangay, City" required />
                      </div>
                    </div>

                    {err && <p className="text-[13px] text-red-600">{err}</p>}
                    {msg && <p className="text-[13px] text-green-700">{msg}</p>}

                    <button disabled={loading} className="bg-red-900 text-white w-full h-10 rounded-md hover:bg-red-800 transition-all text-[13px] font-medium shadow-sm disabled:opacity-60">
                      {loading ? "Creating..." : "Register"}
                    </button>

                    {!!onResend && (
                      <button type="button" onClick={onResend} disabled={loading} className="mt-2 w-full text-center text-[13px] text-red-900 underline disabled:opacity-60">
                        Resend confirmation
                      </button>
                    )}

                    <p className="text-[12px] text-gray-700 text-center mt-1">
                      Already have an account?{" "}
                      <Link href="/login" className="text-red-900 hover:underline font-medium">Login</Link>
                    </p>
                  </form>
                )}

                {/* DRIVER */}
                {role === "driver" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-[11px] text-gray-800">
                      <span className={`px-2 py-1 rounded ${dStep === "phone" ? "bg-gray-200" : ""}`}>1. Phone</span>
                      <span>→</span>
                      <span className={`px-2 py-1 rounded ${dStep === "otp" ? "bg-gray-200" : ""}`}>2. Code</span>
                      <span>→</span>
                      <span className={`px-2 py-1 rounded ${dStep === "profile" ? "bg-gray-200" : ""}`}>3. Profile</span>
                    </div>

                    {dStep === "phone" && (
                      <form onSubmit={onDriverSendOtp} className="space-y-3">
                        <div>
                          <Label>Phone number</Label>
                          <Input placeholder="09XXXXXXXXX" value={dPhone} onChange={(e) => setDPhone(e.target.value)} required />
                        </div>
                        {err && <p className="text-[13px] text-red-600">{err}</p>}
                        {msg && <p className="text-[13px] text-green-700">{msg}</p>}
                        <button disabled={loading} className="bg-red-900 text-white w-full h-10 rounded-md hover:bg-red-800 transition-all text-[13px] font-medium shadow-sm disabled:opacity-60">
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
                        {err && <p className="text-[13px] text-red-600">{err}</p>}
                        {msg && <p className="text-[13px] text-green-700">{msg}</p>}
                        <button disabled={loading} className="bg-red-900 text-white w-full h-10 rounded-md hover:bg-red-800 transition-all text-[13px] font-medium shadow-sm disabled:opacity-60">
                          {loading ? "Verifying..." : "Verify"}
                        </button>
                      </form>
                    )}

                    {dStep === "profile" && (
                      <form onSubmit={onDriverSave} className="space-y-3">
                        <p className="text-[12px] text-gray-600">
                          Verified phone: <span className="font-medium">{verifiedPhone ?? "—"}</span>
                        </p>
                        <div>
                          <Label>Full name</Label>
                          <Input value={dName} onChange={(e) => setDName(e.target.value)} required />
                        </div>
                        <div>
                          <Label>Address</Label>
                          <Input value={dAddress} onChange={(e) => setDAddress(e.target.value)} placeholder="House No., Street, Barangay, City" required />
                        </div>
                        {err && <p className="text-[13px] text-red-600">{err}</p>}
                        {msg && <p className="text-[13px] text-green-700">{msg}</p>}
                        <button disabled={loading} className="bg-red-900 text-white w-full h-10 rounded-md hover:bg-red-800 transition-all text-[13px] font-medium shadow-sm disabled:opacity-60">
                          {loading ? "Saving..." : "Save Profile"}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>

            <p className="mt-3 text-center text-[11px] text-white/80">
              © {new Date().getFullYear()} TraviLink · Enverga University
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
