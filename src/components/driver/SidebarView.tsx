"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export type NavLink = {
  kind: "link";
  href: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
};

export type NavGroup = {
  kind: "group";
  href: string;   // parent page (/driver/maintenance)
  label: string;
  icon?: ReactNode;
  active?: boolean;     // parent active (exact match only)
  expanded?: boolean;   // if true, show children
  onToggle?: () => void; // optional; if omitted, no chevron
  children: NavLink[];  // child links
};

export type NavItem = NavLink | NavGroup;

export default function SidebarView({ items }: { items: NavItem[] }) {
  return (
    <nav className="w-[260px] h-full">
      <ul className="p-3 space-y-1">
        {items.map((it) => {
          if (it.kind === "link") {
            return (
              <li key={it.href} className="relative">
                {it.active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r bg-[#7a0019]" />}
                <Link
                  href={it.href}
                  className={[
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                    it.active ? "text-[#7a0019] bg-[#7a0019]/10 font-semibold"
                              : "text-neutral-700 hover:bg-neutral-100",
                  ].join(" ")}
                >
                  {it.icon && <span className="grid h-5 w-5 place-items-center">{it.icon}</span>}
                  <span>{it.label}</span>
                </Link>
              </li>
            );
          }

          // GROUP
          return (
            <li key={it.href} className="relative">
              {it.active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r bg-[#7a0019]" />}

              <div className="flex items-center">
                <Link
                  href={it.href}
                  className={[
                    "flex-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                    it.active ? "text-[#7a0019] bg-[#7a0019]/10 font-semibold"
                              : "text-neutral-700 hover:bg-neutral-100",
                  ].join(" ")}
                >
                  {it.icon && <span className="grid h-5 w-5 place-items-center">{it.icon}</span>}
                  <span>{it.label}</span>
                </Link>

                {/* show chevron only if onToggle exists */}
                {it.onToggle && (
                  <button
                    type="button"
                    onClick={it.onToggle}
                    className="mr-1 rounded p-1 text-neutral-600 hover:bg-neutral-100"
                    aria-label={it.expanded ? "Collapse" : "Expand"}
                  >
                    <ChevronDown className={["h-4 w-4 transition-transform", it.expanded ? "rotate-180" : ""].join(" ")} />
                  </button>
                )}
              </div>

              {it.expanded && it.children.length > 0 && (
                <ul className="mt-1 ml-7 space-y-1">
                  {it.children.map((c) => (
                    <li key={c.href} className="relative">
                      {c.active && <span className="absolute -left-3 top-1/2 -translate-y-1/2 h-4 w-1 rounded-r bg-[#7a0019]" />}
                      <Link
                        href={c.href}
                        className={[
                          "block rounded-lg px-3 py-1.5 text-sm",
                          c.active ? "text-[#7a0019] bg-[#7a0019]/10 font-semibold"
                                   : "text-neutral-700 hover:bg-neutral-100",
                        ].join(" ")}
                      >
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
