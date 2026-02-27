import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";

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

type Step = 0 | 1 | 2;

export default function UltraMinimalCreatePost({
  onSubmit,
}: {
  onSubmit?: (state: FormState) => Promise<void> | void;
}) {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(0);
  const [state, setState] = useState<FormState>({
    details: { title: "", description: "", pricePerMonth: "", address: "" },
    tags: [],
    images: [],
  });

  const canContinue = useMemo(() => {
    if (step === 0) {
      const d = state.details;
      return (
        d.title.trim().length >= 3 &&
        d.description.trim().length >= 10 &&
        d.pricePerMonth !== "" &&
        Number(d.pricePerMonth) > 0 &&
        d.address.trim().length >= 5
      );
    }
    if (step === 1) return state.tags.length >= 1;
    return state.images.length >= 1;
  }, [step, state.details, state.tags.length, state.images.length]);

  const hint = useMemo(() => {
    if (step === 0) return "Title, description, price, location";
    if (step === 1) return "Add a few keywords to help search";
    return "Upload photos for the listing";
  }, [step]);

  const next = async () => {
    if (!canContinue) return;

    if (step < 2) {
      setStep((s) => (s + 1) as Step);
      return;
    }

    // Submit
    try {
      await onSubmit?.(state);
      console.log("SUBMIT", state);

      // choose where you want to go after submit
      navigate("/cribs");
    } catch (e) {
      console.error(e);
      alert("Submit failed. Check console.");
    }
  };

  const back = () => setStep((s) => Math.max(0, s - 1) as Step);

  return (
    <div className="min-h-[100dvh] w-full max-w-md mx-auto px-4 pt-8 pb-6 flex flex-col">
      <div className="flex flex-col gap-6 mb-10">
        <div className="mb-6">
          <div className="text-lg font-semibold text-black/85">
            {step === 0 ? "Post details" : step === 1 ? "Tags" : "Images"}
          </div>
          <div className="text-sm text-black/50 mt-1">{hint}</div>

          {/* Tiny progress (minimal) */}
          <div className="mt-4 flex gap-2">
            <Dot active={step === 0} />
            <Dot active={step === 1} />
            <Dot active={step === 2} />
          </div>
        </div>

        {step === 0 && (
          <DetailsStep
            value={state.details}
            onChange={(details) => setState((s) => ({ ...s, details }))}
          />
        )}

        {step === 1 && (
          <TagsStep
            value={state.tags}
            onChange={(tags) => setState((s) => ({ ...s, tags }))}
          />
        )}

        {step === 2 && (
          <ImagesStep
            value={state.images}
            onChange={(images) => setState((s) => ({ ...s, images }))}
          />
        )}

        {!canContinue && (
          <div className="mt-5 text-sm text-black/45">
            Fill out the required fields to continue.
          </div>
        )}
      </div>

      <div className=" flex items-center gap-3">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="w-24 rounded-2xl px-4 py-3 text-sm font-semibold text-black/60 disabled:opacity-30"
        >
          Back
        </button>

        <button
          type="button"
          onClick={next}
          disabled={!canContinue}
          className="flex-1 rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-neutral-900 disabled:opacity-40"
        >
          {step < 2 ? "Continue" : "Finish"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- tiny primitives ---------------- */

function Dot({ active }: { active: boolean }) {
  return (
    <div
      className={[
        "h-2 w-2 rounded-full",
        active ? "bg-neutral-900" : "bg-black/15",
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

/* ---------------- Step 1: Details ---------------- */

function DetailsStep({
  value,
  onChange,
}: {
  value: Details;
  onChange: (next: Details) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Field label="Title">
        <input
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          placeholder="Sunny 2BR near campus"
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm text-black/80 outline-none focus:border-black/25"
        />
      </Field>

      <Field label="Price / month">
        <input
          type="number"
          min={0}
          value={value.pricePerMonth}
          onChange={(e) =>
            onChange({
              ...value,
              pricePerMonth:
                e.target.value === "" ? "" : Number(e.target.value),
            })
          }
          placeholder="1200"
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm text-black/80 outline-none focus:border-black/25"
        />
      </Field>

      <Field label="Address (or neighborhood)">
        <input
          value={value.address}
          onChange={(e) => onChange({ ...value, address: e.target.value })}
          placeholder="Clifton / 123 Main St"
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm text-black/80 outline-none focus:border-black/25"
        />
      </Field>

      <Field label="Description">
        <textarea
          rows={6}
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          placeholder="Tell people what’s great about it…"
          className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm text-black/80 outline-none focus:border-black/25"
        />
      </Field>
    </div>
  );
}

/* ---------------- Step 2: Tags ---------------- */

function TagsStep({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const suggestions = [
    "Furnished",
    "Pets OK",
    "Parking",
    "In-unit laundry",
    "Near campus",
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
      {/* Current tags */}
      <div className="flex flex-wrap gap-2">
        {value.length === 0 ? (
          <div className="text-sm text-black/45">No tags yet.</div>
        ) : (
          value.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => removeTag(t)}
              className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm text-black/70 hover:border-black/20"
              title="Click to remove"
            >
              {t} <span className="text-black/35">×</span>
            </button>
          ))
        )}
      </div>

      {/* Add tag */}
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

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => addTag(t)}
            className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm text-black/60 hover:border-black/20"
          >
            + {t}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Step 3: Images ---------------- */

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

    onChange(next.slice(0, 15));
  }

  function removeAt(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="rounded-2xl border border-black/10 bg-white px-4 py-4">
        <div className="text-sm font-semibold text-black/70">Upload images</div>
        <div className="text-xs text-black/40 mt-1">
          PNG/JPG/WEBP • up to 15 images
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
