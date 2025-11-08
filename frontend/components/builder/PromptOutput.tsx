/**
 * @FeatureID F-5, F-14
 * @Purpose Prompt output preview component with mobile responsive design
 * @Spec /docs/PRD.md F-5, DesignSpec.md Section 6 (Cards), Section 22 (Responsive Adaptations)
 * @Author Chat Bot Labs
 */

"use client";

import React, { useMemo, useState, memo } from "react";
import { Copy, Check, ChevronUp, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { assemblePrompt } from "@/lib/promptFormatter";
import { copyPromptToClipboard } from "@/lib/promptFormatter";
import type { Prompt } from "@/lib/types";
import { PromptStatus, ExportFormat } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * PromptOutput component props
 */
export interface PromptOutputProps {
  /** Partial prompt data to display. Required. */
  prompt: Partial<Prompt>;
  /** Additional CSS classes. Optional. */
  className?: string;
}

export const PromptOutput: React.FC<PromptOutputProps> = memo(({
  prompt,
  className,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const assembledText = useMemo(() => {
    if (!prompt.subject && !prompt.actionSetting) {
      return "Your assembled prompt will appear here as you fill in the fields...";
    }

    const fullPrompt: Prompt = {
      id: prompt.id || "",
      subject: prompt.subject || "",
      actionSetting: prompt.actionSetting || "",
      cinematicStyle: prompt.cinematicStyle || "",
      cameraShot: prompt.cameraShot || "",
      visualDetails: prompt.visualDetails || "",
      createdAt: prompt.createdAt || Date.now(),
      lastModified: prompt.lastModified || Date.now(),
      status: prompt.status || PromptStatus.DRAFT,
    };

    return assemblePrompt(fullPrompt);
  }, [prompt]);

  const handleCopy = async () => {
    const fullPrompt: Prompt = {
      id: prompt.id || "",
      subject: prompt.subject || "",
      actionSetting: prompt.actionSetting || "",
      cinematicStyle: prompt.cinematicStyle || "",
      cameraShot: prompt.cameraShot || "",
      visualDetails: prompt.visualDetails || "",
      createdAt: prompt.createdAt || Date.now(),
      lastModified: prompt.lastModified || Date.now(),
      status: prompt.status || PromptStatus.DRAFT,
    };

    const success = await copyPromptToClipboard({
      format: ExportFormat.TEXT,
      content: assembledText,
      filename: "prompt.txt",
    });

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      // Note: In a production app, you might want to show a toast error here
      // For Phase 1, we silently fail as clipboard API may not be available in all contexts
      console.warn("Failed to copy prompt to clipboard. The clipboard API may not be available.");
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileDrawerOpen(true)}
        className={cn(
          "xl:hidden fixed bottom-4 right-4 z-40",
          "bg-gradient-to-br from-gold-primary to-gold-dark text-text-inverse",
          "rounded-full p-4 shadow-floating",
          "flex items-center gap-2 min-h-[56px]",
          "hover:from-gold-light hover:to-gold-primary transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary"
        )}
        aria-label="View formatted output"
      >
        <ChevronUp className="h-5 w-5" aria-hidden="true" />
        <span className="text-sm font-medium">Preview</span>
      </button>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div
          className={cn(
            "xl:hidden fixed inset-0 z-50 bg-background-primary",
            "flex flex-col animate-slideUp"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-divider">
            <h3 className="text-base font-semibold text-text-primary uppercase tracking-wide">
              Formatted Output
            </h3>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2 min-h-[44px]"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-success text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </Button>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-base min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="bg-background-secondary border border-border-default rounded-base p-4">
              <pre 
                className="text-sm font-mono text-text-primary whitespace-pre-wrap break-words"
                aria-live="polite"
                aria-atomic="true"
              >
                {assembledText}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <Card className={cn("hidden xl:block sticky bottom-6", className)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
            Formatted Output
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-success" />
                <span className="text-success">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>
        <div className="bg-background-primary border border-border-default rounded-base p-4 max-h-[400px] overflow-y-auto">
          <pre 
            className="text-sm font-mono text-text-primary whitespace-pre-wrap break-words"
            aria-live="polite"
            aria-atomic="true"
          >
            {assembledText}
          </pre>
        </div>
      </Card>
    </>
  );
});

PromptOutput.displayName = "PromptOutput";

