"use client";

import Link from "next/link";
import { Bell, CircleUserRound } from "lucide-react";
import FacultyNav from "@/components/faculty/Nav";
import RightRail from "@/components/faculty/RightRail"; // put your Profile + KPIs + MiniCalendar here

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      {/* FIXED MAROON TOP BAR */}
      <header className="fixed inset-x-0 top-0 z-50 h-14 bg-[#7a0019] text-white">
        <div className="flex h-full items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-white text-[#7a0019] text-sm font-semibold">TL</span>
              <span className="font-medium">TraviLink</span>
            </Link>
            <span className="opacity-70">|</span>
            <span className="opacity-90">Faculty</span>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/faculty/notifications" className="relative rounded-full p-2 hover:bg-white/10" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-white px-[3px] text-[10px] leading-4 text-[#7a0019]">2</span>
            </Link>
            <Link href="/faculty/profile" className="rounded-full p-2 hover:bg-white/10" aria-label="Profile">
              <CircleUserRound className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </header>

      {/* APP SHELL: full viewport height minus header; only center scrolls */}
            <div
        className="
          pt-14
          h-[calc(100dvh-56px)]
          grid grid-cols-[260px_minmax(0,1fr)_360px]
          gap-6
          overflow-hidden
        "
      >
        {/* LEFT NAV */} 
        <aside className="h-full bg-white/90 border-r border-neutral-200">
          <div className="h-full p-3">
            <FacultyNav />
          </div>
        </aside>

        {/* CENTER (only this scrolls) */}
        <main className="min-w-0 h-full overflow-y-auto px-4 md:px-6">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>

        {/* RIGHT RAIL — add min-w-0 so children can shrink */}
        <aside className="h-full bg-white/90 border-l border-neutral-200 min-w-0">
          <div className="h-full p-3">
            <RightRail /> {/* see step 2 */}
          </div>
        </aside>
      </div>
    </div>
  );
}
