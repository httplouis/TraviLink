"use client";
import * as React from "react";

type BusyKind = "approve" | "reject" | "delete" | null;

type Props = {
  selectedCount: number;
  breakdown: Record<string, number>;
  onApprove: () => void;
  onReject: () => void; // opens confirm
  onDelete: () => void; // opens confirm
  onExport: () => void;
  onClear: () => void;
  busy?: BusyKind;
};

export default function BulkBarUI({
  selectedCount,
  breakdown,
  onApprove,
  onReject,
  onDelete,
  onExport,
  onClear,
  busy = null,
}: Props) {
  const disabled = selectedCount === 0 || busy !== null;

  return (
    <div className="sticky top-[calc(var(--sticky-offset,56px)+4px)] z-20 flex items-center gap-3 rounded-md border bg-white px-3 py-2 shadow">
      <div className="text-sm font-medium">
        {selectedCount > 0
          ? `${selectedCount} selected` +
            Object.entries(breakdown)
              .map(([status, n]) => ` · ${n} ${status}`)
              .join("")
          : "No selection"}
      </div>

      <div className="ml-auto flex flex-wrap gap-2">
        <Button
          onClick={onApprove}
          disabled={disabled}
          busy={busy === "approve"}
          kind="primary"
          title="Approve selected (Ctrl+Enter)"
        >
          Approve
        </Button>

        <Button
          onClick={onReject}
          disabled={disabled}
          busy={busy === "reject"}
          kind="danger"
          title="Reject selected (asks to confirm)"
        >
          Reject
        </Button>

        <Button
          onClick={onDelete}
          disabled={disabled}
          busy={busy === "delete"}
          title="Delete selected (asks to confirm)"
        >
          Delete
        </Button>

        <button
          disabled={selectedCount === 0 || busy !== null}
          onClick={onExport}
          className="rounded border px-2 py-1 text-xs disabled:opacity-50"
          title="Export selected to CSV"
        >
          Export
        </button>

        <button
          disabled={selectedCount === 0 || busy !== null}
          onClick={onClear}
          className="rounded border px-2 py-1 text-xs disabled:opacity-50"
          title="Clear selection"
        >
          Clear
        </button>

        {/* Hotkeys tooltip */}
        <div className="relative group ml-3">
          <span className="cursor-help text-xs text-neutral-500">?</span>
          <div className="absolute right-0 top-full mt-1 hidden w-52 rounded bg-black p-2 text-xs text-white group-hover:block">
            <p><kbd>A</kbd> select all on page</p>
            <p><kbd>X</kbd> clear selection</p>
            <p><kbd>← / →</kbd> prev / next page</p>
            <p><kbd>Ctrl+Enter</kbd> approve bulk</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button({
  children,
  onClick,
  disabled,
  busy,
  kind,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  busy?: boolean;
  kind?: "primary" | "danger";
  title?: string;
}) {
  const base =
    "inline-flex items-center gap-1 rounded px-2 py-1 text-xs disabled:opacity-50";
  const style =
    kind === "primary"
      ? "bg-green-600 text-white"
      : kind === "danger"
      ? "bg-red-600 text-white"
      : "border";
  return (
    <button
      disabled={disabled || busy}
      onClick={onClick}
      className={`${base} ${style}`}
      title={title}
    >
      {busy && <Spinner />}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="h-3 w-3 animate-spin"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4A4 4 0 004 12z"
      />
    </svg>
  );
}
