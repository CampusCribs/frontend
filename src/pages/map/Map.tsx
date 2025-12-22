import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

// Fix default marker icon paths (common gotcha in Vite/React)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type Listing = {
  id: string;
  name: string;
  details: string;
  imageUrl: string;
  position: { lat: number; lng: number };
};

export default function Map() {
  return (
    <div className="h-screen w-full relative">
      {/* Map layer */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[39.1317, -84.5167]}
          zoom={14}
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* markers... */}
        </MapContainer>
      </div>

      {/* Bottom sheet overlay (always on top) */}
      <div className="absolute inset-x-0 bottom-30 z-[9999] p-4">
        <div className="mx-auto w-full max-w-xl">
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur border">
            <img
              src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=400&q=80"
              className="h-16 w-16 shrink-0 rounded-xl object-cover"
              alt="home"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                Oak Street House
              </p>
              <p className="text-sm text-gray-600 line-clamp-2">
                Roommate Needed • 8 min to campus • Chill vibes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
