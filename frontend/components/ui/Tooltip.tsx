/**
 * @FeatureID F-12
 * @Purpose Tooltip component with auto-positioning
 * @Spec /docs/DesignSpec.md Section 6 (Modals & Overlays)
 * @Author Chat Bot Labs
 */

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * Tooltip component props
 */
export interface TooltipProps {
  /** Tooltip text content. Required. */
  content: string;
  /** Element that triggers the tooltip on hover/focus. Required. */
  children: React.ReactNode;
  /** Placement position relative to trigger. Default: "top" */
  placement?: "top" | "bottom" | "left" | "right";
  /** Delay before showing tooltip in milliseconds. Default: 500 */
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = "top",
  delay = 500,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const offset = 8;

    let top = 0;
    let left = 0;

    switch (placement) {
      case "top":
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case "bottom":
        top = triggerRect.bottom + offset;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case "left":
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left - tooltipRect.width - offset;
        break;
      case "right":
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right + offset;
        break;
    }

    // Adjust if tooltip goes off screen
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 0) left = 8;
    if (left + tooltipRect.width > viewportWidth) {
      left = viewportWidth - tooltipRect.width - 8;
    }
    if (top < 0) top = 8;
    if (top + tooltipRect.height > viewportHeight) {
      top = viewportHeight - tooltipRect.height - 8;
    }

    setPosition({ top, left });
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      setTimeout(updatePosition, 0);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
    setPosition(null);
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isVisible]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      className="inline-block"
    >
      {children}
      {isVisible && position && (
        <div
          ref={tooltipRef}
          className="fixed z-50 px-3 py-2 text-sm text-text-primary bg-background-elevated border border-border-default rounded-base shadow-elevated max-w-[280px] pointer-events-none animate-fadeIn"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
          role="tooltip"
        >
          {content}
          {/* Arrow */}
          <div
            className={cn(
              "absolute w-0 h-0 border-4 border-transparent",
              placement === "top" && "top-full left-1/2 -translate-x-1/2 border-t-background-elevated",
              placement === "bottom" && "bottom-full left-1/2 -translate-x-1/2 border-b-background-elevated",
              placement === "left" && "left-full top-1/2 -translate-y-1/2 border-l-background-elevated",
              placement === "right" && "right-full top-1/2 -translate-y-1/2 border-r-background-elevated"
            )}
          />
        </div>
      )}
    </div>
  );
};

