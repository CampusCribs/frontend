import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CircleUserRound,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router";
import { LandlordProfile, PageResidenceCardDTO, ProfileCribPost } from "@/gen";
import { ResidenceCard } from "@/pages/cribs/CribsPage";
import ShareModal from "@/components/ui/ShareModal";

function isPageResidenceCardDTO(
  cribs: ProfileCribPost | PageResidenceCardDTO | null | undefined,
): cribs is PageResidenceCardDTO {
  return (
    !!cribs &&
    typeof cribs === "object" &&
    "items" in cribs &&
    Array.isArray((cribs as PageResidenceCardDTO).items)
  );
}

/** ---------------------------------------------
 * Page
 * --------------------------------------------*/
export default function LandlordPage({
  profile,
  cribs,
}: {
  profile: LandlordProfile;
  cribs: ProfileCribPost | PageResidenceCardDTO | null | undefined;
}) {
  const navigate = useNavigate();
  const [openShare, setOpenShare] = useState<boolean>(false);
  const isVerified = profile.verification === "VERIFIED";
  return (
    <div className="min-h-dvh w-full bg-white">
      {/* Top bar (tighter) */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="mx-auto w-full max-w-[520px] px-3 h-12 flex items-center justify-between">
          <button
            type="button"
            className="p-1.5 -ml-1 rounded-full hover:bg-slate-100 transition"
            onClick={() => window.history.back()}
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>

          <button
            type="button"
            className="p-1.5 -mr-1 rounded-full hover:bg-slate-100 transition"
            onClick={() => navigate("/settings")}
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[520px]">
        {/* Profile header (cleaner rhythm) */}
        <div className="px-4 pt-5 pb-5">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="h-[72px] w-[72px] rounded-full bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <CircleUserRound size={48} className="text-slate-400" />
              )}
            </div>

            {/* Info column */}
            <div className="min-w-0 flex-1">
              {/* Name + handle */}
              <div className="flex items-center gap-2">
                <div className="text-[15px] font-semibold text-slate-900 leading-tight">
                  {profile.name}
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
              <div className="text-xs text-slate-500 truncate">
                @{profile.username} · {profile.market}
              </div>

              {/* Bio */}
              <div className="mt-2.5 text-sm text-slate-700 leading-snug">
                {profile.bio}
              </div>

              {/* Contact */}
              <div className="mt-3 text-xs text-slate-500 space-y-1">
                <div className="truncate">{profile.email}</div>
                <div className="truncate">{profile.phone}</div>
              </div>
            </div>
          </div>

          {/* CTA row */}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="flex-1 rounded-xl px-4 py-2.5 text-sm border border-slate-200 font-semibold text-slate-900 hover:bg-slate-50 transition"
              onClick={() => console.log("edit profile")}
            >
              Edit profile
            </button>
            <button
              type="button"
              className="flex-1 rounded-xl text-white px-4 bg-slate-900 hover:bg-slate-800 py-2.5 text-sm font-semibold transition"
              onClick={() => console.log("create/edit post")}
            >
              {cribs ? "Edit post" : "Create post"}
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100" />
        <div className="relative border-b ">
          <div className="flex font-medium items-center justify-center py-3">
            <span className={"text-black"}>Cribs</span>

            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1 w-full p-2">
          {isPageResidenceCardDTO(cribs) &&
            cribs.items.length > 0 &&
            cribs.items.map((crib) => (
              <ResidenceCard key={crib.id} data={crib} />
            ))}
        </div>
        {/* ... your Post section stays the same ... */}
        {isPageResidenceCardDTO(cribs) && cribs.items.length === 0 && (
          <div className="px-4 py-10 text-center">
            <div className="text-sm font-semibold text-slate-900">
              No post yet
            </div>
            <div className="text-sm text-slate-600 mt-1">
              Create a listing to show on the map and in search.
            </div>
            <button
              type="button"
              className="mt-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 text-sm font-semibold transition"
              onClick={() => console.log("create post")}
            >
              Create post
            </button>
          </div>
        )}
      </div>
      {openShare && (
        <ShareModal
          open={openShare}
          onClose={() => setOpenShare(false)}
          title={`Check out ${profile.name}'s Profile on CampusCribs`}
          url={window.location.href}
        />
      )}
    </div>
  );
}
