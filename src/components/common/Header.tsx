"use client";
import React from "react";
import { IconBell, IconSearch } from "@/components/ui/Icons";

export default function Header({
  onToggleNotifs,
  unread,
  notifOpen,
}: {
  onToggleNotifs: () => void;
  unread: number;
  notifOpen: boolean;
}) {
  return (
    <header className="bg-gradient-to-b from-[#7A0010] to-[#4E0009] text-white border-b border-black/10">
      <div className="w-full px-2 sm:px-4 py-2 flex items-center gap-3">
        <h1 className="text-sm sm:text-base font-semibold text-white">
          <span className="text-white">Admin</span> · <span className="text-white">TraviLink</span>
        </h1>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="relative text-neutral-500">
            <IconSearch />
            <input
              placeholder="Search schedules, vehicles, drivers…"
              className="h-9 w-[58vw] md:w-[46vw] 2xl:w-[720px] rounded-md border border-white/20 bg-white/95 pl-8 pr-3 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white transition-shadow hover:shadow-sm"
            />
          </div>
          <button
            aria-label="Notifications"
            aria-expanded={notifOpen}
            onClick={onToggleNotifs}
            className={`relative grid place-items-center h-9 w-9 rounded-md border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#7A0010] ${
              notifOpen ? "border-white/50 bg-white/15" : "border-white/30 bg-white/10 hover:bg-white/15 hover:-translate-y-0.5"
            } text-white`}
          >
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-rose-600 text-white text-[10px] leading-[18px] grid place-items-center px-1 shadow">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
            <IconBell />
          </button>
        </div>
      </div>
    </header>
  );
}
