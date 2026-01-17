import { useState } from "react";
import {
  ArrowLeft,
  MoreHorizontal,
  Settings,
  CircleUserRound,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router";

type Post = {
  id: string;
  title: string;
  price: number;
  roommates: number;
  description: string;
  imageUrl: string;
  isVerified: boolean;
};

export default function ProfilePageInstagramStyle() {
  // Placeholder user
  const user = {
    name: "Johnny Edwards",
    username: "johnnyedwards",
    school: "UC Berkeley",
    bio: "CS student. Looking for a clean, chill roommate near campus. Gym + coffee + grind.",
    email: "johnnyedwards@gmail.com",
    phone: "(513) 555-0123",
    avatarUrl: "", // set to a URL to see avatar image
  };

  const navigate = useNavigate();
  // Single active post (Instagram vibe: one post only)
  const post: Post | null = {
    id: "post_123",
    title: "Sunny Private Room on Short Vine",
    price: 850,
    roommates: 2,
    description:
      "Private room in a 3BR. Walk to campus, in-unit laundry, furnished common area. Looking for someone clean + respectful.",
    imageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=80",
    isVerified: true,
  };

  const [openActions, setOpenActions] = useState(false);

  return (
    <div className="min-h-dvh w-full bg-white">
      {/* Top bar (IG-like) */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="mx-auto w-full max-w-[520px] px-4 py-3 flex items-center">
          <button
            type="button"
            className="p-2 -ml-2 rounded-full hover:bg-slate-100"
            onClick={() => console.log("back")}
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex-1 text-center">
            <div className="text-base font-semibold text-slate-900 leading-none">
              {user.username}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {user.school}
            </div>
          </div>

          <button
            type="button"
            className="p-2 -mr-2 rounded-full hover:bg-slate-100"
            onClick={() => navigate("/settings")}
            aria-label="More"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[520px]">
        {/* Profile header (IG-like) */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="h-20 w-20 rounded-full overflow-hidden bg-slate-100 ring-2 ring-slate-100 grid place-items-center shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <CircleUserRound size={42} className="text-slate-500" />
              )}
            </div>

            {/* Simple stats row (keep minimal) */}
            <div className="flex-1 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-base font-semibold text-slate-900">2</div>
                <div className="text-[12px] text-slate-500">messages</div>
              </div>
              <div>
                <div className="text-base font-semibold text-slate-900">
                  153
                </div>
                <div className="text-[12px] text-slate-500">views</div>
              </div>
              <div>
                <div className="text-base font-semibold text-slate-900">—</div>
                <div className="text-[12px] text-slate-500">saved</div>
              </div>
            </div>
          </div>

          {/* Name + bio */}
          <div className="mt-3">
            <div className="text-sm font-semibold text-slate-900">
              {user.name}
            </div>
            <div className="text-sm text-slate-700 leading-snug mt-1">
              {user.bio}
            </div>

            {/* Contact (tiny, not loud) */}
            <div className="mt-2 text-[12px] text-slate-500 space-y-1">
              <div className="truncate">{user.email}</div>
              <div className="truncate">{user.phone}</div>
            </div>
          </div>

          {/* Primary CTA row (IG style buttons) */}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="flex-1 rounded-xl bg-slate-100 text-slate-900 px-4 py-2.5 text-sm font-semibold hover:bg-slate-200 transition"
              onClick={() => console.log("edit profile")}
            >
              Edit profile
            </button>
            <button
              type="button"
              className="flex-1 rounded-xl bg-slate-900 text-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-800 transition"
              onClick={() => console.log("create/edit post")}
            >
              {post ? "Edit post" : "Create post"}
            </button>
          </div>
        </div>

        {/* Divider like IG */}
        <div className="border-t border-slate-100" />

        {/* Single post feed */}
        {!post ? (
          <div className="px-4 py-10 text-center">
            <div className="text-sm font-semibold text-slate-900">
              No post yet
            </div>
            <div className="text-sm text-slate-600 mt-1">
              Create one listing to show on the map and in search.
            </div>
            <button
              type="button"
              className="mt-4 rounded-xl bg-slate-900 text-white px-5 py-2.5 text-sm font-semibold hover:bg-slate-800 transition"
              onClick={() => console.log("create post")}
            >
              Create post
            </button>
          </div>
        ) : (
          <div className="pb-10">
            {/* Post header */}
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full overflow-hidden bg-slate-100 grid place-items-center">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <CircleUserRound size={20} className="text-slate-500" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 leading-none truncate">
                  {user.username}
                </div>
                <div className="text-[12px] text-slate-500 mt-0.5 truncate">
                  {post.title} • ${post.price}/mo • {post.roommates} roommates
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2">
                {post.isVerified && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                    Verified
                  </span>
                )}
              </div>
            </div>

            {/* Image */}
            <div className="w-full bg-black">
              <img
                src={post.imageUrl}
                alt="post"
                className="w-full aspect-square object-cover"
              />
            </div>

            {/* Post actions */}
            <div className="px-4 pt-3">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-slate-100"
                  onClick={() => console.log("share")}
                  aria-label="Share"
                >
                  <Send size={22} />
                </button>

                <button
                  type="button"
                  className=" p-2 -mr-2 rounded-full hover:bg-slate-100"
                  onClick={() => console.log("save")}
                  aria-label="Save"
                >
                  <Bookmark size={22} />
                </button>
              </div>

              {/* Caption / details */}
              <div className="mt-2 text-sm text-slate-900">
                <span className="font-semibold">{user.username}</span>{" "}
                <span className="text-slate-700">{post.description}</span>
              </div>

              {/* Tiny meta row */}
              <div className="mt-2 text-[12px] text-slate-500">
                ${post.price}/month • {post.roommates} roommates • Near campus
              </div>

              {/* CTA (single post) */}
              <button
                type="button"
                className="mt-4 w-full rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2"
                onClick={() => navigate(`/cribs/${post.id}`)}
              >
                View listing <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
