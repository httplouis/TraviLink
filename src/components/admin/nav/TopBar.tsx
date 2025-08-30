// src/components/admin/nav/TopBar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function TopBar() {
  const [q, setQ] = useState("");

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
        <button className="ml-1 flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1.5 text-sm text-white hover:bg-white/15">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/30 font-semibold">A</span>
          <span className="hidden sm:block">Admin</span>
          <svg className="h-4 w-4 opacity-80" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 7 10 11.5 14.5 7l1 1L10 14 4.5 8l1-1Z"/></svg>
        </button>
      </div>
    </header>
  );
}
