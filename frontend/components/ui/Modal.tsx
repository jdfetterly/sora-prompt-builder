/**
 * @FeatureID Foundation
 * @Purpose Modal component with backdrop, focus trap, and keyboard support
 * @Spec /docs/DesignSpec.md Section 6 (Modals & Overlays)
 * @Author Chat Bot Labs
 */

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

/**
 * Modal component props
 */
export interface ModalProps {
  /** Whether the modal is open. Required. */
  isOpen: boolean;
  /** Callback function called when modal should close. Required. */
  onClose: () => void;
  /** Modal title displayed in header. Optional. */
  title?: string;
  /** Modal content. Required. */
  children: React.ReactNode;
  /** Modal width size. Default: "md" */
  size?: "sm" | "md" | "lg";
  /** Show close button (X) in header. Default: true */
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Focus trap - keeps keyboard focus within the modal for accessibility
  // Reference: WCAG 2.1 AA - modals must trap focus (DesignSpec.md Section 11)
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    // Save previous active element to restore focus when modal closes
    // This improves UX by returning focus to where user was before opening modal
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus first focusable element in modal
    // Query selector matches standard focusable elements (buttons, links, inputs, etc.)
    // Excludes elements with tabindex="-1" (programmatically focusable but not in tab order)
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    if (firstElement) {
      firstElement.focus();
    }

    // Trap focus - prevent Tab from moving focus outside modal
    // When Tab is pressed on last element, wrap to first
    // When Shift+Tab is pressed on first element, wrap to last
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !modalRef.current) return;

      const focusableElements = Array.from(
        modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ) as HTMLElement[];

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab (backward tab) - wrap from first to last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab (forward tab) - wrap from last to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);

    return () => {
      document.removeEventListener("keydown", handleTab);
      // Restore focus to element that was active before modal opened
      previousActiveElement.current?.focus();
    };
  }, [isOpen]);

  // Prevent body scroll when modal is open
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

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          "relative z-10 w-full bg-background-secondary border border-border-default rounded-lg shadow-floating p-8",
          sizes[size]
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between mb-6">
            {title && (
              <h2 id="modal-title" className="text-2xl font-heading font-bold text-text-primary">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto p-2 text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-base transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="text-text-primary">{children}</div>
      </div>
    </div>
  );
};

