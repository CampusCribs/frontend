import { Heart, House, MapPlus, MessageSquare, Users } from "lucide-react";
import { useNavigate } from "react-router";

const Footer = () => {
  const pathname = useActiveNav();
  const navigate = useNavigate();
  return (
    <div className="w-full bg-white shadow-xl border border-gray-600/10 flex pt-2 ">
      <div
        className="mx-auto flex flex-col items-center"
        onClick={() => navigate("/cribs")}
      >
        <House
          size={32}
          className={pathname === "cribs" ? "" : "text-gray-500"}
        />
        <div
          className={`text-xs ${pathname === "cribs" ? "text-black" : "text-gray-500"}`}
        >
          Cribs
        </div>
      </div>
      <div
        className="mx-auto flex flex-col items-center"
        onClick={() => navigate("/map")}
      >
        <MapPlus
          size={32}
          className={pathname === "map" ? "" : "text-gray-500"}
        />
        <div
          className={`text-xs ${pathname === "map" ? "text-black" : "text-gray-500"}`}
        >
          Map
        </div>
      </div>
      <div
        className=" mx-auto flex flex-col items-center"
        onClick={() => navigate("/community")}
      >
        <Users
          size={32}
          className={pathname === "community" ? "" : "text-gray-500"}
        />
        <div
          className={`text-xs ${pathname === "community" ? "text-black" : "text-gray-500"}`}
        >
          Community
        </div>
      </div>
      <div
        className=" mx-auto flex flex-col items-center"
        onClick={() => navigate("/chats")}
      >
        <MessageSquare
          size={32}
          className={pathname === "chats" ? "" : "text-gray-500"}
        />
        <div
          className={`text-xs ${pathname === "chats" ? "text-black" : "text-gray-500"}`}
        >
          Chats
        </div>
      </div>
      <div
        className=" mx-auto flex flex-col items-center"
        onClick={() => navigate("/favorites")}
      >
        <Heart
          size={32}
          className={pathname === "favorites" ? "" : "text-gray-500"}
        />
        <div
          className={`text-xs ${pathname === "favorites" ? "text-black" : "text-gray-500"}`}
        >
          Favorites
        </div>
      </div>
      <div
        className="mx-auto flex flex-col items-center"
        onClick={() => navigate("/profile")}
      >
        <img
          alt="selfie"
          className={`${pathname === "profile" ? "ring-2 ring-black/85" : ""} w-9 h-9 rounded-full`}
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3krGAS5w7YyUrBn7Y55sqCFh13aR2La_dYQ&s"
        />

        <div
          className={`text-xs ${pathname === "profile" ? "text-black" : "text-gray-500"}`}
        >
          Profile
        </div>
      </div>
    </div>
  );
};
const useActiveNav = () => {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const activeNav = pathname.split("/")[1];
  return activeNav;
};
export default Footer;
