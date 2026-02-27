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

import { userProfileSchema, UserProfileSchema } from "@/lib/schema/schema";
import { useThumbnailUpload } from "@/lib/uploadThumbnail";
import { buildThumbnailURL } from "@/lib/image-resolver";
import { useNotify } from "@/components/ui/Notify";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";

export default function ProfileSettingsPage() {
  const config = useAuthenticatedClientConfig();
  const notify = useNotify();
  const navigate = useNavigate();

  // ✅ Re-enable when wired
  // const { data: userData } = useGetUsersMe({ ...config });

  // TEMP: if you don't have the hook wired yet, set userData to undefined:
  const userData = undefined as
    | {
        data: {
          id: string;
          bio?: string | null;
          phone?: string | null;
          firstName?: string | null;
          lastName?: string | null;
          username?: string | null;
          email?: string | null;
          thumbnailMediaId?: string | null;
        };
      }
    | undefined;

  const { upload } = useThumbnailUpload();

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UserProfileSchema>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      bio: "",
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      thumbnailMediaId: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!userData?.data) return;

    reset({
      bio: userData.data.bio || "",
      phone: userData.data.phone || "",
      firstName: userData.data.firstName || "",
      lastName: userData.data.lastName || "",
      username: userData.data.username || "",
      email: userData.data.email || "",
      thumbnailMediaId: userData.data.thumbnailMediaId || "",
    });
  }, [userData, reset]);

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

  const currentThumbUrl =
    userData?.data?.id && userData?.data?.thumbnailMediaId
      ? buildThumbnailURL(userData.data.id, userData.data.thumbnailMediaId)
      : null;

  const onSubmit = async (data: UserProfileSchema) => {
    // TODO wire API: updateProfile({ data })
    await notify({
      title: "Saved",
      message: "Your profile changes are ready to be sent to the backend.",
      buttonText: "Close",
    });
    navigate("/profile");
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
    <div className="min-h-[100dvh] w-full mx-auto px-4 pt-6 pb-6 flex flex-col bg-white">
      {/* Header (match Account / onboarding-ish) */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-full grid place-items-center hover:bg-black/5 transition"
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex flex-col gap-8"
      >
        {/* Identity */}
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

          {/* Tiny live preview (optional, feels onboarding-y but not required) */}
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

        {/* Thumbnail */}
        <section className="flex flex-col gap-3">
          <FieldLabel label="Profile thumbnail" />

          {/* file input styled like onboarding fields */}
          <div className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 flex items-center gap-3">
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
                  className="w-full aspect-square object-cover border border-black/10 rounded-2xl shadow-sm"
                />

                {previewUrl && (
                  <button
                    type="button"
                    onClick={clearThumbnail}
                    className="absolute top-2 right-2 inline-flex items-center justify-center h-9 w-9 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition"
                    aria-label="Remove thumbnail"
                    title="Remove"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full aspect-square border border-black/10 rounded-2xl flex items-center justify-center text-sm text-black/50">
                No thumbnail
              </div>
            )}
          </div>

          <p className="text-xs text-black/50">Tip: square photos look best.</p>
        </section>

        {/* Bottom actions (match account page single CTA) */}
        <div className="mt-auto flex flex-col gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-black/70 border border-black/10 hover:bg-black/[0.03] transition"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-neutral-900 disabled:opacity-40"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- small UI primitives (match onboarding/account) ---------------- */

function FieldLabel({ label }: { label: string }) {
  return <div className="text-sm font-semibold text-black/75">{label}</div>;
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-red-600 -mt-2">{children}</p>;
}

type RoundedInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode;
};

const RoundedInput = React.forwardRef<HTMLInputElement, RoundedInputProps>(
  ({ icon, className, ...props }, ref) => {
    return (
      <div className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 flex items-center gap-3">
        <div className="text-black/60">{icon}</div>
        <input
          ref={ref}
          {...props}
          className={[
            "w-full text-sm text-left text-black/80 font-[Inter] outline-none bg-transparent",
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
    <div className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 flex items-start gap-3">
      <div className="text-black/60 mt-[2px]">{icon}</div>
      <textarea
        ref={ref}
        {...props}
        className={[
          "w-full text-sm text-left text-black/80 font-[Inter] outline-none bg-transparent resize-none min-h-[112px]",
          className ?? "",
        ].join(" ")}
      />
    </div>
  );
});
RoundedTextarea.displayName = "RoundedTextarea";
