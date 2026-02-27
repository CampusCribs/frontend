import { Bell, SquarePlus } from "lucide-react";
import { useNavigate } from "react-router";

import useEasyAuth from "@/hooks/use-easy-auth";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
// import { useHasUnreadNotifications } from "@/gen";
import HatHouseBlack from "../ui/HatHouseBlack";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useEasyAuth();
  const config = useAuthenticatedClientConfig();
  // const { data } = useHasUnreadNotifications({ ...config });

  return (
    <div className="flex justify-between items-center px-4 py-2 shadow z-40">
      <div className="flex items-center gap-2 my-2">
        <div
          className="flex items-center text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="flex items-center mr-2">
            <HatHouseBlack />
          </div>
          Campus Cribs
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
      </div>
    </div>
  );
};

export default Header;
