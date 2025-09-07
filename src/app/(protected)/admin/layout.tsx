import "@/app/globals.css";
import "@/app/styles/admin.css";

import type { Metadata } from "next";
import Topbar from "@/components/admin/nav/TopBar";
import AdminLeftNav from "@/components/admin/nav/AdminLeftNav";
import Breadcrumbs from "@/components/admin/nav/Breadcrumbs";

export const metadata: Metadata = {
  title: "TraviLink · Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-role="admin"
      className="h-dvh w-full bg-neutral-50 text-neutral-900" // fixed to viewport height; page itself won't scroll
    >
      {/* Sticky top bar (56px assumed) */}
      <div className="tl-topbar">
        <Topbar />
      </div>

      {/* 2-column shell: LeftNav • Main */}
      <div className="tl-shell">
        {/* Left nav */}
        <aside className="tl-leftnav overflow-y-auto">
          <AdminLeftNav />
        </aside>

        {/* Main (ONLY scroller) */}
        <main className="tl-main overflow-y-auto min-w-0">
          <div className="mx-auto max-w-7xl px-6 py-5">
            <Breadcrumbs className="mb-4" />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
