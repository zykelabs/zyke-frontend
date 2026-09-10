import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "ghost" | "outline";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  solid: "bg-ember-500 text-ink-950 hover:bg-ember-400",
  ghost: "text-ink-200 hover:text-white hover:bg-white/5",
  outline: "border border-white/15 text-ink-100 hover:border-white/30 hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "solid", size = "md", ...props }, ref) => (
    <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
  ),
);
Button.displayName = "Button";

export function buttonClass(variant: Variant = "solid", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}
