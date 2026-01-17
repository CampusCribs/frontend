import {
  ArrowLeftIcon,
  Calendar,
  CircleUserRound,
  DollarSign,
  Tag,
  Users,
} from "lucide-react";
import IndividualSlider from "./IndividualSlider";
import { useNavigate } from "react-router";
import { useEffect, useMemo } from "react";

// MapLibre
import Map, { Marker } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Tag = { name: string };

type FakePost = {
  id: string;
  userId: string;
  userThumbnailUrl?: string;

  firstName: string;
  lastName: string;
  username: string;
  institutionName: string;

  title: string;
  description: string;
  price: number;
  roommates: number;
  termStartDate: string; // ISO
  termEndDate: string; // ISO

  tags: Tag[];
  mediaIds: string[];

  location: { lat: number; lng: number; label: string };
};

const FAKE_POST: FakePost = {
  id: "post_123",
  userId: "user_abc",
  userThumbnailUrl: "", // set a URL to show image

  firstName: "Johnny",
  lastName: "Edwards",
  username: "johnnyedwards",
  institutionName: "University of California, Berkeley",

  title: "Sunny Private Room on Short Vine",
  description:
    "Private room in a 3BR. Walk to campus, in-unit laundry, furnished common area. Looking for someone clean + respectful. Close to restaurants and a bus stop.",
  price: 850,
  roommates: 2,
  termStartDate: "2026-05-10T00:00:00.000Z",
  termEndDate: "2026-08-15T00:00:00.000Z",

  tags: [
    { name: "Private bedroom" },
    { name: "In-unit laundry" },
    { name: "Furnished" },
    { name: "Walkable" },
    { name: "Utilities included" },
    { name: "Desk included" },
  ],

  mediaIds: ["m1", "m2", "m3"],

  location: { lat: 39.1279, lng: -84.5146, label: "Near Short Vine" },
};

function formatDateISO(iso: string) {
  return new Date(iso).toISOString().split("T")[0];
}

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4 py-2">
    <div className="text-sm text-slate-500">{label}</div>
    <div className="text-sm font-medium text-slate-900 text-right">{value}</div>
  </div>
);

/**
 * Different map style: "framed card" with:
 * - soft gradient header
 * - rounded container
 * - corner label chip
 * - subtle marker with pulse ring
 */
const LocationMapCard = ({
  lat,
  lng,
  label,
}: {
  lat: number;
  lng: number;
  label: string;
}) => {
  return (
    <div className="px-5 mt-5">
      <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
        {/* Header (different style than before) */}
        <div className="px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
          <div className="text-sm font-semibold">Location</div>
          <div className="text-xs text-white/80 truncate">{label}</div>
        </div>

        {/* Map */}
        <div className="relative h-56 w-full">
          {/* little corner chip */}
          <div className="absolute top-3 left-3 z-10">
            <span className="rounded-full bg-white/95 backdrop-blur border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">
              Nearby
            </span>
          </div>

          <Map
            mapLib={maplibregl}
            initialViewState={{ latitude: lat, longitude: lng, zoom: 14 }}
            mapStyle="https://demotiles.maplibre.org/style.json"
            style={{ width: "100%", height: "100%" }}
            attributionControl={false}
            // keep it “preview-like” so scroll doesn’t hijack the page
            scrollZoom={false}
            dragPan={false}
            doubleClickZoom={false}
            dragRotate={false}
            touchZoomRotate={false}
          >
            <Marker latitude={lat} longitude={lng} anchor="center">
              <div className="relative">
                {/* pulse ring */}
                <div className="absolute -inset-3 rounded-full bg-slate-900/15 animate-pulse" />
                {/* pin dot */}
                <div className="h-4 w-4 rounded-full bg-slate-900 ring-4 ring-white shadow-md" />
              </div>
            </Marker>
          </Map>
        </div>

        {/* Footer actions */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Tap “Open in map” later (placeholder)
          </div>
          <button
            type="button"
            onClick={() => console.log("open map")}
            className="rounded-full bg-slate-900 text-white px-4 py-2 text-xs font-semibold shadow-sm hover:bg-slate-800"
          >
            Open map
          </button>
        </div>
      </div>
    </div>
  );
};

const IndividualPage = () => {
  const navigate = useNavigate();
  const post = useMemo(() => FAKE_POST, []);

  useEffect(() => {
    localStorage.setItem("headerText", "Crib Details");
  }, []);

  return (
    <div className="mb-6">
      {/* Back */}
      <div className="px-3 pt-3">
        <div
          onClick={() => window.history.back()}
          className="cursor-pointer inline-flex items-center"
        >
          <ArrowLeftIcon size={32} />
          <span className="ml-2">Back</span>
        </div>
      </div>
      {/* Slider */}
      <div>
        <IndividualSlider
          images={post.mediaIds}
          userId={post.userId}
          postId={post.id}
        />
      </div>
      {/* Profile header (you liked this) */}
      <div className="px-5 pt-4">
        <div className="flex flex-row items-center gap-4">
          <div className="h-16 w-16 rounded-full overflow-hidden border shadow-sm bg-slate-100 grid place-items-center shrink-0">
            {post.userThumbnailUrl ? (
              <img
                src={post.userThumbnailUrl}
                alt="profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <CircleUserRound size={40} className="text-slate-500" />
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <h1 className="text-lg font-semibold text-slate-900 leading-tight truncate">
              {post.firstName} {post.lastName}
            </h1>
            <p className="text-sm text-slate-600 leading-tight">
              @{post.username}
            </p>
            <p className="text-xs text-slate-500 mt-1 truncate">
              {post.institutionName}
            </p>
          </div>
        </div>
      </div>
      {/* Post content */}
      <div className="px-5 pt-4">
        <div className="text-2xl font-semibold text-slate-900">
          {post.title}
        </div>
        <div className="mt-2 text-base text-slate-700 break-words leading-relaxed">
          {post.description}
        </div>
      </div>

      {/* Details + tags block */}
      <div className="my-10 px-5 text-md ">
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <DollarSign size={18} className="text-slate-400 shrink-0" />
          <span className=" text-slate-900">${post.price} / month</span>
        </div>

        {/* Roommates */}
        <div className="flex items-baseline gap-2 mt-1">
          <Users size={18} className="text-slate-400 shrink-0" />
          <span className="text-slate-900">{post.roommates} roommates</span>
        </div>

        {/* Lease */}
        <div className="flex items-baseline gap-2 mt-1">
          <Calendar size={18} className="text-slate-400 shrink-0" />
          <span className="text-slate-900">
            {formatDateISO(post.termStartDate)} →{" "}
            {formatDateISO(post.termEndDate)}
          </span>
        </div>

        {/* Tags */}
        <div className="flex items-start gap-2 mt-2">
          <Tag size={18} className="text-slate-400 mt-[2px] shrink-0" />
          <div className="text-slate-600">
            {post.tags.map((t, i) => (
              <span key={`${t.name}-${i}`}>
                {t.name}
                {i < post.tags.length - 1 && (
                  <span className="text-slate-400"> · </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Map (different style) */}
      <LocationMapCard
        lat={post.location.lat}
        lng={post.location.lng}
        label={post.location.label}
      />
      {/* CTA */}
      <div className="flex flex-row-reverse px-5 pt-5">
        <button
          className="bg-blue-500 rounded-full py-3 px-5 shadow-lg text-white font-semibold cursor-pointer active:scale-[0.99]"
          onClick={() => navigate(`/chats/${post.username}`)}
        >
          Contact
        </button>
      </div>
    </div>
  );
};

export default IndividualPage;
