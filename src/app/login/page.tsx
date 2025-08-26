"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import LoginView from "./LoginView";

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

    // 1) Sign in with Supabase
   const { data: signIn, error } = await supabase.auth.signInWithPassword({ email, password });
if (error) { setErr(error.message); setLoading(false); return; }

const { data: s } = await supabase.auth.getSession();
const token = s.session?.access_token;

const res = await fetch("/api/auth/bootstrap", {
  method: "POST",
  headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  cache: "no-store",
});
const { role } = await res.json();

if (next) router.replace(next);
else router.push(role === "admin" ? "/admin" : role === "driver" ? "/driver" : "/faculty");

  }

  return (
    <LoginView
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      loading={loading}
      err={err}
      onSubmit={handleLogin}
    />
  );
}
