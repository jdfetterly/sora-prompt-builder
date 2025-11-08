/**
 * @FeatureID F-4
 * @Purpose Static suggestions data and helper functions for anonymous users
 * @Spec /docs/PRD.md F-4
 * @Author Chat Bot Labs
 */

export type SuggestionCategory = "subject" | "actionSetting" | "style" | "camera" | "visualDetails";

export interface Suggestion {
  text: string;
  category: SuggestionCategory;
  tooltip?: string; // Educational explanation
}

/**
 * Static suggestions for each step
 */
const suggestions: Record<SuggestionCategory, Suggestion[]> = {
  subject: [
    {
      text: "A golden retriever wearing a vintage space helmet",
      category: "subject",
      tooltip: "Specific subjects with unique details create more compelling visuals",
    },
    {
      text: "A lone astronaut floating in zero gravity",
      category: "subject",
      tooltip: "Clear subject focus helps Sora understand the main element",
    },
    {
      text: "A vintage film camera on a wooden desk",
      category: "subject",
      tooltip: "Objects with character and context add depth to your prompt",
    },
    {
      text: "A mysterious figure in a long coat",
      category: "subject",
      tooltip: "Subjects with implied narrative create cinematic intrigue",
    },
    {
      text: "A weathered lighthouse on a rocky cliff",
      category: "subject",
      tooltip: "Architectural subjects with environmental context work well",
    },
    {
      text: "A vintage typewriter with paper scattered around",
      category: "subject",
      tooltip: "Objects with surrounding context tell a richer story",
    },
    {
      text: "A child holding a glowing lantern",
      category: "subject",
      tooltip: "Human subjects with props create emotional connection",
    },
    {
      text: "A classic car covered in morning dew",
      category: "subject",
      tooltip: "Adding texture details enhances visual richness",
    },
  ],
  actionSetting: [
    {
      text: "trotting happily on the dusty, red surface of Mars",
      category: "actionSetting",
      tooltip: "Combine action with specific location for clarity",
    },
    {
      text: "walking through a misty forest at dawn",
      category: "actionSetting",
      tooltip: "Time of day adds atmosphere to your setting",
    },
    {
      text: "sitting in a cozy coffee shop during a rainstorm",
      category: "actionSetting",
      tooltip: "Indoor settings with weather create mood",
    },
    {
      text: "running across a neon-lit city street at night",
      category: "actionSetting",
      tooltip: "Urban settings with lighting details are cinematic",
    },
    {
      text: "floating in a zero-gravity space station",
      category: "actionSetting",
      tooltip: "Unique environments make prompts stand out",
    },
    {
      text: "standing on a windswept beach at sunset",
      category: "actionSetting",
      tooltip: "Natural settings with time of day are visually striking",
    },
    {
      text: "dancing in an abandoned warehouse",
      category: "actionSetting",
      tooltip: "Contrasting actions and settings create interest",
    },
    {
      text: "reading in a library with towering bookshelves",
      category: "actionSetting",
      tooltip: "Quiet actions in atmospheric spaces work well",
    },
  ],
  style: [
    {
      text: "In the style of a Wes Anderson film, highly symmetrical, high-contrast, vintage pastel color palette",
      category: "style",
      tooltip: "Referencing specific directors helps Sora understand aesthetic",
    },
    {
      text: "Film noir with dramatic shadows and high contrast",
      category: "style",
      tooltip: "Classic film genres provide clear visual direction",
    },
    {
      text: "Documentary style, natural lighting, handheld camera feel",
      category: "style",
      tooltip: "Cinematic styles communicate the overall mood",
    },
    {
      text: "Cinematic, wide aspect ratio, epic scale",
      category: "style",
      tooltip: "Technical terms help define the visual approach",
    },
    {
      text: "Vintage 1970s aesthetic with warm color grading",
      category: "style",
      tooltip: "Era-specific styles create distinct visual identity",
    },
    {
      text: "Minimalist, clean composition, muted colors",
      category: "style",
      tooltip: "Simple style descriptions can be very effective",
    },
    {
      text: "Surrealist art style with dreamlike quality",
      category: "style",
      tooltip: "Artistic movements provide rich visual references",
    },
    {
      text: "Sci-fi aesthetic with neon accents and futuristic design",
      category: "style",
      tooltip: "Genre-specific styles help set expectations",
    },
  ],
  camera: [
    {
      text: "Medium shot, eye-level, smooth tracking shot that follows the subject",
      category: "camera",
      tooltip: "Combining shot type, angle, and movement creates dynamic visuals",
    },
    {
      text: "Close-up, low angle, static camera",
      category: "camera",
      tooltip: "Close-ups create intimacy and focus",
    },
    {
      text: "Wide shot, high angle, slow dolly forward",
      category: "camera",
      tooltip: "Wide shots establish context and scale",
    },
    {
      text: "Extreme close-up, eye-level, handheld movement",
      category: "camera",
      tooltip: "Handheld adds energy and realism",
    },
    {
      text: "Aerial shot, bird's eye view, smooth crane movement",
      category: "camera",
      tooltip: "Aerial perspectives create dramatic scale",
    },
    {
      text: "Dutch angle, medium shot, slow pan",
      category: "camera",
      tooltip: "Unusual angles add visual interest",
    },
    {
      text: "Over-the-shoulder shot, eye-level, static",
      category: "camera",
      tooltip: "OTS shots create connection between subject and viewer",
    },
    {
      text: "Tracking shot, low angle, follows subject through environment",
      category: "camera",
      tooltip: "Movement adds dynamism and narrative flow",
    },
  ],
  visualDetails: [
    {
      text: "Golden hour lighting, casting long, sharp shadows. The texture of the spacesuit is slightly reflective.",
      category: "visualDetails",
      tooltip: "Lighting and texture details add realism and mood",
    },
    {
      text: "Soft, diffused morning light filtering through fog",
      category: "visualDetails",
      tooltip: "Atmospheric lighting creates mood",
    },
    {
      text: "Hard, directional light creating dramatic contrast",
      category: "visualDetails",
      tooltip: "Lighting quality affects the emotional tone",
    },
    {
      text: "Blue hour with neon signs reflecting in puddles",
      category: "visualDetails",
      tooltip: "Time-specific lighting creates distinct atmospheres",
    },
    {
      text: "Warm candlelight flickering, casting dancing shadows",
      category: "visualDetails",
      tooltip: "Practical lighting sources add authenticity",
    },
    {
      text: "Overcast sky, even, soft lighting, muted colors",
      category: "visualDetails",
      tooltip: "Weather affects both lighting and mood",
    },
    {
      text: "Backlit silhouette against bright sunset",
      category: "visualDetails",
      tooltip: "Backlighting creates dramatic silhouettes",
    },
    {
      text: "Rim lighting separating subject from dark background",
      category: "visualDetails",
      tooltip: "Technical lighting terms help achieve specific looks",
    },
  ],
};

