import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeftIcon, MoreHorizontal } from "lucide-react";
import {
  ChatSettingsRequest,
  postChatSettings,
  postMessage,
  useIndividualChat,
} from "@/gen";
import z from "zod";

const postMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(500, "Message must be 500 characters or less"),
});

const IndividualChat = () => {
  const navigate = useNavigate();
  const { username = "" } = useParams<{ username: string }>();

  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useIndividualChat(username);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;

    setMessage(el.value);
    if (error) setError(null);
  };
  const chat = data?.data;
  const otherUser = chat?.otherUser;
  useEffect(() => {
    if (textareaRef.current === null) return;
    if (textareaRef.current.value.length == 0)
      textareaRef.current.style.height = "10px ";
    else textareaRef.current.style.height = "auto"; // reset
    textareaRef.current.style.height =
      Math.min(textareaRef.current.scrollHeight, 200) + "px";
  });
  const messages = useMemo(() => {
    return chat?.messages?.content ?? [];
  }, [chat]);

  const handleMessageSend = async () => {
    const result = postMessageSchema.safeParse({ message });

    if (!result.success) {
      setError(
        result.error.flatten().fieldErrors.message?.[0] ?? "Invalid message",
      );
      return;
    }

    setError(null);

    try {
      await postMessage(username, result.data);
      setMessage("");
    } catch (err) {
      setError("Failed to send message");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-[600px] h-[100dvh] bg-white flex items-center justify-center text-sm text-gray-500">
          Loading chat...
        </div>
      </div>
    );
  }

  if (isError || !otherUser) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-[600px] h-[100dvh] bg-white flex flex-col items-center justify-center px-6 text-center">
          <div className="text-lg font-semibold text-slate-900">
            Could not load chat
          </div>
          <button
            type="button"
            onClick={() => window.location.reload}
            className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            reload
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const avatarUrl = otherUser.avatarUrl;
  const name = otherUser.name;
  const profileUsername = otherUser.username;

  return (
    <div className="flex justify-center">
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
              onClick={() => navigate(`/profile/${profileUsername}`)}
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
                  Chat
                </div>
              </div>
            </div>

            <div className="relative">
              <button
                type="button"
                className="rounded-xl px-2 py-2 hover:bg-gray-100 transition"
                aria-label="Menu"
                onClick={() => setOpen((prev) => !prev)}
              >
                <MoreHorizontal size={20} />
              </button>

              {open && (
                <ChatMenu
                  setOpen={setOpen}
                  onSetting={async (setting: ChatSettingsRequest) => {
                    postChatSettings(username, setting);
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 ">
          <div className="flex w-full items-center justify-center text-sm font-light text-gray-500 mb-3">
            Messages
          </div>

          <div className="flex flex-col gap-3">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                No messages yet
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.username !== otherUser.username;

                return isMe ? (
                  <MeChat
                    key={`${msg.sentAt}-${index}`}
                    message={msg.message}
                    time={formatTime(msg.sentAt)}
                  />
                ) : (
                  <OtherChat
                    key={`${msg.sentAt}-${index}`}
                    avatarUrl={avatarUrl}
                    time={formatTime(msg.sentAt)}
                  >
                    {msg.message}
                  </OtherChat>
                );
              })
            )}
          </div>
          <div className="h-2" />
        </div>

        {/* Composer */}
        <div className="border-t border-gray-200 bg-white px-3 pt-2 pb-3">
          <div className="flex items-end gap-2 w-full">
            {/* Input bubble */}
            <div className="flex-1 bg-gray-100 rounded-3xl px-3 py-2 shadow-sm">
              <textarea
                ref={textareaRef}
                value={message}
                onBlur={handleInput}
                onChange={handleInput}
                maxLength={500}
                placeholder="Type your message..."
                className="w-full resize-none bg-transparent px-2 py-2 text-sm focus:outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Send button */}
            <button
              type="button"
              onClick={handleMessageSend}
              className="bg-blue-500 hover:bg-blue-600 transition text-white px-4 h-10 rounded-full font-medium flex items-center justify-center"
            >
              Send
            </button>
          </div>

          {error && <p className="mt-1 text-sm text-red-500 px-1">{error}</p>}
        </div>
      </div>
    </div>
  );
};

/* ---------- helpers ---------- */

function formatTime(sentAt?: string) {
  if (!sentAt) return "";

  const date = new Date(sentAt);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

/* ---------- Message bubbles ---------- */

const MeChat = ({ message, time }: { message: string; time: string }) => {
  return (
    <div className="flex justify-end mb-2">
      <div className="bg-blue-600 text-white px-4 py-2 max-w-[80%] sm:max-w-md rounded-2xl">
        <div className="text-sm">{message}</div>
        <div className="flex justify-end text-xs text-blue-100 font-light">
          {time}
        </div>
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
        <div className="flex justify-end text-xs text-gray-500 font-light ">
          {time}
        </div>
      </div>
    </div>
  );
};

export default IndividualChat;

type ChatMenuProps = {
  setOpen: (open: boolean) => void;
  onSetting: (setting: ChatSettingsRequest) => void;
};

const ChatMenu = ({ setOpen, onSetting }: ChatMenuProps) => {
  return (
    <div
      className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white shadow-lg border border-slate-200 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <MenuItem
        label="Mute conversation"
        onClick={() => {
          onSetting("MUTE");
          setOpen(false);
        }}
      />

      <MenuItem
        label="Delete conversation"
        danger
        onClick={() => {
          onSetting("DELETE");
          setOpen(false);
        }}
      />

      <div className="h-px bg-slate-100 my-1" />

      <MenuItem
        label="Report"
        danger
        onClick={() => {
          onSetting("REPORT");
          setOpen(false);
        }}
      />

      <MenuItem
        label="Block user"
        danger
        onClick={() => {
          onSetting("BLOCK");
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
