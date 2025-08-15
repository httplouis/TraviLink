"use client";

import React, { ReactNode } from "react";

/** Root page wrapper */
export function Page({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`min-h-screen bg-neutral-50 text-neutral-900 ${className}`}>
      {children}
    </div>
  );
}

/**
 * PageHeader
 * - Defaults to contained layout with a bottom border (like Gab's)
 * - Can mimic the simpler header (your version) by turning off `bordered`
 *   and adjusting outer margins via `className`.
 */
export function PageHeader({
  title,
  description,
  actions,
  bordered = true,
  className = "",
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  /** show bottom border line under the header */
  bordered?: boolean;
  className?: string;
}) {
  return (
    <div className={`bg-transparent ${className}`}>
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description ? (
            <p className="text-sm text-neutral-600">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex gap-2">{actions}</div> : null}
      </div>
      {bordered && <div className="border-b" />}
    </div>
  );
}

/**
 * PageBody
 * - Default is contained (max width + paddings) like Gab’s
 * - Set `contained={false}` to use simple stacked spacing (your version)
 */
export function PageBody({
  children,
  contained = true,
  className = "",
}: {
  children: ReactNode;
  /** if false, renders simple vertical spacing instead of container */
  contained?: boolean;
  className?: string;
}) {
  if (!contained) {
    return <div className={`space-y-4 ${className}`}>{children}</div>;
  }
  return (
    <div className={`mx-auto max-w-[1400px] px-4 md:px-6 py-5 ${className}`}>
      {children}
    </div>
  );
}
