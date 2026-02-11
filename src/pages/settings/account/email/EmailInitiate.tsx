import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotify } from "@/components/ui/Notify";
// import { useGetUsersEmail, usePostUsersEmail } from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import { Label } from "@radix-ui/react-label";
import { AlertTriangle, ArrowLeftIcon } from "lucide-react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const EmailInitiate = () => {
  const notify = useNotify();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { newEmail: "" },
    mode: "onSubmit",
  });

  const config = useAuthenticatedClientConfig();
  // const { data: emailStatusResponse } = useGetUsersEmail({ ...config });

  // const { mutateAsync: postUsersEmail } = usePostUsersEmail({
  //   ...config,
  //   mutation: {
  //     onSuccess: async () => {
  //       await notify({
  //         title: "🎉Success",
  //         message: "We have sent you a verification email. Please enter it in",
  //         buttonText: "Close",
  //       });
  //       navigate("/settings/account/email-verification");
  //     },
  //     onError: async (error) => {
  //       await notify({
  //         title: error.response?.data.title || "error",
  //         message: error.response?.data.message || "an error occured",
  //         buttonText: "Close",
  //       });
  //     },
  //   },
  // });
  const onSubmit = handleSubmit(async ({ newEmail }) => {
    // postUsersEmail({ data: { email: newEmail } });
  });
  const allowAt = emailStatusResponse?.data?.emailChangeAllowedAt
    ? new Date(emailStatusResponse.data.emailChangeAllowedAt)
    : null;

  const remainingMs = allowAt ? allowAt.getTime() - new Date().getTime() : 0;
  function formatRemaining(ms: number) {
    if (ms <= 0) return "0 minutes";
    const totalMinutes = Math.ceil(ms / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    const parts: string[] = [];
    if (days) parts.push(`${days} day${days === 1 ? "" : "s"}`);
    if (hours) parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
    if (minutes && !days)
      parts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);
    return parts.join(", ");
  }
  return (
    <div className="">
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
      <div className=" flex-1 flex items-center justify-center  p-10 ">
        <div className="h-[75%] ">
          <h1 className="text-xl font-semibold mb-4">Enter New Email</h1>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="grid gap-1">
              <Label htmlFor="newEmail">New Email</Label>
              <Input
                id="newEmail"
                type="email"
                inputMode="email"
                autoComplete="email"
                aria-invalid={!!errors.newEmail}
                disabled={
                  new Date(emailStatusResponse?.data.emailResendAllowedAt) >
                    new Date() ||
                  new Date(emailStatusResponse?.data.emailChangeAllowedAt) >
                    new Date()
                }
                aria-describedby={
                  errors.newEmail ? "newEmail-error" : undefined
                }
                {...register("newEmail", {
                  required: "Email is required",
                  pattern: {
                    // RFC-lite: something@something.tld (no spaces)
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                  setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
                })}
              />
              {new Date(emailStatusResponse?.data.emailChangeAllowedAt) >
                new Date() && (
                <p id="newEmail-error" className="text-sm text-red-600">
                  email has already been updated please wait{" "}
                  {formatRemaining(remainingMs)}
                </p>
              )}
              {new Date(emailStatusResponse?.data.emailResendAllowedAt) >
                new Date() && (
                <p id="newEmail-error" className="text-sm text-red-600">
                  please wait 1 minute before requesting a new email
                </p>
              )}
              {errors.newEmail && (
                <p id="newEmail-error" className="text-sm text-red-600">
                  {errors.newEmail.message}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || remainingMs > 0}
              >
                {isSubmitting ? "Sending..." : "Send Verification Code"}
              </Button>
            </div>
            {/* Small reiteration under the form for clarity */}

            <p className="text-xs text-gray-500 text-center">
              You may only change your email once a month if your having issues
              please contact support@campuscribs.com
            </p>
          </form>
          {emailStatusResponse?.data.emailStatus == "PENDING" && (
            <div
              role="status"
              className="rounded-xl border border-amber-300 bg-amber-50 p-4 md:p-5 grid gap-3 mt-10"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="shrink-0" />
                <div className="grid gap-1">
                  <p className="text-sm md:text-base font-semibold text-amber-900">
                    Email change is pending
                  </p>
                  <p className="text-sm text-amber-900/80">
                    We sent a verification code to your new email. Continue to
                    finish verification, or enter a different email
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center  gap-2">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/settings/account/email-verification")
                  }
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-amber-600 bg-amber-600 text-white font-medium hover:bg-amber-700"
                >
                  Continue to Verification
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailInitiate;
