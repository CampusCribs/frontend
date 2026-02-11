import React, { useMemo, useState } from "react";
import {
  Home,
  ShieldCheck,
  User2,
  Building2,
  AtSign,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router";

type Role = "STUDENT" | "LANDLORD";
type Goal = "FIND_HOUSING" | "FIND_ROOMMATES";

type HeardFrom =
  | "TIKTOK"
  | "INSTAGRAM"
  | "GOOGLE"
  | "FRIEND"
  | "FLYER"
  | "CAMPUS"
  | "OTHER";

type OnboardingState = {
  role: Role | null;

  // basics (shared)
  fullName: string;
  username: string;

  // student-only basics
  birthday: string; // YYYY-MM-DD

  // landlord-only basics
  companyName: string;

  // student flow
  major: string;
  goal: Goal | null;

  // landlord flow
  campus: string;
  rooms: number | null;
  ein: string; // optional

  // marketing
  heardFrom: HeardFrom | null;
  heardFromOther: string; // if OTHER
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

const campuses = [
  "University of Cincinnati",
  "Xavier University",
  "Ohio State University",
  "University of Dayton",
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

export default function UltraMinimalOnboarding({
  onFinish,
}: {
  onFinish?: (data: OnboardingState) => void;
}) {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingState>({
    role: null,

    fullName: "",
    username: "",

    birthday: "",
    companyName: "",

    major: "",
    goal: null,

    campus: "",
    rooms: null,
    ein: "",

    heardFrom: null,
    heardFromOther: "",
  });

  const isLandlord = data.role === "LANDLORD";
  const isStudent = data.role === "STUDENT";

  // Step maps:
  // STUDENT: 0 Role, 1 Basics, 2 Major, 3 Marketing, 4 Goal
  // LANDLORD: 0 Role, 1 Basics, 2 Campus, 3 Rooms, 4 Marketing, 5 Verify
  const studentSteps = 5;
  const landlordSteps = 6;
  const maxStep = isLandlord ? landlordSteps - 1 : studentSteps - 1;

  const canContinue = useMemo(() => {
    if (step === 0) return data.role !== null;

    // Basics step (role-dependent)
    if (step === 1) {
      if (!data.fullName.trim()) return false;
      if (!data.username.trim()) return false;

      if (isStudent) {
        // require birthday
        return data.birthday.trim().length > 0;
      }
      if (isLandlord) {
        // require company name
        return data.companyName.trim().length > 0;
      }
      return false;
    }

    if (isStudent) {
      if (step === 2) return data.major.trim().length > 0;

      // Marketing before last question (Goal)
      if (step === 3) {
        if (data.heardFrom === null) return false;
        if (data.heardFrom === "OTHER")
          return data.heardFromOther.trim().length > 0;
        return true;
      }

      if (step === 4) return data.goal !== null;
      return false;
    }

    if (isLandlord) {
      if (step === 2) return data.campus.trim().length > 0;
      if (step === 3) return data.rooms !== null && data.rooms > 0;

      // Marketing before last question (Verify)
      if (step === 4) {
        if (data.heardFrom === null) return false;
        if (data.heardFrom === "OTHER")
          return data.heardFromOther.trim().length > 0;
        return true;
      }

      if (step === 5) return true; // EIN optional
      return false;
    }

    return false;
  }, [step, data, isStudent, isLandlord, isLandlord, isStudent]);

  const next = () => {
    if (!canContinue) return;

    if (step < maxStep) {
      setStep((s) => s + 1);
      return;
    }

    onFinish?.(data);
    console.log("onboarding submit:", data);

    navigate(isLandlord ? "/profile" : "/cribs");
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="min-h-[100dvh] w-full max-w-md mx-auto px-4 pt-8 pb-6 flex flex-col">
      <div className="flex-1 justify-items-center">
        {step === 0 && (
          <RoleStep
            value={data.role}
            onChange={(role) => setData((p) => ({ ...p, role }))}
          />
        )}

        {step === 1 && (
          <BasicsStep
            role={data.role}
            fullName={data.fullName}
            username={data.username}
            birthday={data.birthday}
            companyName={data.companyName}
            onChange={(patch) => setData((p) => ({ ...p, ...patch }))}
          />
        )}

        {/* STUDENT */}
        {isStudent && step === 2 && (
          <MajorStep
            major={data.major}
            onChange={(major) => setData((p) => ({ ...p, major }))}
          />
        )}

        {isStudent && step === 3 && (
          <MarketingStep
            heardFrom={data.heardFrom}
            heardFromOther={data.heardFromOther}
            onChange={(patch) => setData((p) => ({ ...p, ...patch }))}
          />
        )}

        {isStudent && step === 4 && (
          <GoalStep
            value={data.goal}
            onChange={(goal) => setData((p) => ({ ...p, goal }))}
          />
        )}

        {/* LANDLORD */}
        {isLandlord && step === 2 && (
          <CampusStep
            campus={data.campus}
            onChange={(campus) => setData((p) => ({ ...p, campus }))}
          />
        )}

        {isLandlord && step === 3 && (
          <RoomsStep
            rooms={data.rooms}
            onChange={(rooms) => setData((p) => ({ ...p, rooms }))}
          />
        )}

        {isLandlord && step === 4 && (
          <MarketingStep
            heardFrom={data.heardFrom}
            heardFromOther={data.heardFromOther}
            onChange={(patch) => setData((p) => ({ ...p, ...patch }))}
          />
        )}

        {isLandlord && step === 5 && (
          <VerifyStep
            ein={data.ein}
            onChange={(ein) => setData((p) => ({ ...p, ein }))}
          />
        )}
      </div>

      <div className="pt-6 flex items-center gap-3">
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
    </div>
  );
}

/* ---------------- Step 0 ---------------- */

function RoleStep({
  value,
  onChange,
}: {
  value: Role | null;
  onChange: (r: Role) => void;
}) {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="text-lg font-semibold text-black/85">Who are you?</div>

      <div className="flex flex-col gap-3 w-full items-center">
        <Box
          label="Student or User"
          selected={value === "STUDENT"}
          onClick={() => onChange("STUDENT")}
          icon={<User2 size={80} />}
        />
        <Box
          label="Landlord or Property Manager"
          selected={value === "LANDLORD"}
          onClick={() => onChange("LANDLORD")}
          icon={<Home size={80} />}
        />
      </div>
    </div>
  );
}

/* ---------------- Step 1 (Basics) ---------------- */

function BasicsStep({
  role,
  fullName,
  username,
  birthday,
  companyName,
  onChange,
}: {
  role: Role | null;
  fullName: string;
  username: string;
  birthday: string;
  companyName: string;
  onChange: (
    patch: Partial<
      Pick<
        OnboardingState,
        "fullName" | "username" | "birthday" | "companyName"
      >
    >,
  ) => void;
}) {
  const isStudent = role === "STUDENT";
  const isLandlord = role === "LANDLORD";

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

      {isStudent && (
        <LabeledInput
          icon={<CalendarDays size={18} />}
          placeholder="Birthday (YYYY-MM-DD)"
          value={birthday}
          type="date"
          onChange={(v) => onChange({ birthday: v })}
        />
      )}

      {isLandlord && (
        <LabeledInput
          icon={<Building2 size={18} />}
          placeholder="Company name"
          value={companyName}
          onChange={(v) => onChange({ companyName: v })}
        />
      )}

      {!isStudent && !isLandlord && (
        <div className="text-sm text-black/60">
          Select a role first, then we’ll ask the right questions.
        </div>
      )}
    </div>
  );
}

/* ---------------- Marketing (before last question) ---------------- */

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

/* ---------------- STUDENT Step ---------------- */

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
          label="Find housing"
          selected={value === "FIND_HOUSING"}
          onClick={() => onChange("FIND_HOUSING")}
          icon={<Home size={80} />}
        />
        <Box
          label="Find roommates"
          selected={value === "FIND_ROOMMATES"}
          onClick={() => onChange("FIND_ROOMMATES")}
          icon={<User2 size={80} />}
        />
      </div>
    </div>
  );
}

