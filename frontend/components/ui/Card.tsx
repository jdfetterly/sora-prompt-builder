/**
 * @FeatureID Foundation
 * @Purpose Card component for content containers
 * @Spec /docs/DesignSpec.md Section 6 (Cards)
 * @Author Chat Bot Labs
 */

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Card component props
 * @extends React.HTMLAttributes<HTMLDivElement>
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Padding variant. Default: "default" */
  variant?: "default" | "compact" | "spacious";
  /** Enable hover lift effect. Default: false */
  hover?: boolean;
  /** Card content. Required. */
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", hover = false, className, children, ...props }, ref) => {
    const paddingVariants = {
      default: "p-6",
      compact: "p-4",
      spacious: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-background-secondary border border-border-subtle rounded-md",
          paddingVariants[variant],
          hover && "transition-all duration-200 hover:border-border-default hover:shadow-elevated hover:-translate-y-0.5",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

