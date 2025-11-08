/**
 * @FeatureID F-1, F-14
 * @Purpose Step navigation sidebar component with mobile and tablet responsive design
 * @Spec /docs/DesignSpec.md Section 6 (Navigation), Section 22 (Responsive Adaptations)
 * @Author Chat Bot Labs
 */

"use client";

import React, { useRef, useEffect, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * StepNav component props
 */
export interface StepNavProps {
  /** Currently active step number (1-based). Required. */
  currentStep: number;
  /** Array of completed step numbers. Required. */
  completedSteps: number[];
  /** Callback when a step is clicked. Required. */
  onStepClick: (step: number) => void;
  /** Additional CSS classes. Optional. */
  className?: string;
}

const stepLabels = [
  "Subject",
  "Action & Setting",
  "Cinematic Style",
  "Camera & Shot",
  "Visual Details",
];

export const StepNav: React.FC<StepNavProps> = ({
  currentStep,
  completedSteps,
  onStepClick,
  className,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef<HTMLButtonElement>(null);
  const [tabletExpanded, setTabletExpanded] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Scroll active step into view on mobile
  useEffect(() => {
    if (activeStepRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeElement = activeStepRef.current;
      const containerRect = container.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();
      
      const scrollLeft = elementRect.left - containerRect.left - (containerRect.width / 2) + (elementRect.width / 2);
      container.scrollTo({
        left: container.scrollLeft + scrollLeft,
        behavior: "smooth",
      });
    }
  }, [currentStep]);

  // Close tablet sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        tabletExpanded
      ) {
        setTabletExpanded(false);
      }
    };

    if (tabletExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [tabletExpanded]);

  const renderStepButtons = () => {
    return stepLabels.map((label, index) => {
      const stepNumber = index + 1;
      const isActive = currentStep === stepNumber;
      const isCompleted = completedSteps.includes(stepNumber);
      const isAccessible = isCompleted || stepNumber <= currentStep;

      return (
        <button
          key={stepNumber}
          onClick={() => {
            if (isAccessible) {
              onStepClick(stepNumber);
              setTabletExpanded(false);
            }
          }}
          disabled={!isAccessible}
          className={cn(
            "w-full text-left px-4 py-3 rounded-base transition-all duration-200",
            "flex items-center gap-3",
            isActive &&
              "bg-gold-muted text-gold-primary border-l-4 border-gold-primary",
            !isActive &&
              isCompleted &&
              "text-text-primary hover:bg-white/5",
            !isActive &&
              !isCompleted &&
              "text-text-secondary hover:bg-white/5",
            !isAccessible && "opacity-50 cursor-not-allowed"
          )}
          aria-label={`${isActive ? "Current step: " : ""}Step ${stepNumber}: ${label}${isCompleted && !isActive ? " (completed)" : ""}${!isAccessible ? " (locked)" : ""}`}
          aria-current={isActive ? "step" : undefined}
        >
          <div
            className={cn(
              "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
              isActive && "bg-gold-primary text-text-inverse",
              isCompleted && !isActive && "bg-success text-text-inverse",
              !isCompleted && !isActive && "bg-background-tertiary text-text-secondary"
            )}
            aria-hidden="true"
          >
            {isCompleted && !isActive ? (
              <Check className="h-4 w-4" />
            ) : (
              stepNumber
            )}
          </div>
          <span className="flex-1 text-sm font-medium">{label}</span>
        </button>
      );
    });
  };

  return (
    <>
      {/* Tablet Collapsible Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          "hidden md:block lg:hidden fixed left-0 top-16 h-[calc(100vh-4rem)] z-40",
          "transition-all duration-300 ease-in-out",
          tabletExpanded ? "w-60" : "w-16"
        )}
      >
        <div className="h-full bg-background-primary border-r border-divider flex flex-col">
          {/* Toggle Button */}
          <button
            onClick={() => setTabletExpanded(!tabletExpanded)}
            className={cn(
              "w-full p-4 flex items-center justify-center",
              "text-text-secondary hover:text-text-primary transition-colors",
              "border-b border-divider",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary"
            )}
            aria-label={tabletExpanded ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={tabletExpanded}
          >
            <ChevronRight
              className={cn(
                "h-5 w-5 transition-transform duration-300",
                tabletExpanded && "rotate-180"
              )}
            />
          </button>

          {/* Sidebar Content */}
          <div
            className={cn(
              "flex-1 overflow-y-auto transition-opacity duration-300",
              tabletExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <div className="p-4 space-y-1">{renderStepButtons()}</div>

            <div className="mt-8 pt-8 border-t border-divider px-4">
              <div className="text-xs text-text-tertiary uppercase tracking-wide mb-2">
                Progress
              </div>
              <div className="text-sm text-text-secondary" aria-live="polite" aria-atomic="true">
                Step {currentStep} of {stepLabels.length}
              </div>
              <div className="mt-2 w-full h-1.5 bg-background-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-primary to-gold-light transition-all duration-300"
                  style={{ width: `${(currentStep / stepLabels.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Icon-only view when collapsed */}
          <div
            className={cn(
              "flex flex-col items-center gap-2 p-2",
              "transition-opacity duration-300",
              tabletExpanded ? "opacity-0 pointer-events-none absolute" : "opacity-100"
            )}
          >
            {stepLabels.map((_, index) => {
              const stepNumber = index + 1;
              const isActive = currentStep === stepNumber;
              const isCompleted = completedSteps.includes(stepNumber);

              return (
                <button
                  key={stepNumber}
                  onClick={() => {
                    if (completedSteps.includes(stepNumber) || stepNumber <= currentStep) {
                      onStepClick(stepNumber);
                    }
                  }}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                    isActive && "bg-gold-primary text-text-inverse ring-2 ring-gold-primary ring-offset-2 ring-offset-background-primary",
                    isCompleted && !isActive && "bg-success text-text-inverse",
                    !isCompleted && !isActive && "bg-background-tertiary text-text-secondary",
                    "hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary"
                  )}
                  aria-label={`Step ${stepNumber}: ${stepLabels[index]}`}
                >
                  {isCompleted && !isActive ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    stepNumber
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overlay when expanded */}
        {tabletExpanded && (
          <div
            className="fixed inset-0 bg-background-primary/50 backdrop-blur-sm z-[-1]"
            onClick={() => setTabletExpanded(false)}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside
        id="navigation"
        className={cn(
          "hidden lg:block w-60 bg-background-primary border-r border-divider p-4",
          "fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto z-40",
          className
        )}
        aria-label="Step navigation"
      >
        <div className="space-y-1">{renderStepButtons()}</div>

        <div className="mt-8 pt-8 border-t border-divider">
          <div className="text-xs text-text-tertiary uppercase tracking-wide mb-2">
            Progress
          </div>
          <div className="text-sm text-text-secondary" aria-live="polite" aria-atomic="true">
            Step {currentStep} of {stepLabels.length}
          </div>
          <div className="mt-2 w-full h-1.5 bg-background-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-primary to-gold-light transition-all duration-300"
              style={{ width: `${(currentStep / stepLabels.length) * 100}%` }}
            />
          </div>
        </div>
      </aside>

      {/* Mobile Horizontal Navigation */}
      <div className="md:hidden sticky top-14 z-30 bg-background-primary border-b border-divider">
        <div className="px-4 py-3">
          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-3">
            {stepLabels.map((_, index) => {
              const stepNumber = index + 1;
              const isActive = currentStep === stepNumber;
              const isCompleted = completedSteps.includes(stepNumber);
              
              return (
                <div
                  key={stepNumber}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    isActive && "w-8 bg-gold-primary",
                    !isActive && isCompleted && "w-1.5 bg-success",
                    !isActive && !isCompleted && "w-1.5 bg-background-tertiary"
                  )}
                />
              );
            })}
          </div>

          {/* Horizontal Scrollable Steps */}
          <div
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {stepLabels.map((label, index) => {
              const stepNumber = index + 1;
              const isActive = currentStep === stepNumber;
              const isCompleted = completedSteps.includes(stepNumber);
              const isAccessible = isCompleted || stepNumber <= currentStep;

              return (
                <button
                  key={stepNumber}
                  ref={isActive ? activeStepRef : null}
                  onClick={() => isAccessible && onStepClick(stepNumber)}
                  disabled={!isAccessible}
                  className={cn(
                    "flex-shrink-0 px-4 py-2.5 rounded-base transition-all duration-200",
                    "flex items-center gap-2 min-h-[48px]",
                    isActive &&
                      "bg-gold-muted text-gold-primary border-2 border-gold-primary",
                    !isActive &&
                      isCompleted &&
                      "bg-background-secondary text-text-primary border-2 border-success",
                    !isActive &&
                      !isCompleted &&
                      "bg-background-secondary text-text-secondary border-2 border-background-tertiary",
                    !isAccessible && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div
                    className={cn(
                      "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
                      isActive && "bg-gold-primary text-text-inverse",
                      isCompleted && !isActive && "bg-success text-text-inverse",
                      !isCompleted && !isActive && "bg-background-tertiary text-text-secondary"
                    )}
                  >
                    {isCompleted && !isActive ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

