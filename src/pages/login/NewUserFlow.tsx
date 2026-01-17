import { Home, User2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

type Role = "STUDENT" | "LANDLORD";
type Goal = "FIND_HOUSING" | "FIND_ROOMMATES";

type OnboardingState = {
  role: Role | null;
  major: string;
  goal: Goal | null;
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

export default function UltraMinimalOnboarding({
  onFinish,
}: {
  onFinish?: (data: OnboardingState) => void;
}) {
  const navigate = useNavigate();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [data, setData] = useState<OnboardingState>({
    role: null,
    major: "",
    goal: null,
  });

  const canContinue = useMemo(() => {
    if (step === 0) return data.role !== null;
    if (step === 1) return data.major.trim().length > 0;
    return data.goal !== null;
  }, [step, data]);

  const next = () => {
    if (!canContinue) return;
    if (step < 2) setStep((s) => (s + 1) as 0 | 1 | 2);
    else {
      onFinish?.(data);
      console.log("onboarding submit:", data);
      navigate("/cribs");
    }
  };

  const back = () => setStep((s) => Math.max(0, s - 1) as 0 | 1 | 2);

  return (
    <div className="min-h-[100dvh] w-full max-w-md mx-auto px-4 pt-8 pb-6 flex flex-col">
      <div className="flex-1 justify-items-center ">
        {step === 0 && (
          <RoleStep
            value={data.role}
            onChange={(role) => setData((p) => ({ ...p, role }))}
          />
        )}

        {step === 1 && (
          <MajorStep
            major={data.major}
            onChange={(major) => setData((p) => ({ ...p, major }))}
          />
        )}

        {step === 2 && (
          <GoalStep
            value={data.goal}
            onChange={(goal) => setData((p) => ({ ...p, goal }))}
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
          {step < 2 ? "Continue" : "Finish"}
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
    <div className="flex flex-col gap-4 ">
      <div className="text-lg font-semibold text-black/85">Who are you?</div>

      <div className="flex flex-col gap-3 w-full  items-center">
        <Box
          label="Student"
          selected={value === "STUDENT"}
          onClick={() => onChange("STUDENT")}
        />
        <Box
          label="Landlord"
          selected={value === "LANDLORD"}
          onClick={() => onChange("LANDLORD")}
        />
      </div>
    </div>
  );
}

/* ---------------- Step 2 ---------------- */

function MajorStep({
  major,
  onChange,
}: {
  major: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 relative">
      <div className="text-lg font-semibold text-black/85">
        What&apos;s your major?
      </div>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4
                   text-sm text-left text-black/80 font-[Inter]"
      >
        {major || "Select your major"}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-2 z-10
                     rounded-2xl border border-black/10 bg-white
                     max-h-64 overflow-auto"
        >
          {majors.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                onChange(m);
                setOpen(false);
              }}
              className="w-full px-4 py-3 text-sm text-left font-[Inter]
                         text-black/80 hover:bg-black/5"
            >
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Step 3 ---------------- */

function GoalStep({
  value,
  onChange,
}: {
  value: Goal | null;
  onChange: (g: Goal) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-semibold text-black/85">
        What are you here to do?
      </div>

      <div className="flex flex-col gap-3 items-center ">
        <Box
          label="Find housing"
          selected={value === "FIND_HOUSING"}
          onClick={() => onChange("FIND_HOUSING")}
        />
        <Box
          label="Find roommates"
          selected={value === "FIND_ROOMMATES"}
          onClick={() => onChange("FIND_ROOMMATES")}
        />
      </div>
    </div>
  );
}

/* ---------------- tiny primitive ---------------- */

function Box({
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
        "w-[60%] rounded-2xl px-4 py-6 text-base font-semibold text-left",
        "border transition aspect-square flex flex-col items-center justify-center gap-4",
        selected ? "border-neutral-900" : "border-black/10",
      ].join(" ")}
    >
      {label === "Student" ? (
        <div className="text-black/85 ">
          <User2 size={80} />
        </div>
      ) : null}
      {label === "Landlord" ? (
        <div className="text-black/85 ">
          <Home size={80} />
        </div>
      ) : null}
      {label === "Find housing" ? (
        <div className="text-black/85 ">
          <Home size={80} />{" "}
        </div>
      ) : null}
      {label === "Find roommates" ? (
        <div className="text-black/85 ">
          <User2 size={80} />
        </div>
      ) : null}
      <div className="text-black/85">{label}</div>
    </button>
  );
}
