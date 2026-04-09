"use client";

import { Loader2, TriangleAlert, X, Trash2 } from "lucide-react";
import { useState } from "react";

export default function DeleteAccountModal({
  open,
  onClose,
  onConfirm,
  deleting,
}) {
  const [confirmText, setConfirmText] = useState("");

  if (!open) return null;

  const handleClose = () => {
    if (deleting) return;
    setConfirmText("");
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(confirmText, () => setConfirmText(""));
  };

  return (
    <div className="fixed inset-0 z-2000 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-3xl border border-red-400/20 bg-slate-950 p-6 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-red-500/10 p-3">
              <TriangleAlert className="h-6 w-6 text-red-300" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-red-200">
                Deactivate Account
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Your account will be soft deleted and deactivated. You can no
                longer use it unless restored from backend/admin side.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-red-400/15 bg-red-500/5 p-4">
          <p className="text-sm text-red-100/80">
            Type <span className="font-bold text-red-200">DELETE</span> to
            confirm deactivation.
          </p>

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE"
            className="mt-4 w-full rounded-2xl border border-red-400/20 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-red-300/70"
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:opacity-70"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deactivating...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Confirm
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
