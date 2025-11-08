/**
 * @FeatureID F-5, F-9
 * @Purpose Prompt formatting and export functions
 * @Spec /docs/PRD.md F-5, F-9
 * @Author Chat Bot Labs
 */

import type { Prompt, FormattedPrompt } from "./types";
import { ExportFormat } from "./types";

/**
 * Assemble all prompt fields into a natural language sentence.
 * Combines all non-empty fields with proper punctuation and transitions.
 * 
 * @param prompt - Complete prompt object with all fields
 * @returns Assembled prompt as a single sentence string
 * @example
 * const assembled = assemblePrompt({
 *   subject: "A golden retriever",
 *   actionSetting: "walking on Mars",
 *   // ... other fields
 * });
 * // Returns: "A golden retriever. walking on Mars."
 */
export function assemblePrompt(prompt: Prompt): string {
  const parts: string[] = [];

  // Subject (required)
  if (prompt.subject.trim()) {
    parts.push(prompt.subject.trim());
  }

  // Action/Setting
  if (prompt.actionSetting.trim()) {
    parts.push(prompt.actionSetting.trim());
  }

  // Cinematic Style
  if (prompt.cinematicStyle.trim()) {
    parts.push(prompt.cinematicStyle.trim());
  }

  // Camera & Shot
  if (prompt.cameraShot.trim()) {
    parts.push(prompt.cameraShot.trim());
  }

  // Visual Details & Lighting
  if (prompt.visualDetails.trim()) {
    parts.push(prompt.visualDetails.trim());
  }

  // Join with proper transitions
  return parts.join(". ") + (parts.length > 0 ? "." : "");
}

/**
 * Format as plain text
 */
export function formatPlainText(prompt: Prompt): FormattedPrompt {
  const content = assemblePrompt(prompt);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  
  return {
    format: ExportFormat.TEXT,
    content,
    filename: `prompt-${timestamp}.txt`,
  };
}

/**
 * Format as markdown with section labels
 */
export function formatMarkdown(prompt: Prompt): FormattedPrompt {
  const sections: string[] = [];
  
  sections.push("# Sora Prompt\n");
  sections.push(`*Generated: ${new Date(prompt.lastModified || prompt.createdAt).toLocaleString()}*\n`);

  if (prompt.subject.trim()) {
    sections.push("## Subject");
    sections.push(prompt.subject.trim());
    sections.push("");
  }

  if (prompt.actionSetting.trim()) {
    sections.push("## Action & Setting");
    sections.push(prompt.actionSetting.trim());
    sections.push("");
  }

  if (prompt.cinematicStyle.trim()) {
    sections.push("## Cinematic Style");
    sections.push(prompt.cinematicStyle.trim());
    sections.push("");
  }

  if (prompt.cameraShot.trim()) {
    sections.push("## Camera & Shot");
    sections.push(prompt.cameraShot.trim());
    sections.push("");
  }

  if (prompt.visualDetails.trim()) {
    sections.push("## Visual Details & Lighting");
    sections.push(prompt.visualDetails.trim());
    sections.push("");
  }

  sections.push("---\n");
  sections.push("## Assembled Prompt");
  sections.push(assemblePrompt(prompt));

  const content = sections.join("\n");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  
  return {
    format: ExportFormat.MARKDOWN,
    content,
    filename: `prompt-${timestamp}.md`,
  };
}

/**
 * Format as JSON with metadata
 */
export function formatJSON(prompt: Prompt): FormattedPrompt {
  const jsonData = {
    version: "1.0",
    prompt: {
      subject: prompt.subject,
      actionSetting: prompt.actionSetting,
      cinematicStyle: prompt.cinematicStyle,
      cameraShot: prompt.cameraShot,
      visualDetails: prompt.visualDetails,
    },
    assembled: assemblePrompt(prompt),
    metadata: {
      id: prompt.id,
      status: prompt.status,
      createdAt: new Date(prompt.createdAt).toISOString(),
      lastModified: new Date(prompt.lastModified || prompt.createdAt).toISOString(),
    },
  };

  const content = JSON.stringify(jsonData, null, 2);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  
  return {
    format: ExportFormat.JSON,
    content,
    filename: `prompt-${timestamp}.json`,
  };
}

/**
 * Format a prompt according to the specified export format.
 * Supports text, markdown, and JSON formats.
 * 
 * @param prompt - Complete prompt object to format
 * @param format - Export format type (TEXT, MARKDOWN, or JSON)
 * @returns Formatted prompt object with content, format, and filename
 * @example
 * const formatted = formatPrompt(prompt, ExportFormat.MARKDOWN);
 * downloadPrompt(formatted);
 */
export function formatPrompt(prompt: Prompt, format: ExportFormat): FormattedPrompt {
  switch (format) {
    case ExportFormat.TEXT:
      return formatPlainText(prompt);
    case ExportFormat.MARKDOWN:
      return formatMarkdown(prompt);
    case ExportFormat.JSON:
      return formatJSON(prompt);
    default:
      return formatPlainText(prompt);
  }
}

/**
 * Download formatted prompt as file
 */
export function downloadPrompt(formatted: FormattedPrompt): void {
  const blob = new Blob([formatted.content], {
    type:
      formatted.format === ExportFormat.JSON
        ? "application/json"
        : formatted.format === ExportFormat.MARKDOWN
        ? "text/markdown"
        : "text/plain",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = formatted.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy formatted prompt content to the system clipboard.
 * Uses the modern Clipboard API with fallback error handling.
 * 
 * @param formatted - Formatted prompt object with content to copy
 * @returns Promise resolving to true if copy succeeded, false otherwise
 * @example
 * const formatted = formatPrompt(prompt, ExportFormat.TEXT);
 * const success = await copyPromptToClipboard(formatted);
 * if (success) showToast("Copied to clipboard!");
 */
export async function copyPromptToClipboard(formatted: FormattedPrompt): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(formatted.content);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

