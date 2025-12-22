const Favorited = () => {
  return (
    <div>
      {Array.from({ length: 10 }).map((_, i) => (
        <SavedPostCard key={i} />
      ))}
    </div>
  );
};

import { Heart } from "lucide-react";

export function SavedPostCard() {
  const liked = true;

  return (
    <div className="bg-white my-3  border shadow-sm overflow-hidden">
      {/* Image */}
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80"
          alt="post"
          className="h-72 w-full object-cover"
        />

        {/* Heart overlay */}
        <button
          className="absolute right-3 top-3 z-10 rounded-full bg-black/40 p-2 backdrop-blur hover:bg-black/60 transition"
          onClick={(e) => {
            e.preventDefault();
            // toggle like here
          }}
          aria-label="Like post"
        >
          <Heart
            className={`h-5 w-5 ${
              liked ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Profile row */}
        <div className="flex items-center gap-3 mb-2">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3krGAS5w7YyUrBn7Y55sqCFh13aR2La_dYQ&s"
            alt="profile"
            className="h-9 w-9 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Johnny Edwards
            </p>
            <span className="inline-block text-xs text-gray-500">
              Roommate Needed
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 leading-relaxed line-clamp-2 mb-3">
          Looking for one more roommate to join me and my friends this semester.
          Chill house, close to campus, and a great backyard for BBQs.
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 items-center">
          {["Near Campus", "Chill Vibes", "Fall"].map((tag) => (
            <>
              <span key={tag} className=" px-1 py-1 text-xs text-gray-700">
                {tag}
              </span>
              <span className="px-1 text-xs text-gray-700">|</span>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Favorited;
