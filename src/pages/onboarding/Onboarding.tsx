import React, { useEffect, useMemo, useState } from "react";
import {
  Home,
  User2,
  AtSign,
  CalendarDays,
  Phone,
  Search,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router";

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
  goal: Goal | null;

  heardFrom: HeardFrom | null;
  heardFromOther: string;
};

const majors = [
  "Computer Science",
  "Computer Engineering",
  "Business",
  "Nursing",
  "Biology",
  "Psychology",
  "Other",
];

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
  { code: "US", dial: "+1", flag: "🇺🇸", label: "United States" },
  { code: "CA", dial: "+1", flag: "🇨🇦", label: "Canada" },
  { code: "GB", dial: "+44", flag: "🇬🇧", label: "United Kingdom" },
  { code: "DE", dial: "+49", flag: "🇩🇪", label: "Germany" },
  { code: "FR", dial: "+33", flag: "🇫🇷", label: "France" },
];

function digitsOnly(v: string) {
  return v.replace(/\D/g, "");
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

  // 0 Phone entry, 1 Code verify, 2 Basics, 3 Major, 4 Marketing, 5 Goal
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
    goal: null,

    heardFrom: null,
    heardFromOther: "",
  });

  const selectedCountry =
    COUNTRY_CODES.find((c) => c.code === data.phoneCountry) ?? COUNTRY_CODES[0];

  const isUSLike = selectedCountry.dial === "+1";
  const phoneDigits = digitsOnly(data.phoneNumber);

  const canContinue = useMemo(() => {
    if (step === 0) {
      return isUSLike ? phoneDigits.length === 10 : phoneDigits.length >= 6;
    }
    if (step === 1) return data.phoneStatus === "VERIFIED";

    if (step === 2) {
      if (!data.fullName.trim()) return false;
      if (!data.username.trim()) return false;
      if (!data.birthday.trim()) return false;
      return true;
    }

    if (step === 3) return data.major.trim().length > 0;

    if (step === 4) {
      if (data.heardFrom === null) return false;
      if (data.heardFrom === "OTHER")
        return data.heardFromOther.trim().length > 0;
      return true;
    }

    if (step === 5) return data.goal !== null;

    return false;
  }, [step, data, isUSLike, phoneDigits.length]);

  // ✅ Auto-advance when verified (minimal + reliable)
  useEffect(() => {
    if (step === 1 && data.phoneStatus === "VERIFIED") {
      setStep(2);
    }
  }, [step, data.phoneStatus]);

  const next = async () => {
    if (!canContinue) return;

    // Step 0 -> Step 1: send OTP (separate API call)
    if (step === 0) {
      // TODO: replace with API call
      // await api.sendOtp({ country: data.phoneCountry, phone: phoneDigits })
      await new Promise((r) => setTimeout(r, 250));
      setData((p) => ({ ...p, phoneStatus: "CODE_SENT" }));
      setStep(1);
      return;
    }

    if (step < maxStep) {
      setStep((s) => s + 1);
      return;
    }

    onFinish?.(data);
    navigate("/cribs");
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="min-h-[100dvh] w-full max-w-md mx-auto px-4 pt-8 pb-6 flex flex-col">
      <div className="flex mb-20 justify-items-center">
        {step === 0 && (
          <PhoneEntryStep
            phoneCountry={data.phoneCountry}
            phoneNumber={data.phoneNumber}
            onChange={(patch) => setData((p) => ({ ...p, ...patch }))}
          />
        )}

        {step === 1 && (
          <PhoneCodeStep
            phoneCountry={data.phoneCountry}
            phoneNumber={data.phoneNumber}
            phoneOtp={data.phoneOtp}
            phoneStatus={data.phoneStatus}
            onChange={(patch) => setData((p) => ({ ...p, ...patch }))}
          />
        )}

        {step === 2 && (
          <BasicsStep
            fullName={data.fullName}
            username={data.username}
            birthday={data.birthday}
            onChange={(patch) => setData((p) => ({ ...p, ...patch }))}
          />
        )}

        {step === 3 && (
          <MajorStep
            major={data.major}
            onChange={(major) => setData((p) => ({ ...p, major }))}
          />
        )}

        {step === 4 && (
          <MarketingStep
            heardFrom={data.heardFrom}
            heardFromOther={data.heardFromOther}
            onChange={(patch) => setData((p) => ({ ...p, ...patch }))}
          />
        )}

        {step === 5 && (
          <GoalStep
            value={data.goal}
            onChange={(goal) => setData((p) => ({ ...p, goal }))}
          />
        )}
      </div>

      {/* Keep it super basic: hide nav buttons on code page */}
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
            disabled={!canContinue}
            className="flex-1 rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-neutral-900 disabled:opacity-40"
          >
            {step < maxStep ? "Continue" : "Finish"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- Step 0 (Phone entry) ---------------- */

function PhoneEntryStep({
  phoneCountry,
  phoneNumber,
  onChange,
}: {
  phoneCountry: string;
  phoneNumber: string;
  onChange: (
    patch: Partial<Pick<OnboardingState, "phoneCountry" | "phoneNumber">>,
  ) => void;
}) {
  const [countryOpen, setCountryOpen] = useState(false);

  const selectedCountry =
    COUNTRY_CODES.find((c) => c.code === phoneCountry) ?? COUNTRY_CODES[0];

  const isUSLike = selectedCountry.dial === "+1";
  const displayedNumber = isUSLike ? formatUSPhone(phoneNumber) : phoneNumber;

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="text-lg font-semibold text-black/85">
        Enter your phone
      </div>

      <div className="text-sm text-black/60">
        We’ll text you a verification code.
      </div>

      <div className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 flex items-center gap-3">
        <div className="text-black/60">
          <Phone size={18} />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setCountryOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm hover:bg-black/[0.02] focus:outline-none"
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm text-black/80">
              {selectedCountry.dial}
            </span>
            <ChevronDown size={14} className="text-black/50" />
          </button>

          {countryOpen && (
            <div className="absolute left-0 top-[110%] z-50 w-56 rounded-2xl border border-black/10 bg-white shadow-lg overflow-hidden">
              {COUNTRY_CODES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onChange({ phoneCountry: c.code, phoneNumber: "" });
                    setCountryOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-black/[0.04] text-left"
                >
                  <span className="text-lg">{c.flag}</span>
                  <span className="flex-1 text-black/80">{c.label}</span>
                  <span className="text-black/60">{c.dial}</span>
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
          className="flex-1 text-sm text-left text-black/80 font-[Inter] outline-none bg-transparent"
        />
      </div>
    </div>
  );
}

/* ---------------- Step 1 (Code verify) ---------------- */

function PhoneCodeStep({
  phoneCountry,
  phoneNumber,
  phoneOtp,
  phoneStatus,
  onChange,
}: {
  phoneCountry: string;
  phoneNumber: string;
  phoneOtp: string;
  phoneStatus: PhoneVerifyStatus;
  onChange: (
    patch: Partial<Pick<OnboardingState, "phoneOtp" | "phoneStatus">>,
  ) => void;
}) {
  const selectedCountry =
    COUNTRY_CODES.find((c) => c.code === phoneCountry) ?? COUNTRY_CODES[0];

  const dial = selectedCountry.dial;

  const verify = async (code?: string) => {
    const otp = code ?? phoneOtp; // <- use the newest value if provided
    if (!isValidOtp(otp)) return;

    await new Promise((r) => setTimeout(r, 200));

    if (otp === "123456") {
      onChange({ phoneStatus: "VERIFIED" });
      return;
    }

    onChange({ phoneOtp: "" });
    alert("Invalid code. Try 123456 for now.");
  };

  const resend = async () => {
    // TODO: replace with resend API call
    await new Promise((r) => setTimeout(r, 150));
    alert("Resent (dummy). Use 123456.");
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="text-lg font-semibold text-black/85">
        Enter verification code
      </div>

      <div className="text-sm text-black/60">
        Sent to{" "}
        <span className="font-semibold text-black/75">
          {dial} {phoneNumber}
        </span>
      </div>

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
              verify(value); // <- pass the fresh 6 digits
            }
          }}
          className="w-full text-center text-lg tracking-[0.35em] font-semibold text-black/80 outline-none bg-transparent"
        />
      </div>

      <button
        type="button"
        onClick={verify}
        disabled={!isValidOtp(phoneOtp) || phoneStatus !== "CODE_SENT"}
        className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-neutral-900 disabled:opacity-40"
      >
        Verify
      </button>

      <button
        type="button"
        onClick={resend}
        className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-black/70 border border-black/10 hover:bg-black/[0.03] transition"
      >
        Resend code
      </button>
    </div>
  );
}

/* ---------------- Step 2 (Basics) ---------------- */

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
        onChange={(v) => onChange({ fullName: v })}
      />

      <LabeledInput
        icon={<AtSign size={18} />}
        placeholder="Username"
        value={username}
        onChange={(v) => onChange({ username: v })}
      />

      <LabeledInput
        icon={<CalendarDays size={18} />}
        placeholder="Birthday"
        value={birthday}
        type="date"
        onChange={(v) => onChange({ birthday: v })}
      />
    </div>
  );
}

