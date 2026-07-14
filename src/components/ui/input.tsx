

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full items-center gap-3 rounded-[10px] border bg-neutral-925 px-3 py-2 text-sm text-white transition-colors placeholder:text-neutral-500 outline-none disabled:pointer-events-none disabled:bg-neutral-900 disabled:border-neutral-925 disabled:text-neutral-500",
  {
    variants: {
      state: {
        default: "border-neutral-925 hover:border-purple-200 focus:border-purple-500 has-[input:not(:placeholder-shown)]:border-purple-400",
        success: "border-success-700",
        error: "border-error-700",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  label?: string
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, state, leadingIcon, trailingIcon, label, helperText, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && <label className="text-sm font-medium text-white">{label}</label>}
        <div className={cn(inputVariants({ state, className }))}>
          {leadingIcon}
          <input
            ref={ref}
            className="flex-1 bg-transparent outline-none placeholder:text-neutral-500"
            {...props}
          />
          {trailingIcon}
        </div>
        {helperText && (
          <span
            className={cn(
              "text-xs",
              state === "error" && "text-error-700",
              state === "success" && "text-success-700",
              (!state || state === "default") && "text-neutral-500"
            )}
          >
            {helperText}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }