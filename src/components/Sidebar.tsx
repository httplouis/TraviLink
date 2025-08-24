"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Calendar,
  Activity,
  Wrench,
  Clock,
  User,
  Settings,
  PlusCircle,
} from "lucide-react";

const items = [
  { href: "/driver", label: "Dashboard", icon: LayoutDashboard },
  { href: "/driver/schedule", label: "Schedule", icon: Calendar },
  { href: "/driver/status", label: "Update Status", icon: Activity },
  { href: "/driver/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/driver/history", label: "History", icon: Clock },
  { href: "/driver/profile", label: "Profile", icon: User },
  { href: "/driver/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const onSubmitMaintenance =
    pathname === "/driver/maintenance/submit" ||
    pathname?.startsWith("/driver/maintenance/submit?");

  return (
    <aside className="hidden md:flex md:w-[232px] lg:w-[248px] shrink-0 border-r border-neutral-200 bg-white">
      <nav className="w-full mt-2">
        <ul className="px-3 py-4 space-y-1">
          {items.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || (href !== "/driver" && pathname?.startsWith(href));
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

                {/* Show submenu ONLY when user is on the submit page */}
                {href === "/driver/maintenance" && onSubmitMaintenance && (
                  <ul className="ml-9 mt-1 space-y-1">
                    <li>
                      <Link
                        href="/driver/maintenance/submit"
                        className={clsx(
                          "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm",
                          "bg-[var(--muted-250)] text-[var(--ink-900)]"
                        )}
                      >
                        <PlusCircle className="h-4 w-4" />
                        <span>Submit a maintenance</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
