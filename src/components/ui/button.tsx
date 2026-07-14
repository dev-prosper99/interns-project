import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors outline-none select-none disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-purple-500 text-white hover:bg-purple-400 focus-visible:bg-purple-600 focus-visible:ring-2 focus-visible:ring-purple-300 disabled:bg-neutral-900 disabled:text-neutral-500",
        secondary:
          "bg-purple-500/10 text-purple-500 border border-purple-500/24 hover:bg-purple-500/24 focus-visible:border-[1.5px] focus-visible:border-purple-500/24 disabled:bg-neutral-900 disabled:text-neutral-500 disabled:border-neutral-800",
        outline:
          "bg-transparent text-orange-600 border border-orange-600 hover:bg-orange-600/16 focus-visible:border-[1.5px] focus-visible:border-orange-600 disabled:bg-neutral-900 disabled:text-neutral-500 disabled:border-neutral-800",
      },
      size: {
        sm: "rounded-[10px] px-4 py-1.5 gap-2.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "sm",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

// Navbar Button Components
interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const LoginButton: React.FC<NavButtonProps> = ({ children, className, ...props }) => (
  <button 
    className={cn("px-5 py-2 border border-purple-500 text-white rounded-md hover:bg-purple-500/10 transition", className)}
    {...props}
  >
    {children}
  </button>
);

export const PrimaryButton: React.FC<NavButtonProps> = ({ children, className, ...props }) => (
  <button 
    className={cn("px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition", className)}
    {...props}
  >
    {children}
  </button>
);

export { Button, buttonVariants }

