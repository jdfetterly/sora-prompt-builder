/**
 * @FeatureID Foundation
 * @Purpose Text input component with error/success states
 * @Spec /docs/DesignSpec.md Section 6 (Form Elements)
 * @Author Chat Bot Labs
 */

"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * Input component props
 * @extends React.InputHTMLAttributes<HTMLInputElement>
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text displayed above the input. Optional. */
  label?: string;
  /** Helper text displayed below the input. Optional. */
  helperText?: string;
  /** Error message. When provided, input shows error state. Optional. */
  error?: string;
  /** Show success state (green border and checkmark). Default: false */
  success?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, success, className, id, ...props }, ref) => {
    const generatedId = useId();
    const hasError = !!error;
    const showSuccess = success && !hasError;
    const inputId = id || `input-${generatedId}`;
    const helperId = (error || helperText) ? `${inputId}-helper` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-text-primary mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full bg-background-secondary border rounded-base px-4 py-3",
              "min-h-[48px] md:min-h-[44px]",
              "text-text-primary placeholder:text-text-tertiary",
              "focus:outline-none focus:border-gold-primary focus:ring-2 focus:ring-gold-primary/20",
              "disabled:bg-background-primary disabled:text-text-tertiary disabled:border-border-subtle disabled:cursor-not-allowed",
              hasError && "border-error focus:border-error focus:ring-error/20",
              showSuccess && "border-success focus:border-success focus:ring-success/20",
              className
            )}
            aria-invalid={hasError}
            aria-describedby={helperId}
            {...props}
          />
          {hasError && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-error" aria-hidden="true" />
          )}
          {showSuccess && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-success" aria-hidden="true" />
          )}
        </div>
        {(error || helperText) && (
          <p
            id={helperId}
            className={cn(
              "mt-1.5 text-sm",
              error ? "text-error" : "text-text-secondary"
            )}
            role={error ? "alert" : undefined}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

