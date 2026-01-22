import {
  BadgeCheckIcon,
  HelpCircleIcon,
  Search,
  ShieldCheckIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

function Chats() {
  const [searchTerm, setSearchTerm] = useState("");
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
      {Array.from(Array(3).keys()).map((_) => (
        <>
          <Chat
            chatId="chat-student-001"
            name="Emily Carter"
            avatarUrl="https://randomuser.me/api/portraits/women/44.jpg"
            lastMessage="Hey! I'm also a UC student — want to tour together?"
            lastMessageAt="9:12 PM"
            role="STUDENT"
          />
          <Chat
            chatId="chat-landlord-002"
            name="Michael Thompson"
            avatarUrl="https://randomuser.me/api/portraits/men/32.jpg"
            lastMessage="Yes, the 2-bedroom is still available starting August."
            lastMessageAt="10:53 PM"
            role="LANDLORD"
          />
          <Chat
            chatId="chat-unverified-003"
            name="Alex Johnson"
            avatarUrl="https://randomuser.me/api/portraits/lego/1.jpg"
            lastMessage="Is this place still open?"
            lastMessageAt="Yesterday"
            role="UNVERIFIED"
          />
        </>
      ))}
    </div>
  );
}

type UserRole = "STUDENT" | "LANDLORD" | "UNVERIFIED";

type ChatProps = {
  chatId: string;
  name: string;
  avatarUrl: string;
  lastMessage: string;
  lastMessageAt: string;
  role: UserRole;
};

const roleConfig = {
  STUDENT: {
    label: "Student",
    icon: ShieldCheckIcon,
    badge: "bg-emerald-50 text-emerald-600",
  },
  LANDLORD: {
    label: "Landlord",
    icon: BadgeCheckIcon,
    badge: "bg-blue-50 text-blue-600",
  },
  UNVERIFIED: {
    label: "Unverified",
    icon: HelpCircleIcon,
    badge: "bg-gray-100 text-gray-500",
  },
};

const Chat = ({
  chatId,
  name,
  avatarUrl,
  lastMessage,
  lastMessageAt,
  role,
}: ChatProps) => {
  const navigate = useNavigate();
  const RoleIcon = roleConfig[role].icon;

  return (
    <div
      className="border-t p-3 py-4 mt-1 cursor-pointer hover:bg-gray-50 transition"
      onClick={() => navigate(`/chats/${chatId}`)}
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

              <span
                className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${roleConfig[role].badge}`}
              >
                <RoleIcon size={12} />
                {roleConfig[role].label}
              </span>
            </div>

            <p className="text-sm text-gray-500 truncate max-w-[220px]">
              {lastMessage}
            </p>
          </div>
        </div>

        {/* Right */}
        <span className="text-sm text-gray-400 whitespace-nowrap ml-2">
          {lastMessageAt}
        </span>
      </div>
    </div>
  );
};
export default Chats;
