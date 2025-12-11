import { Bell, Dot, SquarePlus } from "lucide-react";
import { useNavigate } from "react-router";

import useEasyAuth from "@/hooks/use-easy-auth";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import { useHasUnreadNotifications } from "@/gen";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useEasyAuth();
  const config = useAuthenticatedClientConfig();
  const { data } = useHasUnreadNotifications({ ...config });
  const pathname = useActiveNav();
  let headerText;
  if (pathname === "") {
    headerText = "Cribs";
  } else if (pathname === "community") {
    headerText = "Community";
  } else if (pathname === "chats") {
    headerText = "Chats";
  } else if (pathname === "favorites") {
    headerText = "Favorites";
  } else if (pathname === "profile") {
    headerText = "Profile";
  } else {
    // Fallback for any other page
    headerText = localStorage.getItem("headerText") ?? "CampusCribs";
  }

  return (
    <div className="flex justify-between items-center px-4 py-2 shadow">
      <div className="flex items-center gap-2">
        <div
          className="flex items-center text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Dot width={48} height={48} />

          <div className=" text-xl font-semibold">{headerText}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {user?.access_token && (
          <div
            className="cursor-pointer"
            onClick={() => navigate("/settings/notifications")}
          >
            {data?.data ? (
              <div
                className="relative cursor-pointer"
                onClick={() => navigate("/settings/notifications")}
              >
                <Bell size={23} />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
              </div>
            ) : (
              <Bell size={23} />
            )}
          </div>
        )}
        <div className="flex items-center ">
          <SquarePlus size={32} />
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
export default Header;
