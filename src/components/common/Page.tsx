"use client";
import React from "react";

export function Page({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-neutral-50 text-neutral-900">{children}</div>;
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="bg-transparent">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description && (
            <p className="text-sm text-neutral-600">{description}</p>
          )}
        </div>
        {actions}
      </div>
      <div className="border-b" />
    </div>
  );
}

export function PageBody({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-5">{children}</div>;
}
