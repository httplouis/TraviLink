"use client";
import React from "react";

export default function CTA({
  tone = "primary",
  className = "",
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "ghost" | "success" | "danger";
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-3 py-[7px] text-[13px] sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-offset-2";
  const tones: Record<string, string> = {
    primary:
      "bg-[#7A0010] text-white shadow-sm shadow-[#7A0010]/20 hover:shadow-md hover:shadow-[#7A0010]/25 hover:-translate-y-0.5 hover:bg-[#66000D] focus:ring-[#7A0010]",
    ghost:
      "bg-white/70 text-neutral-800 ring-1 ring-neutral-200 hover:bg-neutral-100/80 hover:-translate-y-0.5 focus:ring-neutral-300",
    success:
      "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 hover:-translate-y-0.5 focus:ring-emerald-300",
    danger:
      "bg-rose-50 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100 hover:-translate-y-0.5 focus:ring-rose-300",
  };
  return (
    <button className={`${base} ${tones[tone]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
