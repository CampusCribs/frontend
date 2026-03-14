import React, { useEffect, useMemo, useState } from "react";
import {
  useCompleteMediaUpload,
  useCreateDraftMediaUpload,
  useCreatePostDraft,
  useGetPostDraft,
  useGetPostTags,
  useUpdatePostDraft,
} from "@/gen";
import type { PostTagOption } from "@/gen/types/PostTagOption";
import {
  residenceCardDTOCommuteBucketEnum,
  type ResidenceCardDTOCommuteBucketEnum,
} from "@/gen/types/ResidenceCardDTO";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import { useNavigate, useSearchParams } from "react-router";

const MAX_IMAGES = 10;

type Details = {
  title: string;
  description: string;
  pricePerMonth: number | "";
  commuteBucket: ResidenceCardDTOCommuteBucketEnum;
};

type UploadedImage = {
  mediaId: string;
  label: string;
};

type FormState = {
  details: Details;
  tags: string[];
  images: UploadedImage[];
};

type Step = 0 | 1 | 2;

const commuteOptions: {
  value: ResidenceCardDTOCommuteBucketEnum;
  label: string;
}[] = [
  {
    value: residenceCardDTOCommuteBucketEnum.WALK_5,
    label: "5 min walk to campus",
  },
  {
    value: residenceCardDTOCommuteBucketEnum.WALK_10,
    label: "10 min walk to campus",
  },
  {
    value: residenceCardDTOCommuteBucketEnum.WALK_15,
    label: "15 min walk to campus",
  },
  {
    value: residenceCardDTOCommuteBucketEnum.WALK_20,
    label: "20 min walk to campus",
  },
  {
    value: residenceCardDTOCommuteBucketEnum.DRIVE,
    label: "Short drive to campus",
  },
];

function mergeImages(
  mediaIds: string[],
  previous: UploadedImage[],
  labels: Record<string, string>,
) {
  return mediaIds.map((mediaId, index) => ({
    mediaId,
    label:
      labels[mediaId] ??
      previous.find((image) => image.mediaId === mediaId)?.label ??
      `Uploaded image ${index + 1}`,
  }));
}

