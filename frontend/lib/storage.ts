/**
 * @FeatureID F-2
 * @Purpose localStorage management for draft prompts (anonymous users)
 * @Spec /docs/PRD.md F-2
 * @Author Chat Bot Labs
 */

import type { Prompt } from "./types";
import { PromptStatus } from "./types";

const STORAGE_KEY_PREFIX = "sora_prompt_";
const DRAFTS_KEY = "sora_drafts_list";
const LAST_DRAFT_KEY = "sora_last_draft_id";
const DRAFT_EXPIRY_DAYS = 7;

/**
 * Generate a unique ID for a prompt
 * 
 * @returns A unique identifier combining timestamp and random string
 * @example
 * const id = generateId(); // "1703123456789_abc123xyz"
 */
function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get storage key for a specific prompt
 */
function getPromptKey(id: string): string {
  return `${STORAGE_KEY_PREFIX}${id}`;
}

/**
 * Get all draft IDs from storage
 */
function getDraftIds(): string[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(DRAFTS_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as string[];
  } catch {
    return [];
  }
}

/**
 * Save draft IDs list
 */
function saveDraftIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(ids));
  } catch (error) {
    console.error("Failed to save draft IDs:", error);
  }
}

/**
 * Clean up expired drafts (older than 7 days)
 * This function removes drafts that are older than DRAFT_EXPIRY_DAYS to prevent localStorage bloat.
 * Called periodically (10% chance on each save) to avoid performance impact.
 * Reference: PRD.md F-2 - drafts persist for 7 days
 */
function cleanupExpiredDrafts(): void {
  if (typeof window === "undefined") return;
  
  const draftIds = getDraftIds();
  const now = Date.now();
  const expiryMs = DRAFT_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // Convert days to milliseconds
  const validIds: string[] = [];

  draftIds.forEach((id) => {
    try {
      const key = getPromptKey(id);
      const stored = localStorage.getItem(key);
      if (!stored) return; // Already deleted or never existed

      const prompt = JSON.parse(stored) as Prompt;
      const age = now - prompt.createdAt; // Age in milliseconds

      // Keep drafts that haven't expired yet
      if (age < expiryMs) {
        validIds.push(id);
      } else {
        // Remove expired draft
        localStorage.removeItem(key);
      }
    } catch {
      // Remove corrupt entries - if JSON parse fails, the data is corrupted
      const key = getPromptKey(id);
      localStorage.removeItem(key);
    }
  });

  // Update draft IDs list if any were removed
  if (validIds.length !== draftIds.length) {
    saveDraftIds(validIds);
  }
}

/**
 * Debounce helper
 */
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Save a draft prompt to localStorage with automatic debouncing (500ms).
 * Automatically generates an ID for new prompts and updates lastModified timestamp.
 * Handles localStorage quota exceeded errors gracefully.
 * 
 * @param prompt - Partial prompt object to save (can be missing fields)
 * @returns The prompt ID if successful, null if save failed
 * @example
 * const id = saveDraft({ subject: "A golden retriever", actionSetting: "walking on Mars" });
 * if (id) console.log("Saved with ID:", id);
 */
export const saveDraft = debounce((prompt: Partial<Prompt>): string | null => {
  if (typeof window === "undefined") return null;

  try {
    // Generate ID if new prompt
    const id = prompt.id || generateId();
    const now = Date.now();

    // Create or update prompt
    const fullPrompt: Prompt = {
      id,
      subject: prompt.subject || "",
      actionSetting: prompt.actionSetting || "",
      cinematicStyle: prompt.cinematicStyle || "",
      cameraShot: prompt.cameraShot || "",
      visualDetails: prompt.visualDetails || "",
      createdAt: prompt.createdAt || now,
      lastModified: now,
      status: prompt.status || PromptStatus.DRAFT,
    };

    // Save prompt
    const key = getPromptKey(id);
    localStorage.setItem(key, JSON.stringify(fullPrompt));

    // Update draft IDs list
    const draftIds = getDraftIds();
    if (!draftIds.includes(id)) {
      draftIds.push(id);
      saveDraftIds(draftIds);
    }

    // Save as last draft
    localStorage.setItem(LAST_DRAFT_KEY, id);

    // Cleanup expired drafts periodically
    // Use random chance (10%) to avoid cleanup overhead on every save
    // This balances storage management with performance
    if (Math.random() < 0.1) {
      cleanupExpiredDrafts();
    }

    return id;
  } catch (error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      // Handle quota exceeded - user-friendly error message would be shown in UI
      // Note: In production, this should trigger a toast notification to the user
      console.error("localStorage quota exceeded. Please delete some old drafts to free up space.");
      return null;
    }
    console.error("Failed to save draft. Your changes may not be saved.", error);
    return null;
  }
}, 500);

