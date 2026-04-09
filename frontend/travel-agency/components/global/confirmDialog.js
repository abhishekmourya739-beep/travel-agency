"use client";

import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Keep it",
  loading = false,
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-[#0c1222] p-6 text-white shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-rose-400/20 bg-rose-400/10">
          <AlertTriangle className="h-7 w-7 text-rose-200" />
        </div>

        <h3 className="mt-5 text-2xl font-semibold">{title}</h3>
        <p className="mt-3 leading-7 text-white/70">{message}</p>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white/80 transition hover:bg-white/10 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex flex-1 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 font-semibold text-rose-200 transition hover:bg-rose-400/15 disabled:opacity-50"
          >
            {loading ? "Cancelling..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
