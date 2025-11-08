/**
 * @FeatureID F-15.3
 * @Purpose Floating action button to open preview overlay on non-XL screens
 * @Spec /docs/features/context-memory-preview-sidebar.md
 * @Author Chat Bot Labs
 */

"use client";

import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Prompt } from "@/lib/types";

interface FloatingPreviewButtonProps {
  /** Current prompt to determine if button should pulse */
  prompt: Partial<Prompt>;
  
  /** Click handler to open preview overlay */
  onClick: () => void;
  
  /** Whether the button should be visible (responsive control) */
  isVisible?: boolean;
  
  /** Optional CSS classes */
  className?: string;
}

export const FloatingPreviewButton: React.FC<FloatingPreviewButtonProps> = ({
  prompt,
  onClick,
  isVisible = true,
  className,
}) => {
  // Check if prompt has any content (for pulse animation)
  const hasContent = !!(
    prompt.subject ||
    prompt.actionSetting ||
    prompt.cinematicStyle ||
    prompt.cameraShot ||
    prompt.visualDetails
  );

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open prompt preview"
      aria-expanded={false}
      className={cn(
        "fixed bottom-20 right-4 md:bottom-24 md:right-6",
        "w-14 h-14 rounded-full",
        "bg-gold-primary text-text-inverse",
        "flex items-center justify-center",
        "shadow-2xl hover:shadow-[0_6px_30px_rgba(212,175,55,0.6)]",
        "transition-all duration-200",
        "hover:scale-110 active:scale-95",
        "z-30 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary",
        hasContent && "animate-pulse-gold",
        className
      )}
    >
      <Eye className="h-6 w-6" aria-hidden="true" />
    </button>
  );
};