/* ---------------- Major ---------------- */

function MajorStep({
  major,
  onChange,
}: {
  major: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 relative w-full h-full">
      <div className="text-lg font-semibold text-black/85">
        What&apos;s your major?
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm text-left text-black/80 font-[Inter]"
      >
        {major || "Select your major"}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 z-10 rounded-2xl border border-black/10 bg-white max-h-64 overflow-auto">
          {majors.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                onChange(m);
                setOpen(false);
              }}
              className="w-full px-4 py-3 text-sm text-left font-[Inter] text-black/80 hover:bg-black/5"
            >
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Marketing ---------------- */

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
        {heardFromOptions.map((opt) => (
          <SmallChoice
            key={opt.key}
            label={opt.label}
            selected={heardFrom === opt.key}
            onClick={() => onChange({ heardFrom: opt.key })}
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

/* ---------------- Goal ---------------- */

function GoalStep({
  value,
  onChange,
}: {
  value: Goal | null;
  onChange: (g: Goal) => void;
}) {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="text-lg font-semibold text-black/85">
        What are you here to do?
      </div>

      <div className="flex flex-col gap-3 items-center">
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

/* ---------------- primitives ---------------- */

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
        "border transition aspect-square flex flex-col items-center justify-center gap-4",
        selected ? "border-neutral-900" : "border-black/10",
      ].join(" ")}
    >
      <div className="text-black/85">{icon}</div>
      <div className="text-black/85 text-center">{label}</div>
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
  onChange: (v: string) => void;
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
        className="w-full text-sm text-left text-black/80 font-[Inter] outline-none bg-transparent"
      />
    </div>
  );
}
