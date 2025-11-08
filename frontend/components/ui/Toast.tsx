/**
 * @FeatureID Foundation
 * @Purpose Toast notification component
 * @Spec /docs/DesignSpec.md Section 12 (States & Feedback)
 * @Author Chat Bot Labs
 */

import React, { useEffect, useState } from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

/** Toast notification type */
export type ToastType = "success" | "error" | "info" | "warning";

/**
 * Toast component props
 */
export interface ToastProps {
  /** Unique identifier for the toast. Required. */
  id: string;
  /** Visual style type. Required. */
  type: ToastType;
  /** Toast message text. Required. */
  message: string;
  /** Auto-dismiss duration in milliseconds. Default: 5000 */
  duration?: number;
  /** Callback function called when toast should close. Required. */
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const borderColors = {
  success: "border-l-success",
  error: "border-l-error",
  info: "border-l-info",
  warning: "border-l-warning",
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = icons[type];

  useEffect(() => {
    // Trigger slide-in animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto-dismiss
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 w-full max-w-sm bg-background-elevated border border-border-default rounded-md p-4 shadow-floating transition-all duration-300",
        `border-l-4 ${borderColors[type]}`,
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
      role="alert"
      aria-live="polite"
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", `text-${type}`)} />
      <p className="flex-1 text-sm text-text-primary">{message}</p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-base transition-colors"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Toast Container Component
export interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    message: string;
  }>;
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-6 right-6 z-50 flex flex-col gap-3"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

