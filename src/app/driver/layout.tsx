"use client";
import React from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import ProfilePanel from "@/components/ProfilePanel";
import "@/app/styles/driver.css"; // ⬅️ correct path

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    // ⬇️ add data-role so styles in driver.css apply only here
    <div data-role="driver" className="min-h-screen flex flex-col bg-[var(--bg)]">
      {/* Topbar */}
      <Topbar title="Driver Transport Portal" />

      {/* Shell: sidebar + main + right rail */}
      <div className="flex flex-1">
        {/* Make sure Sidebar has className="sidebar app-sidebar" inside the component */}
        <Sidebar />

        {/* Mark this as app-main so our anti-fade styles target it */}
        <main className="app-main flex-1 p-5 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
          <div className="min-w-0">{children}</div>

          {/* Right rail */}
          <aside className="w-full">
            <div className="tl-profile"> 
            <ProfilePanel
              role="DRIVER"
              name="Jolo Rosales"
              code="D22-11451"
              faculty="Driver"
              campus="Lucena Campus"
              watermarkSrc="/euwhite.png"
            />
            </div>
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
