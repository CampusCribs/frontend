import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeftIcon, MoreHorizontal } from "lucide-react";

type IndividualChatProps = {
  // top bar
  name?: string;
  avatarUrl?: string;
};

const IndividualChat = ({
  name = "Johnny Edwards",
  avatarUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3krGAS5w7YyUrBn7Y55sqCFh13aR2La_dYQ&s",
}: IndividualChatProps) => {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const [open, setOpen] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    // TODO: sendmessage
    setMessage("");
  };

  return (
    <div className="flex justify-center ">
      <div className="w-full max-w-[600px] shadow-xl h-[100dvh] flex flex-col bg-white">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-3 py-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 rounded-xl px-2 py-2 hover:bg-gray-100 transition"
              aria-label="Back"
            >
              <ArrowLeftIcon size={22} />
            </button>

            <div
              className="flex items-center gap-2 min-w-0 cursor-pointer"
              onClick={() => navigate("/profile/johnnyedwards")}
            >
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
                setOpen(!open);
                console.log("Open menu");
              }}
            >
              <MoreHorizontal size={20} />
              {open && (
                <ChatMenu
                  setOpen={setOpen}
                  onReport={() => console.log("report")}
                  onBlock={() => console.log("block")}
                  onMute={() => console.log("mute")}
                  onDelete={() => console.log("delete")}
                />
              )}
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

type ChatMenuProps = {
  setOpen: (open: boolean) => void;
  onReport?: () => void;
  onBlock?: () => void;
  onMute?: () => void;
  onDelete?: () => void;
};

const ChatMenu = ({
  setOpen,
  onReport,
  onBlock,
  onMute,
  onDelete,
}: ChatMenuProps) => {
  return (
    <div
      className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white shadow-lg border border-slate-200 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <MenuItem
        label="Mute conversation"
        onClick={() => {
          onMute?.();
          setOpen(false);
        }}
      />

      <MenuItem
        label="Delete conversation"
        danger
        onClick={() => {
          onDelete?.();
          setOpen(false);
        }}
      />

      <div className="h-px bg-slate-100 my-1" />

      <MenuItem
        label="Report"
        danger
        onClick={() => {
          onReport?.();
          setOpen(false);
        }}
      />

      <MenuItem
        label="Block user"
        danger
        onClick={() => {
          onBlock?.();
          setOpen(false);
        }}
      />
    </div>
  );
};

function MenuItem({
  label,
  danger,
  onClick,
}: {
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left px-4 py-2.5 text-sm font-medium transition",
        "hover:bg-slate-50",
        danger ? "text-rose-600" : "text-slate-800",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
