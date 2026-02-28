import React, { useMemo, useState } from "react";
import { X, MessageSquare, Bug, Lightbulb, HelpCircle } from "lucide-react";
import { useLocation } from "react-router";

type FeedbackType = "BUG" | "FEATURE" | "CONFUSING" | "OTHER";

type FeedbackPayload = {
  type: FeedbackType;
  message: string;
  path: string;
  userAgent: string;
  createdAt: string;
};

export function FeedbackButton({
  // If you have a bottom nav, pass its height so the button floats above it.
  bottomOffset = 84,
  // Set false if you only want to open feedback from Settings page.
  floating = true,
  // Optional: preselect type when launching from an error UI etc.
  defaultType = "OTHER",
  // Hook to send data somewhere (API / webhook). If omitted, it console.logs.
  onSubmit,
}: {
  bottomOffset?: number;
  floating?: boolean;
  defaultType?: FeedbackType;
  onSubmit?: (payload: FeedbackPayload) => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {floating && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={[
            "fixed z-40 right-4",
            "rounded-full border border-black/10 bg-white",
            "px-4 py-3 text-sm font-semibold text-black/80",
            "shadow-sm hover:bg-black/[0.03] transition",
            "inline-flex items-center gap-2",
          ].join(" ")}
          style={{ bottom: bottomOffset }}
          aria-label="Send feedback"
        >
          <MessageSquare size={16} className="text-black/60" />
          Feedback
        </button>
      )}

      <FeedbackModal
        open={open}
        onClose={() => setOpen(false)}
        defaultType={defaultType}
        onSubmit={onSubmit}
      />
    </>
  );
}

/**
 * If you want a Settings entry:
 * <button onClick={() => setOpen(true)}>Send feedback</button>
 * and render <FeedbackModal ... />
 */
export function FeedbackModal({
  open,
  onClose,
  defaultType = "OTHER",
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  defaultType?: FeedbackType;
  onSubmit?: (payload: FeedbackPayload) => Promise<void> | void;
}) {
  const location = useLocation();

  const [type, setType] = useState<FeedbackType>(defaultType);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Reset when opening
  React.useEffect(() => {
    if (!open) return;
    setType(defaultType);
    setMessage("");
    setSending(false);
    setSent(false);
  }, [open, defaultType]);

  const path = location.pathname + location.search;

  const payload: FeedbackPayload = useMemo(
    () => ({
      type,
      message: message.trim(),
      path,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      createdAt: new Date().toISOString(),
    }),
    [type, message, path],
  );

  const canSend = payload.message.length > 0 && !sending;

  const submit = async () => {
    if (!canSend) return;

    try {
      setSending(true);
      if (onSubmit) {
        await onSubmit(payload);
      } else {
        // TODO: wire to your API
        // await fetch("/api/feedback", { method: "POST", body: JSON.stringify(payload) })
        console.log("feedback payload", payload);
        await new Promise((r) => setTimeout(r, 350));
      }
      setSent(true);
    } catch (e) {
      console.error(e);
      alert("Failed to send feedback. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
        aria-label="Close feedback modal"
      />

      {/* Sheet */}
      <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-xl border-t border-black/10">
        <div className="max-w-md mx-auto px-4 pt-4 pb-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-black/85">
                Send feedback
              </div>
              <div className="text-sm text-black/55">
                Help us improve CampusCribs
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 rounded-full grid place-items-center hover:bg-black/5 transition"
              aria-label="Close"
              title="Close"
            >
              <X size={18} className="text-black/70" />
            </button>
          </div>

          {/* Body */}
          <div className="mt-4 flex flex-col gap-4">
            {/* Type chips */}
            <div className="text-sm font-semibold text-black/75">Type</div>
            <div className="grid grid-cols-2 gap-3">
              <TypeChip
                label="Bug"
                icon={<Bug size={16} />}
                selected={type === "BUG"}
                onClick={() => setType("BUG")}
              />
              <TypeChip
                label="Feature"
                icon={<Lightbulb size={16} />}
                selected={type === "FEATURE"}
                onClick={() => setType("FEATURE")}
              />
              <TypeChip
                label="Confusing"
                icon={<HelpCircle size={16} />}
                selected={type === "CONFUSING"}
                onClick={() => setType("CONFUSING")}
              />
              <TypeChip
                label="Other"
                icon={<MessageSquare size={16} />}
                selected={type === "OTHER"}
                onClick={() => setType("OTHER")}
              />
            </div>

            {/* Message */}
            <div className="text-sm font-semibold text-black/75">Message</div>
            <div className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What happened? What were you trying to do?"
                className="w-full min-h-[120px] text-sm text-black/80 font-[Inter] outline-none bg-transparent resize-none"
              />
            </div>

            {/* Sent state */}
            {sent ? (
              <div className="rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-black/70">
                Thanks! Your feedback was sent.
              </div>
            ) : null}
          </div>

          {/* Actions */}
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-28 rounded-2xl px-4 py-3 text-sm font-semibold text-black/60 hover:bg-black/[0.03] border border-black/10 transition"
            >
              Close
            </button>

            <button
              type="button"
              onClick={sent ? onClose : submit}
              disabled={!sent && !canSend}
              className="flex-1 rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-neutral-900 disabled:opacity-40"
            >
              {sent ? "Done" : sending ? "Sending..." : "Send feedback"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TypeChip({
  label,
  icon,
  selected,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl px-4 py-4 text-sm font-semibold",
        "border transition text-black/85",
        "flex items-center gap-2 justify-center",
        selected ? "border-neutral-900" : "border-black/10",
      ].join(" ")}
    >
      <span className="text-black/60">{icon}</span>
      {label}
    </button>
  );
}
