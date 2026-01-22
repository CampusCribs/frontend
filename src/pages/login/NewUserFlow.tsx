import { Home, ShieldCheck, User2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

type Role = "STUDENT" | "LANDLORD";
type Goal = "FIND_HOUSING" | "FIND_ROOMMATES";

type OnboardingState = {
  role: Role | null;

  // student
  major: string;
  goal: Goal | null;

  // landlord
  campus: string;
  rooms: number | null;
  ein: string; // optional, can be ""
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

export default function UltraMinimalOnboarding({
  onFinish,
}: {
  onFinish?: (data: OnboardingState) => void;
}) {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingState>({
    role: null,

    major: "",
    goal: null,

    campus: "",
    rooms: null,
    ein: "",
  });

  const isLandlord = data.role === "LANDLORD";
  const isStudent = data.role === "STUDENT";

  const studentSteps = 3; // role, major, goal
  const landlordSteps = 4; // role, campus, rooms, verify(optional)
  const maxStep = isLandlord ? landlordSteps - 1 : studentSteps - 1;

  const canContinue = useMemo(() => {
    // step 0 always role
    if (step === 0) return data.role !== null;

    if (isStudent) {
      if (step === 1) return data.major.trim().length > 0;
      if (step === 2) return data.goal !== null;
      return false;
    }

    if (isLandlord) {
      if (step === 1) return data.campus.trim().length > 0;
      if (step === 2) return data.rooms !== null && data.rooms > 0;
      if (step === 3) return true; // EIN optional
      return false;
    }

    return false;
  }, [step, data, isStudent, isLandlord]);

  const next = () => {
    if (!canContinue) return;

    if (step < maxStep) {
      setStep((s) => s + 1);
      return;
    }

    onFinish?.(data);
    console.log("onboarding submit:", data);

    // student -> /cribs (like you had), landlord -> profile
    navigate(isLandlord ? "/profile" : "/cribs");
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="min-h-[100dvh] w-full max-w-md mx-auto px-4 pt-8 pb-6 flex flex-col">
      <div className="flex-1 justify-items-center">
        {step === 0 && (
          <RoleStep
            value={data.role}
            onChange={(role) => {
              setData((p) => ({ ...p, role }));
              // if they switch roles mid-flow, keep them safe
              // (don’t auto-jump steps; just let continue handle it)
            }}
          />
        )}

        {/* STUDENT */}
        {isStudent && step === 1 && (
          <MajorStep
            major={data.major}
            onChange={(major) => setData((p) => ({ ...p, major }))}
          />
        )}

        {isStudent && step === 2 && (
          <GoalStep
            value={data.goal}
            onChange={(goal) => setData((p) => ({ ...p, goal }))}
          />
        )}

        {/* LANDLORD */}
        {isLandlord && step === 1 && (
          <CampusStep
            campus={data.campus}
            onChange={(campus) => setData((p) => ({ ...p, campus }))}
          />
        )}

        {isLandlord && step === 2 && (
          <RoomsStep
            rooms={data.rooms}
            onChange={(rooms) => setData((p) => ({ ...p, rooms }))}
          />
        )}

        {isLandlord && step === 3 && (
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

/* ---------------- Step 1 ---------------- */

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

/* ---------------- STUDENT Step 2 ---------------- */

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

/* ---------------- STUDENT Step 3 ---------------- */

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

/* ---------------- LANDLORD Step 2 ---------------- */

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

/* ---------------- LANDLORD Step 3 ---------------- */
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

/* ---------------- LANDLORD Step 4 ---------------- */

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
