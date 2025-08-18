"use client";
import React from "react";

export default function Badge({
  color = "gray",
  children,
}: {
  color?: "green" | "red" | "amber" | "blue" | "gray";
  children: React.ReactNode;
}) {
  const map: Record<string, string> = {
    green: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    red: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
    amber: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
    blue: "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
    gray: "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-150 ${map[color]}`}>
      {children}
    </span>
  );
}
