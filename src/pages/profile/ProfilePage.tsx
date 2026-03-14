import { useState } from "react";
import { type ProfileResponse, useGetProfileByUsername } from "@/gen";
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
  Edit,
  User,
} from "lucide-react";
import { useNavigate } from "react-router";
import ShareModal from "@/components/modals/ShareModal";

type ProfilePost = NonNullable<ProfileResponse["post"]>;

export default function ProfilePage() {
  const navigate = useNavigate();
  const username = "user";
  const [openShare, setOpenShare] = useState(false);
  const { data, isLoading, isError } = useGetProfileByUsername(username, {
    query: {
      enabled: !!username,
    },
  });

  const profileData = data?.data;
  const profile = profileData?.profile;
  const post = profileData?.post;
  const isVerified = profile?.verificationStatus === "VERIFIED";
  const verificationClasses = isVerified
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : "bg-gray-100 text-gray-600 ring-gray-200";

  if (isLoading) {
    return (
      <div className="min-h-dvh w-full bg-white px-4 py-10 text-center text-sm text-slate-600">
        Loading profile...
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-dvh w-full bg-white px-4 py-10 text-center">
        <div className="text-sm font-semibold text-slate-900">
          Unable to load profile
        </div>
        <div className="mt-1 text-sm text-slate-600">
          Please try again in a moment.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh w-full bg-white">
      <div className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-12 w-full max-w-[520px] items-center justify-between px-3">
          <button
            type="button"
            className="-mr-1 rounded-full p-1.5 transition hover:bg-slate-100"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>

          <button
            type="button"
            className="-mr-1 rounded-full p-1.5 transition hover:bg-slate-100"
            onClick={() => navigate("/settings")}
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[520px]">
        <div className="px-4 pb-5 pt-5">
          <div className="flex items-start gap-4">
            <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50">
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

            <div className="min-w-0 flex-1">
              <div className="space-y-0.5">
                <div className="flex justify-between">
                  <div className="text-[15px] font-semibold leading-tight text-slate-900">
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
                <div className="truncate text-xs text-slate-500">
                  @{profile.username} · {profile.market}
                </div>
              </div>

              <div className="mt-2.5 text-sm leading-snug text-slate-700">
                {profile.bio}
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              onClick={() => navigate(`/settings/profile`)}
            >
              <User size={16} className="mr-2" />
              Edit Profile
            </button>
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              onClick={() => navigate(`/post/edit`)}
            >
              <Edit size={16} className="mr-2" />
              Edit Post
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100" />
        <div className="w-full border-b">
          <div className="flex">
            <button className="relative flex-1 py-3 text-sm font-medium">
              <span className="text-black">Cribs</span>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-black" />
            </button>
          </div>
        </div>

        {post ? (
          <div className="mt-2">
            <ProfilePostCard
              post={post}
              user={{
                username: profile.username,
                avatarUrl: profile.avatarUrl,
              }}
              onViewListing={() => navigate(`/cribs/${post.id}`)}
              onShare={() => console.log("share")}
              onSave={() => console.log("save")}
            />
          </div>
        ) : (
          <div className="px-4 py-10 text-center">
            <div className="text-sm font-semibold text-slate-900">
              No post yet
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Create a listing to show on the map and in search.
            </div>
            <button
              type="button"
              className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
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
          title={`Check out ${profile.name}'s crib on CampusCribs`}
          url={window.location.href}
        />
      )}
    </div>
  );
}

function ProfilePostCard({
  post,
  user,
  onViewListing,
  onShare,
  onSave,
}: {
  post: ProfilePost;
  user: { username: string; avatarUrl?: string };
  onViewListing: () => void;
  onShare: () => void;
  onSave: () => void;
}) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="pb-10">
      <div className="w-full bg-black">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="aspect-[4/3] w-full object-cover"
        />
      </div>

      <div className="flex flex-row-reverse items-center gap-4 px-4 pt-3">
        <button
          title="Share"
          type="button"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900"
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
            className={
              saved
                ? "fill-red-500 text-red-500"
                : "text-slate-700 hover:text-slate-900"
            }
            size={18}
          />
        </button>
      </div>

      <div className="px-4 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-base font-semibold leading-tight text-slate-900">
              {post.title}
            </div>

            <div className="mt-1 text-[12px] text-slate-500">
              @{user.username}
              {post.type === "CRIB" ? (
                <>
                  {" "}
                  · ${post.price}/mo · {post.roommates} roommates
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-2 text-sm leading-relaxed text-slate-700">
          {post.description}
        </div>

        <div className="mt-2 flex items-start gap-2">
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
          className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          onClick={onViewListing}
        >
          View listing
        </button>
      </div>
    </div>
  );
}
