import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  User2,
  AtSign,
  FileText,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useGetProfileSettings, usePostProfileSettings } from "@/gen";
import { userProfileSchema, UserProfileSchema } from "@/lib/schema/schema";
import { useThumbnailUpload } from "@/lib/uploadThumbnail";
import { buildThumbnailURL } from "@/lib/image-resolver";
import { useNotify } from "@/components/ui/Notify";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";

export default function ProfileSettingsPage() {
  const config = useAuthenticatedClientConfig();
  const notify = useNotify();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetProfileSettings({});
  const { mutateAsync: saveProfileSettings } = usePostProfileSettings({});
  const { upload } = useThumbnailUpload();

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UserProfileSchema>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      bio: "",
      phone: "",
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      thumbnailMediaId: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    const profile = data?.data.profile;
    if (!profile) return;

    reset({
      bio: profile.bio || "",
      phone: profile.phone || "",
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      username: profile.username || "",
      email: profile.email || "",
      thumbnailMediaId: profile.thumbnailMediaId || "",
    });
  }, [data, reset]);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => {
    if (!thumbnailFile) return null;
    return URL.createObjectURL(thumbnailFile);
  }, [thumbnailFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const profile = data?.data.profile;
  const currentThumbUrl =
    profile?.id && profile?.thumbnailMediaId
      ? buildThumbnailURL(profile.id, profile.thumbnailMediaId)
      : null;

  const onSubmit = async (formData: UserProfileSchema) => {
    try {
      const response = await saveProfileSettings({
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          bio: formData.bio,
          email: formData.email,
          phone: formData.phone,
          thumbnailMediaId: formData.thumbnailMediaId || null,
        },
      });

      const savedProfile = response.data.profile;
      reset({
        bio: savedProfile.bio || "",
        phone: savedProfile.phone || "",
        firstName: savedProfile.firstName || "",
        lastName: savedProfile.lastName || "",
        username: savedProfile.username || "",
        email: savedProfile.email || "",
        thumbnailMediaId: savedProfile.thumbnailMediaId || "",
      });
      setThumbnailFile(null);

      await notify({
        title: "Saved",
        message: "Your profile changes have been updated.",
        buttonText: "Close",
      });
      navigate("/profile");
    } catch (error: any) {
      const fieldErrors = error?.response?.data?.errors;

      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach(
          (fieldError: { field?: string; message?: string }) => {
            if (!fieldError.field || !fieldError.message) return;

            if (
              fieldError.field === "bio" ||
              fieldError.field === "phone" ||
              fieldError.field === "firstName" ||
              fieldError.field === "lastName" ||
              fieldError.field === "username" ||
              fieldError.field === "email" ||
              fieldError.field === "thumbnailMediaId"
            ) {
              setError(fieldError.field, {
                type: "server",
                message: fieldError.message,
              });
            }
          },
        );
      }

      await notify({
        title: "Unable to save",
        message:
          error?.response?.data?.detail ||
          "Please check your inputs and try again.",
        buttonText: "Close",
      });
    }
  };

  const clearThumbnail = () => {
    setThumbnailFile(null);
    setValue("thumbnailMediaId", "", { shouldDirty: true });
  };

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const username = watch("username");
  const bio = watch("bio");

  return (
    <div className="min-h-[100dvh] w-full mx-auto flex flex-col bg-white px-4 pb-6 pt-6">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-black/5"
          aria-label="Back"
          title="Back"
        >
          <ArrowLeft size={20} className="text-black/70" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-black/85">Edit Profile</h1>
          <p className="text-sm text-black/55">Update your public details</p>
        </div>
      </div>

      {isLoading && (
        <div className="mb-4 text-sm text-black/55">Loading profile...</div>
      )}
      {isError && (
        <div className="mb-4 text-sm text-red-600">
          Unable to load profile settings.
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-1 flex-col gap-8"
      >
        <section className="flex flex-col gap-4">
          <FieldLabel label="First name" />
          <RoundedInput
            icon={<User2 size={18} />}
            placeholder="First name"
            {...register("firstName")}
          />
          {errors.firstName && (
            <FieldError>{errors.firstName.message}</FieldError>
          )}

          <FieldLabel label="Last name" />
          <RoundedInput
            icon={<User2 size={18} />}
            placeholder="Last name"
            {...register("lastName")}
          />
          {errors.lastName && (
            <FieldError>{errors.lastName.message}</FieldError>
          )}

          <FieldLabel label="Username" />
          <RoundedInput
            icon={<AtSign size={18} />}
            placeholder="Username"
            {...register("username")}
          />
          {errors.username && (
            <FieldError>{errors.username.message}</FieldError>
          )}

          <FieldLabel label="Bio" />
          <RoundedTextarea
            icon={<FileText size={18} />}
            placeholder="A short description of you"
            {...register("bio")}
          />
          {errors.bio && <FieldError>{errors.bio.message}</FieldError>}

          {(firstName || lastName || username || bio) && (
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-4">
              <div className="text-sm font-semibold text-black/80">Preview</div>
              <div className="mt-2 text-sm text-black/70">
                <div className="font-semibold text-black/80">
                  {[firstName, lastName].filter(Boolean).join(" ") ||
                    "Your name"}
                </div>
                <div className="text-black/55">@{username || "username"}</div>
                {bio ? <div className="mt-2 text-black/65">{bio}</div> : null}
              </div>
            </div>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <FieldLabel label="Profile thumbnail" />

          <div className="flex w-full items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-4">
            <div className="text-black/60">
              <ImageIcon size={18} />
            </div>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="w-full text-sm text-black/70 file:mr-3 file:rounded-xl file:border-0 file:bg-black/[0.04] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-black/80 hover:file:bg-black/[0.06]"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const validTypes = ["image/jpeg", "image/png", "image/webp"];
                if (!validTypes.includes(file.type)) {
                  await notify({
                    title: "Invalid File Type",
                    message: "Only JPEG, PNG, and WebP images are allowed.",
                    buttonText: "Close",
                  });
                  e.currentTarget.value = "";
                  return;
                }

                try {
                  const media = await upload(file);
                  setValue("thumbnailMediaId", media, { shouldDirty: true });
                  setThumbnailFile(file);
                } catch (err) {
                  console.error("Image upload failed:", err);
                  await notify({
                    title: "Upload Failed",
                    message: "Upload failed. Please try again.",
                    buttonText: "Close",
                  });
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>

          {errors.thumbnailMediaId && (
            <FieldError>{errors.thumbnailMediaId.message}</FieldError>
          )}

          <div className="flex w-full justify-center">
            {previewUrl || currentThumbUrl ? (
              <div className="relative w-[75%] max-w-sm">
                <img
                  src={previewUrl ?? currentThumbUrl ?? ""}
                  alt="profile thumbnail"
                  className="aspect-square w-full rounded-2xl border border-black/10 object-cover shadow-sm"
                />

                {(previewUrl || currentThumbUrl) && (
                  <button
                    type="button"
                    onClick={clearThumbnail}
                    className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white transition hover:bg-neutral-800"
                    aria-label="Remove thumbnail"
                    title="Remove"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-black/10 text-sm text-black/50">
                No thumbnail
              </div>
            )}
          </div>

          <p className="text-xs text-black/50">Tip: square photos look best.</p>
        </section>

        <div className="mt-auto flex flex-col gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold text-black/70 transition hover:bg-black/[0.03]"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !isDirty || isLoading}
            className="w-full rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FieldLabel({ label }: { label: string }) {
  return <div className="text-sm font-semibold text-black/75">{label}</div>;
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="-mt-2 text-sm text-red-600">{children}</p>;
}

type RoundedInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode;
};

const RoundedInput = React.forwardRef<HTMLInputElement, RoundedInputProps>(
  ({ icon, className, ...props }, ref) => {
    return (
      <div className="flex w-full items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-4">
        <div className="text-black/60">{icon}</div>
        <input
          ref={ref}
          {...props}
          className={[
            "w-full bg-transparent text-left font-[Inter] text-sm text-black/80 outline-none",
            className ?? "",
          ].join(" ")}
        />
      </div>
    );
  },
);
RoundedInput.displayName = "RoundedInput";

type RoundedTextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    icon: React.ReactNode;
  };

const RoundedTextarea = React.forwardRef<
  HTMLTextAreaElement,
  RoundedTextareaProps
>(({ icon, className, ...props }, ref) => {
  return (
    <div className="flex w-full items-start gap-3 rounded-2xl border border-black/10 bg-white px-4 py-4">
      <div className="mt-[2px] text-black/60">{icon}</div>
      <textarea
        ref={ref}
        {...props}
        className={[
          "min-h-[112px] w-full resize-none bg-transparent text-left font-[Inter] text-sm text-black/80 outline-none",
          className ?? "",
        ].join(" ")}
      />
    </div>
  );
});
RoundedTextarea.displayName = "RoundedTextarea";