export default function UltraMinimalCreatePost({
  onSubmit,
}: {
  onSubmit?: (state: FormState) => Promise<void> | void;
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCommuteDropdown, setShowCommuteDropdown] = useState(false);
  const config = useAuthenticatedClientConfig();
  const draftId = searchParams.get("draftId") ?? "";

  const { data: draftData, isLoading: isLoadingDraft } = useGetPostDraft(
    draftId,
    {
      query: {
        enabled: !!draftId,
      },
    },
  );
  const { mutateAsync: createDraft, isPending: isCreatingDraft } =
    useCreatePostDraft({});
  const { mutateAsync: updateDraft, isPending: isUpdatingDraft } =
    useUpdatePostDraft({});
  const { mutateAsync: createMediaUpload } = useCreateDraftMediaUpload({});
  const { mutateAsync: completeMediaUpload } = useCompleteMediaUpload({});
  const {
    data: tagsData,
    isLoading: isLoadingTags,
    isError: isTagsError,
  } = useGetPostTags({});

  const [step, setStep] = useState<Step>(0);
  const [uploadError, setUploadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [imageLabels, setImageLabels] = useState<Record<string, string>>({});
  const [state, setState] = useState<FormState>({
    details: {
      title: "",
      description: "",
      pricePerMonth: "",
      commuteBucket: "WALK_5",
    },
    tags: [],
    images: [],
  });

  useEffect(() => {
    const draft = draftData?.data;
    if (!draft) return;

    setState((prev) => ({
      details: {
        title: draft.details.title,
        description: draft.details.description,
        pricePerMonth: draft.details.pricePerMonth,
        commuteBucket: draft.details.commuteBucket,
      },
      tags: draft.tags,
      images: mergeImages(draft.mediaIds, prev.images, imageLabels),
    }));
  }, [draftData]);

  const canContinue = useMemo(() => {
    if (step === 0) {
      const details = state.details;
      return (
        details.title.trim().length >= 3 &&
        details.description.trim().length >= 10 &&
        details.pricePerMonth !== "" &&
        Number(details.pricePerMonth) > 0
      );
    }

    if (step === 1) {
      return state.images.length >= 1 && !isUploadingImages;
    }

    return state.tags.length >= 1;
  }, [
    isUploadingImages,
    state.details,
    state.images.length,
    state.tags.length,
    step,
  ]);

  const hint = useMemo(() => {
    if (step === 0) return "Title, description, price, location";
    if (step === 1) return "Upload up to 10 listing photos";
    return "Add a few keywords to help search";
  }, [step]);

  async function saveDraftDetails() {
    const payload = {
      title: state.details.title,
      description: state.details.description,
      pricePerMonth: Number(state.details.pricePerMonth),
      commuteBucket: state.details.commuteBucket,
    };

    if (!draftId) {
      const response = await createDraft({
        data: payload,
      });
      setSearchParams({ draftId: response.data.draftId });
      return response.data.draftId;
    }

    await updateDraft({
      draftId,
      data: payload,
    });

    return draftId;
  }

  async function saveFinalDraft() {
    if (!draftId) return;

    await updateDraft({
      draftId,
      data: {
        title: state.details.title,
        description: state.details.description,
        pricePerMonth: Number(state.details.pricePerMonth),
        commuteBucket: state.details.commuteBucket,
        tags: state.tags,
        mediaIds: state.images.map((image) => image.mediaId),
      },
    });
  }

  const next = async () => {
    if (!canContinue) return;

    setSaveError("");

    if (step === 0) {
      try {
        await saveDraftDetails();
        setStep(1);
      } catch (error) {
        console.error(error);
        setSaveError("Unable to save draft details right now.");
      }
      return;
    }

    if (step === 1) {
      setStep(2);
      return;
    }

    try {
      await saveFinalDraft();
      await onSubmit?.(state);
      navigate("/cribs");
    } catch (error) {
      console.error(error);
      setSaveError("Unable to save tags for this draft right now.");
    }
  };

  const back = () =>
    setStep((currentStep) => Math.max(0, currentStep - 1) as Step);

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || !draftId) return;

    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );
    const remainingSlots = MAX_IMAGES - state.images.length;

    if (remainingSlots <= 0) {
      setUploadError(`You can upload up to ${MAX_IMAGES} images.`);
      return;
    }

    const filesToUpload = imageFiles.slice(0, remainingSlots);

    if (filesToUpload.length === 0) {
      setUploadError("Choose at least one image file to upload.");
      return;
    }

    if (imageFiles.length > filesToUpload.length) {
      setUploadError(`Only the first ${remainingSlots} image(s) were added.`);
    } else {
      setUploadError("");
    }

    setIsUploadingImages(true);

    try {
      const uploadedImages: UploadedImage[] = [];

      for (const file of filesToUpload) {
        const uploadResponse = await createMediaUpload({
          draftId,
          data: {
            fileName: file.name,
            contentType: file.type,
          },
        });

        const uploadResult = await fetch(uploadResponse.data.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!uploadResult.ok) {
          throw new Error("Upload request failed.");
        }

        const completeResponse = await completeMediaUpload({
          mediaId: uploadResponse.data.mediaId,
        });

        if (!completeResponse.data.uploaded) {
          throw new Error("Upload confirmation failed.");
        }

        uploadedImages.push({
          mediaId: completeResponse.data.mediaId,
          label: file.name,
        });
      }

      const nextImages = [...state.images, ...uploadedImages];

      setImageLabels((prev) => {
        const nextLabels = { ...prev };

        for (const image of uploadedImages) {
          nextLabels[image.mediaId] = image.label;
        }

        return nextLabels;
      });

      setState((prev) => ({
        ...prev,
        images: nextImages,
      }));

      await updateDraft({
        draftId,
        data: {
          mediaIds: nextImages.map((image) => image.mediaId),
        },
      });
    } catch (error) {
      console.error(error);
      setUploadError("Unable to upload images right now.");
    } finally {
      setIsUploadingImages(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-md mx-auto px-4 pt-8 pb-6 flex flex-col">
      <div className="flex flex-col gap-6 mb-10">
        <div className="mb-6">
          <div className="text-lg font-semibold text-black/85">
            {step === 0 ? "Post details" : step === 1 ? "Images" : "Tags"}
          </div>
          <div className="text-sm text-black/50 mt-1">{hint}</div>

          <div className="mt-4 flex gap-2">
            <Dot active={step === 0} />
            <Dot active={step === 1} />
            <Dot active={step === 2} />
          </div>
        </div>

        {step === 0 && (
          <DetailsStep
            value={state.details}
            onChange={(details) => setState((prev) => ({ ...prev, details }))}
            isLoadingDraft={isLoadingDraft}
          />
        )}

        {step === 1 && (
          <ImagesStep
            value={state.images}
            isUploading={isUploadingImages}
            uploadError={uploadError}
            onFilesSelected={handleFilesSelected}
          />
        )}

        {step === 2 && (
          <TagsStep
            value={state.tags}
            onChange={(tags) => setState((prev) => ({ ...prev, tags }))}
            suggestions={tagsData?.data ?? []}
            isLoading={isLoadingTags}
            isError={isTagsError}
          />
        )}

        {(saveError || (!canContinue && !isUploadingImages)) && (
          <div className="mt-5 text-sm text-black/45">
            {saveError || "Fill out the required fields to continue."}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
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
          disabled={!canContinue || isCreatingDraft || isUpdatingDraft}
          className="flex-1 rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-neutral-900 disabled:opacity-40"
        >
          {step === 0 && (isCreatingDraft || isUpdatingDraft)
            ? "Saving..."
            : step === 2 && isUpdatingDraft
              ? "Saving..."
              : step < 2
                ? "Continue"
                : "Finish"}
        </button>
      </div>
    </div>
  );
}

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

function DetailsStep({
  value,
  onChange,
  isLoadingDraft,
}: {
  value: Details;
  onChange: (next: Details) => void;
  isLoadingDraft: boolean;
}) {
  const [showCommuteDropdown, setShowCommuteDropdown] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      {isLoadingDraft && (
        <div className="text-sm text-black/45">Loading draft details...</div>
      )}

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

      <Field label="Distance from campus">
        <div className="relative">
          <button
            type="button"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm text-black/80 outline-none focus:border-black/25 text-left flex justify-between items-center"
            onClick={() => setShowCommuteDropdown((prev) => !prev)}
          >
            {commuteOptions.find(
              (option) => option.value === value.commuteBucket,
            )?.label || "Select a campus distance"}
            <span className="ml-2 text-black/40">&#9662;</span>
          </button>
          {showCommuteDropdown && (
            <div className="absolute z-10 mt-1 w-full rounded-2xl border border-black/10 bg-white shadow-lg">
              {commuteOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`block w-full text-left px-4 py-3 text-sm text-black/80 hover:bg-neutral-100 ${
                    value.commuteBucket === option.value ? "bg-neutral-100" : ""
                  }`}
                  onClick={() => {
                    onChange({ ...value, commuteBucket: option.value });
                    setShowCommuteDropdown(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </Field>

      <Field label="Description">
        <textarea
          rows={6}
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          placeholder="Tell people what's great about it..."
          className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm text-black/80 outline-none focus:border-black/25"
        />
      </Field>
    </div>
  );
}

function ImagesStep({
  value,
  isUploading,
  uploadError,
  onFilesSelected,
}: {
  value: UploadedImage[];
  isUploading: boolean;
  uploadError: string;
  onFilesSelected: (files: FileList | null) => Promise<void>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <label className="rounded-2xl border border-black/10 bg-white px-4 py-4">
        <div className="text-sm font-semibold text-black/70">Upload images</div>
        <div className="text-xs text-black/40 mt-1">
          PNG/JPG/WEBP, up to {MAX_IMAGES} images
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          disabled={isUploading || value.length >= MAX_IMAGES}
          onChange={(e) => {
            void onFilesSelected(e.target.files);
            e.currentTarget.value = "";
          }}
          className="mt-3 block w-full text-sm text-black/70 file:mr-3 file:rounded-2xl file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        />
      </label>

      {uploadError && <div className="text-sm text-red-600">{uploadError}</div>}

      {isUploading && (
        <div className="text-sm text-black/45">Uploading images...</div>
      )}

      {value.length === 0 ? (
        <div className="text-sm text-black/45">No images yet.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {value.map((image) => (
            <div
              key={image.mediaId}
              className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-black/75">
                  {image.label}
                </div>
                <div className="text-xs text-black/40">{image.mediaId}</div>
              </div>

              <div className="rounded-full bg-neutral-100 px-3 py-2 text-xs font-semibold text-black/60">
                Uploaded
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TagsStep({
  value,
  onChange,
  suggestions,
  isLoading,
  isError,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  suggestions: PostTagOption[];
  isLoading: boolean;
  isError: boolean;
}) {
  function addTag(tag: string) {
    const normalizedTag = tag.trim();
    if (!normalizedTag) return;
    if (
      value.some((item) => item.toLowerCase() === normalizedTag.toLowerCase())
    ) {
      return;
    }
    onChange([...value, normalizedTag]);
  }

  function removeTag(tag: string) {
    onChange(value.filter((item) => item !== tag));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl border border-black/10 bg-neutral-100 px-4 py-4">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
          Selected tags
        </div>
        <div className="flex flex-wrap gap-2">
          {value.length === 0 ? (
            <div className="text-sm text-black/45">No tags selected yet.</div>
          ) : (
            value.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full border border-neutral-900 bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
                title="Click to remove"
              >
                {tag} <span className="text-white/70">x</span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="pt-2">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
          Available tags
        </div>
        <div className="flex flex-wrap gap-2">
        {isLoading ? (
          <div className="text-sm text-black/45">
            Loading tag suggestions...
          </div>
        ) : isError ? (
          <div className="text-sm text-black/45">
            Unable to load tag suggestions right now.
          </div>
        ) : (
          suggestions.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => addTag(tag.name)}
              className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm text-black/65 hover:border-black/20 hover:bg-neutral-50"
            >
              + {tag.name}
            </button>
          ))
        )}
      </div>
      </div>
    </div>
  );
}
