import {
  ArrowLeftIcon,
  Bookmark,
  Calendar,
  CircleUserRound,
  DollarSign,
  Flag,
  Heart,
  Send,
  Tag,
  Users,
  X,
} from "lucide-react";
import IndividualSlider from "./IndividualSlider";
import { useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";

// MapLibre
import Map, { Marker } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import ShareModal from "@/components/ui/ShareModal";

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
  const navigate = useNavigate();
  return (
    <div className="px-5 mt-5">
      <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
        {/* Header (different style than before) */}
        <div className="px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
          <div className="text-sm font-semibold">Location</div>
          <div className="text-xs text-white/80 truncate">{label}</div>
        </div>

        {/* Map */}
        <div className="relative h-100 w-full">
          {/* little corner chip */}
          <div className="absolute top-3 left-3 z-10">
            <span className="rounded-full bg-white/95 backdrop-blur border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">
              Nearby
            </span>
          </div>

          <Map
            mapLib={maplibregl}
            initialViewState={{ latitude: lat, longitude: lng, zoom: 14 }}
            mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
            style={{ width: "100%", height: "100%" }}
            attributionControl={false}
            // keep it “preview-like” so scroll doesn’t hijack the page
            scrollZoom={false}
            dragPan={false}
            doubleClickZoom={false}
            dragRotate={false}
            touchZoomRotate={false}
            minZoom={11}
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
        <div className="px-4 py-3 flex flex-row-reverse items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(`/map?lat=${lat}&lng=${lng}`)}
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
  const [liked, setLiked] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [openReport, setOpenReport] = useState(false);
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
      <div className="flex flex-row w-full gap-4 items-center my-1 ">
        <div className="ml-4" onClick={() => setOpenShare(!openShare)}>
          <Send size={25} />
        </div>

        <div onClick={() => setLiked(!liked)}>
          <Heart
            size={25}
            className={`${liked ? "fill-red-500 " : "text-black"}`}
          />
        </div>
        <div
          className="ml-auto mr-5 rotate-3"
          onClick={() => setOpenReport(!openReport)}
        >
          <Flag size={25} className=" cursor-pointer" />
        </div>
      </div>
      {/* Profile header (you liked this) */}
      <div className="px-5 pt-4">
        <div
          className="flex flex-row items-center gap-4"
          onClick={() => navigate("/profile/123")}
        >
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
          className="bg-black rounded-full py-3 px-5 my-2 shadow-lg text-white font-semibold cursor-pointer active:scale-[0.99]"
          onClick={() => navigate(`/chats/${post.username}`)}
        >
          Chat
        </button>
      </div>
      {openReport && (
        <ReportModal
          open={openReport}
          onClose={() => setOpenReport(false)}
          onSubmit={() => {}}
        />
      )}
      {openShare && (
        <ShareModal
          open={openShare}
          onClose={() => setOpenShare(false)}
          title={`Check out ${post.firstName}'s crib on CampusCribs`}
          url={window.location.href}
        />
      )}
    </div>
  );
};

export default IndividualPage;

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

const ReportModal = ({ open, onClose, onSubmit, title = "Report" }: Props) => {
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

  const canSubmit = useMemo(() => reason !== null, [reason]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
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
                    {r.hint ? (
                      <div className="text-xs text-slate-500">{r.hint}</div>
                    ) : null}
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
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm min-h-[96px] focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!canSubmit}
            className={[
              "flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
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
  );
};
