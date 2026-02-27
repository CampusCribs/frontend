import React from "react";
import { ArrowLeft, AtSign, Phone, Lock } from "lucide-react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
  .object({
    email: z.string().email("Enter a valid email"),
    phoneDisplay: z.string().optional(),

    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().optional(),
    confirmNewPassword: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    const hasNew =
      !!val.newPassword?.length || !!val.confirmNewPassword?.length;

    if (hasNew) {
      if (!val.newPassword || val.newPassword.length < 8) {
        ctx.addIssue({
          code: "custom",
          path: ["newPassword"],
          message: "New password must be at least 8 characters",
        });
      }
      if (!val.confirmNewPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmNewPassword"],
          message: "Please confirm your new password",
        });
      }
      if (val.newPassword !== val.confirmNewPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmNewPassword"],
          message: "Passwords do not match",
        });
      }
    }
  });

type FormValues = z.infer<typeof schema>;

export default function AccountSettingsPage() {
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      phoneDisplay: "+1 (555) 555-5555",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onTouched",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    watch,
    reset,
  } = form;

  const email = watch("email");
  const phoneDisplay = watch("phoneDisplay");

  const onSubmit = async (values: FormValues) => {
    // TODO: wire to API
    await new Promise((r) => setTimeout(r, 400));
    reset(values);
  };

  return (
    <div className="min-h-[100dvh] w-full  mx-auto px-4 pt-6 pb-6 flex flex-col bg-white">
      {/* Header (onboarding-ish) */}
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
          <h1 className="text-lg font-semibold text-black/85">Account</h1>
          <p className="text-sm text-black/55">Update your details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
        {/* Contact */}
        <section className="mb-8">
          <div className="flex flex-col gap-4">
            <FieldLabel label="Email address" />
            <RoundedInput
              icon={<AtSign size={18} />}
              placeholder="you@example.com"
              type="email"
              disabled
              {...register("email")}
            />
            <p className="text-sm text-black/55">
              Please reach out to support if you need to change your email
              address
            </p>

            <div className="h-2" />

            <FieldLabel label="Phone number" />
            <RoundedReadOnly
              icon={<Phone size={18} />}
              value={phoneDisplay || "—"}
            />
            <p className="text-xs text-black/50">
              To change your phone, please contact support
            </p>
          </div>
        </section>

        {/* Password */}
        <section className="mb-10">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-black/80">Password</h2>
            <p className="text-sm text-black/55">
              Change your password. Requires your current password.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <FieldLabel label="Current password" />
            <RoundedInput
              icon={<Lock size={18} />}
              type="password"
              autoComplete="current-password"
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <FieldError>{errors.currentPassword.message}</FieldError>
            )}

            <FieldLabel label="New password" />
            <RoundedInput
              icon={<Lock size={18} />}
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <FieldError>{errors.newPassword.message}</FieldError>
            )}

            <FieldLabel label="Confirm new password" />
            <RoundedInput
              icon={<Lock size={18} />}
              type="password"
              autoComplete="new-password"
              {...register("confirmNewPassword")}
            />
            {errors.confirmNewPassword && (
              <FieldError>{errors.confirmNewPassword.message}</FieldError>
            )}

            <p className="text-xs text-black/50">
              Tip: use a long passphrase you don&apos;t reuse elsewhere.
            </p>
          </div>
        </section>

        {/* Save */}
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-neutral-900 disabled:opacity-40"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}

/* ---------------- small UI primitives (match onboarding) ---------------- */

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

function RoundedReadOnly({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 flex items-center gap-3">
      <div className="text-black/60">{icon}</div>
      <div className="w-full text-sm text-left text-black/80 font-[Inter]">
        {value}
      </div>
    </div>
  );
}
