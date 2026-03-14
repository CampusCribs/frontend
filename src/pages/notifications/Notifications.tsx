import { useMemo, useState } from "react";
import { ArrowLeft, CheckCheck, Filter, BellOff } from "lucide-react";
import { useNavigate } from "react-router";

type NotificationType = "message" | "comment" | "like" | "mention" | "system";
type NotificationChannel = "in_app" | "push" | "email";

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  body?: string;
  createdAt: string; // ISO
  read: boolean;

  // optional deep links
  href?: string; // internal route to navigate to
  actorName?: string;
  actorAvatarUrl?: string;
  postTitle?: string;

  // optional metadata
  channel?: NotificationChannel;
};

const demoNotifications: NotificationItem[] = [
  {
    id: "n1",
    type: "message",
    title: "New message",
    body: "Ava: “Hey—are you still looking for a roommate?”",
    createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    read: false,
    href: "/messages/ava",
    actorName: "Ava",
  },
  {
    id: "n2",
    type: "comment",
    title: "New comment",
    body: "Sam commented on your post: “Is this still available?”",
    createdAt: new Date(Date.now() - 1000 * 60 * 52).toISOString(),
    read: false,
    href: "/posts/123",
    actorName: "Sam",
    postTitle: "Looking for roommate near campus",
  },
  {
    id: "n3",
    type: "like",
    title: "Someone liked your post",
    body: "Jordan liked your listing.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    read: true,
    href: "/posts/456",
    actorName: "Jordan",
  },
  {
    id: "n4",
    type: "system",
    title: "Security alert",
    body: "New login detected from a new device.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
    href: "/settings/account",
  },
];

function timeAgo(iso: string) {
  const delta = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(delta / (1000 * 60));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

function typeLabel(t: NotificationType) {
  switch (t) {
    case "message":
      return "Messages";
    case "comment":
      return "Comments";
    case "like":
      return "Likes";
    case "mention":
      return "Mentions";
    case "system":
      return "System";
  }
}

export default function NotificationsInboxPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<NotificationItem[]>(demoNotifications);
  const [filter, setFilter] = useState<NotificationType | "all">("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const unreadCount = useMemo(
    () => items.filter((n) => !n.read).length,
    [items],
  );

  const visible = useMemo(() => {
    return items
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .filter((n) => (filter === "all" ? true : n.type === filter))
      .filter((n) => (showUnreadOnly ? !n.read : true));
  }, [items, filter, showUnreadOnly]);

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  };

  const openNotification = (n: NotificationItem) => {
    // mark as read when opened
    setItems((prev) =>
      prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
    );
    if (n.href) navigate(n.href);
  };

  return (
    <div className="mx-auto min-h-[100dvh] bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="flex items-center justify-between px-4 h-12">
          <button
            title="back"
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-black/5 transition"
            type="button"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-black/90">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 text-black/70">
                {unreadCount} new
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={markAllRead}
            className="p-2 rounded-full hover:bg-black/5 transition"
            title="Mark all as read"
          >
            <CheckCheck size={18} />
          </button>
        </div>

        {/* Filters */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`shrink-0 text-sm px-3 py-1.5 rounded-full border transition ${
                filter === "all"
                  ? "border-black/10 bg-black/[0.04] text-black/90"
                  : "border-black/10 text-black/60 hover:text-black/80"
              }`}
            >
              All
            </button>

            {(["message", "comment", "like", "mention", "system"] as const).map(
              (t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilter(t)}
                  className={`shrink-0 text-sm px-3 py-1.5 rounded-full border transition ${
                    filter === t
                      ? "border-black/10 bg-black/[0.04] text-black/90"
                      : "border-black/10 text-black/60 hover:text-black/80"
                  }`}
                >
                  {typeLabel(t)}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() => setShowUnreadOnly((v) => !v)}
              className={`ml-auto shrink-0 inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-full border transition ${
                showUnreadOnly
                  ? "border-black/10 bg-black/[0.04] text-black/90"
                  : "border-black/10 text-black/60 hover:text-black/80"
              }`}
              title="Toggle unread only"
            >
              <Filter size={16} />
              Unread
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="divide-y">
        {visible.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-black/5 flex items-center justify-center">
              <BellOff size={20} className="text-black/50" />
            </div>
            <div className="mt-3 font-medium text-black/80">
              No notifications
            </div>
            <p className="mt-1 text-sm text-black/50">You’re all caught up.</p>
          </div>
        ) : (
          visible.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => openNotification(n)}
              className="w-full text-left px-4 py-4 hover:bg-black/[0.03] transition"
            >
              <div className="flex items-start gap-3">
                {/* Read indicator */}
                <div className="pt-1">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      n.read ? "bg-transparent" : "bg-black/70"
                    }`}
                    title={n.read ? "Read" : "Unread"}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-black/90 truncate">
                      {n.title}
                    </div>
                    <div className="text-xs text-black/45 shrink-0">
                      {timeAgo(n.createdAt)}
                    </div>
                  </div>

                  {n.body && (
                    <p className="mt-1 text-sm text-black/60 line-clamp-2">
                      {n.body}
                    </p>
                  )}

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 text-black/60">
                      {typeLabel(n.type)}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRead(n.id);
                      }}
                      className="text-xs text-black/50 hover:text-black/80 transition"
                    >
                      Mark as {n.read ? "unread" : "read"}
                    </button>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