/**
 * Retrieve a draft prompt by its ID from localStorage.
 * 
 * @param id - The unique identifier of the prompt to retrieve
 * @returns The prompt object if found, null if not found or on error
 * @example
 * const prompt = getDraft("1703123456789_abc123xyz");
 * if (prompt) console.log("Found:", prompt.subject);
 */
export function getDraft(id: string): Prompt | null {
  if (typeof window === "undefined") return null;

  try {
    const key = getPromptKey(id);
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const prompt = JSON.parse(stored) as Prompt;
    return prompt;
  } catch (error) {
    console.error("Failed to get draft:", error);
    return null;
  }
}

/**
 * Retrieve all saved draft prompts from localStorage.
 * Automatically cleans up expired drafts (older than 7 days) before returning.
 * Results are sorted by lastModified timestamp (newest first).
 * 
 * @returns Array of all saved prompts, sorted by lastModified descending
 * @example
 * const drafts = getAllDrafts();
 * console.log(`Found ${drafts.length} drafts`);
 */
export function getAllDrafts(): Prompt[] {
  if (typeof window === "undefined") return [];

  try {
    cleanupExpiredDrafts();
    const draftIds = getDraftIds();
    const drafts: Prompt[] = [];

    draftIds.forEach((id) => {
      const draft = getDraft(id);
      if (draft) {
        drafts.push(draft);
      }
    });

    // Sort by lastModified (newest first)
    return drafts.sort((a, b) => b.lastModified - a.lastModified);
  } catch (error) {
    console.error("Failed to get all drafts:", error);
    return [];
  }
}

/**
 * Delete a draft prompt from localStorage by ID.
 * Also removes it from the drafts list and clears last draft reference if applicable.
 * 
 * @param id - The unique identifier of the prompt to delete
 * @returns true if deletion was successful, false otherwise
 * @example
 * if (deleteDraft("1703123456789_abc123xyz")) {
 *   console.log("Draft deleted successfully");
 * }
 */
export function deleteDraft(id: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const key = getPromptKey(id);
    localStorage.removeItem(key);

    // Remove from draft IDs list
    const draftIds = getDraftIds();
    const filtered = draftIds.filter((draftId) => draftId !== id);
    saveDraftIds(filtered);

    // Clear last draft if it was this one
    const lastDraftId = localStorage.getItem(LAST_DRAFT_KEY);
    if (lastDraftId === id) {
      localStorage.removeItem(LAST_DRAFT_KEY);
    }

    return true;
  } catch (error) {
    console.error("Failed to delete draft:", error);
    return false;
  }
}

/**
 * Retrieve the most recently saved draft prompt (for session recovery).
 * This is the draft that was last saved, useful for "Continue where you left off" functionality.
 * 
 * @returns The last saved prompt, or null if no draft exists
 * @example
 * const lastDraft = getLastDraft();
 * if (lastDraft) {
 *   // Show "Continue draft?" modal
 * }
 */
export function getLastDraft(): Prompt | null {
  if (typeof window === "undefined") return null;

  try {
    const lastDraftId = localStorage.getItem(LAST_DRAFT_KEY);
    if (!lastDraftId) return null;

    return getDraft(lastDraftId);
  } catch (error) {
    console.error("Failed to get last draft:", error);
    return null;
  }
}

/**
 * Check if localStorage is available and accessible in the current environment.
 * Useful for SSR compatibility checks.
 * 
 * @returns true if localStorage is available, false otherwise
 * @example
 * if (isStorageAvailable()) {
 *   saveDraft(prompt);
 * } else {
 *   console.warn("localStorage not available");
 * }
 */
export function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

