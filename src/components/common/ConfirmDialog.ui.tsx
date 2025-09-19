"use client";
export function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="border-b px-4 py-3 text-sm font-semibold">{title}</div>
        <div className="px-4 py-4 text-sm text-gray-700">{message}</div>
        <div className="flex justify-end gap-2 border-t px-4 py-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white shadow hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
