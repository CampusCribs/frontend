import { Search } from "lucide-react";
import { useNavigate } from "react-router";

function Chats() {
  return (
    <div className="w-full ">
      <div className=" flex items-center justify-center border-2 rounded-2xl py-1 px-3 m-3">
        <Search className="mr-2 text-black/70" />
        <input
          type="text"
          placeholder="Search chats"
          className=" p-2  outline-none"
        />
      </div>
      {Array.from(Array(10).keys()).map((_, index) => (
        <Chat key={index} />
      ))}
    </div>
  );
}

const Chat = () => {
  const navigate = useNavigate();
  return (
    <div
      className="border-t p-3 py-4 mt-1 cursor-pointer"
      onClick={() => navigate(`/chats/${"chatId"}`)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-gray-300 rounded-full w-10 h-10 overflow-hidden">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3krGAS5w7YyUrBn7Y55sqCFh13aR2La_dYQ&s"
              alt="profile pic"
            />
          </div>
          <div className="ml-2">
            <h3 className="font-semibold">Johnny Edwards</h3>
            <p className="text-sm text-gray-500 overflow-ellipsis whitespace-nowrap overflow-hidden w-50">
              Hey I like the apartment could you tell me a little bit more about
              it d
            </p>
          </div>
        </div>
        <span className="text-sm text-gray-500">Time</span>
      </div>
    </div>
  );
};
export default Chats;
