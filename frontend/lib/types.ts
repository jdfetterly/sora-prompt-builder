/**
 * @FeatureID F-1, F-6, F-9
 * @Purpose Core type definitions for prompts, validation, and export formats
 * @Spec /docs/PRD.md Section 8.1
 * @Author Chat Bot Labs
 */

/**
 * Prompt status enum
 */
export enum PromptStatus {
  DRAFT = "draft",
  COMPLETE = "complete",
}

/**
 * Core Prompt data structure
 * Based on the 5-step prompt building process
 */
export interface Prompt {
  // Core fields (5 steps)
  subject: string; // Step 1: Main character, object, or element
  actionSetting: string; // Step 2: What's happening and where
  cinematicStyle: string; // Step 3: Aesthetic, artist reference, or film genre
  cameraShot: string; // Step 4: Shot type, angle, and movement
  visualDetails: string; // Step 5: Lighting, time of day, textures, mood

  // Metadata
  id: string;
  createdAt: number; // Unix timestamp
  lastModified: number; // Unix timestamp
  status: PromptStatus;
}

/**
 * Validation result levels
 */
export type ValidationLevel = "error" | "warning" | "success";

/**
 * Validation message structure
 */
export interface ValidationMessage {
  level: ValidationLevel;
  message: string;
}

/**
 * Field validation result
 */
export interface FieldValidation {
  field: keyof Prompt;
  level: ValidationLevel;
  message: string;
}

/**
 * Full validation result for a prompt
 */
export interface ValidationResult {
  isValid: boolean;
  fields: Record<keyof Prompt, FieldValidation | null>;
  overall: ValidationMessage[];
}

/**
 * Export format types
 */
export enum ExportFormat {
  TEXT = "text",
  MARKDOWN = "markdown",
  JSON = "json",
}

/**
 * Context Memory Mode for localhost testing (F-15.1, F-15.2, F-15.3)
 * Used to toggle between different context visibility solutions
 */
export enum ContextMemoryMode {
  NONE = "none",           // Baseline (XL sidebar only)
  ACCORDION = "accordion", // Solution F-15.2
  PREVIEW = "preview",     // Solution F-15.3
  HYBRID = "hybrid",       // Solution F-15.1
}

/**
 * Formatted prompt output
 */
export interface FormattedPrompt {
  format: ExportFormat;
  content: string;
  filename: string;
}

