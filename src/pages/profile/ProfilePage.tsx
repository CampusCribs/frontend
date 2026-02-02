import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CircleUserRound,
  Settings,
  Send,
  Tag,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router";

/** ---------------------------------------------
 * Types
 * --------------------------------------------*/
export type Tag = { name: string };

type BaseProfilePost = {
  id: string;
  type: "HOUSING" | "COMMUNITY";
  tags: Tag[];
};

/** ---------------------------------------------
 * HOUSING (listing-style)
 * --------------------------------------------*/
export type HousingPost = BaseProfilePost & {
  type: "HOUSING";
  title: string;
  description: string;
  imageUrl: string; // single hero image
  isVerified: boolean;
  price: number;
  roommates: number;
};

/** ---------------------------------------------
 * COMMUNITY (feed/blog-style)
 * --------------------------------------------*/
export type CommunityPost = {
  title: string;
  type: "COMMUNITY";
  id: string;

  // intent tag (single)
  intent: string; // e.g. "Looking for Roommate"

  // content
  body: string;
  images?: string[];

  // optional
  createdAtLabel?: string; // "Posted 2h ago" (used only as grey line)
};

/** ---------------------------------------------
 * Union used by the profile page renderer
 * --------------------------------------------*/
export type Post = HousingPost | CommunityPost;

/** ---------------------------------------------
 * Page
 * --------------------------------------------*/
export default function ProfilePage() {
  const navigate = useNavigate();

  // Placeholder user
  const user = {
    name: "Johnny Edwards",
    username: "johnnyedwards",
    school: "UC Berkeley",
    bio: "CS student. Looking for a clean, chill roommate near campus. Gym + coffee + grind.",
    email: "johnnyedwards@gmail.com",
    phone: "(513) 555-0123",
    avatarUrl: "", // set to URL to see avatar image
  };

  // Example post (swap type to show different layout)
  // const post: Post | null = {
  //   type: "HOUSING",
  //   id: "post_123",
  //   title: "Sunny Private Room on Short Vine",
  //   description:
  //     "Private room in a 3BR. Walk to campus, in-unit laundry, furnished common area. Looking for someone clean + respectful.",
  //   imageUrl:
  //     "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=80",
  //   isVerified: true,
  //   price: 850,
  //   roommates: 2,
  //   tags: [
  //     { name: "Short Vine" },
  //     { name: "Walkable" },
  //     { name: "Laundry" },
  //     { name: "Furnished" },
  //   ],
  // };
  const post: CommunityPost = {
    title: "Hey I am looking fo a Roomate!",
    type: "COMMUNITY",
    id: "community_456",
    intent: "Looking for Roommate",
    createdAtLabel: "Posted 2h ago",
    body:
      "Looking for a roommate to join me and my friends this semester. " +
      "Chill group, close to campus, and we love hosting BBQs in our backyard.",
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
    ],
  };

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
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
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
                <div className="text-[15px] font-semibold text-slate-900 leading-tight">
                  {user.name}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  @{user.username} · {user.school}
                </div>
              </div>

              {/* Bio */}
              <div className="mt-2.5 text-sm text-slate-700 leading-snug">
                {user.bio}
              </div>

              {/* Contact */}
              <div className="mt-3 text-xs text-slate-500 space-y-1">
                <div className="truncate">{user.email}</div>
                <div className="truncate">{user.phone}</div>
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
              {post ? "Edit post" : "Create post"}
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* ... your Post section stays the same ... */}
        {!post && (
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
        {post && post.type == "COMMUNITY" ? (
          <CommunityPostCardProfileMinimal post={post} />
        ) : (
          <ProfilePostCard
            post={post}
            user={{ username: user.username, avatarUrl: user.avatarUrl }}
            onViewListing={() => navigate(`/cribs/${post.id}`)}
            onShare={() => console.log("share")}
            onSave={() => console.log("save")}
          />
        )}
      </div>
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
  post: HousingPost;
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
              {post.type === "HOUSING" ? (
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

/** ---------------------------------------------
 * CommunityPostCard
 * - Designed to drop into ProfilePage where ProfilePostCard is used
 * --------------------------------------------*/

export function CommunityPostCardProfileMinimal({
  post,
}: {
  post: CommunityPost;
}) {
  const images = useMemo(
    () => (post.images ?? []).filter(Boolean),
    [post.images],
  );
  const gridImages = images.slice(0, 4); // 2x2 max

  return (
    <div className="px-4 py-6 border-b border-slate-100 bg-white">
      <div className="flex font-medium text-lg text-slate-800 ">
        {post.title}
      </div>
      {/* Intent tag */}
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {post.intent}
      </div>

      {/* Grey helper line */}
      <div className="mt-1 text-[12px] text-slate-400">
        {post.createdAtLabel ?? "Community post"}
      </div>

      {/* Big paragraph */}
      <div className="mt-4 text-[15px] leading-relaxed text-slate-800 whitespace-pre-line">
        {post.body}
      </div>

      {/* 2x2 images */}
      {gridImages.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-2">
          {gridImages.map((src, i) => (
            <img
              key={`${post.id}-img-${i}`}
              src={src}
              alt="post"
              className="w-full aspect-square rounded-xl object-cover border border-slate-100"
            />
          ))}
        </div>
      )}
    </div>
  );
}
