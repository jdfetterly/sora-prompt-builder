/**
 * @FeatureID F-15.3
 * @Purpose Full-screen overlay with slide-in panel for preview
 * @Spec /docs/features/context-memory-preview-sidebar.md
 * @Author Chat Bot Labs
 */

"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PromptOutput } from "@/components/builder/PromptOutput";
import type { Prompt } from "@/lib/types";

interface PreviewOverlayProps {
  /** Controls overlay visibility */
  isOpen: boolean;
  
  /** Callback when overlay should close */
  onClose: () => void;
  
  /** Prompt data to pass to PromptOutput */
  prompt: Partial<Prompt>;
  
  /** Optional CSS classes */
  className?: string;
}

export const PreviewOverlay: React.FC<PreviewOverlayProps> = ({
  isOpen,
  onClose,
  prompt,
  className,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ESC key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
      onClick={handleBackdropClick}
      className={cn(
        "fixed inset-0 bg-background-primary/75 backdrop-blur-sm z-50",
        "animate-fadeIn",
        className
      )}
    >
      <div
        className={cn(
          "fixed top-0 right-0 h-screen",
          "w-screen md:w-2/3 lg:w-[480px]",
          "bg-background-primary border-l border-divider",
          "shadow-[-8px_0_40px_rgba(0,0,0,0.5)]",
          "flex flex-col",
          "animate-slideInRight"
        )}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-divider flex items-center justify-between flex-shrink-0">
          <h2
            id="preview-title"
            className="text-lg font-semibold text-text-primary"
          >
            Preview
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className={cn(
              "text-text-secondary hover:text-text-primary transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary rounded"
            )}
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div
          role="region"
          aria-label="Prompt preview content"
          className="flex-1 overflow-y-auto p-5 md:p-6"
        >
          <PromptOutput prompt={prompt} />
        </div>
      </div>
    </div>
  );
};

