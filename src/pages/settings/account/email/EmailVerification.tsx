import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useNotify } from "@/components/ui/Notify";
// import { useGetUsersEmail, usePatchUsersEmail, usePutUsersEmail } from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import { Label } from "@radix-ui/react-label";
import { ArrowLeftIcon } from "lucide-react";
import { useEffect } from "react";

import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const EmailVerification = () => {
  const notify = useNotify();
  const config = useAuthenticatedClientConfig();
  const navigate = useNavigate();
  const {
    control,
    register,
    handleSubmit: handleSubmitVerify,
    formState: { errors: errorsVerify },
  } = useForm();

  // const { mutateAsync: patchUsersEmail } = usePatchUsersEmail({
  //   ...config,
  //   mutation: {
  //     onSuccess: async (response) => {
  //       await notify({
  //         title: "New Verification Sent",
  //         message:
  //           "We have sent you a new verification email. Be sure to check your junk!",

  //         buttonText: "Close",
  //       });
  //     },
  //     onError: async (error) => {
  //       await notify({
  //         title: error.response?.data.title || "Error",
  //         message:
  //           error.response?.data.message ||
  //           "Failed to update profile. Please try again later or reach out to support",
  //         buttonText: "Close",
  //       });
  //     },
  //   },
  // });
  // const { data: emailStatusResponse } = useGetUsersEmail({ ...config });
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (emailStatusResponse?.data.emailStatus !== "PENDING") {
  //       navigate("/settings/account/email");
  //     }
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, [emailStatusResponse, navigate]);
  // const { mutateAsync: putUsersEmail } = usePutUsersEmail({
  //   ...config,
  //   mutation: {
  //     onSuccess: async (response) => {
  //       await notify({
  //         title: "Profile Updated 🎉",
  //         message: "Your profile has been successfully updated.",

  //         buttonText: "Close",
  //       });
  //       navigate("/settings/account");
  //     },
  //     onError: async (error) => {
  //       await notify({
  //         title: error.response?.data.title || "Error",
  //         message:
  //           error.response?.data.message ||
  //           "Failed to update profile. Please try again later or reach out to support",
  //         buttonText: "Close",
  //       });
  //     },
  //   },
  // });
  const onSubmitVerify = async (data) => {
    // await putUsersEmail({ data: { verificationCode: data.code } });
  };
  const onResendEmail = async () => {
    // await patchUsersEmail();
  };
  return (
    <div className="fixed inset-0 z-40 bg-white">
      {/* Top bar */}
      <div className="pt-15" />
      <div className="flex px-4 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="cursor-pointer inline-flex items-center"
          aria-label="Go back"
        >
          <ArrowLeftIcon size={28} />
          <span className="ml-2">Back</span>
        </button>
      </div>
      <div className=" w-full h-full flex items-center justify-center mx-auto">
        <div className="h-[75%] ">
          <h1 className="text-xl font-semibold mb-4">
            Enter Verification Code
          </h1>
          <form
            onSubmit={handleSubmitVerify(onSubmitVerify)}
            className="space-y-10"
          >
            <Controller
              control={control}
              rules={{
                required: "Code is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "Please enter a valid 6-digit code",
                },
              }}
              {...register("code", { required: "code is required" })}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <div className="grid gap-1">
                  <Label htmlFor="code">6-digit Code</Label>
                  <InputOTP value={value} onChange={onChange} maxLength={6}>
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot
                          className="h-10 w-10  m-2"
                          key={i}
                          index={i}
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  {error && (
                    <p className="text-sm text-red-500">{error.message}</p>
                  )}
                </div>
              )}
            />

            <Button type="submit" className="w-full">
              Verify Email
            </Button>
          </form>
          <p className="mt-4 text-sm text-gray-500">
            Didn't receive a code?{" "}
            <button className="underline text-blue-600" onClick={onResendEmail}>
              Resend Code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
