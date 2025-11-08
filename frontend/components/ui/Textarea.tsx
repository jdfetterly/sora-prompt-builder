/**
 * @FeatureID Foundation
 * @Purpose Textarea component with auto-resize and character count
 * @Spec /docs/DesignSpec.md Section 6 (Form Elements)
 * @Author Chat Bot Labs
 */

"use client";

import React, { useEffect, useRef, useId } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * Textarea component props
 * @extends React.TextareaHTMLAttributes<HTMLTextAreaElement>
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text displayed above the textarea. Optional. */
  label?: string;
  /** Helper text displayed below the textarea. Optional. */
  helperText?: string;
  /** Error message. When provided, textarea shows error state. Optional. */
  error?: string;
  /** Show success state (green border and checkmark). Default: false */
  success?: boolean;
  /** Display character count indicator. Requires maxLength. Default: false */
  showCharacterCount?: boolean;
  /** Maximum character length. Used with showCharacterCount. Optional. */
  maxLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      showCharacterCount = false,
      maxLength,
      className,
      value,
      onChange,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const hasError = !!error;
    const showSuccess = success && !hasError;
    const textareaId = id || `textarea-${generatedId}`;
    const helperId = (error || helperText) ? `${textareaId}-helper` : undefined;
    const countId = showCharacterCount && maxLength ? `${textareaId}-count` : undefined;

    // Combine refs - allows parent components to access textarea element via ref
    // Reference: React.useImperativeHandle for custom ref forwarding
    React.useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    // Auto-resize functionality
    // Dynamically adjusts textarea height based on content while respecting min/max constraints
    // Reference: DesignSpec.md Section 6 (Form Elements) - auto-resize with constraints
    useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Reset height to auto to get the correct scrollHeight
      // This is necessary because scrollHeight includes the current height
      textarea.style.height = "auto";
      
      // Set height based on content, with min and max constraints
      // minHeight and maxHeight match CSS min-h and max-h values
      const minHeight = 120; // min-height from design spec
      const maxHeight = 400; // max-height from design spec
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
      
      textarea.style.height = `${newHeight}px`;
    }, [value]);

    const characterCount = typeof value === "string" ? value.length : 0;
    const isNearLimit = maxLength && characterCount > maxLength * 0.9;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-text-primary mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={textareaRef}
            id={textareaId}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            className={cn(
              "w-full bg-background-secondary border rounded-base px-4 py-4",
              "min-h-[120px] md:min-h-[120px]",
              "text-text-primary placeholder:text-text-tertiary",
              "focus:outline-none focus:border-gold-primary focus:ring-2 focus:ring-gold-primary/20",
              "disabled:bg-background-primary disabled:text-text-tertiary disabled:border-border-subtle disabled:cursor-not-allowed",
              "resize-y max-h-[400px]",
              hasError && "border-error focus:border-error focus:ring-error/20",
              showSuccess && "border-success focus:border-success focus:ring-success/20",
              className
            )}
            aria-invalid={hasError}
            aria-describedby={[helperId, countId].filter(Boolean).join(" ") || undefined}
            {...props}
          />
          {hasError && (
            <AlertCircle className="absolute right-3 top-3 h-5 w-5 text-error" aria-hidden="true" />
          )}
          {showSuccess && (
            <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-success" aria-hidden="true" />
          )}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <div>
            {(error || helperText) && (
              <p
                id={helperId}
                className={cn(
                  "text-sm",
                  error ? "text-error" : "text-text-secondary"
                )}
                role={error ? "alert" : undefined}
              >
                {error || helperText}
              </p>
            )}
          </div>
          {showCharacterCount && maxLength && (
            <p
              id={countId}
              className={cn(
                "text-sm",
                isNearLimit ? "text-warning" : "text-text-tertiary"
              )}
              aria-live="polite"
            >
              {characterCount} / {maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

