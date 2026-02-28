import {
  ArrowLeftIcon,
  Calendar,
  CircleUserRound,
  DollarSign,
  Flag,
  Heart,
  Send,
  Tag,
  Users,
} from "lucide-react";
import IndividualSlider from "./IndividualSlider";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";

// MapLibre
import Map, { Marker } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import ShareModal from "@/components/modals/ShareModal";
import { useGetIndividualCrib } from "@/gen";
import { LocationInfoCard } from "./LocationInfoCard";
import { ReportModal } from "@/components/modals/ReportModal";

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
  const { postId } = useParams<{ postId: string }>();
  const [openShare, setOpenShare] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const { data: postData, isLoading } = useGetIndividualCrib(postId || "");
  console.log(postData);
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
          images={postData?.data.mediaIds || []}
          userId={postData?.data.userId || ""}
          postId={postData?.data.postId || ""}
        />
      </div>
      <div className="flex flex-row w-full gap-4 items-center my-1 ">
        <div className="ml-4" onClick={() => setOpenShare(!openShare)}>
          <Send size={25} />
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
            {postData?.data.userThumbnailUrl ? (
              <img
                src={postData?.data.userThumbnailUrl}
                alt="profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <CircleUserRound size={40} className="text-slate-500" />
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <h1 className="text-lg font-semibold text-slate-900 leading-tight truncate">
              {postData?.data.firstName} {postData?.data.lastName}
            </h1>
            <p className="text-sm text-slate-600 leading-tight">
              @{postData?.data.username}
            </p>
            <p className="text-xs text-slate-500 mt-1 truncate">
              {postData?.data.institutionName}
            </p>
          </div>
        </div>
      </div>
      {/* Post content */}
      <div className="px-5 pt-4">
        <div className="text-2xl font-semibold text-slate-900">
          {postData?.data.title}
        </div>
        <div className="mt-2 text-base text-slate-700 break-words leading-relaxed">
          {postData?.data.description}
        </div>
      </div>

      {/* Details + tags block */}
      <div className="my-10 px-5 text-md ">
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <DollarSign size={18} className="text-slate-400 shrink-0" />
          <span className=" text-slate-900">
            ${postData?.data.price} / month
          </span>
        </div>

        {/* Roommates */}
        <div className="flex items-baseline gap-2 mt-1">
          <Users size={18} className="text-slate-400 shrink-0" />
          <span className="text-slate-900">
            {postData?.data.roommates} roommates
          </span>
        </div>

        {/* Lease */}
        <div className="flex items-baseline gap-2 mt-1">
          <Calendar size={18} className="text-slate-400 shrink-0" />
          <span className="text-slate-900">
            {postData?.data.termStartDate &&
              formatDateISO(postData?.data.termStartDate)}{" "}
            →{" "}
            {postData?.data.termEndDate &&
              formatDateISO(postData?.data.termEndDate)}
          </span>
        </div>

        {/* Tags */}
        <div className="flex items-start gap-2 mt-2">
          <Tag size={18} className="text-slate-400 mt-[2px] shrink-0" />
          <div className="text-slate-600">
            {postData?.data.tags.map((t, i) => (
              <span key={`${t.name}-${i}`}>
                {t.name}
                {i < postData?.data.tags.length - 1 && (
                  <span className="text-slate-400"> · </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Map (different style) */}
      {/* {postData?.data.location.lat && postData?.data.location.lng && (
        <LocationMapCard
          lat={postData?.data.location.lat}
          lng={postData?.data.location.lng}
          label={postData?.data.location.label}
        />
      )} */}
      {postData?.data.location?.label && (
        <LocationInfoCard
          label={postData.data.location.label}
          lat={postData.data.location.lat}
          lng={postData.data.location.lng}
        />
      )}
      {/* CTA */}
      <div className="flex flex-row-reverse px-5 pt-5">
        <button
          className="bg-black rounded-full py-3 px-5 my-2 shadow-lg text-white font-semibold cursor-pointer active:scale-[0.99]"
          onClick={() => navigate(`/chats/${postData?.data.username}`)}
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
          title={`Check out ${postData?.data.firstName}'s crib on CampusCribs`}
          url={window.location.href}
        />
      )}
    </div>
  );
};

export default IndividualPage;
