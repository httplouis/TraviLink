"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const next = useSearchParams().get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

   const { data: signIn, error } = await supabase.auth.signInWithPassword({ email, password });
if (error) { setErr(error.message); setLoading(false); return; }

const { data: s } = await supabase.auth.getSession();
const token = s.session?.access_token;

await fetch("/api/users", {
  method: "POST",
  headers: token ? { Authorization: `Bearer ${token}` } : undefined,
});

const roleRes = await fetch("/api/auth/role", {
  headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  cache: "no-store",
});
const { role } = await roleRes.json();


    setLoading(false);

    // 5) honor ?next= if present
    if (next) { router.replace(next); return; }

    // 6) redirect by role
    router.push(role === "admin" ? "/admin" : role === "driver" ? "/driver" : "/faculty");
  }

  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-br from-gray-100 to-gray-200">
      {/* LEFT PANEL — keep your existing content if you like */}
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

      <main className="flex-1 flex flex-col lg:flex-row">
        {/* (You can paste your long left info section here unchanged) */}

        {/* RIGHT: Login form */}
        <section
          className="w-full lg:w-[45%] flex items-center justify-center bg-cover bg-center relative"
          style={{ backgroundImage: "url('/eu1.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/40" />

          <form onSubmit={handleLogin} className="relative bg-white shadow-2xl rounded-xl p-10 w-96 border border-gray-200 z-10">
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
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full border border-gray-300 focus:ring-2 focus:ring-red-900 focus:border-red-900 p-3 rounded-md text-sm"
                placeholder="you@mseuf.edu.ph"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full border border-gray-300 focus:ring-2 focus:ring-red-900 focus:border-red-900 p-3 rounded-md text-sm"
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
              | <Link href="/register" className="text-red-900 hover:underline font-medium">Register Account</Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
