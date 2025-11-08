/**
 * @FeatureID F-1
 * @Purpose Subject step component
 * @Spec /docs/PRD.md Section 8.1 (Subject)
 * @Author Chat Bot Labs
 */

import React, { memo, useMemo } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { SuggestionChips } from "@/components/builder/SuggestionChips";
import { getSuggestionsForStep } from "@/lib/suggestions";
import { validateField } from "@/lib/validation";
import type { Prompt } from "@/lib/types";

/**
 * SubjectStep component props
 */
export interface SubjectStepProps {
  /** Current subject value. Required. */
  value: string;
  /** Callback when subject value changes. Required. */
  onChange: (value: string) => void;
  /** Validation result for the field. Optional. */
  validation?: { level: "error" | "warning" | "success"; message: string } | null;
}

export const SubjectStep: React.FC<SubjectStepProps> = memo(({
  value,
  onChange,
  validation,
}) => {
  const suggestions = useMemo(() => getSuggestionsForStep("subject"), []);
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-xl lg:text-2xl font-heading font-bold text-text-primary mb-2">
          Step 1: Subject
        </h2>
        <p className="text-sm md:text-base text-text-secondary">
          Describe the main character, object, or element of focus. Be specific and detailed.
          <span className="text-text-tertiary text-xs md:text-sm ml-1">(Recommended: 50-150 words)</span>
        </p>
      </div>

      <Textarea
        label="Subject"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Example: A golden retriever wearing a vintage space helmet..."
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

SubjectStep.displayName = "SubjectStep";

export default SubjectStep;

