/**
 * @FeatureID F-4, F-12
 * @Purpose Suggestion chips component with tooltips
 * @Spec /docs/DesignSpec.md Section 6 (Badges & Tags)
 * @Author Chat Bot Labs
 */

import React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";
import type { Suggestion } from "@/lib/suggestions";

/**
 * SuggestionChips component props
 */
export interface SuggestionChipsProps {
  /** Array of suggestion objects to display. Required. */
  suggestions: Suggestion[];
  /** Callback when a suggestion chip is clicked. Required. */
  onSelect: (text: string) => void;
  /** Additional CSS classes. Optional. */
  className?: string;
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  suggestions,
  onSelect,
  className,
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-text-secondary">Suggestions:</span>
      </div>
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
        {suggestions.map((suggestion, index) => (
          <Tooltip
            key={index}
            content={suggestion.tooltip || "Click to insert this suggestion"}
            placement="top"
          >
            <button
              onClick={() => onSelect(suggestion.text)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5",
                "bg-background-secondary border border-border-default rounded-pill",
                "text-sm text-text-primary",
                "hover:bg-background-tertiary hover:border-gold-primary",
                "active:bg-gold-muted active:border-gold-primary",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/50"
              )}
              type="button"
              aria-label={`Insert suggestion: ${suggestion.text}${suggestion.tooltip ? `. ${suggestion.tooltip}` : ""}`}
            >
              <span>{suggestion.text}</span>
              {suggestion.tooltip && (
                <Info className="h-3.5 w-3.5 text-text-tertiary flex-shrink-0" aria-hidden="true" />
              )}
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

