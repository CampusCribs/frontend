import { Bookmark, Heart, MessageCircle, Search, Send } from "lucide-react";
import GuidedSearch from "../cribs/GuidedSearch";
import { useState } from "react";
import { useNavigate } from "react-router";
import { CommunityPost, useGetCuratedCommunity } from "@/gen/index";

export const fakePost: CommunityPost = {
  id: "1",
  name: "Johnny Edwards",
  username: "johnnyedwards",
  avatarUrl:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3krGAS5w7YyUrBn7Y55sqCFh13aR2La_dYQ&s",
  intent: "Looking for Roommate",
  body: "Looking for a roommate to join me and my friends this semester. Chill group, close to campus.",
  images: [
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858",
    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6",
    "https://images.unsplash.com/photo-1501183638710-841dd1904471",
    "https://images.unsplash.com/photo-1502672023488-70e25813eb80",
  ],
  createdAt: "2h ago",
  likes: 24,
  comments: 8,
};

type ImageGridProps = {
  images: string[];
};

export const ImageGrid = ({ images }: ImageGridProps) => {
  if (!images || images.length === 0) return null;

  const count = images.length;

  // 1 image — hero
  if (count === 1) {
    return (
      <div className="mb-3">
        <img
          src={images[0]}
          alt="post"
          className="w-full max-h-96 object-cover rounded-xl"
        />
      </div>
    );
  }

  // 2 images — side by side
  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-2 mb-3">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="post"
            className="w-full h-48 object-cover rounded-xl"
          />
        ))}
      </div>
    );
  }

  // 3 images — 1 large left, 2 stacked right
  if (count === 3) {
    return (
      <div className="grid grid-cols-2 gap-2 mb-3">
        <img
          src={images[0]}
          alt="post"
          className="w-full h-96 object-cover rounded-xl"
        />
        <div className="grid grid-rows-2 gap-2">
          {images.slice(1).map((img, i) => (
            <img
              key={i}
              src={img}
              alt="post"
              className="w-full h-full object-cover rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  // 4+ images — 2x2 grid
  return (
    <div className="grid grid-cols-2 gap-2 mb-3">
      {images.slice(0, 4).map((img, i) => (
        <div key={i} className="relative">
          <img
            src={img}
            alt="post"
            className="w-full h-48 object-cover rounded-xl"
          />
          {i === 3 && count > 4 && (
            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
              +{count - 4}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const Community = () => {
  const [openSearch, setOpenSearch] = useState(false);

  const {
    data: community,
    isLoading: isCommunityLoading,
    isError: isCommunityError,
  } = useGetCuratedCommunity();
  return (
    <div className="w-full h-full ">
      {" "}
      <div className="flex flex-col w-full  ">
        <div className="flex w-full p-2 justify-center items-center">
          <div
            className="shadow-sm px-20 py-3 rounded-2xl flex justify-center bg-white-100 border border-black/10 font-semibold text-black/70 cursor-pointer w-full max-w-md"
            onClick={() => setOpenSearch(!openSearch)}
          >
            <Search className="mr-2 text-black/70" /> Start your search
          </div>
        </div>
      </div>
      <div>
        {community &&
          community.data.items.map((data, index) => (
            <BlogCard post={data} key={index} />
          ))}
      </div>
      {openSearch && <GuidedSearch setOpenSearch={setOpenSearch} />}
    </div>
  );
};

export const BlogCard = ({ post }: { post: CommunityPost }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white border-b p-4 py-6 hover:bg-gray-50 transition"
      onClick={() => navigate(`/community/${post.id}`)}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 mb-2 cursor-pointer"
        onClick={() => navigate(`/profile/${post.username}`)}
      >
        <img
          alt="thumbnail"
          src={post.avatarUrl}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-sm">{post.name}</h3>
          <p className="text-xs text-gray-500">{post.intent}</p>
        </div>
      </div>

      {/* Body */}
      <p className="text-sm text-gray-700 leading-relaxed mb-3">{post.body}</p>

      {/* Images */}
      <div className="flex gap-2 mb-3">
        <ImageGrid
          images={post.images.slice(
            0,
            Math.floor(Math.random() * post.images.length) + 1,
          )}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
        <span>Posted 2h ago</span>
      </div>

      {/* Engagement Row */}
      <div className="flex justify-between items-center text-gray-500 text-sm">
        {/* Like */}
        <button className="flex items-center gap-1 hover:text-red-500 transition">
          <Heart size={18} />
          <span>{post.likes}</span>
        </button>

        {/* Comment */}
        <button className="flex items-center gap-1 hover:text-blue-500 transition">
          <MessageCircle size={18} />
          <span>{post.comments}</span>
        </button>

        {/* Share */}
        <button className="flex items-center gap-1 hover:text-green-500 transition">
          <Send size={18} />
          <span>Share</span>
        </button>

        {/* Bookmark */}
        <button
          title="bookmark"
          className="flex items-center gap-1 hover:text-yellow-500 transition"
        >
          <Bookmark size={18} />
        </button>
      </div>
    </div>
  );
};

export default Community;
