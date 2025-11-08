/**
 * @FeatureID F-6
 * @Purpose Validation rules and helpers for prompt fields
 * @Spec /docs/PRD.md F-6
 * @Author Chat Bot Labs
 */

import type { Prompt, ValidationResult, FieldValidation, ValidationLevel } from "./types";

/**
 * Character length recommendations per field
 */
const FIELD_RECOMMENDATIONS: Record<keyof Prompt, { min: number; optimal: number; max: number }> = {
  subject: { min: 10, optimal: 50, max: 200 },
  actionSetting: { min: 15, optimal: 80, max: 250 },
  cinematicStyle: { min: 10, optimal: 60, max: 200 },
  cameraShot: { min: 10, optimal: 50, max: 200 },
  visualDetails: { min: 10, optimal: 60, max: 250 },
  id: { min: 0, optimal: 0, max: 0 },
  createdAt: { min: 0, optimal: 0, max: 0 },
  lastModified: { min: 0, optimal: 0, max: 0 },
  status: { min: 0, optimal: 0, max: 0 },
};

/**
 * Validate a single prompt field against length recommendations and required rules.
 * Returns validation result with level (error/warning/success) and message.
 * Subject field is required; other fields are optional.
 * 
 * @param field - The prompt field to validate (subject, actionSetting, etc.)
 * @param value - The field value to validate
 * @returns Validation result object with level and message, or null if no validation needed
 * @example
 * const validation = validateField("subject", "A dog");
 * if (validation?.level === "error") {
 *   console.error(validation.message);
 * }
 */
export function validateField(
  field: keyof Prompt,
  value: string
): FieldValidation | null {
  // Skip metadata fields
  if (field === "id" || field === "createdAt" || field === "lastModified" || field === "status") {
    return null;
  }

  const trimmedValue = value.trim();
  const recommendations = FIELD_RECOMMENDATIONS[field];
  const length = trimmedValue.length;

  // Required field validation (Subject is required)
  if (field === "subject" && length === 0) {
    return {
      field,
      level: "error",
      message: "Subject is required. Try describing the main character, object, or element (e.g., 'A golden retriever wearing a vintage space helmet').",
    };
  }

  // Length-based validation
  if (length === 0) {
    // Optional fields can be empty
    return null;
  }

  if (length < recommendations.min) {
    return {
      field,
      level: "warning",
      message: `Try adding more detail to make this more vivid. Aim for around ${recommendations.optimal} characters for best results.`,
    };
  }

  if (length > recommendations.max) {
    return {
      field,
      level: "warning",
      message: `This is quite long. Try focusing on the most important details—around ${recommendations.optimal} characters works best.`,
    };
  }

  if (length >= recommendations.min && length <= recommendations.optimal) {
    return {
      field,
      level: "success",
      message: "Perfect length! This provides clear, detailed information.",
    };
  }

  return null;
}

/**
 * Best practice checks
 * Analyzes prompt content for common improvements and returns validation warnings.
 * These are suggestions, not errors - users can proceed without addressing them.
 */
function checkBestPractices(prompt: Prompt): FieldValidation[] {
  const practices: FieldValidation[] = [];

  // Check for camera movement keywords
  // Static shots are valid, but dynamic movement often produces better results
  // Reference: PRD.md Section 8.1 (Camera & Shot)
  if (prompt.cameraShot && !prompt.cameraShot.toLowerCase().includes("movement") && 
      !prompt.cameraShot.toLowerCase().includes("tracking") &&
      !prompt.cameraShot.toLowerCase().includes("dolly") &&
      !prompt.cameraShot.toLowerCase().includes("pan") &&
      !prompt.cameraShot.toLowerCase().includes("static")) {
    practices.push({
      field: "cameraShot",
      level: "warning",
      message: "Try adding camera movement (like tracking, dolly, or pan) to make your visuals more dynamic.",
    });
  }

  // Check for lighting details
  // Lighting is crucial for cinematic quality - check if user mentioned it
  // Reference: PRD.md Section 8.1 (Visual Details & Lighting)
  if (prompt.visualDetails && !prompt.visualDetails.toLowerCase().includes("light")) {
    practices.push({
      field: "visualDetails",
      level: "warning",
      message: "Try adding lighting details (like golden hour, time of day, or light quality) to enhance the mood.",
    });
  }

  // Check for specific details in subject
  // Very short subjects (< 5 words) often lack detail for good results
  // This is a heuristic - not a strict rule
  if (prompt.subject && prompt.subject.split(" ").length < 5) {
    practices.push({
      field: "subject",
      level: "warning",
      message: "Try adding more specific details about your subject (appearance, clothing, expression) for richer results.",
    });
  }

  return practices;
}

