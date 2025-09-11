"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { CalendarDays, LayoutGrid, User2, PlusSquare, Settings as Cog, Wrench } from "lucide-react";
import SidebarView, { type NavItem, type NavLink, type NavGroup } from "@/components/driver/SidebarView";

function scoreMatch(pathname: string, href: string) {
  const a = (pathname || "/").replace(/\/+$/, "");
  const b = href.replace(/\/+$/, "");
  if (a === b) return b.length;
  if (a.startsWith(b + "/")) return b.length;
  return -1;
}

export default function Sidebar() {
  const pathname = usePathname() || "/";

  const showSubmitChild = pathname.startsWith("/driver/maintenance/submit"); // 👈 only show on submit page

  const topLinks: NavLink[] = [
    { kind: "link", href: "/driver",          label: "Dashboard", icon: <LayoutGrid className="h-4 w-4" /> },
    { kind: "link", href: "/driver/schedule", label: "Schedule",  icon: <CalendarDays className="h-4 w-4" /> },
    { kind: "link", href: "/driver/profile",  label: "Profile",   icon: <User2 className="h-4 w-4" /> },
    { kind: "link", href: "/driver/settings", label: "Settings",  icon: <Cog className="h-4 w-4" /> },
  ];

  const maintenanceGroup: NavGroup = {
    kind: "group",
    href: "/driver/maintenance",
    label: "Maintenance",
    icon: <Wrench className="h-4 w-4" />,
    expanded: showSubmitChild,       // expand only when on submit route
    // no onToggle -> no chevron button
    children: showSubmitChild
      ? [{ kind: "link", href: "/driver/maintenance/submit", label: "Submit Maintenance", icon: <PlusSquare className="h-4 w-4" /> }]
      : [],
  };

  // longest-prefix wins to keep only one active item
  const allLinksFlat: NavLink[] = [
    ...topLinks,
    { kind: "link", href: maintenanceGroup.href, label: maintenanceGroup.label, icon: maintenanceGroup.icon },
    ...maintenanceGroup.children,
  ];

  const activeHref = useMemo(
    () =>
      allLinksFlat.reduce(
        (best, it) => {
          const s = scoreMatch(pathname, it.href);
          return s > best.score ? { href: it.href, score: s } : best;
        },
        { href: "", score: -1 }
      ).href,
    [pathname]
  );

  const mark = (l: NavLink): NavLink => ({ ...l, active: l.href === activeHref });
  const markedTop = topLinks.map(mark);
  const markedGroup: NavGroup = {
    ...maintenanceGroup,
    active: maintenanceGroup.href === activeHref, // parent active only when exactly on /driver/maintenance
    children: maintenanceGroup.children.map(mark),
  };

  const items: NavItem[] = [
    ...markedTop.slice(0, 2),
    markedGroup,
    ...markedTop.slice(2),
  ];

  return <SidebarView items={items} />;
}
