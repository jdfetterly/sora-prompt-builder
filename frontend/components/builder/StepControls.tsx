/**
 * @FeatureID F-1
 * @Purpose Step navigation controls component
 * @Author Chat Bot Labs
 */

import React from "react";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * StepControls component props
 */
export interface StepControlsProps {
  /** Current step number (1-based). Required. */
  currentStep: number;
  /** Total number of steps. Required. */
  totalSteps: number;
  /** Whether user can proceed to next step. Required. */
  canContinue: boolean;
  /** Callback when Back button is clicked. Required. */
  onBack: () => void;
  /** Callback when Continue button is clicked. Required. */
  onNext: () => void;
  /** Callback when Save Draft link is clicked. Required. */
  onSaveDraft: () => void;
  /** Whether this is the last step. Default: false */
  isLastStep?: boolean;
}

export const StepControls: React.FC<StepControlsProps> = ({
  currentStep,
  totalSteps,
  canContinue,
  onBack,
  onNext,
  onSaveDraft,
  isLastStep = false,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-6 border-t border-divider">
      <Button
        variant="secondary"
        onClick={onBack}
        disabled={currentStep === 1}
        className="flex items-center justify-center gap-2 w-full md:w-auto min-h-[48px] md:min-h-[44px]"
        aria-label={currentStep === 1 ? "Cannot go back, already on first step" : `Go back to step ${currentStep - 1}`}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span>Back</span>
      </Button>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 w-full md:w-auto">
        <button
          onClick={onSaveDraft}
          className="text-sm text-text-secondary hover:text-text-primary transition-colors py-3 md:py-0 min-h-[48px] md:min-h-0 flex items-center justify-center md:justify-start"
          type="button"
          aria-label="Save current draft"
        >
          Save Draft
        </button>
        <Button
          variant="primary"
          onClick={onNext}
          disabled={!canContinue}
          className="flex items-center justify-center gap-2 w-full md:w-auto min-h-[48px] md:min-h-[44px]"
          aria-label={!canContinue ? "Cannot continue, please complete required fields" : isLastStep ? "Complete prompt" : `Continue to step ${currentStep + 1}`}
        >
          <span>{isLastStep ? "Complete" : "Continue"}</span>
          {!isLastStep && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </Button>
      </div>
    </div>
  );
};

