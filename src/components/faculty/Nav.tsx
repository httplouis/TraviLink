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
    <nav className="p-2 text-sm">
      <ul className="space-y-1">
        {items.map((i) => {
          const active =
            pathname === i.href ||
            (i.href !== "/faculty" && pathname.startsWith(i.href));
          return (
            <li key={i.href}>
              <Link
                href={i.href}
                className={`block rounded-md px-3 py-2 ${
                  active
                    ? "bg-[#7a0019]/10 text-[#7a0019] font-medium"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {i.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
