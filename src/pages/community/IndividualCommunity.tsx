import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
} from "lucide-react";
import { ImageGrid } from "./Community";

/**
 * Community Post Detail Page (Post + Comments)
 * - Post card at top (BlogCard style, no random image slicing)
 * - Comments list
 * - STICKY "Add comment" composer pinned to bottom, meant to sit ABOVE your app footer/taskbar
 *
 * IMPORTANT:
 * - This page assumes your layout has a persistent bottom taskbar (e.g. 64px tall).
 * - Set `TASKBAR_H = 64` to your actual height (in px).
 */

type CommentSort = "Top" | "Newest" | "Oldest";

type Comment = {
  id: string;
  postId: string;
  author: { name: string; username: string; avatarUrl: string };
  body: string;
  createdAtLabel: string;
  likes: number;
  likedByMe?: boolean;
  replies?: Comment[]; // 1-level nesting
};

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

const TASKBAR_H = 64; // <-- set to your real bottom nav height (px)

export function IndividualCommunity({
  post,
  initialComments,
}: {
  post: any; // replace with CommunityPost
  initialComments: Comment[];
}) {
  const navigate = useNavigate();

  const [sort, setSort] = useState<CommentSort>("Top");
  const [comments, setComments] = useState<Comment[]>(initialComments);

  // Sticky composer state
  const [draft, setDraft] = useState("");
  const [replyingTo, setReplyingTo] = useState<{
    parentId: string;
    username: string;
  } | null>(null);

  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const sortedComments = useMemo(() => {
    const clone = [...comments];
    if (sort === "Newest") return clone.reverse();
    if (sort === "Oldest") return clone;
    return clone.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
  }, [comments, sort]);

  const onToggleLikePost = () => {
    // wire to API
  };

  const submitTopLevelComment = () => {
    const text = draft.trim();
    if (!text) return;

    const created: Comment = {
      id: crypto.randomUUID(),
      postId: post.id,
      author: {
        name: "You",
        username: "you",
        avatarUrl:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=you&backgroundColor=b6e3f4",
      },
      body: text,
      createdAtLabel: "Just now",
      likes: 0,
      replies: [],
    };

    setComments((prev) => [created, ...prev]);
    setDraft("");
  };

  const submitReply = () => {
    if (!replyingTo) return;
    const { parentId } = replyingTo;
    const text = (replyDrafts[parentId] ?? "").trim();
    if (!text) return;

    const reply: Comment = {
      id: crypto.randomUUID(),
      postId: post.id,
      author: {
        name: "You",
        username: "you",
        avatarUrl:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=you&backgroundColor=b6e3f4",
      },
      body: text,
      createdAtLabel: "Just now",
      likes: 0,
      replies: [],
    };

    setComments((prev) =>
      prev.map((c) =>
        c.id === parentId
          ? { ...c, replies: [reply, ...(c.replies ?? [])] }
          : c,
      ),
    );

    setReplyDrafts((prev) => ({ ...prev, [parentId]: "" }));
    setReplyingTo(null);
  };

  const onToggleLikeComment = (commentId: string, parentId?: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (!parentId && c.id === commentId) {
          const liked = !c.likedByMe;
          return { ...c, likedByMe: liked, likes: c.likes + (liked ? 1 : -1) };
        }
        if (parentId && c.id === parentId) {
          const nextReplies =
            c.replies?.map((r) => {
              if (r.id !== commentId) return r;
              const liked = !r.likedByMe;
              return {
                ...r,
                likedByMe: liked,
                likes: r.likes + (liked ? 1 : -1),
              };
            }) ?? [];
          return { ...c, replies: nextReplies };
        }
        return c;
      }),
    );
  };

  const jumpToComments = () => {
    document
      .getElementById("comments")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <div className="text-sm font-semibold">Post</div>
            <div className="text-xs text-gray-500">
              Community • {post?.createdAtLabel ?? "Posted recently"}
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto">
        {/* Post (BlogCard-style) */}
        <div className="bg-white border-b p-4 py-6">
          {/* Header */}
          <div
            className="flex items-center gap-3 mb-2 cursor-pointer"
            onClick={() => navigate(`/profile/${post.username}`)}
          >
            <img
              alt="thumbnail"
              src={post.avatarUrl}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-sm">{post.name}</h3>
                  <p className="text-xs text-gray-500">{post.intent}</p>
                </div>
                <button className="p-2 rounded-full hover:bg-gray-100 transition">
                  <MoreHorizontal size={18} className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <p className="text-sm text-gray-800 leading-relaxed mb-3">
            {post.body}
          </p>

          {/* Images */}
          {post.images?.length ? (
            <div className="mb-3">
              <ImageGrid images={post.images} />
            </div>
          ) : null}

          {/* Footer */}
          <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
            <span>{post.createdAtLabel ?? "Posted recently"}</span>
          </div>

          {/* Engagement */}
          <div className="flex justify-between items-center text-gray-600 text-sm">
            <button
              className={cx(
                "flex items-center gap-1 transition",
                post.likedByMe ? "text-red-500" : "hover:text-red-500",
              )}
              onClick={onToggleLikePost}
            >
              <Heart
                size={18}
                className={cx(post.likedByMe && "fill-current")}
              />
              <span>{post.likes ?? 0}</span>
            </button>

            <button
              className="flex items-center gap-1 hover:text-blue-500 transition"
              onClick={jumpToComments}
            >
              <MessageCircle size={18} />
              <span>{comments.length}</span>
            </button>

            <button className="flex items-center gap-1 hover:text-green-600 transition">
              <Share2 size={18} />
              <span>Share</span>
            </button>

            <button
              title="bookmark"
              className="flex items-center gap-1 hover:text-yellow-600 transition"
            >
              <Bookmark size={18} />
            </button>
          </div>
        </div>

        {/* Comments header + sort */}
        <div id="comments" className="px-4 py-4 border-b">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">Comments</div>
              <div className="text-xs text-gray-500">
                Tap Reply to respond to someone
              </div>
            </div>
          </div>
        </div>

        {/* Comments list */}
        <div className="divide-y">
          {sortedComments.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-gray-500">
              No comments yet. Be the first to comment.
            </div>
          ) : (
            sortedComments.map((c) => (
              <CommentItem
                key={c.id}
                comment={c}
                onLike={() => onToggleLikeComment(c.id)}
                onReply={() =>
                  setReplyingTo({ parentId: c.id, username: c.author.username })
                }
                onLikeReply={(replyId) => onToggleLikeComment(replyId, c.id)}
              />
            ))
          )}
        </div>

        {/* Spacer so last comments aren't hidden behind sticky composer + taskbar */}
        <div style={{ height: TASKBAR_H + 96 }} />
      </div>

      {/* Sticky Composer (above taskbar) */}
      <div className="sticky z-30 max-w-[600px]" style={{ bottom: TASKBAR_H }}>
        <div className="border-t bg-white/95 backdrop-blur">
          <div className="max-w-2xl mx-auto px-4 py-3">
            {replyingTo ? (
              <div className="mb-2 flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  Replying to{" "}
                  <span className="font-medium">@{replyingTo.username}</span>
                </div>
                <button
                  className="text-xs text-gray-500 hover:text-gray-800"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </button>
              </div>
            ) : null}

            <div className="flex items-end gap-3 ">
              <img
                alt="you"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=you&backgroundColor=b6e3f4"
                className="w-9 h-9 rounded-full object-cover"
              />

              <div className="flex-1">
                {replyingTo ? (
                  <textarea
                    value={replyDrafts[replyingTo.parentId] ?? ""}
                    onChange={(e) =>
                      setReplyDrafts((p) => ({
                        ...p,
                        [replyingTo.parentId]: e.target.value,
                      }))
                    }
                    placeholder={`Reply to @${replyingTo.username}…`}
                    rows={2}
                    className="w-full text-sm border rounded-2xl px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                  />
                ) : (
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Add a comment…"
                    rows={2}
                    className="w-full text-sm border rounded-2xl px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                  />
                )}
              </div>

              <button
                onClick={replyingTo ? submitReply : submitTopLevelComment}
                disabled={
                  replyingTo
                    ? !(replyDrafts[replyingTo.parentId] ?? "").trim()
                    : !draft.trim()
                }
                className={cx(
                  "inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-xl transition",
                  replyingTo
                    ? (replyDrafts[replyingTo.parentId] ?? "").trim()
                      ? "bg-black text-white hover:bg-gray-900"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : draft.trim()
                      ? "bg-black text-white hover:bg-gray-900"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed",
                )}
              >
                <Send size={16} />
                {replyingTo ? "Reply" : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  onLike,
  onReply,
  onLikeReply,
}: {
  comment: Comment;
  onLike: () => void;
  onReply: () => void;
  onLikeReply: (replyId: string) => void;
}) {
  const [showAllReplies, setShowAllReplies] = useState(false);
  const replies = comment.replies ?? [];
  const visibleReplies = showAllReplies ? replies : replies.slice(0, 2);
  const hiddenCount = Math.max(0, replies.length - visibleReplies.length);

  return (
    <div className="px-4 py-4">
      <div className="flex gap-3">
        <img
          alt={comment.author.name}
          src={comment.author.avatarUrl}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold">
                  {comment.author.name}
                </div>
                <div className="text-xs text-gray-400">
                  @{comment.author.username}
                </div>
                <div className="text-xs text-gray-400">•</div>
                <div className="text-xs text-gray-400">
                  {comment.createdAtLabel}
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-800 leading-relaxed">
                {comment.body}
              </p>
            </div>

            <button className="p-2 rounded-full hover:bg-gray-100 transition">
              <MoreHorizontal size={16} className="text-gray-500" />
            </button>
          </div>

          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
            <button
              onClick={onLike}
              className={cx(
                "inline-flex items-center gap-1 hover:text-red-500 transition",
                comment.likedByMe && "text-red-500",
              )}
            >
              <Heart
                size={14}
                className={cx(comment.likedByMe && "fill-current")}
              />
              <span>{comment.likes}</span>
            </button>

            <button
              onClick={onReply}
              className="inline-flex items-center gap-1 hover:text-blue-500 transition"
            >
              <MessageCircle size={14} />
              <span>Reply</span>
            </button>
          </div>

          {/* Replies */}
          {replies.length > 0 ? (
            <div className="mt-3 pl-6 border-l">
              <div className="space-y-3">
                {visibleReplies.map((r) => (
                  <div key={r.id} className="flex gap-3">
                    <img
                      alt={r.author.name}
                      src={r.author.avatarUrl}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold">
                          {r.author.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          @{r.author.username}
                        </div>
                        <div className="text-xs text-gray-400">•</div>
                        <div className="text-xs text-gray-400">
                          {r.createdAtLabel}
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-800 leading-relaxed">
                        {r.body}
                      </p>

                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <button
                          onClick={() => onLikeReply(r.id)}
                          className={cx(
                            "inline-flex items-center gap-1 hover:text-red-500 transition",
                            r.likedByMe && "text-red-500",
                          )}
                        >
                          <Heart
                            size={14}
                            className={cx(r.likedByMe && "fill-current")}
                          />
                          <span>{r.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hiddenCount > 0 ? (
                <button
                  onClick={() => setShowAllReplies(true)}
                  className="mt-3 text-xs font-medium text-blue-600 hover:underline"
                >
                  View {hiddenCount} more repl{hiddenCount === 1 ? "y" : "ies"}
                </button>
              ) : replies.length > 2 && showAllReplies ? (
                <button
                  onClick={() => setShowAllReplies(false)}
                  className="mt-3 text-xs font-medium text-blue-600 hover:underline"
                >
                  Hide replies
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Example route page (swap data-loading with your API) */
export function IndividualCommunityExample() {
  const { postId } = useParams<{ postId: string }>();

  const mockPost = {
    id: postId ?? "1",
    type: "COMMUNITY",
    name: "Johnny Edwards",
    username: "johnnyedwards",
    avatarUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3krGAS5w7YyUrBn7Y55sqCFh13aR2La_dYQ&s",
    intent: "Looking for Roommate",
    body: "Looking for a roommate to join me and my friends this semester. Chill group, close to campus.",
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
    ],
    likes: 18,
    likedByMe: false,
    createdAtLabel: "Posted 2h ago",
  };

  const mockComments: Comment[] = [
    {
      id: "c1",
      postId: mockPost.id,
      author: {
        name: "Ava Chen",
        username: "avachen",
        avatarUrl:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=ava&backgroundColor=b6e3f4",
      },
      body: "What’s the rent range + which neighborhood?",
      createdAtLabel: "1h ago",
      likes: 6,
      likedByMe: false,
      replies: [
        {
          id: "r1",
          postId: mockPost.id,
          author: {
            name: "Johnny Edwards",
            username: "johnnyedwards",
            avatarUrl:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3krGAS5w7YyUrBn7Y55sqCFh13aR2La_dYQ&s",
          },
          body: "Around $650–$750 each. Clifton area, ~10 min to campus.",
          createdAtLabel: "55m ago",
          likes: 3,
        },
        {
          id: "r2",
          postId: mockPost.id,
          author: {
            name: "Sam Patel",
            username: "sampatel",
            avatarUrl:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=sam&backgroundColor=c0aede",
          },
          body: "Clifton is solid—parking can be rough though.",
          createdAtLabel: "40m ago",
          likes: 1,
        },
      ],
    },
    {
      id: "c2",
      postId: mockPost.id,
      author: {
        name: "Leo",
        username: "leor",
        avatarUrl:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=leo&backgroundColor=ffdfbf",
      },
      body: "DM’d you!",
      createdAtLabel: "25m ago",
      likes: 2,
      likedByMe: true,
      replies: [],
    },
  ];

  return <IndividualCommunity post={mockPost} initialComments={mockComments} />;
}
