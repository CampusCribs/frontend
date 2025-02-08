import { CircleUserRound, Search } from "lucide-react";
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-2">
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Campus Cribs
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="cursor-pointer" onClick={() => navigate("/profile")}>
          <CircleUserRound />
        </div>
        <div>
          <Search />
        </div>
      </div>
    </div>
  );
};

export default Header;
