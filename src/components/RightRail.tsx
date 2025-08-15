"use client";
import React from "react";

type ProfilePanelProps = {
  role?: "DRIVER" | "ADMIN" | "FACULTY" | string;
  name?: string;
  code?: string;
  faculty?: string;
  campus?: string;
  watermarkSrc?: string; // e.g. "/euwhite.png" in /public
};

function initials(full?: string) {
  if (!full) return "DR"; // safe fallback
  return full
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

export default function ProfilePanel({
  role = "DRIVER",
  name = "Driver",
  code = "—",
  faculty = "Faculty",
  campus = "Lucena Campus",
  watermarkSrc = "/euwhite.png",
}: ProfilePanelProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#7A0E20] text-white">
      {/* subtle watermark */}
      <img
        src={watermarkSrc}
        alt=""
        className="pointer-events-none select-none absolute right-[-24px] top-[-24px] h-40 w-40 opacity-15"
      />

      <div className="p-5 sm:p-6 flex items-start gap-4">
        {/* avatar */}
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20 text-white font-semibold">
          {initials(name)}
        </div>

        {/* identity */}
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide opacity-90">Profile • {role}</div>
          <div className="mt-0.5 text-lg font-semibold leading-tight truncate">{name}</div>
          <div className="text-sm opacity-90">Code: {code}</div>

          {/* chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium ring-1 ring-white/25">
              {faculty}
            </span>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium ring-1 ring-white/25">
              {campus}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