/* ---------------- LANDLORD Steps ---------------- */

function CampusStep({
  campus,
  onChange,
}: {
  campus: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 relative w-full h-full">
      <div className="text-lg font-semibold text-black/85">
        Which campus are you near?
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm text-left text-black/80 font-[Inter]"
      >
        {campus || "Select a campus"}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 z-10 rounded-2xl border border-black/10 bg-white max-h-64 overflow-auto">
          {campuses.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                onChange(c);
                setOpen(false);
              }}
              className="w-full px-4 py-3 text-sm text-left font-[Inter] text-black/80 hover:bg-black/5"
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RoomsStep({
  rooms,
  onChange,
}: {
  rooms: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="text-lg font-semibold text-black/85">
        How many rooms are you listing?
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SmallChoice
          label="1"
          selected={rooms === 1}
          onClick={() => onChange(1)}
        />
        <SmallChoice
          label="2"
          selected={rooms === 2}
          onClick={() => onChange(2)}
        />
        <SmallChoice
          label="3"
          selected={rooms === 3}
          onClick={() => onChange(3)}
        />
        <SmallChoice
          label="4+"
          selected={rooms !== null && rooms >= 4}
          onClick={() => onChange(4)}
        />
      </div>
    </div>
  );
}

function VerifyStep({
  ein,
  onChange,
}: {
  ein: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="text-lg font-semibold text-black/85">
        Want to get verified?
      </div>

      <div className="w-full rounded-2xl border border-black/10 bg-white p-4 flex items-start gap-3">
        <div className="pt-0.5 text-black/85">
          <ShieldCheck size={18} />
        </div>
        <div className="text-sm text-black/70 leading-relaxed">
          Verified landlords get more trust from students. You can skip this
          now.
        </div>
      </div>

      <input
        inputMode="numeric"
        placeholder="EIN (optional)"
        value={ein}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm text-left text-black/80 font-[Inter]"
      />
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
