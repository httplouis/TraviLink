"use client";

import Link from "next/link";
import { Calendar, Wrench, Clock, User, Settings, Activity } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const items = [
  { href: "/driver/schedule", label: "Schedule", icon: Calendar },
  { href: "/driver/status", label: "Update Status", icon: Activity },
  { href: "/driver/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/driver/history", label: "History", icon: Clock },
  { href: "/driver/profile", label: "Profile", icon: User },
  { href: "/driver/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-[232px] lg:w-[248px] shrink-0 border-r border-neutral-200 bg-white">
      <nav className="w-full mt-2">
        <ul className="px-3 py-4 space-y-1">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname?.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
                    active
                      ? "bg-[var(--muted-250)] text-[var(--ink-900)]"
                      : "text-[var(--ink-700)] hover:bg-[var(--muted-200)]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="truncate">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
