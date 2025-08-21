"use client";
import { useState } from "react";
import Link from "next/link";
import { PageHeader, PageBody } from "@/components/common/Page";

export default function FacultyNotificationsPage() {
  const [tab, setTab] = useState<"unread" | "all">("unread");

  // No data yet (temporary)
  const unreadCount = 0;
  const allCount = 0;

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Your recent updates and alerts."
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              disabled
              className="rounded-md border px-3 py-2 text-sm text-neutral-400 cursor-not-allowed"
              title="No notifications to mark as read"
            >
              Mark all read
            </button>
            <button
              onClick={() => {/* placeholder refresh */}}
              className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
            >
              Refresh
            </button>
          </div>
        }
      />

      <PageBody>
        {/* Tabs */}
        <div className="rounded-lg border bg-white p-2">
          <div className="flex items-center gap-2">
            <TabButton
              active={tab === "unread"}
              onClick={() => setTab("unread")}
              label={`Unread (${unreadCount})`}
            />
            <TabButton
              active={tab === "all"}
              onClick={() => setTab("all")}
              label={`All (${allCount})`}
            />
          </div>
        </div>

        {/* Empty state */}
        <div className="mt-4 rounded-lg border bg-white p-8 text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-neutral-100 grid place-items-center">
            <BellEmpty />
          </div>
          <h2 className="text-base font-semibold">You’re all caught up</h2>
          <p className="mt-1 text-sm text-neutral-600">
            No {tab === "unread" ? "unread " : ""}notifications yet. New updates about requests,
            schedules, and approvals will appear here.
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link
              href="/faculty/request"
              className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
            >
              Submit a Request
            </Link>
            <Link
              href="/faculty/schedule"
              className="rounded-md bg-[#7a0019] text-white px-3 py-2 text-sm"
            >
              View Schedule
            </Link>
          </div>
        </div>

        {/* (Optional) Tips card */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-lg border bg-white p-4">
            <h3 className="font-medium">What you’ll see here</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700 space-y-1">
              <li>Request status changes (Approved / Rejected / Needs info)</li>
              <li>Assigned vehicle and driver for your trips</li>
              <li>Schedule updates and reminders</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <h3 className="font-medium">Manage alerts</h3>
            <p className="mt-2 text-sm text-neutral-700">
              Control email/push notifications in{" "}
              <Link href="/faculty/profile" className="text-[#7a0019] underline">
                Profile &gt; Preferences
              </Link>.
            </p>
          </div>
        </div>
      </PageBody>
    </>
  );
}

/* ---------------- UI helpers ---------------- */
function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-sm rounded-md border ${
        active ? "bg-[#7a0019] text-white border-[#7a0019]" : "hover:bg-neutral-50"
      }`}
    >
      {label}
    </button>
  );
}

function BellEmpty(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" fill="none" {...props}>
      <path strokeWidth="2" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
      <path strokeWidth="2" d="M9 17a3 3 0 0 0 6 0" />
    </svg>
  );
}
