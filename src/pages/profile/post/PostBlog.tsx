import React, { useMemo, useState } from "react";
import { Home, User2, Image as ImageIcon, Tags, FileText } from "lucide-react";
import { useNavigate } from "react-router";

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

const ORDER: CommunityStep[] = [
  "CHOOSE",
  "DETAILS",
  "IMAGES",
  "TAGS",
  "REVIEW",
];

export default function UltraMinimalPostOrchestrator() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>(null);
  const [step, setStep] = useState<CommunityStep>("CHOOSE");

  const [community, setCommunity] = useState<CommunityState>({
    details: { title: "", body: "" },
    images: [],
    tags: [],
  });

  const stepIndex = ORDER.indexOf(step);
  const isCommunityFlow = mode === "COMMUNITY_POST" && step !== "CHOOSE";

  const canContinue = useMemo(() => {
    if (step === "CHOOSE") return mode !== null;

    if (step === "DETAILS") {
      return (
        community.details.title.trim().length >= 3 &&
        community.details.body.trim().length >= 10
      );
    }

    if (step === "IMAGES") return community.images.length >= 1;
    if (step === "TAGS") return community.tags.length >= 1;
    if (step === "REVIEW") return true;

    return false;
  }, [
    step,
    mode,
    community.details,
    community.images.length,
    community.tags.length,
  ]);

  function chooseMode(next: Exclude<Mode, null>) {
    setMode(next);

    if (next === "LIST_CRIB") {
      navigate("/profile/post/crib");
      return;
    }

    setStep("DETAILS");
  }

  function back() {
    if (step === "CHOOSE") return;

    if (step === "DETAILS") {
      setStep("CHOOSE");
      setMode(null);
      return;
    }

    if (step === "IMAGES") return setStep("DETAILS");
    if (step === "TAGS") return setStep("IMAGES");
    if (step === "REVIEW") return setStep("TAGS");
  }

  function next() {
    if (!canContinue) return;

    if (step === "CHOOSE") {
      if (mode === "COMMUNITY_POST") setStep("DETAILS");
      return;
    }

    if (step === "DETAILS") return setStep("IMAGES");
    if (step === "IMAGES") return setStep("TAGS");
    if (step === "TAGS") return setStep("REVIEW");
  }

  async function submitCommunityPost() {
    console.log("SUBMIT COMMUNITY POST", community);
    alert("Submitted (check console)");
    navigate("/cribs");
  }

  return (
    <div className=" w-full max-w-md mx-auto px-4 pt-8 pb-6 flex flex-col">
      <div className="flex-1">
        {/* Title */}
        <div className="mb-6">
          {/* Dots: only show full 5 dots once you're in community flow,
              otherwise show nothing or just 1 dot. */}
          {mode === "COMMUNITY_POST" ? (
            <div className="mt-4 flex gap-2">
              {ORDER.map((s) => (
                <Dot
                  key={s}
                  active={s === step}
                  done={ORDER.indexOf(s) < stepIndex}
                />
              ))}
            </div>
          ) : null}
        </div>

        {/* Content */}
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

        {step !== "CHOOSE" && !canContinue ? (
          <div className="mt-5 text-sm text-black/45">
            Fill out the required info to continue.
          </div>
        ) : null}
      </div>

      {/* Footer buttons (same vibe as onboarding) */}
      <div className="pt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={back}
          disabled={step === "CHOOSE"}
          className="w-24 rounded-2xl px-4 py-3 text-sm font-semibold text-black/60 disabled:opacity-30"
        >
          Back
        </button>

        {step === "REVIEW" ? (
          <button
            type="button"
            onClick={submitCommunityPost}
            className="flex-1 rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-neutral-900"
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            disabled={!canContinue}
            className="flex-1 rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-neutral-900 disabled:opacity-40"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- tiny primitives ---------------- */

function Dot({ active, done }: { active: boolean; done: boolean }) {
  return (
    <div
      className={[
        "h-2 w-2 rounded-full",
        active ? "bg-neutral-900" : done ? "bg-black/35" : "bg-black/15",
      ].join(" ")}
    />
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <div className="text-sm font-semibold text-black/70">{label}</div>
      {children}
    </label>
  );
}

/* ---------------- CHOOSE ---------------- */

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
        Choose your post type.
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

/* ---------------- DETAILS ---------------- */

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
          <div className="text-sm text-black/50">Title + a bit of context.</div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Field label="Title">
          <input
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            placeholder="Looking for a roommate near campus"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm text-black/80 outline-none focus:border-black/25"
          />
        </Field>

        <Field label="Post">
          <textarea
            value={value.body}
            onChange={(e) => onChange({ ...value, body: e.target.value })}
            placeholder="Write your post..."
            rows={7}
            className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm text-black/80 outline-none focus:border-black/25"
          />
        </Field>
      </div>
    </div>
  );
}

/* ---------------- IMAGES ---------------- */

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
          <div className="text-sm text-black/50">Add at least one.</div>
        </div>
      </div>

      <label className="rounded-2xl border border-black/10 bg-white px-4 py-4">
        <div className="text-sm font-semibold text-black/70">Upload</div>
        <div className="text-xs text-black/40 mt-1">
          PNG/JPG/WEBP • up to 12
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => addFiles(e.target.files)}
          className="mt-3 block w-full text-sm text-black/70 file:mr-3 file:rounded-2xl file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        />
      </label>

      {value.length === 0 ? (
        <div className="text-sm text-black/45">No images yet.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {value.map((f, idx) => (
            <div
              key={`${f.name}-${idx}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-black/75">
                  {f.name}
                </div>
                <div className="text-xs text-black/40">
                  {Math.round(f.size / 1024)} KB
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-black/60 hover:border-black/20"
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

/* ---------------- TAGS ---------------- */

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
          <div className="text-sm text-black/50">Add at least one.</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {value.length === 0 ? (
          <div className="text-sm text-black/45">No tags yet.</div>
        ) : (
          value.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => removeTag(t)}
              className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-black/70 hover:border-black/20"
              title="Click to remove"
            >
              {t} <span className="text-black/35">×</span>
            </button>
          ))
        )}
      </div>

      <div className="flex gap-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a tag and press Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(draft);
              setDraft("");
            }
          }}
          className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm text-black/80 outline-none focus:border-black/25"
        />
        <button
          type="button"
          onClick={() => {
            addTag(draft);
            setDraft("");
          }}
          className="rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-neutral-900"
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
            className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-black/60 hover:border-black/20"
          >
            + {t}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- REVIEW ---------------- */

function ReviewStep({ community }: { community: CommunityState }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-black/70">
          <FileText size={22} />
        </div>
        <div>
          <div className="text-lg font-semibold text-black/85">Review</div>
          <div className="text-sm text-black/50">
            Quick check before posting.
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-4">
        <div className="text-sm font-semibold text-black/60">Title</div>
        <div className="mt-1 text-base font-semibold text-black/85">
          {community.details.title || "—"}
        </div>

        <div className="mt-4 text-sm font-semibold text-black/60">Body</div>
        <div className="mt-1 whitespace-pre-wrap text-sm text-black/75">
          {community.details.body || "—"}
        </div>

        <div className="mt-4 text-sm font-semibold text-black/60">Images</div>
        <div className="mt-1 text-sm text-black/75">
          {community.images.length} file(s)
        </div>

        <div className="mt-4 text-sm font-semibold text-black/60">Tags</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {community.tags.length === 0 ? (
            <div className="text-sm text-black/45">—</div>
          ) : (
            community.tags.map((t) => (
              <div
                key={t}
                className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-black/70"
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
