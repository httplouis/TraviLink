"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/faculty", label: "Dashboard" },
  { href: "/faculty/schedule", label: "Schedule" },
  { href: "/faculty/request", label: "Request" },
  { href: "/faculty/profile", label: "Profile" },
  { href: "/faculty/feedback", label: "Feedback" },
];

export default function FacultyNav() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="space-y-1">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={`nav-item ${active ? "nav-item-active" : ""}`}
              >
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
