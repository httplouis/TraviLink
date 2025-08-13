"use client";
import React from "react";

export function Page({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-neutral-50">{children}</div>;
}

export function PageHeader({
  title,
  description,
  actions,
}: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-20 bg-white border-b px-4 md:px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">{title}</h1>
        {description && <p className="text-sm text-neutral-500">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function PageBody({ children }: { children: React.ReactNode }) {
  return <div className="p-4 md:p-6">{children}</div>;
}
