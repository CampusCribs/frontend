import { Search } from "lucide-react";
import GuidedSearch from "../cribs/GuidedSearch";
import { useState } from "react";
import { useNavigate } from "react-router";

const Community = () => {
  const [openSearch, setOpenSearch] = useState(false);
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
        {Array.from(Array(10).keys()).map((_, index) => (
          <BlogCard key={index} />
        ))}
      </div>
      {openSearch && <GuidedSearch setOpenSearch={setOpenSearch} />}
    </div>
  );
};

const BlogCard = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white border-b p-4 py-6 ">
      {/* Header */}
      <div
        className="flex items-center gap-3 mb-2"
        onClick={() => navigate("/profile/johnnyedwards")}
      >
        <img
          alt="thumbnail"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3krGAS5w7YyUrBn7Y55sqCFh13aR2La_dYQ&s"
          className="w-9 h-9 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-sm">Johnny Edwards</h3>
          <p className="text-xs text-gray-500">Looking for Roommate</p>
        </div>
      </div>

      {/* Body */}
      <p className="text-sm text-gray-700 leading-relaxed mb-3">
        Looking for a roommate to join me and my friends this semester. Chill
        group, close to campus, and we love hosting BBQs in our backyard.
      </p>

      {/* Images */}
      <div className="flex gap-2 mb-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <img
            key={i}
            src="https://images.unsplash.com/photo-1505691938895-1758d7feb511"
            className="w-20 h-20 rounded-lg object-cover"
            alt="post"
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">Posted 2h ago</span>
        <button
          className="text-sm mt-2 font-medium text-blue-600 hover:underline"
          onClick={() => navigate(`/profile/${"username"}`)}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};
export default Community;
