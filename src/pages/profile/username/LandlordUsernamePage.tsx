import { useState } from "react";
import {
  ArrowLeft,
  CircleUserRound,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router";
import { ResidenceCard } from "@/pages/cribs/CribsPage";
import { CommunityPostCardProfileMinimal } from "../ProfilePage";
import ShareModal from "@/components/ui/ShareModal";

/** ---------------------------------------------
 * Types
 * --------------------------------------------*/
type Verification = "Verified" | "Unverified";

/** ---------------------------------------------
 * Page
 * --------------------------------------------*/
export default function LandlordUsernamePage() {
  const navigate = useNavigate();
  const [feedListings, setFeedListings] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  // Placeholder landlord
  const landlord = {
    name: "Queen City Property Group",
    username: "queencityprops",
    market: "Cincinnati, OH",
    bio: "Student-friendly rentals near campus. Fast responses, transparent leases.",
    email: "leasing@queencityprops.com",
    phone: "(513) 555-0123",
    avatarUrl: "",
    role: "Landlord" as const,
    verification: "Unverified" as Verification, // flip to "Verified" to see styling
    stats: {
      listings: 12,
      responseRate: 96,
      avgReply: "2h",
    },
  };

  // UI-only controls (static behavior, but wired)
  const [sort, setSort] = useState<"Recommended" | "Price" | "Availability">(
    "Recommended",
  );

  const isVerified = landlord.verification === "Verified";

  return (
    <div className="min-h-dvh w-full bg-white">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="mx-auto w-full max-w-[720px] px-3 h-12 flex items-center justify-between">
          <button
            type="button"
            className="p-1.5 -ml-1 rounded-full hover:bg-slate-100 transition"
            onClick={() => window.history.back()}
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[720px]">
        {/* Header */}
        <div className="px-4 pt-5 pb-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="h-[72px] w-[72px] rounded-full bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
              {landlord.avatarUrl ? (
                <img
                  src={landlord.avatarUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <CircleUserRound size={48} className="text-slate-400" />
              )}
            </div>

            {/* Info column */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="text-[15px] font-semibold text-slate-900 leading-tight">
                  {landlord.name}
                </div>

                {/* Trust badge */}
                <span
                  className={[
                    "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ring-1 ring-inset",
                    isVerified
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-gray-100 text-gray-600 ring-gray-200",
                  ].join(" ")}
                  title={
                    isVerified
                      ? "This landlord completed verification."
                      : "This landlord has not completed verification yet."
                  }
                >
                  {isVerified ? (
                    <CheckCircle2 size={12} />
                  ) : (
                    <AlertCircle size={12} />
                  )}
                  {isVerified ? "Verified landlord" : "Unverified landlord"}
                </span>
              </div>

              <div className="text-xs text-slate-500 truncate mt-0.5">
                @{landlord.username} · {landlord.market}
              </div>

              <div className="mt-2.5 text-sm text-slate-700 leading-snug">
                {landlord.bio}
              </div>

              {/* Contact (optional for landlords — you can hide until verified if you want) */}
              <div className="mt-3 text-xs text-slate-500 space-y-1">
                <div className="truncate">{landlord.email}</div>
                <div className="truncate">{landlord.phone}</div>
              </div>
            </div>
          </div>

          {/* CTA row */}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="flex-1 rounded-xl px-4 py-2.5 text-sm border border-slate-200 font-semibold text-slate-900 hover:bg-slate-50 transition"
              onClick={() => navigate("/chats/landlord")}
            >
              Message
            </button>

            <button
              type="button"
              className="flex-1 rounded-xl text-white px-4 bg-slate-900 hover:bg-slate-800 py-2.5 text-sm font-semibold transition"
              onClick={() => {
                setOpenShare(true);
              }}
            >
              Share
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* Controls row */}
        <div className="px-4 py-3 flex items-center justify-between gap-2">
          <div className="text-xs font-semibold flex justify-around  h-10 rounded-xl text-slate-900 border w-full ">
            <div
              className={`w-full flex justify-center h-full border-r ${feedListings === false ? "" : "bg-black/10"}`}
            >
              <button
                onClick={() => setFeedListings(true)}
                className="h-full w-full border"
              >
                Listings
              </button>
            </div>
            <div
              className={`w-full flex justify-center ${feedListings === false ? "bg-black/10 " : ""}`}
            >
              <button
                onClick={() => setFeedListings(false)}
                className="h-full w-full"
              >
                Updates
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              onClick={() => console.log("filters")}
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
            >
              <option value="Recommended">Recommended</option>
              <option value="Price">Price</option>
              <option value="Availability">Availability</option>
            </select>
          </div>
        </div>

        {feedListings === true ? (
          <div className="px-4 pb-10">
            {1 === 0 ? (
              <div className="py-10 text-center">
                <div className="text-sm font-semibold text-slate-900">
                  No listings yet
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  Create your first listing to appear in search and on the map.
                </div>
                <button
                  type="button"
                  className="mt-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 text-sm font-semibold transition"
                  onClick={() => console.log("create listing")}
                >
                  Create listing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Array.from({ length: 10 }).map((l) => (
                  <ResidenceCard />
                ))}
              </div>
            )}
          </div>
        ) : (
          <CommunityPostCardProfileMinimal
            post={{
              title: "Properties Available!",
              type: "COMMUNITY",
              id: "community_456",
              intent: "Announcement",
              createdAtLabel: "Posted 2h ago",
              body: "We have pleny of splended appartments available please take some time to view our profile and send us a message if interested! ",
              images: [
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
              ],
            }}
          />
        )}
      </div>
      {openShare && (
        <ShareModal
          open={openShare}
          onClose={() => setOpenShare(false)}
          title={`Check out Queen City Property Group's Profile on CampusCribs`}
          url={window.location.href}
        />
      )}
    </div>
  );
}
