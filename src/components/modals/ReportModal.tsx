import { X } from "lucide-react";
import { useEffect, useState } from "react";

export type ReportReason =
  | "HARASSMENT_HATE"
  | "SPAM_SCAM"
  | "INAPPROPRIATE"
  | "IMPERSONATION"
  | "OTHER";

export type ReportValues = {
  reason: ReportReason;
  details?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ReportValues) => void;
  title?: string; // e.g. "Report user" / "Report message"
};

const REASONS: { id: ReportReason; label: string; hint?: string }[] = [
  { id: "HARASSMENT_HATE", label: "Harassment or hate" },
  { id: "SPAM_SCAM", label: "Spam or scam" },
  { id: "INAPPROPRIATE", label: "Inappropriate content" },
  { id: "IMPERSONATION", label: "Impersonation" },
  { id: "OTHER", label: "Other" },
];

export const ReportModal = ({
  open,
  onClose,
  onSubmit,
  title = "Report",
}: Props) => {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState("");

  // Reset when opened
  useEffect(() => {
    if (!open) return;
    setReason(null);
    setDetails("");
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const canSubmit = reason !== null;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Close report modal"
      />

      {/* Bottom sheet */}
      <div
        className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-xl border-t border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-md mx-auto px-4 pt-4 pb-6">
          {/* Drag handle */}
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200" />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-slate-900">
                {title}
              </div>
              <div className="text-sm text-slate-500">
                Help us understand what’s going on
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 rounded-full grid place-items-center hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="mt-4 space-y-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Why are you reporting?
              </div>

              <div className="mt-2 space-y-2">
                {REASONS.map((r) => (
                  <label
                    key={r.id}
                    className={[
                      "flex items-start gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition",
                      reason === r.id
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="report-reason"
                      className="mt-1"
                      checked={reason === r.id}
                      onChange={() => setReason(r.id)}
                    />

                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900">
                        {r.label}
                      </div>
                      {r.hint && (
                        <div className="text-xs text-slate-500">{r.hint}</div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-700">
                Details (optional)
              </div>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Share any context that helps us review this..."
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm min-h-[96px] resize-none focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-28 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!canSubmit}
              className={[
                "flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                canSubmit
                  ? "bg-rose-600 hover:bg-rose-700 text-white"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed",
              ].join(" ")}
              onClick={() => {
                if (!reason) return;
                onSubmit({
                  reason,
                  details: details.trim() || undefined,
                });
                onClose();
              }}
            >
              Submit report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
