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
    const { data: signIn, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setErr(error.message);
      setLoading(false);
      return;
    }

    // 2) Get access token for our API calls
    const { data: s } = await supabase.auth.getSession();
    const token = s.session?.access_token;

    // 3) Ensure user profile exists (create-if-missing)
    await fetch("/api/users", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    // 4) Ask server for role (token-based, respects RLS)
    const roleRes = await fetch("/api/auth/role", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      cache: "no-store",
    });
    const { role } = await roleRes.json();

    setLoading(false);

    // 5) Honor ?next= if present
    if (next) {
      router.replace(next);
      return;
    }

    // 6) Redirect by role
    router.push(
      role === "admin" ? "/admin" : role === "driver" ? "/driver" : "/faculty"
    );
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
