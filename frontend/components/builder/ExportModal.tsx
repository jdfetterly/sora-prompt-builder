/**
 * @FeatureID F-9
 * @Purpose Export modal component
 * @Spec /docs/PRD.md F-9
 * @Author Chat Bot Labs
 */

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Copy, Download } from "lucide-react";
import { formatPrompt, downloadPrompt, copyPromptToClipboard } from "@/lib/promptFormatter";
import type { Prompt } from "@/lib/types";
import { ExportFormat } from "@/lib/types";

/**
 * ExportModal component props
 */
export interface ExportModalProps {
  /** Whether the modal is open. Required. */
  isOpen: boolean;
  /** Callback when modal should close. Required. */
  onClose: () => void;
  /** Complete prompt data to export. Required. */
  prompt: Prompt;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  prompt,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(ExportFormat.TEXT);
  const [copied, setCopied] = useState(false);

  const formatted = formatPrompt(prompt, selectedFormat);

  const handleCopy = async () => {
    const success = await copyPromptToClipboard(formatted);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadPrompt(formatted);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Prompt"
      size="lg"
    >
      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-3">
            {Object.values(ExportFormat).map((format) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format)}
                className={`
                  px-4 py-3 rounded-base border transition-all duration-200
                  ${
                    selectedFormat === format
                      ? "border-gold-primary bg-gold-muted text-gold-primary"
                      : "border-border-default bg-background-secondary text-text-primary hover:border-border-accent"
                  }
                `}
              >
                <span className="text-sm font-medium capitalize">{format}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Preview
          </label>
          <div className="bg-background-primary border border-border-default rounded-base p-4 max-h-[400px] overflow-y-auto">
            <pre className="text-sm font-mono text-text-primary whitespace-pre-wrap break-words">
              {formatted.content}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={handleCopy}
            className="flex items-center gap-2 flex-1"
          >
            {copied ? (
              <>
                <span className="text-success">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
          <Button
            variant="primary"
            onClick={handleDownload}
            className="flex items-center gap-2 flex-1"
          >
            <Download className="h-4 w-4" />
            Download File
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;

