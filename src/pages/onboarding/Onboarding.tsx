import React, { useEffect, useMemo, useState } from "react";
import {
  AtSign,
  CalendarDays,
  ChevronDown,
  Home,
  Phone,
  Search,
  ShieldCheck,
  User2,
} from "lucide-react";
import { useNavigate } from "react-router";
import {
  useGetOnboardingEducation,
  usePostOnboardingComplete,
  usePostOnboardingEducation,
  usePostOnboardingPhone,
  usePostOnboardingPhoneVerify,
} from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";

type Goal = "FIND_LEASE" | "POST_LISTING";

type HeardFrom =
  | "TIKTOK"
  | "INSTAGRAM"
  | "GOOGLE"
  | "FRIEND"
  | "FLYER"
  | "CAMPUS"
  | "OTHER";

type PhoneVerifyStatus = "UNVERIFIED" | "CODE_SENT" | "VERIFIED";

type OnboardingState = {
  phoneCountry: string;
  phoneNumber: string;
  phoneOtp: string;
  phoneStatus: PhoneVerifyStatus;
  fullName: string;
  username: string;
  birthday: string;
  major: string;
  universityId: string;
  goal: Goal | null;
  heardFrom: HeardFrom | null;
  heardFromOther: string;
};

const heardFromOptions: { key: HeardFrom; label: string }[] = [
  { key: "TIKTOK", label: "TikTok" },
  { key: "INSTAGRAM", label: "Instagram" },
  { key: "GOOGLE", label: "Google" },
  { key: "FRIEND", label: "Friend" },
  { key: "FLYER", label: "Flyer" },
  { key: "CAMPUS", label: "On campus" },
  { key: "OTHER", label: "Other" },
];

