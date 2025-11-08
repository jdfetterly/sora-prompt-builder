/**
 * @FeatureID F-1
 * @Purpose Visual details step component
 * @Spec /docs/PRD.md Section 8.1 (Visual Details & Lighting)
 * @Author Chat Bot Labs
 */

import React, { memo, useMemo } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { SuggestionChips } from "@/components/builder/SuggestionChips";
import { getSuggestionsForStep } from "@/lib/suggestions";
import type { Prompt } from "@/lib/types";

/**
 * VisualDetailsStep component props
 */
export interface VisualDetailsStepProps {
  /** Current visual details value. Required. */
  value: string;
  /** Callback when value changes. Required. */
  onChange: (value: string) => void;
  /** Validation result for the field. Optional. */
  validation?: { level: "error" | "warning" | "success"; message: string } | null;
}

export const VisualDetailsStep: React.FC<VisualDetailsStepProps> = memo(({
  value,
  onChange,
  validation,
}) => {
  const suggestions = useMemo(() => getSuggestionsForStep("visualDetails"), []);

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-xl lg:text-2xl font-heading font-bold text-text-primary mb-2">
          Step 5: Visual Details & Lighting
        </h2>
        <p className="text-sm md:text-base text-text-secondary">
          Time of day, lighting, textures, and other key details. Lighting and texture details add realism and mood.
          <span className="text-text-tertiary text-xs md:text-sm ml-1">(Recommended: 60-200 words)</span>
        </p>
      </div>

      <Textarea
        label="Visual Details & Lighting"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Example: Golden hour lighting, casting long, sharp shadows. The texture of the spacesuit is slightly reflective."
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

VisualDetailsStep.displayName = "VisualDetailsStep";

export default VisualDetailsStep;

