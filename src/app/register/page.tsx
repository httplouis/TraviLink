"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

/* ---------------------- UI helpers ---------------------- */
const Input = (props: React.ComponentProps<"input">) => (
  <input
    {...props}
    autoComplete="off"
    className={
      "w-full border border-gray-300 focus:ring-2 focus:ring-red-900 focus:border-red-900 " +
      "px-3 py-2 rounded-md outline-none text-sm shadow-sm text-gray-900 placeholder-gray-500 " +
      (props.className ?? "")
    }
  />
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[13px] font-medium text-gray-800 mb-1">{children}</label>
);

/* ---------------------- Types ---------------------- */
type RolePick = "faculty" | "driver";
type DriverStep = "phone" | "otp" | "profile";

/* ---------------------- Validators ---------------------- */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validatePassword(pw: string): string | null {
  if (pw.length < 8) return "Password must be at least 8 characters long.";
  if (!/[0-9]/.test(pw)) return "Password must contain at least one number.";
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pw))
    return "Password must contain at least one special character.";
  return null;
}

function normalizePhone(p: string) {
  const digits = p.replace(/\D/g, "");
  if (digits.startsWith("09") && digits.length === 11) return "+63" + digits.slice(1);
  if (digits.startsWith("9") && digits.length === 10) return "+63" + digits;
  if (digits.startsWith("63")) return "+" + digits;
  if (digits.startsWith("+")) return digits;
  return "+" + digits;
}

