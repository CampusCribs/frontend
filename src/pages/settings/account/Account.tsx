import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { ArrowLeftIcon } from "lucide-react";

const accountSettingsSchema = z
  .object({
    email: z.string().email(),
    username: z.string().min(3, "Username must be at least 3 characters."),
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    bio: z.string().max(300).optional().or(z.literal("")),
    newsletterConsent: z.boolean().default(false),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .max(15, "Phone number must be less than 15 characters")
      .regex(/^\+?[0-9\s\-()]+$/, "Phone number must be a valid format"),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      const anyFilled = !!(data.newPassword || data.confirmPassword);
      if (!anyFilled) return true;
      return (
        !!data.newPassword &&
        !!data.confirmPassword &&
        data.newPassword === data.confirmPassword
      );
    },
    {
      message:
        "To change your password, fill both fields and ensure they match.",
      path: ["confirmPassword"],
    },
  );

type AccountSettingsSchema = z.infer<typeof accountSettingsSchema>;

export default function Account() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AccountSettingsSchema>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: {
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      bio: "",
      newsletterConsent: false,
      phone: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newsletterConsent = watch("newsletterConsent");

  const onSubmit = (data: AccountSettingsSchema) => {
    // TODO: wire up API call later
    console.log("Account form submit:", data);
  };

  return (
    <div className="w-full px-2">
      {/* Header */}
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

      <div className="flex w-full justify-center text-xl font-semibold mt-2">
        Account Settings
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center w-full h-full gap-y-6 py-6"
      >
        {/* Identity */}
        <div className="grid w-full max-w-md gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="+1 (555) 555-5555"
              {...register("phone")}
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
              id="firstName"
              placeholder="First Name"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Last Name"
              {...register("lastName")}
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
              className="h-28"
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-sm text-red-500">{errors.bio.message}</p>
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
              checked={newsletterConsent}
              onCheckedChange={(v) =>
                setValue("newsletterConsent", v, { shouldValidate: false })
              }
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
              Leave these empty if you don’t want to change your password.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex w-full max-w-md justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
