import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeftIcon, X } from "lucide-react";

import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
// import { useGetUsersMe, usePutUsersUpdate } from "@/gen";
import { useNotify } from "@/components/ui/Notify";
import { useNavigate } from "react-router";
import LoadingPage from "@/pages/loading/LoadingPage";
import Error from "@/pages/error/Error";
import { useThumbnailUpload } from "@/lib/uploadThumbnail";
import { buildThumbnailURL } from "@/lib/image-resolver";
import { EmailChangeFlow } from "./EmailChangeFlow";
import { useGetUsersMe, usePutUsersUpdate } from "@/gen";
const accountSettingsSchema = z
  .object({
    // Read-only (shown for clarity)
    email: z.string().email(),
    // Preferences
    username: z.string().min(3, "Username must be at least 3 characters."),
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be less than 50 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be less than 50 characters"),
    bio: z
      .string()
      .max(300, "Bio must be at most 300 characters.")
      .optional()
      .or(z.literal("")),
    newsletterConsent: z.boolean().default(false),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .max(15, "Phone number must be less than 15 characters")
      .regex(/^\+?[0-9\s\-()]+$/, "Phone number must be a valid format"),
    // Security
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
    thumbnailMediaId: z.string().uuid("Invalid media ID format"),
  })
  .refine(
    (data) => {
      // if any password field is filled, require all & ensure match
      const anyFilled = !!(data.newPassword || data.confirmPassword);
      if (!anyFilled) return true;
      return !!(
        data.newPassword &&
        data.confirmPassword &&
        data.newPassword === data.confirmPassword
      );
    },
    {
      message:
        "To change your password, fill all password fields and ensure the new passwords match.",
      path: ["confirmPassword"],
    },
  );

type AccountSettingsSchema = z.infer<typeof accountSettingsSchema>;