/**
 * Validate an entire prompt object, checking all fields and best practices.
 * Returns comprehensive validation result including field-level and overall status.
 * 
 * @param prompt - Complete prompt object to validate
 * @returns Validation result with isValid flag, field validations, and overall messages
 * @example
 * const result = validatePrompt(prompt);
 * if (result.isValid) {
 *   console.log("Prompt is ready to export!");
 * } else {
 *   console.log("Please fix errors:", result.fields);
 * }
 */
export function validatePrompt(prompt: Prompt): ValidationResult {
  const fields: Record<keyof Prompt, FieldValidation | null> = {
    subject: null,
    actionSetting: null,
    cinematicStyle: null,
    cameraShot: null,
    visualDetails: null,
    id: null,
    createdAt: null,
    lastModified: null,
    status: null,
  };

  // Validate each field
  Object.keys(fields).forEach((key) => {
    const field = key as keyof Prompt;
    if (field === "id" || field === "createdAt" || field === "lastModified" || field === "status") {
      return;
    }
    fields[field] = validateField(field, prompt[field] || "");
  });

  // Check best practices and merge with field validations
  // Best practice warnings only override if there's no existing validation or if current validation is success
  // This ensures errors take precedence, and warnings don't override other warnings
  const practices = checkBestPractices(prompt);
  practices.forEach((practice) => {
    // Override with best practice warning if no existing validation or if current is success
    // Don't override existing errors or warnings - let field validation take precedence
    if (!fields[practice.field] || fields[practice.field]?.level === "success") {
      fields[practice.field] = practice;
    }
  });

  // Determine overall validity
  // A prompt is valid if it has no errors (warnings are acceptable)
  // Reference: PRD.md F-6 - validation provides warnings but allows override
  const hasErrors = Object.values(fields).some(
    (validation) => validation?.level === "error"
  );
  const isValid = !hasErrors;

  // Overall messages for user feedback
  // Count completed fields (any field without an error is considered "complete")
  // This provides encouragement and progress tracking
  const overall: Array<{ level: ValidationLevel; message: string }> = [];
  const completedFields = Object.values(fields).filter(
    (v) => v && v.level !== "error"
  ).length;
  const totalFields = 5;

  if (completedFields === totalFields) {
    overall.push({
      level: "success",
      message: "Excellent! All fields are complete. Your prompt is ready to export.",
    });
  } else if (completedFields >= 3) {
    overall.push({
      level: "warning",
      message: `Great progress! You've completed ${completedFields} of ${totalFields} fields. Fill in the remaining fields for the best results.`,
    });
  }

  return {
    isValid,
    fields,
    overall,
  };
}

/**
 * Get validation color for UI styling
 */
export function getValidationColor(level: ValidationLevel): string {
  switch (level) {
    case "error":
      return "text-error border-error";
    case "warning":
      return "text-warning border-warning";
    case "success":
      return "text-success border-success";
    default:
      return "text-text-secondary border-border-default";
  }
}

/**
 * Get validation icon component name (for use with lucide-react)
 */
export function getValidationIcon(level: ValidationLevel): string {
  switch (level) {
    case "error":
      return "AlertCircle";
    case "warning":
      return "AlertTriangle";
    case "success":
      return "CheckCircle2";
    default:
      return "";
  }
}

/**
 * Format validation message for display
 */
export function formatValidationMessage(validation: FieldValidation | null): string {
  if (!validation) return "";
  return validation.message;
}

