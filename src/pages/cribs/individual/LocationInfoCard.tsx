import React from "react";
import { MapPin, ShieldCheck, ExternalLink } from "lucide-react";

function openExternalMaps(label: string, lat?: number, lng?: number) {
  if (lat != null && lng != null) {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }
  // fallback: search query
  const q = encodeURIComponent(label);
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${q}`,
    "_blank",
    "noopener,noreferrer",
  );
}

export function LocationInfoCard({
  label,
  lat,
  lng,
}: {
  label: string;
  lat?: number;
  lng?: number;
}) {
  return (
    <div className="px-5 mt-5">
      <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
          <div className="text-sm font-semibold">Location</div>
          <div className="text-xs text-white/80 truncate">{label}</div>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Row: area */}
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-2xl bg-slate-900/5 grid place-items-center shrink-0">
              <MapPin size={18} className="text-slate-700" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900">Area</div>
              <div className="text-sm text-slate-600 break-words">{label}</div>
              <div className="text-xs text-slate-500 mt-1">
                Exact address is shared after you connect with the poster.
              </div>
            </div>
          </div>

          {/* Row: safety */}
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-2xl bg-slate-900/5 grid place-items-center shrink-0">
              <ShieldCheck size={18} className="text-slate-700" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900">Safety</div>
              <div className="text-sm text-slate-600">
                Don’t send deposits before touring. Keep communication in-app.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 flex items-center justify-end border-t border-slate-100">
          <button
            type="button"
            onClick={() => openExternalMaps(label, lat, lng)}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2 text-xs font-semibold shadow-sm hover:bg-slate-800"
          >
            Open in Maps <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
