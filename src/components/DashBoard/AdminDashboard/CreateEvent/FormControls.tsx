import React from "react";
import { Input } from "@/components/ui/input";
import type { SelectOption } from "./types";

interface FieldLabelProps {
  children: React.ReactNode;
  required?: boolean;
}

export function FieldLabel({ children, required }: FieldLabelProps) {
  return (
    <label className="block text-sm text-neutral-300 mb-2">
      {children}
      {required && <span className="text-orange-500 ml-0.5">*</span>}
    </label>
  );
}

interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "label"> {
  required?: boolean;
  label?: string;
}

export function TextInput({ required, label, ...props }: TextInputProps) {
  return (
    <Input label={label} required={required} {...props} />
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  required?: boolean;
  label?: string;
  hint?: string;
}

export function TextArea({ required, label, hint, ...props }: TextAreaProps) {
  return (
    <div>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <textarea
        {...props}
        rows={4}
        className="w-full rounded-lg bg-neutral-800/80 border border-neutral-700 px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors resize-none"
      />
      {hint && <p className="text-xs text-neutral-500 mt-1.5">{hint}</p>}
    </div>
  );
}

interface SelectProps {
  required?: boolean;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}

export function Select({ required, label, options, placeholder, value, onChange, disabled }: SelectProps) {
  return (
    <div>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-lg bg-neutral-800/80 border border-neutral-700 px-3.5 py-2.5 text-sm text-neutral-100 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%23888%22><path d=%22M5.5 7.5l4.5 4.5 4.5-4.5%22 stroke=%22%23888%22 stroke-width=%221.5%22 fill=%22none%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-no-repeat bg-[right_0.9rem_center]"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const optionValue = typeof option === "string" ? option : option.value;
          const optionLabel = typeof option === "string" ? option : option.label;

          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
          </option>
          );
        })}
      </select>
    </div>
  );
}

interface RadioOptionProps {
  selected: boolean;
  onClick: () => void;
  label: string;
  children?: React.ReactNode;
}

export function RadioOption({ selected, onClick, label, children }: RadioOptionProps) {
  return (
    <div>
      <button type="button" onClick={onClick} className="w-full flex items-start gap-3 text-left group">
        <span
          className={`mt-0.5 shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
            selected ? "border-purple-500" : "border-neutral-600 group-hover:border-neutral-400"
          }`}
        >
          {selected && <span className="w-2 h-2 rounded-full bg-purple-500" />}
        </span>
        <span className={`text-sm ${selected ? "text-neutral-100" : "text-neutral-400"}`}>{label}</span>
      </button>
      {children}
    </div>
  );
}
