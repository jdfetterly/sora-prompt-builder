/**
 * @FeatureID Foundation
 * @Purpose Utility functions including clsx and tailwind-merge helpers
 * @Author Chat Bot Labs
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge.
 * Handles conditional classes and resolves Tailwind class conflicts.
 * 
 * @param inputs - Class values (strings, objects, arrays, or conditionals)
 * @returns Merged class string with Tailwind conflicts resolved
 * @example
 * cn("px-4", "py-2", { "bg-gold": isActive }) // "px-4 py-2 bg-gold"
 * cn("px-4", "px-2") // "px-2" (conflict resolved)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

