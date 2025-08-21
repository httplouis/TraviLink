"use client";
import React from "react";

export default function SettingsPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50 overflow-hidden">
      <h1 className="animate-marquee text-5xl font-bold text-[#7a0019] whitespace-nowrap">
        Pogi ni Jolo Rosales 💯🔥
      </h1>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
