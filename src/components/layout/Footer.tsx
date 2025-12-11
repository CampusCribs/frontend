import { Heart, House, MessageSquare, Users } from "lucide-react";
import { useNavigate } from "react-router";

const Footer = () => {
  const pathname = useActiveNav();
  const navigate = useNavigate();
  return (
    <div className="w-full  bg-white shadow-xl border border-gray-600/10 flex py-4 ">
      <div className="mx-auto flex items-center" onClick={() => navigate("/")}>
        <House size={32} className={pathname === "" ? "" : "text-gray-500"} />
      </div>
      <div
        className=" mx-auto flex items-center "
        onClick={() => navigate("/community")}
      >
        <Users
          size={32}
          className={pathname === "community" ? "" : "text-gray-500"}
        />
      </div>
      <div
        className=" mx-auto flex items-center "
        onClick={() => navigate("/chats")}
      >
        <MessageSquare
          size={32}
          className={pathname === "chats" ? "" : "text-gray-500"}
        />
      </div>
      <div
        className=" mx-auto flex items-center"
        onClick={() => navigate("/favorites")}
      >
        <Heart
          size={32}
          className={pathname === "favorites" ? "" : "text-gray-500"}
        />
      </div>
      <div
        className="mx-auto flex items-center"
        onClick={() => navigate("/profile")}
      >
        <div
          className={`${pathname === "profile" ? "ring-4 ring-black/85" : ""} w-12 rounded-full h-12 object-cover overflow-clip`}
        >
          <img
            alt="selfie"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3krGAS5w7YyUrBn7Y55sqCFh13aR2La_dYQ&s"
          />
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