const COUNTRY_CODES = [
  { code: "US", dial: "+1", flag: "US", label: "United States" },
  { code: "CA", dial: "+1", flag: "CA", label: "Canada" },
  { code: "GB", dial: "+44", flag: "GB", label: "United Kingdom" },
  { code: "DE", dial: "+49", flag: "DE", label: "Germany" },
  { code: "FR", dial: "+33", flag: "FR", label: "France" },
];

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function formatUSPhone(value: string) {
  const digits = digitsOnly(value).slice(0, 10);
  const len = digits.length;
  if (len === 0) return "";
  if (len < 4) return `(${digits}`;
  if (len < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function isValidOtp(code: string) {
  return /^\d{6}$/.test(code);
}

export default function Onboarding({
  onFinish,
}: {
  onFinish?: (data: OnboardingState) => void;
}) {
  const navigate = useNavigate();
  const config = useAuthenticatedClientConfig();
  const [step, setStep] = useState(0);
  const maxStep = 5;
  const [data, setData] = useState<OnboardingState>({
    phoneCountry: "US",
    phoneNumber: "",
    phoneOtp: "",
    phoneStatus: "UNVERIFIED",
    fullName: "",
    username: "",
    birthday: "",
    major: "",
    universityId: "",
    goal: null,
    heardFrom: null,
    heardFromOther: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [educationError, setEducationError] = useState("");

  const {
    data: educationData,
    isLoading: isLoadingEducation,
    isError: isEducationError,
  } = useGetOnboardingEducation({});
  const { mutateAsync: saveEducation, isPending: isSavingEducation } =
    usePostOnboardingEducation({});
  const { mutateAsync: sendPhoneCode, isPending: isSendingPhoneCode } =
    usePostOnboardingPhone({});
  const { mutateAsync: verifyPhoneCode, isPending: isVerifyingPhoneCode } =
    usePostOnboardingPhoneVerify({});
  const { mutateAsync: completeOnboarding, isPending: isCompletingOnboarding } =
    usePostOnboardingComplete({});

  const selectedCountry =
    COUNTRY_CODES.find((country) => country.code === data.phoneCountry) ??
    COUNTRY_CODES[0];
  const isUSLike = selectedCountry.dial === "+1";
  const phoneDigits = digitsOnly(data.phoneNumber);

  const canContinue = useMemo(() => {
    if (step === 0) {
      return isUSLike ? phoneDigits.length === 10 : phoneDigits.length >= 6;
    }
    if (step === 1) return data.phoneStatus === "VERIFIED";
    if (step === 2) {
      return (
        data.fullName.trim().length > 0 &&
        data.username.trim().length > 0 &&
        data.birthday.trim().length > 0
      );
    }
    if (step === 3) {
      const education = educationData?.data;
      if (!education) return false;
      if (data.major.trim().length === 0) return false;
      return education.canSelectUniversity
        ? data.universityId.trim().length > 0
        : true;
    }
    if (step === 4) {
      if (data.heardFrom === null) return false;
      return data.heardFrom === "OTHER"
        ? data.heardFromOther.trim().length > 0
        : true;
    }
    if (step === 5) return data.goal !== null;
    return false;
  }, [data, educationData, isUSLike, phoneDigits.length, step]);

  useEffect(() => {
    if (step === 1 && data.phoneStatus === "VERIFIED") {
      setStep(2);
    }
  }, [data.phoneStatus, step]);

  useEffect(() => {
    const education = educationData?.data;
    if (!education) return;

    setData((prev) => ({
      ...prev,
      major: prev.major || education.selectedMajor || "",
      universityId: prev.universityId || education.selectedUniversity?.id || "",
    }));
  }, [educationData]);

  const next = async () => {
    if (!canContinue) return;

    if (step === 0) {
      try {
        setPhoneError("");
        await sendPhoneCode({
          data: {
            phoneNumber: `${selectedCountry.dial}${phoneDigits}`,
          },
        });
        setData((prev) => ({ ...prev, phoneStatus: "CODE_SENT" }));
        setStep(1);
      } catch (error) {
        console.error(error);
        setPhoneError("Unable to send a verification code right now.");
      }
      return;
    }

    if (step === 3) {
      try {
        setEducationError("");
        const education = educationData?.data;
        await saveEducation({
          data: education?.canSelectUniversity
            ? {
                major: data.major,
                universityId: data.universityId || null,
              }
            : {
                major: data.major,
              },
        });
        setStep(4);
      } catch (error) {
        console.error(error);
        setEducationError("Unable to save your education details right now.");
      }
      return;
    }

    if (step === 5) {
      try {
        await completeOnboarding({
          data: {
            fullName: data.fullName,
            username: data.username,
            birthday: data.birthday,
            major: data.major,
            universityId: data.universityId || null,
            goal: data.goal!,
            heardFrom: data.heardFrom!,
            heardFromOther:
              data.heardFrom === "OTHER" ? data.heardFromOther : null,
          },
        });
        onFinish?.(data);
        navigate("/cribs");
      } catch (error) {
        console.error(error);
      }
      return;
    }

    if (step < maxStep) {
      setStep((current) => current + 1);
    }
  };

  const back = () => setStep((current) => Math.max(0, current - 1));

  return (
    <div className="min-h-[100dvh] w-full max-w-md mx-auto px-4 pt-8 pb-6 flex flex-col">
      <div className="flex mb-20 justify-items-center">
        {step === 0 && (
          <PhoneEntryStep
            phoneCountry={data.phoneCountry}
            phoneNumber={data.phoneNumber}
            phoneError={phoneError}
            onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
          />
        )}

        {step === 1 && (
          <PhoneCodeStep
            phoneCountry={data.phoneCountry}
            phoneNumber={data.phoneNumber}
            phoneOtp={data.phoneOtp}
            phoneStatus={data.phoneStatus}
            verifyError={verifyError}
            isVerifying={isVerifyingPhoneCode}
            onVerify={async (otp) => {
              try {
                setVerifyError("");
                await verifyPhoneCode({
                  data: {
                    phoneNumber: `${selectedCountry.dial}${phoneDigits}`,
                    code: otp,
                  },
                });
                setData((prev) => ({ ...prev, phoneStatus: "VERIFIED" }));
              } catch (error) {
                console.error(error);
                setVerifyError("That verification code was not accepted.");
                setData((prev) => ({ ...prev, phoneOtp: "" }));
              }
            }}
            onResend={async () => {
              try {
                setVerifyError("");
                await sendPhoneCode({
                  data: {
                    phoneNumber: `${selectedCountry.dial}${phoneDigits}`,
                  },
                });
              } catch (error) {
                console.error(error);
                setVerifyError("Unable to resend the code right now.");
              }
            }}
            onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
          />
        )}

        {step === 2 && (
          <BasicsStep
            fullName={data.fullName}
            username={data.username}
            birthday={data.birthday}
            onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
          />
        )}

        {step === 3 && (
          <MajorStep
            major={data.major}
            universityId={data.universityId}
            educationData={educationData?.data}
            isLoadingEducation={isLoadingEducation}
            isEducationError={isEducationError}
            educationError={educationError}
            onMajorChange={(major) => setData((prev) => ({ ...prev, major }))}
            onUniversityChange={(universityId) =>
              setData((prev) => ({ ...prev, universityId }))
            }
          />
        )}

        {step === 4 && (
          <MarketingStep
            heardFrom={data.heardFrom}
            heardFromOther={data.heardFromOther}
            onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
          />
        )}

        {step === 5 && (
          <GoalStep
            value={data.goal}
            onChange={(goal) => setData((prev) => ({ ...prev, goal }))}
          />
        )}
      </div>

      {step !== 1 && (
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
            disabled={
              !canContinue ||
              isSavingEducation ||
              isSendingPhoneCode ||
              isCompletingOnboarding
            }
            className="flex-1 rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-neutral-900 disabled:opacity-40"
          >
            {step === 0 && isSendingPhoneCode
              ? "Sending..."
              : step === 3 && isSavingEducation
                ? "Saving..."
                : step === 5 && isCompletingOnboarding
                  ? "Finishing..."
                  : step < maxStep
                    ? "Continue"
                    : "Finish"}
          </button>
        </div>
      )}
    </div>
  );
}

function PhoneEntryStep({
  phoneCountry,
  phoneNumber,
  phoneError,
  onChange,
}: {
  phoneCountry: string;
  phoneNumber: string;
  phoneError: string;
  onChange: (
    patch: Partial<Pick<OnboardingState, "phoneCountry" | "phoneNumber">>,
  ) => void;
}) {
  const [countryOpen, setCountryOpen] = useState(false);
  const selectedCountry =
    COUNTRY_CODES.find((country) => country.code === phoneCountry) ??
    COUNTRY_CODES[0];
  const isUSLike = selectedCountry.dial === "+1";
  const displayedNumber = isUSLike ? formatUSPhone(phoneNumber) : phoneNumber;

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="text-lg font-semibold text-black/85">
        Enter your phone
      </div>

      <div className="text-sm text-black/60">
        We&apos;ll text you a verification code.
      </div>

      {phoneError ? (
        <div className="text-sm text-red-600">{phoneError}</div>
      ) : null}

      <div className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 flex items-center gap-3">
        <div className="text-black/60">
          <Phone size={18} />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setCountryOpen((open) => !open)}
            className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm hover:bg-black/[0.02] focus:outline-none"
          >
            <span className="text-sm font-semibold text-black/70">
              {selectedCountry.flag}
            </span>
            <span className="text-sm text-black/80">
              {selectedCountry.dial}
            </span>
            <ChevronDown size={14} className="text-black/50" />
          </button>

          {countryOpen && (
            <div className="absolute left-0 top-[110%] z-50 w-56 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg">
              {COUNTRY_CODES.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    onChange({ phoneCountry: country.code, phoneNumber: "" });
                    setCountryOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-black/[0.04]"
                >
                  <span className="text-sm font-semibold text-black/70">
                    {country.flag}
                  </span>
                  <span className="flex-1 text-black/80">{country.label}</span>
                  <span className="text-black/60">{country.dial}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          inputMode="tel"
          placeholder={isUSLike ? "(555) 555-5555" : "Phone number"}
          value={displayedNumber}
          onChange={(e) => {
            const formatted = isUSLike
              ? formatUSPhone(e.target.value)
              : e.target.value;
            onChange({ phoneNumber: formatted });
          }}
          className="flex-1 bg-transparent text-left text-sm font-[Inter] text-black/80 outline-none"
        />
      </div>
    </div>
  );
}

function PhoneCodeStep({
  phoneCountry,
  phoneNumber,
  phoneOtp,
  phoneStatus,
  verifyError,
  isVerifying,
  onVerify,
  onResend,
  onChange,
}: {
  phoneCountry: string;
  phoneNumber: string;
  phoneOtp: string;
  phoneStatus: PhoneVerifyStatus;
  verifyError: string;
  isVerifying: boolean;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onChange: (
    patch: Partial<Pick<OnboardingState, "phoneOtp" | "phoneStatus">>,
  ) => void;
}) {
  const selectedCountry =
    COUNTRY_CODES.find((country) => country.code === phoneCountry) ??
    COUNTRY_CODES[0];

  const verify = async (code?: string) => {
    const otp = code ?? phoneOtp;
    if (!isValidOtp(otp)) return;
    await onVerify(otp);
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="text-lg font-semibold text-black/85">
        Enter verification code
      </div>

      <div className="text-sm text-black/60">
        Sent to{" "}
        <span className="font-semibold text-black/75">
          {selectedCountry.dial} {phoneNumber}
        </span>
      </div>

      {verifyError ? (
        <div className="text-sm text-red-600">{verifyError}</div>
      ) : null}

      <div className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 flex items-center gap-3">
        <div className="text-black/60">
          <ShieldCheck size={18} />
        </div>

        <input
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
          value={phoneOtp}
          onChange={(e) => {
            const value = digitsOnly(e.target.value).slice(0, 6);
            onChange({ phoneOtp: value });
            if (value.length === 6) {
              void verify(value);
            }
          }}
          className="w-full bg-transparent text-center text-lg font-semibold tracking-[0.35em] text-black/80 outline-none"
        />
      </div>

      <button
        type="button"
        onClick={() => void verify()}
        disabled={
          !isValidOtp(phoneOtp) || phoneStatus !== "CODE_SENT" || isVerifying
        }
        className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-neutral-900 disabled:opacity-40"
      >
        {isVerifying ? "Verifying..." : "Verify"}
      </button>

      <button
        type="button"
        onClick={() => void onResend()}
        className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold text-black/70 transition hover:bg-black/[0.03]"
      >
        Resend code
      </button>
    </div>
  );
}

function BasicsStep({
  fullName,
  username,
  birthday,
  onChange,
}: {
  fullName: string;
  username: string;
  birthday: string;
  onChange: (
    patch: Partial<Pick<OnboardingState, "fullName" | "username" | "birthday">>,
  ) => void;
}) {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="text-lg font-semibold text-black/85">Basic info</div>

      <LabeledInput
        icon={<User2 size={18} />}
        placeholder="Full name"
        value={fullName}
        onChange={(value) => onChange({ fullName: value })}
      />

      <LabeledInput
        icon={<AtSign size={18} />}
        placeholder="Username"
        value={username}
        onChange={(value) => onChange({ username: value })}
      />

      <LabeledInput
        icon={<CalendarDays size={18} />}
        placeholder="Birthday"
        value={birthday}
        type="date"
        onChange={(value) => onChange({ birthday: value })}
      />
    </div>
  );
}

function MajorStep({
  major,
  universityId,
  educationData,
  isLoadingEducation,
  isEducationError,
  educationError,
  onMajorChange,
  onUniversityChange,
}: {
  major: string;
  universityId: string;
  educationData?: {
    majors: string[];
    universities: { id: string; name: string }[];
    selectedUniversity?: { id: string; name: string } | null;
    canSelectUniversity: boolean;
    selectedMajor: string | null;
    verificationStatus: "VERIFIED" | "UNVERIFIED";
  };
  isLoadingEducation: boolean;
  isEducationError: boolean;
  educationError: string;
  onMajorChange: (value: string) => void;
  onUniversityChange: (value: string) => void;
}) {
  const [majorOpen, setMajorOpen] = useState(false);
  const [universityOpen, setUniversityOpen] = useState(false);
  const selectedUniversity = educationData?.universities.find(
    (university) => university.id === universityId,
  );

  return (
    <div className="flex flex-col gap-4 relative w-full h-full">
      <div className="text-lg font-semibold text-black/85">
        School and major
      </div>

      {isLoadingEducation ? (
        <div className="text-sm text-black/50">
          Loading majors and school...
        </div>
      ) : null}

      {isEducationError || educationError ? (
        <div className="text-sm text-red-600">
          {educationError || "Unable to load education options right now."}
        </div>
      ) : null}

      {educationData?.canSelectUniversity ? (
        <div className="relative">
          <div className="mb-2 text-sm font-semibold text-black/80">
            University
          </div>
          <button
            type="button"
            onClick={() => setUniversityOpen((open) => !open)}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-left text-sm text-black/80 font-[Inter]"
          >
            {selectedUniversity?.name || "Select your university"}
          </button>

          {universityOpen && (
            <div className="absolute left-0 right-0 top-full z-10 mt-2 max-h-64 overflow-auto rounded-2xl border border-black/10 bg-white">
              {educationData.universities.map((university) => (
                <button
                  key={university.id}
                  type="button"
                  onClick={() => {
                    onUniversityChange(university.id);
                    setUniversityOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-[Inter] text-black/80 hover:bg-black/5"
                >
                  {university.name}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-black/10 bg-white px-4 py-4">
          <div className="text-sm font-semibold text-black/80">University</div>
          <div className="mt-1 text-sm text-black/70">
            {educationData?.selectedUniversity?.name ||
              "University detected from your email"}
          </div>
          <div className="mt-1 text-xs text-black/50">
            This is locked because your university is already tied to your
            email.
          </div>
        </div>
      )}

      <div className="relative">
        <div className="mb-2 text-sm font-semibold text-black/80">Major</div>
        <button
          type="button"
          onClick={() => setMajorOpen((open) => !open)}
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm text-left text-black/80 font-[Inter]"
        >
          {major || "Select your major"}
        </button>

        {majorOpen && (
          <div className="absolute left-0 right-0 top-full z-10 mt-2 max-h-64 overflow-auto rounded-2xl border border-black/10 bg-white">
            {educationData?.majors.map((majorOption) => (
              <button
                key={majorOption}
                type="button"
                onClick={() => {
                  onMajorChange(majorOption);
                  setMajorOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-sm font-[Inter] text-black/80 hover:bg-black/5"
              >
                {majorOption}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MarketingStep({
  heardFrom,
  heardFromOther,
  onChange,
}: {
  heardFrom: HeardFrom | null;
  heardFromOther: string;
  onChange: (
    patch: Partial<Pick<OnboardingState, "heardFrom" | "heardFromOther">>,
  ) => void;
}) {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="text-lg font-semibold text-black/85">
        Where did you hear about us?
      </div>

      <div className="grid grid-cols-2 gap-3">
        {heardFromOptions.map((option) => (
          <SmallChoice
            key={option.key}
            label={option.label}
            selected={heardFrom === option.key}
            onClick={() => onChange({ heardFrom: option.key })}
          />
        ))}
      </div>

      {heardFrom === "OTHER" && (
        <input
          placeholder="Tell us where"
          value={heardFromOther}
          onChange={(e) => onChange({ heardFromOther: e.target.value })}
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm text-left text-black/80 font-[Inter]"
        />
      )}
    </div>
  );
}

function GoalStep({
  value,
  onChange,
}: {
  value: Goal | null;
  onChange: (goal: Goal) => void;
}) {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="text-lg font-semibold text-black/85">
        What are you here to do?
      </div>

      <div className="flex flex-col items-center gap-3">
        <Box
          label="Post a Listing"
          selected={value === "POST_LISTING"}
          onClick={() => onChange("POST_LISTING")}
          icon={<Home size={80} />}
        />
        <Box
          label="Find a Lease"
          selected={value === "FIND_LEASE"}
          onClick={() => onChange("FIND_LEASE")}
          icon={<Search size={80} />}
        />
      </div>
    </div>
  );
}

function Box({
  label,
  selected,
  onClick,
  icon,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-[60%] rounded-2xl px-4 py-6 text-base font-semibold text-left",
        "aspect-square border transition flex flex-col items-center justify-center gap-4",
        selected ? "border-neutral-900" : "border-black/10",
      ].join(" ")}
    >
      <div className="text-black/85">{icon}</div>
      <div className="text-center text-black/85">{label}</div>
    </button>
  );
}

function SmallChoice({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl px-4 py-4 text-sm font-semibold",
        "border transition text-black/85",
        selected ? "border-neutral-900" : "border-black/10",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function LabeledInput({
  icon,
  placeholder,
  value,
  onChange,
  inputMode,
  type,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  type?: string;
}) {
  return (
    <div className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 flex items-center gap-3">
      <div className="text-black/60">{icon}</div>
      <input
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-left text-sm font-[Inter] text-black/80 outline-none"
      />
    </div>
  );
}