const Account = () => {
  const config = useAuthenticatedClientConfig();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const notify = useNotify();
  const navigate = useNavigate();
  const [hasInitialized, setHasInitialized] = useState(false);
  // const [confirmText, setConfirmText] = useState("");
  // const [ack, setAck] = useState(false);
  // const [passwordForDelete, setPasswordForDelete] = useState("");
  const { upload, mediaId } = useThumbnailUpload();

  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useGetUsersMe({ ...config });
  const thumbnailUrl = buildThumbnailURL(
    userData?.data.id || "",
    userData?.data.thumbnailMediaId || "",
  );
  const { mutate: updateAccount } = usePutUsersUpdate({
    ...config,
    mutation: {
      onSuccess: async () => {
        await notify({
          title: "Account Updated 🎉",
          message: "Your account settings have been saved.",
          buttonText: "Close",
        });
        navigate("/account");
      },
      onError: async (err) => {
        console.error("Update Error:", err);
        await notify({
          title: "Update Failed",
          message: "We couldn't save your changes. Please try again.",
          buttonText: "Close",
        });
      },
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<AccountSettingsSchema>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: {
      email: userData?.data.email ?? "",
      username: userData?.data.username ?? "",
      firstName: userData?.data.firstName ?? "",
      lastName: userData?.data.lastName ?? "",
      bio: userData?.data.bio ?? "",
      newsletterConsent: userData?.data.newsletterConsent,
      newPassword: "",
      confirmPassword: "",
      thumbnailMediaId: userData?.data.thumbnailMediaId,
      phone: userData?.data.phone,
    },
  });
  const newsletterConsent = watch("newsletterConsent");
  const thumbnailvalue = watch("thumbnailMediaId");
  useEffect(() => {
    if (userData?.data && !hasInitialized) {
      reset({
        email: userData.data.email ?? "",
        username: userData.data.username ?? "",
        firstName: userData.data.firstName ?? "",
        lastName: userData.data.lastName ?? "",
        bio: userData.data.bio ?? "",
        newsletterConsent: userData.data.newsletterConsent ?? false,
        thumbnailMediaId:
          thumbnailvalue ?? userData.data.thumbnailMediaId ?? "",
        phone: userData.data.phone ?? "",
        newPassword: "",
        confirmPassword: "",
      });
      setHasInitialized(true);
    }
  }, [userData, reset, thumbnailvalue, hasInitialized]);

  const onSubmit = (data: AccountSettingsSchema) => {
    const payload: Record<string, unknown> = {
      username: data.username,
      bio: data.bio,
      firstName: data.firstName,
      lastName: data.lastName,
      newsletterConsent: data.newsletterConsent,
      thumbnailMediaId: data.thumbnailMediaId,
      newPassword: "",
      phone: data.phone,
    };

    if (data.newPassword) {
      payload.newPassword = data.newPassword;
    }

    updateAccount({ data: payload });
  };

  //return

  // if (isLoading) return <LoadingPage />;
  // if (isError) return <Error />;

  return (
    <div className="w-full px-2">
      <div className="flex px-4 pt-4">
        <button
          type="button"
          className="cursor-pointer inline-flex items-center"
          aria-label="Go back"
          onClick={() => window.history.back()}
        >
          <ArrowLeftIcon size={28} />
          <span className="ml-2">Back</span>
        </button>
      </div>
      <div className="flex w-full justify-center text-xl font-semibold">
        Account Settings
      </div>

      <form
        // onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center w-full h-full gap-y-6 py-6"
      >
        {/* Identity */}
        <div className="grid w-full max-w-md gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email (read-only)</Label>
            <Input id="email" disabled {...register("email")} />
            <p className="text-sm text-end pr-3">
              Change your email{" "}
              <a
                className="underline cursor-pointer"
                onClick={() => navigate("email")}
              >
                here
              </a>
            </p>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              {...register("phone")}
              type="tel"
              id="phone"
              placeholder="Phone"
            />

            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="your_handle"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              {...register("firstName")}
              id="firstName"
              placeholder="First Name"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              {...register("lastName")}
              id="lastName"
              placeholder="Last Name"
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="A short description of you"
              {...register("bio")}
              className="h-28"
            />
            {errors.bio && (
              <p className="text-sm text-red-500">{errors.bio.message}</p>
            )}
          </div>
        </div>
        {/* Thumbnail */}
        <div className="w-full">
          <div className="grid w-full items-center justify-center gap-1.5 mb-3">
            <Label htmlFor="images">Profile Picture</Label>
            <Input
              type="file"
              id="images"
              accept="image/jpeg, image/png, image/webp"
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
                  return;
                }

                try {
                  const media = await upload(file);
                  setThumbnail(file);
                  // setValue("thumbnailMediaId", media); // <- store this in form state
                  // <- store this for form submit
                } catch (err) {
                  console.error("Image upload failed:", err);
                  await notify({
                    title: "Upload Failed",
                    message: "Upload failed. Please try again.",
                    buttonText: "Close",
                  });
                }
              }}
            />
            {mediaId && (
              <Input
                type="hidden"
                value={mediaId}
                {...register("thumbnailMediaId")}
              />
            )}
            {errors.thumbnailMediaId && (
              <p className="text-sm text-red-500">
                {errors.thumbnailMediaId.message}
              </p>
            )}
          </div>
          <div className="p-2 flex w-full justify-center items-center  gap-1.5">
            {thumbnail && (
              <div className="relative w-[75%]">
                <img
                  src={thumbnail ? URL.createObjectURL(thumbnail) : ""}
                  alt="uploaded image"
                  className=" w-full aspect-square object-cover border border-black rounded-xl shadow-xl "
                />
                <div
                  className="absolute top-1 right-1 cursor-pointer bg-neutral-800 text-white rounded-full px-3 py-1"
                  onClick={() => {
                    setThumbnail(null);
                    setValue("thumbnailMediaId", "");
                  }}
                >
                  <X size={32} />
                </div>
              </div>
            )}
            {userData?.data.thumbnailMediaId && !thumbnail && (
              <div className="relative w-[75%]">
                <img
                  src={thumbnailUrl}
                  alt="uploaded image"
                  className=" w-full aspect-square object-cover border border-black rounded-xl shadow-xl "
                />
              </div>
            )}
          </div>
        </div>
        {/* Notifications */}
        <div className="grid w-full max-w-md gap-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="cursor-pointer">Marketing Emails</Label>
              <p className="text-xs text-muted-foreground">
                Occasional promotions and tips
              </p>
            </div>
            <Switch
              onCheckedChange={(v) =>
                setValue("newsletterConsent", v, { shouldValidate: false })
              }
              checked={newsletterConsent}
            />
          </div>
        </div>

        {/* Security */}
        <div className="grid w-full max-w-md gap-4">
          <div className="border rounded-xl p-4">
            <div className="text-sm font-medium mb-3">Change Password</div>

            <div className="grid gap-1.5 mt-3">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...register("newPassword")}
              />
            </div>
            <div className="grid gap-1.5 mt-3">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Leave these fields empty if you don’t want to change your
              password.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex w-full max-w-md justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => reset()}>
            Reset
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>

        {/* delete account  */}

        {/* <div className="mt-8 border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-red-600">
                Danger Zone
              </div>
              <p className="text-xs text-muted-foreground p-2">
                Permanently delete your account and all associated data.
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete account permanently?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action <span className="font-semibold">cannot</span> be
                    undone. It will permanently remove your account, profile,
                    and any associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {/* Optional password re-auth (recommended) 
                <div className="grid gap-2 mt-2">
                  <Label htmlFor="delete-password">
                    Confirm with password (required if your backend enforces
                    re-auth)
                  </Label>
                  <Input
                    id="delete-password"
                    type="password"
                    placeholder="Current password"
                    value={passwordForDelete}
                    onChange={(e) => setPasswordForDelete(e.target.value)}
                  />
                </div>

                {/* Type-to-confirm *
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="confirm-delete">
                    Type <span className="font-mono">DELETE</span> to confirm
                  </Label>
                  <Input
                    id="confirm-delete"
                    placeholder="DELETE"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                  />
                </div>

                {/* Acknowledge checkbox *
                <div className="flex items-center gap-2 mt-3">
                  <Checkbox
                    id="ack"
                    checked={ack}
                    onCheckedChange={(v) => setAck(Boolean(v))}
                  />
                  <Label htmlFor="ack" className="text-sm">
                    I understand this is permanent and cannot be undone.
                  </Label>
                </div>

                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    // disabled={isDeleting || confirmText !== "DELETE" || !ack}
                    disabled={confirmText !== "DELETE" || !ack}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Permanently Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div> */}
      </form>
    </div>
  );
};

export default Account;
