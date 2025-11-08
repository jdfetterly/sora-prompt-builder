/**
 * @FeatureID F-15.2
 * @Purpose Expandable accordion showing completed prompt fields for context
 * @Spec /docs/features/context-memory-accordion.md
 * @Author Chat Bot Labs
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Prompt } from "@/lib/types";

interface PromptSummaryAccordionProps {
  /** Current prompt object with all field values */
  prompt: Partial<Prompt>;
  
  /** Current step number (1-5) to determine which fields to show */
  currentStep: number;
  
  /** Optional callback when accordion state changes */
  onToggle?: (expanded: boolean) => void;
  
  /** Optional CSS classes */
  className?: string;
}

export const PromptSummaryAccordion: React.FC<PromptSummaryAccordionProps> = ({
  prompt,
  currentStep,
  onToggle,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Field configuration
  const stepToFieldMap: Record<number, Array<keyof Prompt>> = {
    1: [],
    2: ["subject"],
    3: ["subject", "actionSetting"],
    4: ["subject", "actionSetting", "cinematicStyle"],
    5: ["subject", "actionSetting", "cinematicStyle", "cameraShot"],
  };
  
  const fieldLabels: Record<string, string> = {
    subject: "Subject",
    actionSetting: "Action & Setting",
    cinematicStyle: "Cinematic Style",
    cameraShot: "Camera & Shot",
    visualDetails: "Visual Details",
  };
  
  // Get fields to display
  const fieldsToShow = stepToFieldMap[currentStep] || [];
  const completedCount = fieldsToShow.length;
  
  // sessionStorage key
  const storageKey = `sora-accordion-step-${currentStep}`;
  
  // Load saved state on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const { expanded } = JSON.parse(saved);
        setIsExpanded(expanded);
      }
    } catch (error) {
      console.warn("Failed to load accordion state:", error);
    }
  }, [storageKey]);
  
  // Toggle handler
  const handleToggle = useCallback(() => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({
        expanded: newState,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.warn("Failed to save accordion state:", error);
    }
    
    onToggle?.(newState);
  }, [isExpanded, storageKey, onToggle]);
  
  // Don't render if no fields to show
  if (fieldsToShow.length === 0) {
    return null;
  }
  
  return (
    <div
      className={cn(
        "bg-background-secondary border border-divider rounded-base overflow-hidden",
        className
      )}
      role="region"
      aria-labelledby="accordion-header"
    >
      {/* Header */}
      <button
        id="accordion-header"
        type="button"
        onClick={handleToggle}
        aria-expanded={isExpanded}
        aria-controls="accordion-content"
        className={cn(
          "w-full px-4 py-3 md:px-5 md:py-4",
          "flex items-center justify-between",
          "cursor-pointer transition-colors duration-200",
          "hover:bg-background-tertiary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-inset"
        )}
      >
        <div className="flex items-center gap-3">
          <ChevronRight
            className={cn(
              "h-5 w-5 text-text-tertiary transition-transform duration-300",
              isExpanded && "rotate-90"
            )}
            aria-hidden="true"
          />
          <h3 className="text-base md:text-lg font-semibold text-text-primary">
            Your Prompt So Far
          </h3>
        </div>
        <span className="text-sm text-text-tertiary font-medium">
          [{completedCount}/5]
        </span>
      </button>
      
      {/* Content */}
      <div
        id="accordion-content"
        role="region"
        aria-labelledby="accordion-header"
        hidden={!isExpanded}
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded
            ? "max-h-[60vh] md:max-h-[50vh] lg:max-h-[400px] overflow-y-auto"
            : "max-h-0"
        )}
      >
        <div className="p-4 md:p-5 space-y-4">
          {fieldsToShow.map((field) => {
            const value = prompt[field];
            if (!value) return null;
            
            return (
              <div key={field} className="space-y-1">
                <div className="text-xs uppercase tracking-wide text-text-tertiary font-medium">
                  {fieldLabels[field]}
                </div>
                <div className="text-sm md:text-base text-text-primary whitespace-pre-wrap leading-relaxed">
                  {value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

