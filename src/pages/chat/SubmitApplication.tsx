import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

/** -----------------------------
 * Types
 * ----------------------------*/
export type ApplicationValues = {
  name: string;
  email: string;
  phone: string;
  moveInDate: string;
  leaseLength: "6_MONTHS" | "9_MONTHS" | "12_MONTHS" | "OTHER";
  notes?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ApplicationValues) => void;
  defaults?: {
    name?: string;
    email?: string;
    phone?: string;
  };
};

/** -----------------------------
 * Component
 * ----------------------------*/
export default function SubmitApplicationModal({
  open,
  onClose,
  onSubmit,
  defaults,
}: Props) {
  const [name, setName] = useState(defaults?.name ?? "");
  const [email, setEmail] = useState(defaults?.email ?? "");
  const [phone, setPhone] = useState(defaults?.phone ?? "");
  const [moveInDate, setMoveInDate] = useState("");
  const [leaseLength, setLeaseLength] =
    useState<ApplicationValues["leaseLength"]>("12_MONTHS");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(defaults?.name ?? "");
    setEmail(defaults?.email ?? "");
    setPhone(defaults?.phone ?? "");
    setMoveInDate("");
    setLeaseLength("12_MONTHS");
    setNotes("");
  }, [open, defaults]);

  const canSubmit = useMemo(
    () => name && email && phone && moveInDate,
    [name, email, phone, moveInDate],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-semibold">Submit application</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 space-y-4">
          <Input label="Name" value={name} onChange={setName} />
          <Input label="Email" value={email} onChange={setEmail} />
          <Input label="Phone" value={phone} onChange={setPhone} />

          <Input
            label="Move-in date"
            type="date"
            value={moveInDate}
            onChange={setMoveInDate}
          />

          <Field label="Lease length">
            <select
              value={leaseLength}
              onChange={(e) => setLeaseLength(e.target.value as any)}
              className="w-full rounded-xl border px-3 py-2 text-sm bg-white"
            >
              <option value="6_MONTHS">6 months</option>
              <option value="9_MONTHS">9 months</option>
              <option value="12_MONTHS">12 months</option>
              <option value="OTHER">Other</option>
            </select>
          </Field>

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
                moveInDate,
                leaseLength,
                notes: notes || undefined,
              });
              onClose();
            }}
          >
            Submit
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
