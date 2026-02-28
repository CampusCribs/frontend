import { useState } from "react";
import {
  CircleUserRound,
  Settings,
  Send,
  Tag,
  Heart,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import ShareModal from "@/components/modals/ShareModal";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [openShare, setOpenShare] = useState(false);
  const profile = {
    name: "John Doe",
    username: "johndoe",
    market: "New York University",
    bio: "Student at NYU. Love exploring the city and finding cool places to live!",
    email: "",
    avatarUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3krGAS5w7YyUrBn7Y55sqCFh13aR2La_dYQ&s",
    phone: "123-456-7890",
  };
  const isVerified = "VERIFIED" === "VERIFIED";
  const verificationClasses = isVerified
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : "bg-gray-100 text-gray-600 ring-gray-200";
  return (
    <div className="min-h-dvh w-full bg-white">
      {/* Top bar (tighter) */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="mx-auto w-full max-w-[520px] px-3 h-12 flex items-center justify-between">
          <button
            type="button"
            className="p-1.5 -mr-1 rounded-full hover:bg-slate-100 transition"
            onClick={() => navigate(-1)}
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
              <div className="space-y-0.5">
                <div className="flex justify-between">
                  <div className="text-[15px] font-semibold text-slate-900 leading-tight">
                    {profile.name}
                  </div>
                  <div>
                    <span
                      className={[
                        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                        verificationClasses,
                      ].join(" ")}
                      title={
                        isVerified
                          ? "This student completed verification."
                          : "This student has not completed verification yet."
                      }
                    >
                      {isVerified ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <AlertCircle size={12} />
                      )}
                      {isVerified ? "Student" : "User"}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-slate-500 truncate">
                  @{profile.username} · {profile.market}
                </div>
              </div>

              {/* Bio */}
              <div className="mt-2.5 text-sm text-slate-700 leading-snug">
                {profile.bio}
              </div>
            </div>
          </div>

          {/* CTA row */}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="flex-1 rounded-xl px-4 py-2.5 text-sm border border-slate-200 font-semibold text-slate-900 hover:bg-slate-50 transition items-center justify-center inline-flex"
              onClick={() => navigate(`/chats/${profile.username}`)}
            >
              <MessageCircle size={16} className="mr-2" />
              Message
            </button>
            <button
              type="button"
              className="flex-1 rounded-xl text-white px-4 bg-slate-900 hover:bg-slate-800 py-2.5 text-sm font-semibold transition items-center justify-center inline-flex"
              onClick={() => setOpenShare(true)}
            >
              <Send size={16} className="mr-2" />
              Share Profile
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100" />
        <div className="border-b w-full">
          <div className="flex">
            <button className="flex-1 relative py-3 text-sm font-medium">
              <span className={"text-black"}>Cribs</span>

              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black rounded-full" />
            </button>
          </div>
        </div>
        <div className="mt-2">
          {/* <ProfilePostCard
              post={{}}
              user={{
                username: profile.username,
                avatarUrl: profile.avatarUrl,
              }}
              onViewListing={() => navigate(`/cribs/${}`)}
              onShare={() => console.log("share")}
              onSave={() => console.log("save")}
            /> */}
        </div>

        {true && (
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
          title={`Check out ${profile?.name}'s crib on CampusCribs`}
          url={window.location.href}
        />
      )}
    </div>
  );
}

/** ---------------------------------------------
 * Post component (supports 2 types)
 * --------------------------------------------*/
function ProfilePostCard({
  post,
  user,
  onViewListing,
  onShare,
  onSave,
}: {
  post: {};
  user: { username: string; avatarUrl?: string };
  onViewListing: () => void;
  onShare: () => void;
  onSave: () => void;
}) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="pb-10">
      {/* Big picture */}
      <div className="w-full bg-black">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full aspect-[4/3] object-cover"
        />
      </div>

      {/* Share + Save row */}
      <div className="px-4 pt-3 flex items-center flex-row-reverse gap-4">
        <button
          title="Share"
          type="button"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition"
          onClick={onShare}
        >
          <Send size={18} />
        </button>

        <button
          title="save"
          type="button"
          className="inline-flex items-center gap-2 text-sm font-semibold transition"
          onClick={() => {
            setSaved((s) => !s);
            onSave();
          }}
        >
          <Heart
            className={`${saved ? "fill-red-500 text-red-500" : "text-slate-700 hover:text-slate-900"}`}
            size={18}
          />
        </button>
      </div>

      {/* Title + description + meta */}
      <div className="px-4 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-base font-semibold text-slate-900 leading-tight">
              {post.title}
            </div>

            {/* Small meta line depending on post type */}
            <div className="mt-1 text-[12px] text-slate-500">
              @{user.username}
              {post.type === "CRIB" ? (
                <>
                  {" "}
                  • ${post.price}/mo • {post.roommates} roommates
                </>
              ) : null}
            </div>
          </div>

          {post.isVerified && (
            <span className="shrink-0 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
              Verified
            </span>
          )}
        </div>

        <div className="mt-2 text-sm text-slate-700 leading-relaxed">
          {post.description}
        </div>

        {/* Tags */}
        <div className="flex items-start gap-2 mt-2">
          <span className="mt-[2px] shrink-0 text-slate-400">
            <Tag size={20} />
          </span>
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

        <button
          type="button"
          className="mt-4 w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 text-sm font-semibold transition"
          onClick={onViewListing}
        >
          View listing
        </button>
      </div>
    </div>
  );
}
