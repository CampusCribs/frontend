import React from "react";
import { ExternalLink, Footprints, MapPin, ShieldCheck } from "lucide-react";
import Map, { Marker } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

function openExternalMaps(label: string, lat?: number, lng?: number) {
  if (lat != null && lng != null) {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  const query = encodeURIComponent(label);
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${query}`,
    "_blank",
    "noopener,noreferrer",
  );
}

function radiusStyle(commuteBucket?: string) {
  switch (commuteBucket) {
    case "WALK_5":
      return "h-20 w-20";
    case "WALK_10":
      return "h-28 w-28";
    case "WALK_15":
      return "h-36 w-36";
    case "WALK_20":
      return "h-44 w-44";
    case "DRIVE":
      return "h-56 w-56";
    default:
      return "h-28 w-28";
  }
}

function commuteLabel(commuteBucket?: string) {
  switch (commuteBucket) {
    case "WALK_5":
      return "About a 5 minute walk from campus";
    case "WALK_10":
      return "About a 10 minute walk from campus";
    case "WALK_15":
      return "About a 15 minute walk from campus";
    case "WALK_20":
      return "About a 20 minute walk from campus";
    case "DRIVE":
      return "A short drive from campus";
    default:
      return "Near campus";
  }
}

export function LocationInfoCard({
  label,
  lat,
  lng,
  commuteBucket,
}: {
  label: string;
  lat?: number;
  lng?: number;
  commuteBucket?: string;
}) {
  const radiusClass = radiusStyle(commuteBucket);

  return (
    <div className="mt-5 px-5">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-slate-900 px-4 py-3 text-white">
          <div className="text-sm font-semibold">Campus area</div>
          <div className="truncate text-xs text-white/80">{label}</div>
        </div>

        {lat != null && lng != null ? (
          <div className="relative h-72 w-full">
            <div className="absolute left-3 top-3 z-10 rounded-full border border-slate-200 bg-white/95 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">
              Approximate area
            </div>

            <Map
              mapLib={maplibregl}
              initialViewState={{ latitude: lat, longitude: lng, zoom: 13 }}
              mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
              style={{ width: "100%", height: "100%" }}
              attributionControl={false}
              scrollZoom={false}
              dragPan={false}
              doubleClickZoom={false}
              dragRotate={false}
              touchZoomRotate={false}
            >
              <Marker latitude={lat} longitude={lng} anchor="center">
                <div className="relative flex items-center justify-center">
                  <div
                    className={[
                      "rounded-full border border-slate-900/20 bg-slate-900/10",
                      radiusClass,
                    ].join(" ")}
                  />
                  <div className="absolute h-4 w-4 rounded-full bg-slate-900 ring-4 ring-white shadow-md" />
                </div>
              </Marker>
            </Map>
          </div>
        ) : null}

        <div className="space-y-4 px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-900/5">
              <MapPin size={18} className="text-slate-700" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900">Campus</div>
              <div className="break-words text-sm text-slate-600">{label}</div>
              <div className="mt-1 text-xs text-slate-500">
                The map is centered on campus, not the exact home address.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-900/5">
              <Footprints size={18} className="text-slate-700" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900">Distance</div>
              <div className="text-sm text-slate-600">
                {commuteLabel(commuteBucket)}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-900/5">
              <ShieldCheck size={18} className="text-slate-700" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900">Safety</div>
              <div className="text-sm text-slate-600">
                Do not send deposits before touring. Keep communication in-app.
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-slate-100 px-4 py-3">
          <button
            type="button"
            onClick={() => openExternalMaps(label, lat, lng)}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Open in Maps <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
