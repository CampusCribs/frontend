import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

/** -----------------------------
 * Types
 * ----------------------------*/
export type BookTourValues = {
  name: string;
  email: string;
  phone: string;
  tourType: "IN_PERSON" | "VIRTUAL";
  timeWindow: "MORNING" | "AFTERNOON" | "EVENING";
  date?: string;
  notes?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: BookTourValues) => void;
  defaults?: {
    name?: string;
    email?: string;
    phone?: string;
  };
};

/** -----------------------------
 * Component
 * ----------------------------*/
export default function BookTourModal({
  open,
  onClose,
  onSubmit,
  defaults,
}: Props) {
  const [name, setName] = useState(defaults?.name ?? "");
  const [email, setEmail] = useState(defaults?.email ?? "");
  const [phone, setPhone] = useState(defaults?.phone ?? "");
  const [tourType, setTourType] =
    useState<BookTourValues["tourType"]>("IN_PERSON");
  const [timeWindow, setTimeWindow] =
    useState<BookTourValues["timeWindow"]>("AFTERNOON");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(defaults?.name ?? "");
    setEmail(defaults?.email ?? "");
    setPhone(defaults?.phone ?? "");
    setTourType("IN_PERSON");
    setTimeWindow("AFTERNOON");
    setDate("");
    setNotes("");
  }, [open, defaults]);

  const canSubmit = useMemo(
    () => name.trim() && email.trim() && phone.trim(),
    [name, email, phone],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-semibold">Book a tour</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 space-y-4">
          <Input label="Name" value={name} onChange={setName} />
          <Input label="Email" value={email} onChange={setEmail} />
          <Input label="Phone" value={phone} onChange={setPhone} />

          <Field label="Tour type">
            <div className="grid grid-cols-2 gap-2">
              <Chip
                selected={tourType === "IN_PERSON"}
                onClick={() => setTourType("IN_PERSON")}
              >
                In person
              </Chip>
              <Chip
                selected={tourType === "VIRTUAL"}
                onClick={() => setTourType("VIRTUAL")}
              >
                Virtual
              </Chip>
            </div>
          </Field>

          <Field label="Time window">
            <div className="grid grid-cols-3 gap-2">
              {["MORNING", "AFTERNOON", "EVENING"].map((t) => (
                <Chip
                  key={t}
                  selected={timeWindow === t}
                  onClick={() => setTimeWindow(t as any)}
                >
                  {t.toLowerCase()}
                </Chip>
              ))}
            </div>
          </Field>

          <Input
            label="Preferred date (optional)"
            type="date"
            value={date}
            onChange={setDate}
          />

          <Textarea
            label="Notes (optional)"
            value={notes}
            onChange={setNotes}
          />
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-4 pb-4">
          <button
            className="flex-1 border rounded-xl py-2 text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={!canSubmit}
            className="flex-1 rounded-xl bg-slate-900 text-white py-2 text-sm disabled:opacity-40"
            onClick={() => {
              if (!canSubmit) return;
              onSubmit({
                name,
                email,
                phone,
                tourType,
                timeWindow,
                date: date || undefined,
                notes: notes || undefined,
              });
              onClose();
            }}
          >
            Request tour
          </button>
        </div>
      </div>
    </div>
  );
}

/** -----------------------------
 * Small UI helpers
 * ----------------------------*/
function Field({ label, children }: any) {
  return (
    <div>
      <div className="text-xs font-semibold mb-1">{label}</div>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <Field label={label}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border px-3 py-2 text-sm"
      />
    </Field>
  );
}

function Textarea({ label, value, onChange }: any) {
  return (
    <Field label={label}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border px-3 py-2 text-sm min-h-[80px]"
      />
    </Field>
  );
}

function Chip({ selected, children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-3 py-2 text-sm border ${
        selected ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}
