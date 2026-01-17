import React, { useMemo, useState } from "react";
import { Home, User2, Image as ImageIcon, Tags, FileText } from "lucide-react";
import { useNavigate } from "react-router";

/**
 * Orchestrator:
 * Step 0: "What are you here to do?" -> List your crib / Community post
 *  - If "List your crib": navigate to /post/crib
 *  - If "Community post": flow -> Details -> Images -> Tags -> Submit
 */

type Mode = "LIST_CRIB" | "COMMUNITY_POST" | null;
type CommunityStep = "CHOOSE" | "DETAILS" | "IMAGES" | "TAGS" | "REVIEW";

type CommunityDetails = {
  title: string;
  body: string;
};

type CommunityState = {
  details: CommunityDetails;
  images: File[];
  tags: string[];
};

export default function PostOrchestrator() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>(null);
  const [step, setStep] = useState<CommunityStep>("CHOOSE");

  const [community, setCommunity] = useState<CommunityState>({
    details: { title: "", body: "" },
    images: [],
    tags: [],
  });

  const stepIndex = useMemo(() => {
    const order: CommunityStep[] = [
      "CHOOSE",
      "DETAILS",
      "IMAGES",
      "TAGS",
      "REVIEW",
    ];
    return order.indexOf(step);
  }, [step]);

  const canContinue = useMemo(() => {
    if (step === "CHOOSE") return mode !== null;
    if (step === "DETAILS")
      return (
        community.details.title.trim().length >= 3 &&
        community.details.body.trim().length >= 10
      );
    if (step === "IMAGES") return community.images.length >= 1; // adjust if optional
    if (step === "TAGS") return community.tags.length >= 1; // adjust if optional
    if (step === "REVIEW") return true;
    return false;
  }, [
    step,
    mode,
    community.details,
    community.images.length,
    community.tags.length,
  ]);

  function chooseMode(next: Mode) {
    setMode(next);

    if (next === "LIST_CRIB") {
      navigate("/profile/post/crib");
      return;
    }

    // community post flow
    setStep("DETAILS");
  }

  function goBack() {
    if (step === "DETAILS") {
      setStep("CHOOSE");
      setMode(null);
      return;
    }
    if (step === "IMAGES") return setStep("DETAILS");
    if (step === "TAGS") return setStep("IMAGES");
    if (step === "REVIEW") return setStep("TAGS");
  }

  function goNext() {
    if (step === "CHOOSE") {
      if (mode === "LIST_CRIB") return; // would have navigated
      if (mode === "COMMUNITY_POST") return setStep("DETAILS");
    }
    if (step === "DETAILS") return setStep("IMAGES");
    if (step === "IMAGES") return setStep("TAGS");
    if (step === "TAGS") return setStep("REVIEW");
  }

  async function submitCommunityPost() {
    // TODO: wire your API call
    // e.g. await createPost({ ...details, tags }); then upload images
    console.log("SUBMIT COMMUNITY POST", community);
    alert("Submitted (check console)");
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-black/85">
            Create a post
          </div>
          <div className="text-sm text-black/60">
            {step === "CHOOSE"
              ? "Choose what you want to do"
              : "Community post setup"}
          </div>
        </div>

        {step !== "CHOOSE" ? (
          <div className="hidden sm:flex items-center gap-2 text-sm text-black/60">
            <div className="rounded-full border border-black/10 px-3 py-1">
              Step {Math.max(stepIndex, 1)}/4
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-4 rounded-2xl border border-black/10 bg-white p-5">
        {step === "CHOOSE" ? (
          <ChooseStep mode={mode} onChoose={chooseMode} />
        ) : null}

        {step === "DETAILS" ? (
          <DetailsStep
            value={community.details}
            onChange={(next) => setCommunity((s) => ({ ...s, details: next }))}
          />
        ) : null}

        {step === "IMAGES" ? (
          <ImagesStep
            value={community.images}
            onChange={(next) => setCommunity((s) => ({ ...s, images: next }))}
          />
        ) : null}

        {step === "TAGS" ? (
          <TagsStep
            value={community.tags}
            onChange={(next) => setCommunity((s) => ({ ...s, tags: next }))}
          />
        ) : null}

        {step === "REVIEW" ? <ReviewStep community={community} /> : null}

        {/* Footer controls */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === "CHOOSE"}
            className={[
              "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold",
              "border transition",
              step === "CHOOSE"
                ? "border-black/10 text-black/30 cursor-not-allowed"
                : "border-black/10 text-black/80 hover:bg-black/[0.03]",
            ].join(" ")}
          >
            Back
          </button>

          <div className="flex items-center gap-3">
            {step !== "REVIEW" ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!canContinue}
                className={[
                  "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold",
                  "transition",
                  canContinue
                    ? "bg-neutral-900 text-white hover:bg-neutral-800"
                    : "bg-neutral-900/40 text-white cursor-not-allowed",
                ].join(" ")}
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={submitCommunityPost}
                className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Submit
              </button>
            )}
          </div>
        </div>

        {!canContinue && step !== "CHOOSE" ? (
          <div className="mt-3 rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-black/60">
            Fill out the required info to continue.
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ----------------------------- Choose Step ----------------------------- */

function ChooseStep({
  mode,
  onChoose,
}: {
  mode: Mode;
  onChoose: (m: Exclude<Mode, null>) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-semibold text-black/85">
        What are you here to do?
      </div>

      <div className="flex flex-col gap-3 items-center">
        <Box
          label="List your crib"
          icon={<Home size={80} />}
          selected={mode === "LIST_CRIB"}
          onClick={() => onChoose("LIST_CRIB")}
        />
        <Box
          label="Make a community post"
          icon={<User2 size={80} />}
          selected={mode === "COMMUNITY_POST"}
          onClick={() => onChoose("COMMUNITY_POST")}
        />
      </div>
    </div>
  );
}

function Box({
  label,
  icon,
  selected,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-[60%] rounded-2xl px-4 py-6 text-base font-semibold text-left",
        "border transition aspect-square flex flex-col items-center justify-center gap-4",
        selected
          ? "border-neutral-900"
          : "border-black/10 hover:border-black/20",
      ].join(" ")}
    >
      <div className="text-black/85">{icon}</div>
      <div className="text-black/85">{label}</div>
    </button>
  );
}

/* ----------------------------- Details Step ----------------------------- */

function DetailsStep({
  value,
  onChange,
}: {
  value: CommunityDetails;
  onChange: (next: CommunityDetails) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-black/70">
          <FileText size={22} />
        </div>
        <div>
          <div className="text-lg font-semibold text-black/85">Details</div>
          <div className="text-sm text-black/60">Title + a bit of context.</div>
        </div>
      </div>

      <div className="grid gap-3">
        <label className="grid gap-1">
          <div className="text-sm font-semibold text-black/75">Title</div>
          <input
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            placeholder="e.g. Looking for a roommate near campus"
            className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/20"
          />
        </label>

        <label className="grid gap-1">
          <div className="text-sm font-semibold text-black/75">Post</div>
          <textarea
            value={value.body}
            onChange={(e) => onChange({ ...value, body: e.target.value })}
            placeholder="Write your post..."
            rows={7}
            className="w-full resize-none rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/20"
          />
        </label>
      </div>
    </div>
  );
}

/* ----------------------------- Images Step ----------------------------- */

function ImagesStep({
  value,
  onChange,
}: {
  value: File[];
  onChange: (next: File[]) => void;
}) {
  function addFiles(files: FileList | null) {
    if (!files) return;
    const next = [...value];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) continue;
      next.push(f);
    }
    onChange(next.slice(0, 12));
  }

  function removeAt(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-black/70">
          <ImageIcon size={22} />
        </div>
        <div>
          <div className="text-lg font-semibold text-black/85">Images</div>
          <div className="text-sm text-black/60">Add at least one image.</div>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-black/20 bg-black/[0.02] p-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => addFiles(e.target.files)}
          className="block w-full text-sm text-black/70 file:mr-3 file:rounded-2xl file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-neutral-800"
        />
        <div className="mt-2 text-xs text-black/50">
          PNG/JPG/WEBP • up to 12
        </div>
      </div>

      {value.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black/60">
          No images yet.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {value.map((f, idx) => (
            <div
              key={`${f.name}-${idx}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white px-3 py-2"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-black/80">
                  {f.name}
                </div>
                <div className="text-xs text-black/50">
                  {Math.round(f.size / 1024)} KB
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="shrink-0 rounded-2xl border border-black/10 px-3 py-2 text-sm font-semibold text-black/70 transition hover:bg-black/[0.03]"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Tags Step ----------------------------- */

function TagsStep({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const suggestions = [
    "Roommates",
    "Housing",
    "Sublease",
    "UC",
    "Advice",
    "Social",
  ];

  function addTag(tag: string) {
    const t = tag.trim();
    if (!t) return;
    if (value.some((x) => x.toLowerCase() === t.toLowerCase())) return;
    onChange([...value, t]);
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-black/70">
          <Tags size={22} />
        </div>
        <div>
          <div className="text-lg font-semibold text-black/85">Tags</div>
          <div className="text-sm text-black/60">Add at least one tag.</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {value.length === 0 ? (
          <div className="text-sm text-black/60">No tags yet</div>
        ) : (
          value.map((t) => (
            <div
              key={t}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm font-semibold text-black/75"
            >
              {t}
              <button
                type="button"
                onClick={() => removeTag(t)}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-black/60 transition hover:bg-black/[0.04]"
                aria-label={`Remove ${t}`}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="e.g. roommates, sublease, housing"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(draft);
              setDraft("");
            }
          }}
          className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/20"
        />
        <button
          type="button"
          onClick={() => {
            addTag(draft);
            setDraft("");
          }}
          className="rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => addTag(t)}
            className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm font-semibold text-black/70 transition hover:bg-black/[0.03]"
          >
            + {t}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- Review Step ----------------------------- */

function ReviewStep({ community }: { community: CommunityState }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-semibold text-black/85">Review</div>

      <div className="rounded-2xl border border-black/10 bg-white p-4">
        <div className="text-sm font-semibold text-black/70">Title</div>
        <div className="mt-1 text-base font-semibold text-black/85">
          {community.details.title || "—"}
        </div>

        <div className="mt-4 text-sm font-semibold text-black/70">Body</div>
        <div className="mt-1 whitespace-pre-wrap text-sm text-black/75">
          {community.details.body || "—"}
        </div>

        <div className="mt-4 text-sm font-semibold text-black/70">Images</div>
        <div className="mt-1 text-sm text-black/75">
          {community.images.length} file(s)
        </div>

        <div className="mt-4 text-sm font-semibold text-black/70">Tags</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {community.tags.length === 0 ? (
            <div className="text-sm text-black/60">—</div>
          ) : (
            community.tags.map((t) => (
              <div
                key={t}
                className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm font-semibold text-black/75"
              >
                {t}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
