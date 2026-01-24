import { useEffect, useMemo, useState } from "react";
import { Copy, MessageCircle, Mail, Share2, X } from "lucide-react";

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
      // iOS Safari supports this in many cases
      // @ts-expect-error web share
      if (navigator.share) {
        // @ts-expect-error web share
        await navigator.share({ title, text: message, url });
        onClose();
      } else {
        // if not supported, do nothing (user can use other buttons)
      }
    } catch {
      // user cancelled or share failed – silently ignore
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="font-semibold text-slate-900">{title}</div>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-slate-100 transition"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 space-y-4">
          {/* URL preview */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="text-[11px] font-semibold text-slate-500">Link</div>
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
              disabled={
                // @ts-expect-error web share
                typeof navigator !== "undefined" && !navigator.share
              }
              hint={
                // @ts-expect-error web share
                typeof navigator !== "undefined" && !navigator.share
                  ? "Not supported"
                  : undefined
              }
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4">
          <button
            type="button"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
            onClick={onClose}
          >
            Done
          </button>
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
