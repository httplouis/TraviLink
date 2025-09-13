// src/components/admin/nav/TopBar.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function TopBar() {
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (menuOpen && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen]);

  return (
    <header className="flex h-14 items-center gap-3 px-3 sm:px-4">
      {/* Brand */}
      <Link href="/admin" className="flex items-center gap-2 shrink-0">
        <div className="h-7 w-7 rounded-md bg-white/15 ring-1 ring-white/30 flex items-center justify-center text-white font-bold">
          TL
        </div>
        <span className="hidden sm:block font-semibold tracking-tight text-white">TraviLink Admin</span>
      </Link>

      {/* Search */}
      <div className="ml-2 flex-1">
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search schedules, vehicles, drivers…  (Ctrl/⌘+K)"
            className="w-full h-9 rounded-md bg-white/95 pl-9 pr-3 text-sm text-neutral-800 placeholder-neutral-500 ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-white/60"
          />
          <svg className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M13 14a6 6 0 1 1 1-1l3 3-1 1-3-3Zm-5 0a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" clipRule="evenodd"/>
          </svg>
        </div>
      </div>

      {/* Quick actions */}
      <div className="hidden md:flex items-center gap-2">
        <button className="btn-pill btn-pill-primary">+ New Request</button>
        <button className="btn-pill">+ Schedule</button>
        <button className="btn-pill">+ Maintenance</button>
      </div>

      {/* Utilities */}
      <div className="ml-1 flex items-center gap-1">
        <button title="Command palette" className="btn btn-ghost h-9 px-2 text-white/90 hover:bg-white/10">⌘K</button>
        <button title="Notifications" className="relative btn btn-ghost h-9 px-2 text-white/90 hover:bg-white/10">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2ZM19 17h-14l2-2v-4a5 5 0 1 1 10 0v4l2 2Z"/></svg>
          <span className="absolute -right-1 -top-1 h-4 min-w-[16px] rounded-full bg-white text-[10px] font-semibold text-[var(--admin-brand)] px-1 flex items-center justify-center">3</span>
        </button>
        <div className="ml-1 h-8 w-[1px] bg-white/20" />

        {/* Profile button + dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="ml-1 flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1.5 text-sm text-white hover:bg-white/15"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/30 font-semibold">A</span>
            <span className="hidden sm:block">Admin</span>
            <svg className="h-4 w-4 opacity-80" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 7 10 11.5 14.5 7l1 1L10 14 4.5 8l1-1Z"/></svg>
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-xl bg-neutral-900/95 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur p-2"
            >
              {/* Profile tiles */}
              <Link
                href="/admin/profile"
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/10"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-base font-semibold">A</span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Admin</span>
                  <span className="text-xs text-white/70">View profile</span>
                </div>
              </Link>

              <Link
                href="/admin/org/ccms"
                className="mt-1 flex items-center gap-3 rounded-lg p-2 hover:bg-white/10"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--admin-brand)]/30 text-sm font-semibold">TL</span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">TraviLink – CCMS</span>
                  <span className="text-xs text-white/70">Organization profile</span>
                </div>
              </Link>

              <div className="my-2 h-px w-full bg-white/10" />

              {/* Menu groups */}
              <Link
                href="/admin/settings"
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/10"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                <GearIcon />
                <div className="flex-1">
                  <div className="text-sm font-medium">Settings & privacy</div>
                  <div className="text-xs text-white/70">Account, permissions, RLS, security</div>
                </div>
              </Link>

              <Link
                href="/admin/help"
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/10"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                <HelpIcon />
                <div className="flex-1">
                  <div className="text-sm font-medium">Help & support</div>
                  <div className="text-xs text-white/70">Docs, contact support</div>
                </div>
              </Link>

              <button
                className="w-full flex items-center gap-3 rounded-lg p-2 hover:bg-white/10"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                <DisplayIcon />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">Display & accessibility</div>
                  <div className="text-xs text-white/70">Theme, density</div>
                </div>
              </button>

              <button
                className="w-full flex items-center gap-3 rounded-lg p-2 hover:bg-white/10"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                <FeedbackIcon />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">Give feedback</div>
                  <div className="text-xs text-white/70">Tell us what’s working</div>
                </div>
              </button>

              <div className="my-2 h-px w-full bg-white/10" />

              {/* ✅ Logout now signs out + goes to login */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/10 text-red-200 w-full"
                role="menuitem"
              >
                <LogoutIcon />
                <span className="text-sm font-semibold">Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* --- tiny inline icons --- */
function GearIcon() {
  return (
    <svg className="h-5 w-5 text-white/80" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM3 13h2.1a7 7 0 0 0 .6 1.5L4.2 16l1.8 3.1 1.5-1.1a7 7 0 0 0 1.5.6V21h3v-2.1a7 7 0 0 0 1.5-.6l1.5 1.1 1.8-3.1-1.5-1.1a7 7 0 0 0 .6-1.5H21v-3h-2.1a7 7 0 0 0-.6-1.5l1.5-1.1L18 3.3l-1.5 1.1a7 7 0 0 0-1.5-.6V2h-3v1.9a7 7 0 0 0-1.5.6L7.9 3.3 6 6.4l1.5 1.1a7 7 0 0 0-.6 1.5H3v3Z"/>
    </svg>
  );
}
function HelpIcon() {
  return (
    <svg className="h-5 w-5 text-white/80" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm1.2-4.95v.2h-2.1v-.4c0-1 .6-1.6 1.5-2.1.7-.4 1-.7 1-1.2 0-.7-.6-1.2-1.5-1.2s-1.6.4-2.2 1l-1.3-1.5A4.66 4.66 0 0 1 12 5c2 0 3.6 1.2 3.6 3 0 1.2-.6 1.9-1.7 2.3-.7.4-1 .6-1 .97Z"/>
    </svg>
  );
}
function DisplayIcon() {
  return (
    <svg className="h-5 w-5 text-white/80" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 5h18v12H3V5Zm0 14h18v2H3v-2Z"/>
    </svg>
  );
}
function FeedbackIcon() {
  return (
    <svg className="h-5 w-5 text-white/80" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4h16v12H6l-2 2V4Zm4 4h8v2H8V8Zm0 4h6v2H8v-2Z"/>
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 17v2h-6V5h6v2H6v10h4Zm9-5-4-4v3h-5v2h5v3l4-4Z"/>
    </svg>
  );
}
