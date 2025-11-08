/**
 * @FeatureID Foundation
 * @Purpose Badge component for status indicators
 * @Spec /docs/DesignSpec.md Section 6 (Badges & Tags)
 * @Author Chat Bot Labs
 */

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Badge component props
 * @extends React.HTMLAttributes<HTMLSpanElement>
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style variant. Default: "info" */
  variant?: "draft" | "complete" | "warning" | "info" | "error";
  /** Size variant. Default: "md" */
  size?: "sm" | "md";
  /** Optional icon displayed before badge text. Optional. */
  icon?: React.ReactNode;
  /** Badge text content. Required. */
  children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "info", size = "md", icon, className, children, ...props }, ref) => {
    const variants = {
      draft: "bg-info/15 text-info",
      complete: "bg-success/15 text-success",
      warning: "bg-warning/15 text-warning",
      info: "bg-info/15 text-info",
      error: "bg-error/15 text-error",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-3 py-1 text-sm",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-pill font-semibold",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

