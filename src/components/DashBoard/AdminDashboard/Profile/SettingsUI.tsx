import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// ============================================================
// Shared UI primitives
// ============================================================

export type TabKey = "profile" | "notifications" | "security";
export type StatusKind = "ok" | "err" | "pending" | "";

export const TAB_ITEMS: { key: TabKey; label: string }[] = [
  { key: "profile", label: "Profile Info" },
  { key: "notifications", label: "Notifications" },
  { key: "security", label: "Security" },
];

export const STATUS_COLOR: Record<StatusKind, string> = {
  ok: "text-green-500",
  err: "text-red-500",
  pending: "text-gray-400",
  "": "text-gray-400",
};

export function Tabs({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) {
  return (
    <div className="mb-6 flex gap-2">
      {TAB_ITEMS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            active === tab.key
              ? "bg-violet-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function TextField({
  id,
  label,
  value,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs text-gray-400">
        {label}
      </label>
      <input
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-violet-500 disabled:cursor-not-allowed disabled:text-gray-400"
      />
    </div>
  );
}

export function PasswordField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs text-gray-400">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          placeholder="••••••••"
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2.5 pr-10 text-sm text-neutral-100 outline-none focus:border-violet-500"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

export function ToggleSwitch({
  id,
  checked,
  onChange,
}: {
  id?: string;
  checked: boolean;
  onChange: (c: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="relative inline-block h-5.5 w-9.5  cursor-pointer">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer h-0 w-0 opacity-0"
      />
      <span className="absolute inset-0 rounded-full bg-neutral-600 transition-colors peer-checked:bg-violet-500" />
      <span className="absolute left-0.75 top-0.75 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
    </label>
  );
}

export function SaveBar({
  status,
  statusKind = "",
  onSave,
  saving,
}: {
  status: string;
  statusKind?: StatusKind;
  onSave: () => void;
  saving?: boolean;
}) {
  return (
    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
      <div className={`min-h-4 text-xs ${STATUS_COLOR[statusKind]}`}>{status}</div>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-lg bg-linear-to-r from-violet-500 to-fuchsia-400 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}

export function initialsFrom(name: string) {
  if (!name.trim()) return "--";
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}
