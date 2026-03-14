import { X } from "lucide-react";
import { useEffect } from "react";
import {
  type AppliedCribSearch,
  getReminderSummaryLines,
} from "@/pages/cribs/search-reminder";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (filters: AppliedCribSearch) => void;
  filters: AppliedCribSearch | null;
  title?: string;
};

export function ReminderModal({
  open,
  onClose,
  onSubmit,
  filters,
  title = "Create reminder",
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !filters) return null;

  const summaryLines = getReminderSummaryLines(filters);

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Close reminder modal"
      />

      <div
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl border-t border-slate-100 bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto max-w-md px-4 pb-6 pt-4">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200" />

          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-slate-900">{title}</div>
              <div className="text-sm text-slate-500">
                We&apos;ll watch for new cribs matching these filters.
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-slate-100"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">
              Saved criteria
            </div>
            <div className="mt-3 space-y-2">
              {summaryLines.map((line) => (
                <div key={line} className="text-sm text-slate-600">
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-28 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              onClick={() => {
                onSubmit(filters);
                onClose();
              }}
            >
              Create reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
