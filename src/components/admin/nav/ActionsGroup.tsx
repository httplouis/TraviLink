"use client";

import { useState, useRef, useEffect } from "react";

const BRAND = "#7A0010";
const BRAND_HOVER = "#60000C";

export default function ActionsGroup() {
  return (
    <div className="flex items-center gap-2">
      {/* Primary action */}
      <button
        className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        style={{ background: BRAND }}
        onMouseOver={(e) => (e.currentTarget.style.background = BRAND_HOVER)}
        onMouseOut={(e) => (e.currentTarget.style.background = BRAND)}
        onClick={() => console.log("TODO: open New Request modal / route")}
      >
        + New Request
      </button>

      {/* Split/drop button examples */}
      <SplitDropdown
        label="+ Schedule"
        items={[
          { label: "Create schedule", onClick: () => console.log("Create schedule") },
          { label: "Recurring template", onClick: () => console.log("Recurring template") },
          { label: "Import from CSV", onClick: () => console.log("Import CSV") },
        ]}
      />
      <SplitDropdown
        label="+ Maintenance"
        items={[
          { label: "New maintenance log", onClick: () => console.log("New maintenance log") },
          { label: "Preventive schedule", onClick: () => console.log("Preventive schedule") },
          { label: "Parts inventory", onClick: () => console.log("Parts inventory") },
        ]}
      />
    </div>
  );
}

/* --- small split dropdown button --- */
function SplitDropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; onClick: () => void }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const off = (e: MouseEvent) => {
      if (!ref.current) return;
      if (open && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", off);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", off);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        className="inline-flex items-center rounded-full bg-white/12 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <svg className="ml-1 h-4 w-4 opacity-85" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 7 10 11.5 14.5 7l1 1L10 14 4.5 8l1-1Z"/></svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 min-w-[220px] rounded-lg bg-white p-1 text-neutral-900 shadow-2xl ring-1 ring-black/10">
          {items.map((it) => (
            <button
              key={it.label}
              onClick={() => { setOpen(false); it.onClick(); }}
              className="flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-neutral-50"
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
