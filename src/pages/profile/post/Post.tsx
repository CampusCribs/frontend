import React, { useMemo, useState } from "react";

type Details = {
  title: string;
  description: string;
  pricePerMonth: number | "";
  address: string;
};

type FormState = {
  details: Details;
  tags: string[];
  images: File[];
};

type StepId = "details" | "tags" | "images";

const STEPS: { id: StepId; label: string; helper: string }[] = [
  {
    id: "details",
    label: "Details",
    helper: "Title, description, price, location",
  },
  { id: "tags", label: "Tags", helper: "Add a few keywords to help search" },
  { id: "images", label: "Images", helper: "Upload photos for the listing" },
];

export default function CreatePostOrchestrator() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const [state, setState] = useState<FormState>({
    details: {
      title: "",
      description: "",
      pricePerMonth: "",
      address: "",
    },
    tags: [],
    images: [],
  });

  const activeStep = STEPS[activeStepIndex]?.id ?? "details";

  const canGoNext = useMemo(() => {
    if (activeStep === "details") {
      const d = state.details;
      return (
        d.title.trim().length >= 3 &&
        d.description.trim().length >= 10 &&
        d.pricePerMonth !== "" &&
        Number(d.pricePerMonth) > 0 &&
        d.address.trim().length >= 5
      );
    }
    if (activeStep === "tags") return state.tags.length >= 1; // tweak if tags optional
    if (activeStep === "images") return state.images.length >= 1; // tweak if images optional
    return false;
  }, [activeStep, state.details, state.tags.length, state.images.length]);

  function goNext() {
    setActiveStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setActiveStepIndex((i) => Math.max(i - 1, 0));
  }

  function goTo(step: StepId) {
    const idx = STEPS.findIndex((s) => s.id === step);
    if (idx !== -1) setActiveStepIndex(idx);
  }

  async function handleSubmit() {
    // TODO: wire to your API
    console.log("SUBMIT", state);
    alert("Submitted! (check console)");
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <Stepper
        steps={STEPS}
        activeStep={activeStep}
        activeStepIndex={activeStepIndex}
        onStepClick={(step) => {
          // allow clicking back only (common UX)
          const idx = STEPS.findIndex((s) => s.id === step);
          if (idx <= activeStepIndex) goTo(step);
        }}
      />

      <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        {activeStep === "details" && (
          <DetailsStep
            value={state.details}
            onChange={(next) => setState((s) => ({ ...s, details: next }))}
          />
        )}

        {activeStep === "tags" && (
          <TagsStep
            value={state.tags}
            onChange={(next) => setState((s) => ({ ...s, tags: next }))}
          />
        )}

        {activeStep === "images" && (
          <ImagesStep
            value={state.images}
            onChange={(next) => setState((s) => ({ ...s, images: next }))}
          />
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={activeStepIndex === 0}
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>

          <div className="flex items-center gap-3">
            {activeStep !== "images" ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!canGoNext}
                className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canGoNext}
                className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit
              </button>
            )}
          </div>
        </div>

        {!canGoNext && (
          <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
            Fill out the required fields to continue.
          </div>
        )}
      </div>

      <DebugPanel state={state} />
    </div>
  );
}

/* ------------------------- Stepper ------------------------- */

