import React from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeftIcon,
  CalendarIcon,
  FileTextIcon,
  MoreHorizontal,
} from "lucide-react";

type LeadAction = "REQUEST_TOUR" | "SUBMIT_APPLICATION";

type IndividualChatProps = {
  // top bar
  name?: string;
  avatarUrl?: string;

  // role behavior
  isLandlordAccount?: boolean; // if the OTHER party is a landlord, show lead actions
};

const IndividualChat = ({
  name = "Johnny Edwards",
  avatarUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3krGAS5w7YyUrBn7Y55sqCFh13aR2La_dYQ&s",
  isLandlordAccount = true,
}: IndividualChatProps) => {
  const navigate = useNavigate();

  const [message, setMessage] = React.useState("");
  const [showLeadNudge, setShowLeadNudge] = React.useState(isLandlordAccount);

  // Optional: auto-hide the lead strip after a moment (keeps it noticeable but not annoying)
  React.useEffect(() => {
    if (!isLandlordAccount) return;
    const t = window.setTimeout(() => setShowLeadNudge(false), 5500);
    return () => window.clearTimeout(t);
  }, [isLandlordAccount]);

  const handleSend = () => {
    if (!message.trim()) return;
    // TODO: send message
    setMessage("");
  };

  const handleLeadAction = (action: LeadAction) => {
    // TODO: open modal / route to flow
    // This is where you can track + bill landlords for leads (event + attribution)
    console.log("Lead action:", action);
  };

  return (
    <div className="flex justify-center ">
      <div className="w-full max-w-[600px] shadow-xl h-[100dvh] flex flex-col bg-white">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-3 py-2">
            <button
              type="button"
              onClick={() => navigate("/chats")}
              className="inline-flex items-center gap-1 rounded-xl px-2 py-2 hover:bg-gray-100 transition"
              aria-label="Back"
            >
              <ArrowLeftIcon size={22} />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                <img
                  src={avatarUrl}
                  alt={`${name} profile`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 text-center">
                <div className="font-semibold leading-tight truncate">
                  {name}
                </div>
                <div className="text-xs text-gray-500 leading-tight truncate">
                  Chat about listing
                </div>
              </div>
            </div>

            <button
              type="button"
              className="rounded-xl px-2 py-2 hover:bg-gray-100 transition"
              aria-label="Menu"
              onClick={() => {
                // TODO: open menu (report, block, etc.)
                console.log("Open menu");
              }}
            >
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          <div className="flex w-full items-center justify-center text-sm font-light text-gray-500 mb-3">
            Today
          </div>
          <MeChat>
            Hey I saw this listing and I wanted to reach out and ask if it is
            still available during the times posted? please let me know!
          </MeChat>
          {/* Example messages */}
          <OtherChat avatarUrl={avatarUrl} time="10:53 PM">
            Hello! Yes it’s still available. Would you like to schedule a tour?
          </OtherChat>

          {/* Spacer so last message doesn't hide behind composer */}
          <div className="h-2" />
        </div>

        {/* Composer area */}
        <div className="border-t border-gray-200 bg-white px-3 pt-2 pb-3">
          {/* Lead initiation (only when chatting with landlord account) */}
          {isLandlordAccount &&
            (showLeadNudge ? (
              <div className="mb-2 flex items-center justify-between gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-3 py-2">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-blue-800 truncate">
                    Quick actions
                  </div>
                  <div className="text-xs text-blue-700 truncate">
                    Request a tour or submit an application
                  </div>
                </div>
                <button
                  type="button"
                  className="text-xs text-blue-700 hover:text-blue-900 font-medium px-2 py-1 rounded-xl hover:bg-blue-100 transition"
                  onClick={() => setShowLeadNudge(false)}
                >
                  Dismiss
                </button>
              </div>
            ) : (
              <div className="mb-2 flex gap-2 overflow-x-auto no-scrollbar">
                <LeadPill
                  icon={<CalendarIcon size={14} />}
                  label="Request tour"
                  onClick={() => handleLeadAction("REQUEST_TOUR")}
                />
                <LeadPill
                  icon={<FileTextIcon size={14} />}
                  label="Submit application"
                  onClick={() => handleLeadAction("SUBMIT_APPLICATION")}
                />
              </div>
            ))}

          {/* Input row */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              className="flex-1 min-w-0 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="button"
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-3 rounded-full font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Message bubbles ---------- */

const MeChat = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-end mb-2">
      <div className="bg-blue-600 text-white px-4 py-2 max-w-[80%] sm:max-w-md rounded-2xl">
        {children}
      </div>
    </div>
  );
};

const OtherChat = ({
  children,
  avatarUrl,
  time,
}: {
  children: React.ReactNode;
  avatarUrl: string;
  time: string;
}) => {
  return (
    <div className="flex justify-start mb-2 gap-2">
      <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
        <img
          src={avatarUrl}
          alt="profile pic"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col bg-gray-100 text-black px-4 py-2 max-w-[80%] sm:max-w-md rounded-2xl">
        <div className="text-sm">{children}</div>
        <div className="flex justify-end text-xs text-gray-500 font-light mt-1">
          {time}
        </div>
      </div>
    </div>
  );
};

/* ---------- Lead pills ---------- */

const LeadPill = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50 transition"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default IndividualChat;
