// src/components/admin/nav/AdminLeftNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string; icon?: React.ReactNode };

const NAV: Item[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/schedule", label: "Schedule" },
  { href: "/admin/drivers", label: "Drivers" },
  { href: "/admin/vehicles", label: "Vehicles" },
  { href: "/admin/maintenance", label: "Maintenance" },
  { href: "/admin/track", label: "Track / Live" },
  { href: "/admin/history", label: "History / Logs" },
  { href: "/admin/reports", label: "Reports / Exports" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLeftNav() {
  const pathname = usePathname();

  return (
    <nav className="p-3">
      <div className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-neutral-500">TRAVILINK</div>
      <ul className="space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={[
                  "group nav-item",
                  active ? "nav-item-active ring-1 ring-[var(--admin-brand)]/30" : "hover:bg-neutral-100"
                ].join(" ")}
              >
                {/* small bullet icon (kept inline to avoid extra deps) */}
                <span className={[
                  "h-2 w-2 rounded-full",
                  active ? "bg-white" : "bg-neutral-300 group-hover:bg-neutral-400"
                ].join(" ")} />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
