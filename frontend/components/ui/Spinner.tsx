/**
 * @FeatureID Foundation
 * @Purpose Loading spinner component
 * @Spec /docs/DesignSpec.md Section 6 (Loading States)
 * @Author Chat Bot Labs
 */

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Spinner component props
 */
export interface SpinnerProps {
  /** Size variant. Default: "md" */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes. Optional. */
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = "md", className }) => {
  const sizes = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-3",
    lg: "h-16 w-16 border-4",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-gold-primary/20 border-t-gold-primary",
        sizes[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

