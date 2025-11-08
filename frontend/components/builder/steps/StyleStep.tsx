/**
 * @FeatureID F-1
 * @Purpose Cinematic style step component
 * @Spec /docs/PRD.md Section 8.1 (Cinematic Style)
 * @Author Chat Bot Labs
 */

import React, { memo, useMemo } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { SuggestionChips } from "@/components/builder/SuggestionChips";
import { getSuggestionsForStep } from "@/lib/suggestions";
import type { Prompt } from "@/lib/types";

/**
 * StyleStep component props
 */
export interface StyleStepProps {
  /** Current cinematic style value. Required. */
  value: string;
  /** Callback when value changes. Required. */
  onChange: (value: string) => void;
  /** Validation result for the field. Optional. */
  validation?: { level: "error" | "warning" | "success"; message: string } | null;
}

export const StyleStep: React.FC<StyleStepProps> = memo(({
  value,
  onChange,
  validation,
}) => {
  const suggestions = useMemo(() => getSuggestionsForStep("style"), []);

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-xl lg:text-2xl font-heading font-bold text-text-primary mb-2">
          Step 3: Cinematic Style
        </h2>
        <p className="text-sm md:text-base text-text-secondary">
          The overall aesthetic, artist reference, or film genre. Reference specific directors or styles for best results.
          <span className="text-text-tertiary text-xs md:text-sm ml-1">(Recommended: 60-150 words)</span>
        </p>
      </div>

      <Textarea
        label="Cinematic Style"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Example: In the style of a Wes Anderson film, highly symmetrical, high-contrast..."
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

StyleStep.displayName = "StyleStep";

export default StyleStep;