/**
 * Get all suggestions for a specific step/category.
 * 
 * @param stepId - The step category to get suggestions for
 * @returns Array of suggestion objects for the specified step
 * @example
 * const subjectSuggestions = getSuggestionsForStep("subject");
 * // Returns all subject suggestions with tooltips
 */
export function getSuggestionsForStep(stepId: SuggestionCategory): Suggestion[] {
  return suggestions[stepId] || [];
}

/**
 * Filter suggestions by category (alias for getSuggestionsForStep).
 * 
 * @param category - The suggestion category to filter by
 * @returns Array of suggestion objects for the specified category
 * @example
 * const styleSuggestions = filterSuggestionsByCategory("style");
 */
export function filterSuggestionsByCategory(
  category: SuggestionCategory
): Suggestion[] {
  return suggestions[category] || [];
}

/**
 * Get a random selection of suggestions from a category (for variety).
 * Useful for showing different suggestions on each visit.
 * 
 * @param category - The suggestion category to get random suggestions from
 * @param count - Number of random suggestions to return (default: 3)
 * @returns Array of randomly selected suggestion objects
 * @example
 * const randomSubjects = getRandomSuggestions("subject", 5);
 * // Returns 5 random subject suggestions
 */
export function getRandomSuggestions(
  category: SuggestionCategory,
  count: number = 3
): Suggestion[] {
  const categorySuggestions = suggestions[category] || [];
  const shuffled = [...categorySuggestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, categorySuggestions.length));
}

/**
 * Get all suggestions
 */
export function getAllSuggestions(): Record<SuggestionCategory, Suggestion[]> {
  return suggestions;
}

