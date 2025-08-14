"use client";

import Link from "next/link";
import { Bell, CircleUserRound } from "lucide-react";
import { Page } from "@/components/common/Page";
import FacultyNav from "@/components/faculty/Nav";

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Page>
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white border-b">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-[#7a0019] text-white text-sm font-semibold">
                F
              </span>
              <span className="font-medium">TraviLink</span>
            </Link>
            <span className="text-neutral-400">•</span>
            <span className="text-neutral-600">Faculty</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/faculty/notifications"
              className="relative rounded-full p-2 hover:bg-neutral-100"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-[#7a0019] text-white text-[10px] leading-4 text-center px-[3px]">
                2
              </span>
            </Link>
            <Link
              href="/faculty/profile"
              className="rounded-full p-2 hover:bg-neutral-100"
              aria-label="Profile"
            >
              <CircleUserRound className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </header>

      {/* Shell */}
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-4 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
        <aside className="bg-white border rounded-lg p-3">
          <FacultyNav />
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </Page>
  );
}
