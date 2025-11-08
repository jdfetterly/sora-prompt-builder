/**
 * @FeatureID Foundation
 * @Purpose Skeleton loader component for loading states
 * @Spec /docs/DesignSpec.md Section 6 (Loading States)
 * @Author Chat Bot Labs
 */

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Skeleton loader component props
 */
export interface SkeletonProps {
  /** Additional CSS classes. Optional. */
  className?: string;
  /** Shape variant. Default: "rectangular" */
  variant?: "text" | "rectangular" | "circular";
  /** Width (CSS value or number in pixels). Optional. */
  width?: string | number;
  /** Height (CSS value or number in pixels). Optional. */
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  width,
  height,
}) => {
  const baseStyles = "animate-pulse bg-background-secondary rounded-base";
  
  const variantStyles = {
    text: "h-4 rounded",
    rectangular: "rounded-base",
    circular: "rounded-full",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      style={style}
      aria-hidden="true"
    />
  );
};

