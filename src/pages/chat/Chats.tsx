import { ChatDTO, useListChats } from "@/gen";
import { AlertCircle, CheckCircle2, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

function Chats() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: chats } = useListChats({ search: searchTerm });

  return (
    <div className="w-full ">
      <div className=" flex items-center justify-center border-2 rounded-2xl py-1 px-3 m-3">
        <Search className="mr-2 text-black/70" />
        <input
          value={searchTerm}
          type="text"
          placeholder="Search chats"
          className=" p-2  outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {chats?.data.content.map((chat) => (
        <Chat key={chat.username} {...chat} />
      ))}
    </div>
  );
}

const Chat = ({
  username,
  name,
  avatarUrl,
  lastMessage,
  lastMessageAt,
  verification,
}: ChatDTO) => {
  const navigate = useNavigate();

  return (
    <div
      className="border-t p-3 py-4 mt-1 cursor-pointer hover:bg-gray-50 transition"
      onClick={() => navigate(`/chats/${username}`)}
    >
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center min-w-0">
          {/* Avatar */}
          <div className="rounded-full w-10 h-10 overflow-hidden flex-shrink-0">
            <img
              src={avatarUrl}
              alt={`${name} profile`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text */}
          <div className="ml-2 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{name}</h3>
            </div>

            <p className="text-sm text-gray-500 truncate max-w-[220px]">
              {lastMessage}
            </p>
          </div>
        </div>

        <div>
          <span
            className={[
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset mr-5",
              verification === "VERIFIED"
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : "bg-gray-100 text-gray-600 ring-gray-200",
            ].join(" ")}
            title={
              verification === "VERIFIED"
                ? "This user completed verification."
                : "This user has not completed verification yet."
            }
          >
            {verification === "VERIFIED" ? (
              <CheckCircle2 size={12} />
            ) : (
              <AlertCircle size={12} />
            )}
            {verification === "VERIFIED" ? "Verified" : "Unverified"}
          </span>

          {/* Right */}
          <span className="text-sm text-gray-400 whitespace-nowrap ml-2">
            {new Date(lastMessageAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
export default Chats;
