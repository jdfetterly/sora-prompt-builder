/**
 * @FeatureID F-1
 * @Purpose Action/Setting step component
 * @Spec /docs/PRD.md Section 8.1 (Action/Setting)
 * @Author Chat Bot Labs
 */

import React, { memo, useMemo } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { SuggestionChips } from "@/components/builder/SuggestionChips";
import { getSuggestionsForStep } from "@/lib/suggestions";
import type { Prompt } from "@/lib/types";

/**
 * ActionSettingStep component props
 */
export interface ActionSettingStepProps {
  /** Current action/setting value. Required. */
  value: string;
  /** Callback when value changes. Required. */
  onChange: (value: string) => void;
  /** Validation result for the field. Optional. */
  validation?: { level: "error" | "warning" | "success"; message: string } | null;
}

export const ActionSettingStep: React.FC<ActionSettingStepProps> = memo(({
  value,
  onChange,
  validation,
}) => {
  const suggestions = useMemo(() => getSuggestionsForStep("actionSetting"), []);

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-xl lg:text-2xl font-heading font-bold text-text-primary mb-2">
          Step 2: Action & Setting
        </h2>
        <p className="text-sm md:text-base text-text-secondary">
          What is happening and where the scene takes place. Combine action with location for clarity.
          <span className="text-text-tertiary text-xs md:text-sm ml-1">(Recommended: 80-200 words)</span>
        </p>
      </div>

      <Textarea
        label="Action & Setting"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Example: trotting happily on the dusty, red surface of Mars..."
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

ActionSettingStep.displayName = "ActionSettingStep";

export default ActionSettingStep;

