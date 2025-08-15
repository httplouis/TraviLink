"use client";
import React from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import ProfilePanel from "@/components/ProfilePanel";

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    // Topbar sits at the very top; content (sidebar + page) is below it
    <div className="min-h-screen flex flex-col bg-[#f4f5f7]">
      {/* Full-width top bar */}
      <Topbar title="Driver Transport Portal" />

      {/* Below the topbar: sidebar + main content */}
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-5 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
          <div className="min-w-0">{children}</div>

          {/* Right rail: maroon profile rectangle; quick note removed */}
          <aside className="w-full">
            <ProfilePanel
              role="DRIVER"
              name="Jolo Rosales"
              code="D22-11451"
              faculty="Driver" // Changed from Faculty to Driver
              campus="Lucena Campus"
              watermarkSrc="/euwhite.png" // ensure this exists in /public
            />

            {/* Compact stats */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-neutral-200 bg-white p-3 text-center">
                <div className="text-[22px] font-semibold text-neutral-900 leading-none">5</div>
                <div className="mt-1 text-xs text-neutral-500">Active Requests</div>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-3 text-center">
                <div className="text-[22px] font-semibold text-neutral-900 leading-none">3</div>
                <div className="mt-1 text-xs text-neutral-500">Vehicles Online</div>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-3 text-center">
                <div className="text-[22px] font-semibold text-neutral-900 leading-none">4</div>
                <div className="mt-1 text-xs text-neutral-500">Pending Approvals</div>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
