/**
 * @FeatureID Foundation
 * @Purpose Button component with primary, secondary, ghost variants
 * @Spec /docs/DesignSpec.md Section 6 (Buttons)
 * @Author Chat Bot Labs
 */

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

/**
 * Button component props
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant. Default: "primary" */
  variant?: "primary" | "secondary" | "ghost";
  /** Size variant. Default: "md" */
  size?: "sm" | "md" | "lg";
  /** Show loading spinner and disable button. Default: false */
  isLoading?: boolean;
  /** Button content (text or icon + text). Required. */
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = "inline-flex items-center justify-center rounded-base font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      primary: "bg-gradient-to-br from-gold-primary to-gold-dark text-text-inverse hover:from-gold-light hover:to-gold-primary hover:-translate-y-0.5 hover:shadow-glow active:translate-y-0 active:shadow-elevated",
      secondary: "bg-transparent border border-border-default text-text-primary hover:border-gold-primary hover:text-gold-primary hover:bg-gold-muted active:bg-gold-muted",
      ghost: "bg-transparent border-none text-text-secondary hover:text-text-primary hover:bg-white/5 active:bg-white/8",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            <span aria-live="polite">Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