/* ============================== Page ============================== */
export default function RegisterPage() {
  const [role, setRole] = useState<RolePick>("faculty");

  // Faculty state
  const [fName, setFName] = useState("");
  const [fDept, setFDept] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fPw, setFPw] = useState("");
  const [fPwConfirm, setFPwConfirm] = useState("");

  // Driver state
  const [dStep, setDStep] = useState<DriverStep>("phone");
  const [dPhone, setDPhone] = useState("");
  const [dOtp, setDOtp] = useState("");
  const [dName, setDName] = useState("");
  const [dContact, setDContact] = useState("");

  // UI
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [justSignedUpEmail, setJustSignedUpEmail] = useState<string | null>(null);

  useEffect(() => {
    setMsg(null);
    setErr(null);
  }, [role]);

  /* ================= Faculty: email + password (duplicate-safe via signUp only) ================= */
  async function registerFaculty(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    // basic client checks
    if (fName.trim().length < 2) {
      setErr("Please enter your full name.");
      return;
    }
    if (!emailRegex.test(fEmail)) {
      setErr("Please enter a valid email address.");
      return;
    }
    const pwErr = validatePassword(fPw);
    if (pwErr) {
      setErr(pwErr);
      return;
    }
    if (fPw !== fPwConfirm) {
      setErr("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: fEmail,
        password: fPw,
        options: { data: { role: "faculty", name: fName, department: fDept } },
      });

      // explicit server error case
      if (error) {
        const m = error.message?.toLowerCase() || "";
        if (m.includes("already registered") || m.includes("user already registered")) {
          setErr("This email is already registered. Please log in or reset your password.");
          return;
        }
        if (m.includes("rate limit")) {
          setErr("Too many attempts. Please wait a moment and try again.");
          return;
        }
        throw error;
      }

      // Supabase duplicate quirk: 200 but no user (or identities is empty)
      const user = data?.user as any;
      const identities = Array.isArray(user?.identities) ? user.identities : null;
      if (!user || (identities && identities.length === 0)) {
        setErr("This email is already registered. Please log in or reset your password.");
        return;
      }

      // success for brand-new signup
      setJustSignedUpEmail(fEmail);
      setMsg(
        "Account created. Please check your email to confirm, then log in. If you didn’t receive it, click “Resend confirmation”."
      );
    } catch (e: any) {
      setErr(e.message ?? "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  async function resendConfirmation() {
    if (!justSignedUpEmail) return;
    setErr(null);
    setMsg(null);
    try {
      setLoading(true);
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: justSignedUpEmail,
      });
      if (error) {
        const m = error.message?.toLowerCase() || "";
        if (m.includes("already confirmed")) {
          setErr("This email is already confirmed. You can log in now.");
          return;
        }
        // Some projects return generic success to avoid enumeration; if we get an error here,
        // just show a helpful message.
        throw error;
      }
      setMsg("Confirmation email sent. Please check your inbox (and spam).");
    } catch (e: any) {
      setErr(e.message ?? "Could not resend confirmation.");
    } finally {
      setLoading(false);
    }
  }

  /* ================= Driver: phone + OTP + profile ================= */
  async function driverSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    const normalized = normalizePhone(dPhone);
    if (!/^\+63\d{10}$/.test(normalized)) {
      setErr("Please enter a valid PH mobile (e.g., 09XXXXXXXXX).");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ phone: normalized });
      if (error) {
        const m = error.message?.toLowerCase() || "";
        if (m.includes("rate limit")) {
          setErr("Too many requests. Please wait a moment before requesting another code.");
          return;
        }
        throw error;
      }
      setMsg("We sent a verification code via SMS.");
      setDStep("otp");
    } catch (e: any) {
      setErr(e.message ?? "Failed to send code.");
    } finally {
      setLoading(false);
    }
  }

  async function driverVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    try {
      setLoading(true);
      const phone = normalizePhone(dPhone);
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: dOtp,
        type: "sms",
      });
      if (error) throw error;
      if (!data.session?.user) throw new Error("No session after verification.");
      setDStep("profile");
    } catch (e: any) {
      setErr(e.message ?? "Invalid code.");
    } finally {
      setLoading(false);
    }
  }

  async function driverSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    if (dName.trim().length < 2) {
      setErr("Please enter your full name.");
      return;
    }

    try {
      setLoading(true);
      const { data: u } = await supabase.auth.getUser();
      const user = u.user;
      if (!user) throw new Error("Not signed in.");

      // Avoid duplicate profile for same auth user
      const { data: existing, error: selErr } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (selErr) throw selErr;
      if (existing) {
        setMsg("Profile already exists for this account. You’re good to go!");
        return;
      }

      const phone = normalizePhone(dPhone);
      const { error } = await supabase.from("users").upsert(
        {
          auth_user_id: user.id,
          name: dName,
          phone: dContact || phone,
          role: "driver",
          status: "pending",
        },
        { onConflict: "auth_user_id" }
      );
      if (error) throw error;

      setMsg("Profile saved. Your driver account is now pending admin approval.");
    } catch (e: any) {
      setErr(e.message ?? "Could not save profile.");
    } finally {
      setLoading(false);
    }
  }

  /* ============================== UI ============================== */
  return (
    <div className="fixed inset-0 flex flex-col font-sans bg-gradient-to-br from-gray-100 to-gray-200 h-dvh overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Branding strip */}
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

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Info panel */}
          <section className="relative w-full lg:w-[55%] bg-white px-12 py-10 border-r border-gray-300 flex flex-col justify-between overflow-y-auto">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "url('/pattern-light.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="relative z-10">
              <h1 className="text-5xl font-extrabold text-red-900 tracking-tight drop-shadow-sm">
                TraviLink
              </h1>
              <p className="text-gray-800 mt-3 text-lg italic">
                University Vehicle Scheduling & Reservation Portal
              </p>
              <p className="text-base text-gray-800 leading-relaxed mb-6 max-w-xl border-l-4 border-red-900 pl-4 bg-red-50/40 rounded-md">
                Create an account to request trips and receive updates. Faculty use email +
                password. Drivers register with phone + OTP and are approved by admin.
              </p>
            </div>
          </section>

          {/* Right: register card — compact */}
          <section
            className="w-full lg:w-[45%] relative flex items-center justify-center overflow-hidden"
            style={{
              backgroundImage: "url('/pattern-light.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/65 z-0 pointer-events-none" />

            <div className="relative z-10 bg-white rounded-xl p-6 w-[24rem] max-w-[90vw] border border-gray-200 shadow-4xl">
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <img src="/eulogo.png" alt="Enverga University Logo" className="w-14 h-14" />
                <h3 className="font-extrabold text-red-900 tracking-tight text-xl leading-none uppercase">
                  <span className="block">Enverga</span>
                  <span className="block">University</span>
                </h3>
              </div>
              <h2 className="text-lg font-bold border-b pb-2.5 mb-5 text-gray-900">
                Create Account
              </h2>

              {/* Role tabs */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <button
                  type="button"
                  onClick={() => setRole("faculty")}
                  className={`rounded-md py-2 font-medium border ${
                    role === "faculty"
                      ? "bg-red-900 text-white"
                      : "bg-white text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Faculty / Staff
                </button>
                <button
                  type="button"
                  onClick={() => setRole("driver")}
                  className={`rounded-md py-2 font-medium border ${
                    role === "driver"
                      ? "bg-red-900 text-white"
                      : "bg-white text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Driver
                </button>
              </div>

              {/* Faculty form */}
              {role === "faculty" && (
                <form onSubmit={registerFaculty} className="space-y-3">
                  <div>
                    <Label>Full name</Label>
                    <Input value={fName} onChange={(e) => setFName(e.target.value)} required />
                  </div>
                  <div>
                    <Label>Department (optional)</Label>
                    <Input value={fDept} onChange={(e) => setFDept(e.target.value)} />
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
                    <Input
                      type="password"
                      value={fPw}
                      onChange={(e) => setFPw(e.target.value)}
                      required
                    />
                    <p className="text-[10px] text-gray-600 mt-1">
                      At least 8 chars, 1 number, 1 special symbol.
                    </p>
                  </div>
                  <div>
                    <Label>Confirm Password</Label>
                    <Input
                      type="password"
                      value={fPwConfirm}
                      onChange={(e) => setFPwConfirm(e.target.value)}
                      required
                    />
                  </div>

                  {err && <p className="text-sm text-red-600">{err}</p>}
                  {msg && <p className="text-sm text-green-700">{msg}</p>}

                  <button
                    disabled={loading}
                    className="bg-red-900 text-white w-full py-2.5 rounded-md hover:bg-red-800 transition-all font-medium text-sm shadow-md disabled:opacity-60"
                  >
                    {loading ? "Creating..." : "Register"}
                  </button>

                  {justSignedUpEmail && (
                    <button
                      type="button"
                      onClick={resendConfirmation}
                      disabled={loading}
                      className="mt-2 w-full text-center text-sm text-red-900 underline disabled:opacity-60"
                    >
                      Resend confirmation
                    </button>
                  )}

                  <p className="text-xs text-gray-700 text-center mt-1">
                    Already have an account?{" "}
                    <Link href="/login" className="text-red-900 hover:underline font-medium">
                      Login
                    </Link>
                  </p>
                </form>
              )}

              {/* Driver flow */}
              {role === "driver" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-center gap-2 text-[11px] text-gray-800">
                    <span className={`px-2 py-1 rounded ${dStep === "phone" ? "bg-gray-200" : ""}`}>1. Phone</span>
                    <span>→</span>
                    <span className={`px-2 py-1 rounded ${dStep === "otp" ? "bg-gray-200" : ""}`}>2. Code</span>
                    <span>→</span>
                    <span className={`px-2 py-1 rounded ${dStep === "profile" ? "bg-gray-200" : ""}`}>3. Profile</span>
                  </div>

                  {dStep === "phone" && (
                    <form onSubmit={driverSendOtp} className="space-y-3">
                      <div>
                        <Label>Phone number</Label>
                        <Input
                          placeholder="09XXXXXXXXX"
                          value={dPhone}
                          onChange={(e) => setDPhone(e.target.value)}
                          required
                        />
                      </div>
                      {err && <p className="text-sm text-red-600">{err}</p>}
                      {msg && <p className="text-sm text-green-700">{msg}</p>}
                      <button
                        disabled={loading}
                        className="bg-red-900 text-white w-full py-2.5 rounded-md hover:bg-red-800 transition-all font-medium text-sm shadow-md disabled:opacity-60"
                      >
                        {loading ? "Sending..." : "Send Code"}
                      </button>
                    </form>
                  )}

                  {dStep === "otp" && (
                    <form onSubmit={driverVerifyOtp} className="space-y-3">
                      <div>
                        <Label>SMS code</Label>
                        <Input value={dOtp} onChange={(e) => setDOtp(e.target.value)} required />
                      </div>
                      {err && <p className="text-sm text-red-600">{err}</p>}
                      {msg && <p className="text-sm text-green-700">{msg}</p>}
                      <button
                        disabled={loading}
                        className="bg-red-900 text-white w-full py-2.5 rounded-md hover:bg-red-800 transition-all font-medium text-sm shadow-md disabled:opacity-60"
                      >
                        {loading ? "Verifying..." : "Verify"}
                      </button>
                    </form>
                  )}

                  {dStep === "profile" && (
                    <form onSubmit={driverSaveProfile} className="space-y-3">
                      <div>
                        <Label>Full name</Label>
                        <Input value={dName} onChange={(e) => setDName(e.target.value)} required />
                      </div>
                      <div>
                        <Label>Contact number (optional)</Label>
                        <Input
                          value={dContact}
                          onChange={(e) => setDContact(e.target.value)}
                          placeholder="If same as phone, leave blank"
                        />
                      </div>
                      {err && <p className="text-sm text-red-600">{err}</p>}
                      {msg && <p className="text-sm text-green-700">{msg}</p>}
                      <button
                        disabled={loading}
                        className="bg-red-900 text-white w-full py-2.5 rounded-md hover:bg-red-800 transition-all font-medium text-sm shadow-md disabled:opacity-60"
                      >
                        {loading ? "Saving..." : "Save Profile"}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
