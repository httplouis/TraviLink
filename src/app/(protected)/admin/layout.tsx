// src/app/(protected)/admin/layout.tsx
import "@/app/globals.css";
import "@/app/styles/admin.css";

import type { Metadata } from "next";
import Topbar from "@/components/admin/nav/TopBar";           // <- filename is `Topbar.tsx`
import AdminLeftNav from "@/components/admin/nav/AdminLeftNav";
import RightRail from "@/components/admin/rail/RightRail";     // <- lives under nav/
import Breadcrumbs from "@/components/admin/nav/Breadcrumbs";

export const metadata: Metadata = {
  title: "TraviLink · Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-role="admin" className="h-dvh w-dvw overflow-hidden bg-neutral-50 text-neutral-900">
      {/* Sticky top bar */}
      <div className="tl-topbar">
        <Topbar />
      </div>

      {/* Fixed 3-column shell (left nav • main • right rail) */}
      <div className="tl-shell">
        {/* Left nav */}
        <aside className="tl-leftnav overflow-y-auto">
          <AdminLeftNav />
        </aside>

        {/* Main content (the only scroller) */}
        <main className="tl-main">
          <div className="mx-auto max-w-7xl px-6 py-5">
            <Breadcrumbs className="mb-4" />
            {children}
          </div>
        </main>

        {/* Right rail (hidden on xl-) */}
        <aside className="tl-rail overflow-y-auto hidden xl:block">
          <RightRail />
        </aside>
      </div>
    </div>
  );
}
