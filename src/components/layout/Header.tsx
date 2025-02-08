import { CircleUserRound, Search } from "lucide-react";

const Header = () => {
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-2">
        <div className="text-2xl font-bold">Campus Cribs</div>
      </div>

      <div className="flex items-center gap-2">
        <div>
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
