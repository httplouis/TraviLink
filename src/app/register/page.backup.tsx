"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const allowedDomain = (email: string) => email.endsWith("@mseuf.edu.ph"); // adjust if needed

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!allowedDomain(email)) {
      setErr("Please use your university email (e.g., @mseuf.edu.ph).");
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setErr(error.message); return; }

    // make sure there's a row in public.users (role defaults to faculty)
    await fetch("/api/users", { method: "POST" });

    setOk(true);
    router.push("/faculty"); // default landing after register
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleRegister} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold text-red-900 mb-1">Create Account</h1>
        <p className="text-sm text-gray-600 mb-6">Faculty/Staff only. Admin accounts are created by the system.</p>

        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full border border-gray-300 focus:ring-2 focus:ring-red-900 focus:border-red-900 p-3 rounded-md outline-none text-sm shadow-sm text-gray-900"
          placeholder="you@mseuf.edu.ph"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full border border-gray-300 focus:ring-2 focus:ring-red-900 focus:border-red-900 p-3 rounded-md outline-none text-sm shadow-sm text-gray-900"
          required
        />

        {err && <p className="text-sm text-red-600 mt-3">{err}</p>}
        {ok && <p className="text-sm text-green-700 mt-3">Account created.</p>}

        <button type="submit" className="mt-6 bg-red-900 text-white w-full py-3 rounded-md hover:bg-red-800 transition-all font-medium text-sm shadow-md">
          Register
        </button>

        <p className="text-xs text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-red-900 hover:underline font-medium">Login</Link>
        </p>
      </form>
    </div>
  );
}
