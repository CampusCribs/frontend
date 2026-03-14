import React, { useEffect, useMemo, useState } from "react";
import { Copy, Share2, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;

  /** The URL you want to share (listing/profile/community post link) */
  url: string;

  /** Optional title shown in the header */
  title?: string;

  /** Optional prefilled message for SMS/email */
  message?: string;

  /** Called after a successful copy */
  onCopied?: () => void;
};

export default function ShareModal({
  open,
  onClose,
  url,
  title = "Share",
  message,
  onCopied,
}: Props) {
  const [copied, setCopied] = useState(false);

  // Reset + ESC close
  useEffect(() => {
    if (!open) return;
    setCopied(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const encodedUrl = useMemo(() => encodeURIComponent(url), [url]);
  const encodedMsg = useMemo(
    () => encodeURIComponent(message ? `${message}\n${url}` : url),
    [message, url],
  );

  if (!open) return null;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      onCopied?.();
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback (older iOS)
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      onCopied?.();
      window.setTimeout(() => setCopied(false), 1500);
    }
  }

  async function handleNativeShare() {
    try {
      // @ts-expect-error web share
      if (navigator.share) {
        // @ts-expect-error web share
        await navigator.share({ title, text: message, url });
        onClose();
      }
    } catch {
      // user cancelled or share failed – silently ignore
    }
  }

  const nativeShareSupported =
    // @ts-expect-error web share
    typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Close share modal"
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
              <div className="text-sm text-slate-500">Send this link</div>
            </div>

            <button
              type="button"
              className="h-10 w-10 rounded-full grid place-items-center hover:bg-slate-100 transition"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="mt-4 space-y-4">
            {/* URL preview */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-semibold text-slate-500">
                Link
              </div>
              <div className="text-sm text-slate-800 break-all mt-1">{url}</div>
            </div>

            {/* Actions grid */}
            <div className="grid grid-cols-2 gap-2">
              <ActionButton
                icon={<Copy size={18} />}
                label={copied ? "Copied!" : "Copy link"}
                onClick={handleCopy}
              />

              <ActionButton
                icon={<Share2 size={18} />}
                label="Share…"
                onClick={handleNativeShare}
                disabled={!nativeShareSupported}
                hint={!nativeShareSupported ? "Not supported" : undefined}
              />
            </div>

            {/* Optional extra quick actions (kept tiny) */}
            <div className="grid grid-cols-2 gap-2">
              <a
                className="rounded-xl border border-slate-200 px-3 py-3 text-left transition hover:bg-slate-50"
                href={`sms:&body=${encodedMsg}`}
              >
                <div className="text-sm font-semibold text-slate-900">Text</div>
                <div className="mt-1 text-[11px] text-slate-500">
                  Open Messages
                </div>
              </a>

              <a
                className="rounded-xl border border-slate-200 px-3 py-3 text-left transition hover:bg-slate-50"
                href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodedMsg}`}
              >
                <div className="text-sm font-semibold text-slate-900">
                  Email
                </div>
                <div className="mt-1 text-[11px] text-slate-500">Open Mail</div>
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5">
            <button
              type="button"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  hint,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "rounded-xl border border-slate-200 px-3 py-3 text-left transition",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-center gap-2 text-slate-800">
        {icon}
        <span className="text-sm font-semibold">{label}</span>
      </div>
      {hint ? (
        <div className="mt-1 text-[11px] text-slate-500">{hint}</div>
      ) : null}
    </button>
  );
}