function Stepper({
  steps,
  activeStep,
  activeStepIndex,
  onStepClick,
}: {
  steps: { id: StepId; label: string; helper: string }[];
  activeStep: StepId;
  activeStepIndex: number;
  onStepClick: (id: StepId) => void;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {steps.map((s, idx) => {
          const isActive = s.id === activeStep;
          const isDone = idx < activeStepIndex;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onStepClick(s.id)}
              className={[
                "group inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : isDone
                    ? "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50"
                    : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50",
              ].join(" ")}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className={[
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                  isActive
                    ? "bg-white/15 text-white"
                    : isDone
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-700",
                ].join(" ")}
              >
                {idx + 1}
              </span>
              <span className="whitespace-nowrap">{s.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 text-sm text-zinc-600">
        <span className="font-medium text-zinc-900">
          {steps[activeStepIndex]?.label}
        </span>
        <span className="mx-2 text-zinc-300">•</span>
        <span>{steps[activeStepIndex]?.helper}</span>
      </div>
    </div>
  );
}

/* ------------------------- Step 1: Details ------------------------- */

function DetailsStep({
  value,
  onChange,
}: {
  value: Details;
  onChange: (next: Details) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Post details</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Add the core info first—this makes everything else easier.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title">
          <input
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            placeholder="e.g. Sunny 2BR near campus"
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400"
          />
        </Field>

        <Field label="Price / month">
          <input
            type="number"
            value={value.pricePerMonth}
            onChange={(e) =>
              onChange({
                ...value,
                pricePerMonth:
                  e.target.value === "" ? "" : Number(e.target.value),
              })
            }
            placeholder="1200"
            min={0}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400"
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Address (or neighborhood)">
            <input
              value={value.address}
              onChange={(e) => onChange({ ...value, address: e.target.value })}
              placeholder="e.g. Clifton / 123 Main St"
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400"
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Description">
            <textarea
              value={value.description}
              onChange={(e) =>
                onChange({ ...value, description: e.target.value })
              }
              placeholder="Tell people what’s great about it…"
              rows={6}
              className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400"
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- Step 2: Tags ------------------------- */

function TagsStep({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function addTag(tag: string) {
    const t = tag.trim();
    if (!t) return;
    if (value.some((x) => x.toLowerCase() === t.toLowerCase())) return;
    onChange([...value, t]);
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  const suggestions = [
    "Furnished",
    "Pets OK",
    "Parking",
    "In-unit laundry",
    "Near campus",
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Tags</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Tags help people filter and find the right place faster.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {value.length === 0 ? (
          <span className="text-sm text-zinc-500">No tags yet</span>
        ) : (
          value.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900"
            >
              {t}
              <button
                type="button"
                onClick={() => removeTag(t)}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                aria-label={`Remove ${t}`}
                title="Remove"
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="e.g. furnished, pets ok, parking"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(draft);
              setDraft("");
            }
          }}
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400"
        />
        <button
          type="button"
          onClick={() => {
            addTag(draft);
            setDraft("");
          }}
          className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
        >
          Add
        </button>
      </div>

      <div>
        <div className="text-sm font-medium text-zinc-900">Suggestions</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {suggestions.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => addTag(t)}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900"
            >
              + {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------- Step 3: Images ------------------------- */

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

    // cap images (optional)
    onChange(next.slice(0, 15));
  }

  function removeAt(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Images</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Add at least one. More photos usually = more interest.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => addFiles(e.target.files)}
          className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-xl file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-800"
        />
        <div className="mt-2 text-xs text-zinc-500">
          PNG/JPG/WEBP • up to 15 images
        </div>
      </div>

      {value.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700">
          No images yet.
        </div>
      ) : (
        <ul className="space-y-2">
          {value.map((f, idx) => (
            <li
              key={`${f.name}-${idx}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-zinc-900">
                  {f.name}
                </div>
                <div className="text-xs text-zinc-500">
                  {Math.round(f.size / 1024)} KB • {f.type}
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="shrink-0 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------- Small helpers ------------------------- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1">
      <div className="text-sm font-medium text-zinc-900">{label}</div>
      {children}
    </label>
  );
}

function DebugPanel({ state }: { state: FormState }) {
  return (
    <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold text-zinc-900">Debug</div>
      <pre className="mt-2 overflow-auto rounded-xl bg-zinc-50 p-3 text-xs text-zinc-800">
        {JSON.stringify(
          {
            details: state.details,
            tags: state.tags,
            images: state.images.map((f) => ({
              name: f.name,
              size: f.size,
              type: f.type,
            })),
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
