/**
 * @FeatureID F-1
 * @Purpose Camera & shot step component
 * @Spec /docs/PRD.md Section 8.1 (Camera & Shot)
 * @Author Chat Bot Labs
 */

import React, { memo, useMemo } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { SuggestionChips } from "@/components/builder/SuggestionChips";
import { getSuggestionsForStep } from "@/lib/suggestions";
import type { Prompt } from "@/lib/types";

/**
 * CameraStep component props
 */
export interface CameraStepProps {
  /** Current camera shot value. Required. */
  value: string;
  /** Callback when value changes. Required. */
  onChange: (value: string) => void;
  /** Validation result for the field. Optional. */
  validation?: { level: "error" | "warning" | "success"; message: string } | null;
}

export const CameraStep: React.FC<CameraStepProps> = memo(({
  value,
  onChange,
  validation,
}) => {
  const suggestions = useMemo(() => getSuggestionsForStep("camera"), []);

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-xl lg:text-2xl font-heading font-bold text-text-primary mb-2">
          Step 4: Camera & Shot
        </h2>
        <p className="text-sm md:text-base text-text-secondary">
          The type of camera shot, angle, and movement. Combine shot type, angle, and movement for dynamic visuals.
          <span className="text-text-tertiary text-xs md:text-sm ml-1">(Recommended: 50-150 words)</span>
        </p>
      </div>

      <Textarea
        label="Camera & Shot"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Example: Medium shot, eye-level, smooth tracking shot that follows the subject..."
        showCharacterCount
        maxLength={500}
        error={validation?.level === "error" ? validation.message : undefined}
        helperText={validation?.level === "warning" ? validation.message : undefined}
        success={validation?.level === "success"}
        className="min-h-[200px]"
      />

      <SuggestionChips
        suggestions={suggestions}
        onSelect={onChange}
      />
    </div>
  );
});

CameraStep.displayName = "CameraStep";

export default CameraStep;

