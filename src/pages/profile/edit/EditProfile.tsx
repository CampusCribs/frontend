import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userProfileSchema, UserProfileSchema } from "@/lib/schema/schema";
import { Button } from "@/components/ui/button";
import { FieldErrors } from "react-hook-form";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
// import { useGetUsersMe, usePutUsersUpdate } from "@/gen";
import { useThumbnailUpload } from "@/lib/uploadThumbnail";
import { useNavigate } from "react-router";
import { buildThumbnailURL } from "@/lib/image-resolver";
import { useNotify } from "@/components/ui/Notify";
const EditProfile = () => {
  const config = useAuthenticatedClientConfig();
  const notify = useNotify();
  const navigate = useNavigate();
  // const {
  //   data: userData,
  //   isLoading: isLoading_user,
  //   isError: isError_user,
  //   error: error_user,
  // } = useGetUsersMe({ ...config });

  const { upload, mediaId } = useThumbnailUpload();
  // const { mutate: updateProfile } = usePutUsersUpdate({
  //   ...config,
  //   mutation: {
  //     onSuccess: async (response) => {
  //       await notify({
  //         title: "Profile Updated 🎉",
  //         message: "Your profile has been successfully updated.",

  //         buttonText: "Close",
  //       });
  //       navigate("/profile");
  //     },
  //     onError: async (error) => {
  //       console.error(" Error:", error);
  //       await notify({
  //         title: "Error",
  //         message: "Failed to update profile. Please try again later.",
  //         buttonText: "Close",
  //       });
  //     },
  //   },
  // });

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserProfileSchema>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      bio: userData?.data.bio || "",
      phone: userData?.data.phone || "",
      firstName: userData?.data.firstName || "",
      lastName: userData?.data.lastName || "",
      username: userData?.data.username || "",
      email: userData?.data.email || "",
      thumbnailMediaId: userData?.data.thumbnailMediaId || "",
    },
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const onSubmit = (data: UserProfileSchema) => {
    // updateProfile({
    //   data: {
    //     ...data,
    //   },
    // });
    navigate("/profile");
  };
  const onError = (errors: FieldErrors<UserProfileSchema>) => {
    console.error("Validation Errors:", errors);
  };
  //change these to update the profile
  // useEffect(() => {
  //   if (userData?.data) {
  //     reset({
  //       bio: userData.data.bio || "",
  //       phone: userData.data.phone || "",
  //       firstName: userData.data.firstName || "",
  //       lastName: userData.data.lastName || "",
  //       username: userData.data.username || "",
  //       email: userData.data.email || "",
  //       thumbnailMediaId: userData.data.thumbnailMediaId || "",
  //     });
  //   }
  // }, [userData, reset]);

  // if (isLoading_user) {
  //   return <div>Loading...</div>;
  // }
  // if (isError_user) {
  //   return <div>Error: {error_user?.message}</div>;
  // }

  const thumbnailUrl = buildThumbnailURL(
    userData?.data.id || "",
    userData?.data.thumbnailMediaId || "",
  );
  return (
    <div>
      <div>
        <div className="px-3 pt-3">
          <div onClick={() => window.history.back()}>
            <ArrowLeftIcon size={40} />
          </div>
        </div>
        <div className="flex w-full justify-center text-xl font-semibold">
          Edit Profile
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex flex-col items-center justify-center w-full h-full gap-y-4 py-5"
      >
        <div className="grid w-full max-w-sm items-center gap-1.5">
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
        <div className="grid w-full max-w-sm items-center gap-1.5">
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
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            {...register("username")}
            id="username"
            placeholder="Username"
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email")}
            id="email"
            placeholder="Email"
            value={userData?.data.email || ""}
            disabled
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            {...register("bio")}
            id="bio"
            placeholder="bio"
            className="h-50"
          />
          {errors.bio && (
            <p className="text-sm text-red-500">{errors.bio.message}</p>
          )}
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
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

        <div className="w-full">
          <div className="grid w-full items-center justify-center gap-1.5 mb-3">
            <Label htmlFor="images">Profile Thumbnail</Label>
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
                  setValue("thumbnailMediaId", media); // <- store this in form state
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
                  onClick={() => setThumbnail(null)}
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
        <div className="flex w-full justify-center items-center ">
          <div className="flex w-2/3 justify-end">
            <Button className="cursor-pointer" type="submit">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
