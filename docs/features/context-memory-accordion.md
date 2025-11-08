# Feature Specification: Context Memory - Expandable Accordion

**Feature ID:** F-15.2  
**Version:** 1.0  
**Status:** Proposed  
**Owner:** Chat Bot Labs  
**Last Updated:** November 8, 2025  
**PRD Reference:** /docs/PRD.md Section 5 (User Experience Goals)  
**Design Reference:** /docs/DesignSpec.md  
**Architecture Reference:** /docs/Architecture.md

---

## 1. Problem Statement

### User Pain Point
During the 5-step prompt building process (Subject → Action & Setting → Cinematic Style → Camera & Shot → Visual Details), users lose track of what they've entered in previous steps. This cognitive burden leads to:

- **Memory Overload:** Difficulty remembering multiple context pieces across steps
- **Inconsistent Prompts:** Without seeing prior inputs, new content may contradict or duplicate earlier choices
- **Reduced Efficiency:** Users repeatedly navigate backward to review previous steps
- **Decision Fatigue:** Uncertainty about whether current input aligns with the overall vision

### Current State
The existing `PromptOutput` component provides a formatted preview, but it's only accessible:
- On extra-large screens (XL: 1280px+) as a fixed sidebar
- Hidden on laptop, tablet, and mobile devices (majority of users)
- Requires no user interaction (always visible but not inline with workflow)

### Why This Matters
Research shows that working memory can typically hold 4-7 items. Our 5-step process exceeds this capacity, especially when each step contains detailed descriptive text. Users need a lightweight way to refresh their memory without disrupting their flow.

---

## 2. Proposed Solution

### Overview
Add an **expandable accordion panel** titled "Your Prompt So Far" at the top of each step form (Steps 2-5). The accordion displays all previously completed fields in a clean, scannable format. Users can expand or collapse the panel with a single click, giving them full control over when they need context without cluttering the interface.

### Key Characteristics
- **Inline Placement:** Appears naturally above the current step's form
- **User-Controlled:** Collapsed by default; expands only when user needs it
- **Complete Context:** Shows full content of all completed fields (not truncated)
- **Minimal Footprint:** When collapsed, takes up only ~50px vertical space
- **Persistent State:** Remembers expanded/collapsed preference per step during session
- **Universal Compatibility:** Works on all device sizes with responsive sizing

### Design Philosophy
This solution follows the principle of **progressive disclosure**: advanced information (previous context) is readily available but hidden by default to reduce cognitive load. Users opt-in when they need it, maintaining a clean workspace while ensuring context is never more than one click away.

---

## 3. User Stories

### US-15.2.1: Quick Context Check
**As a** user on Step 3 (Cinematic Style)  
**I want to** quickly see what subject and action I previously defined  
**So that** I can choose a cinematic style that complements my existing prompt

**Acceptance Criteria:**
- Accordion appears above the Cinematic Style form
- Header shows "Your Prompt So Far [2/5]" indicating 2 of 5 steps completed
- Clicking header expands accordion smoothly
- Subject and Action & Setting fields display with labels and full content
- Content preserves line breaks and formatting
- Clicking header again collapses accordion

### US-15.2.2: Multi-Step Context Review
**As a** user on Step 5 (Visual Details)  
**I want to** review all four previous steps before finalizing my details  
**So that** I ensure my visual details enhance rather than conflict with earlier choices

**Acceptance Criteria:**
- Accordion shows "Your Prompt So Far [4/5]"
- Expanded view displays all four completed fields in order
- Each field has clear label (Subject, Action & Setting, Cinematic Style, Camera & Shot)
- Content is left-aligned and easy to scan
- Scrollbar appears if content exceeds 400px height

### US-15.2.3: Collapsed State Persistence
**As a** user who prefers minimal UI  
**I want to** collapse the accordion once and have it stay collapsed  
**So that** I don't have to dismiss it repeatedly as I progress through steps

**Acceptance Criteria:**
- Accordion state (expanded/collapsed) saved in sessionStorage
- When navigating to next step, accordion opens in last-used state
- State resets when starting a new prompt or reloading page
- Each step can have independent expanded/collapsed state

### US-15.2.4: Mobile-Friendly Access
**As a** mobile user with limited vertical space  
**I want to** access my previous context without scrolling excessively  
**So that** I can efficiently review and continue building my prompt

**Acceptance Criteria:**
- Accordion header remains visible even when page scrolls
- Content area limits height to 60vh on mobile (scrollable within accordion)
- Touch-friendly tap target (minimum 48px height)
- Smooth animation doesn't cause layout shift

---

## 4. Technical Specifications

### 4.1 Component Architecture

#### New Component

##### `PromptSummaryAccordion.tsx`
**Location:** `/frontend/components/builder/PromptSummaryAccordion.tsx`

**Component Interface:**
```typescript
interface PromptSummaryAccordionProps {
  /** Current prompt object with all field values */
  prompt: Partial<Prompt>;
  
  /** Current step number (1-5) to determine which fields to show */
  currentStep: number;
  
  /** Optional callback when accordion state changes */
  onToggle?: (expanded: boolean) => void;
  
  /** Optional CSS classes */
  className?: string;
}

export const PromptSummaryAccordion: React.FC<PromptSummaryAccordionProps>
```

**Internal State:**
```typescript
const [isExpanded, setIsExpanded] = useState<boolean>(false);
```

**Core Responsibilities:**
1. Determine which fields to display based on `currentStep`
2. Render expandable/collapsible header with step count
3. Display completed fields with proper labels and formatting
4. Persist expanded state to sessionStorage
5. Handle keyboard navigation (Enter/Space to toggle)
6. Animate expand/collapse transitions
7. Handle content overflow with internal scrolling

**Field Mapping:**
```typescript
const stepToFieldMap: Record<number, Array<keyof Prompt>> = {
  1: [], // No accordion on Step 1
  2: ["subject"],
  3: ["subject", "actionSetting"],
  4: ["subject", "actionSetting", "cinematicStyle"],
  5: ["subject", "actionSetting", "cinematicStyle", "cameraShot"],
};
```

**Label Mapping:**
```typescript
const fieldLabels: Record<keyof Prompt, string> = {
  subject: "Subject",
  actionSetting: "Action & Setting",
  cinematicStyle: "Cinematic Style",
  cameraShot: "Camera & Shot",
  visualDetails: "Visual Details",
};
```

#### Modified Components

##### `build/page.tsx`
**Changes Required:**

1. **Import Component:**
```typescript
import { PromptSummaryAccordion } from "@/components/builder/PromptSummaryAccordion";
```

2. **Add to Step Rendering:**
```typescript
const renderStep = useCallback(() => {
  // Show accordion for steps 2-5
  const showAccordion = currentStep > 1;
  
  return (
    <>
      {showAccordion && (
        <PromptSummaryAccordion
          prompt={prompt}
          currentStep={currentStep}
          className="mb-6"
        />
      )}
      
      {/* Existing step component rendering */}
      {switch (currentStep) { ... }}
    </>
  );
}, [currentStep, prompt]);
```

**No Breaking Changes:** All existing functionality remains intact.

### 4.2 Data Management

#### sessionStorage Schema
```typescript
// Key format
const storageKey = `sora-accordion-step-${currentStep}`;

// Value format
interface AccordionState {
  expanded: boolean;
  timestamp: number; // For potential cleanup of old data
}

// Example
{
  "sora-accordion-step-2": {
    "expanded": true,
    "timestamp": 1699478400000
  }
}
```

#### State Persistence Logic
```typescript
// Load on mount
useEffect(() => {
  const savedState = sessionStorage.getItem(storageKey);
  if (savedState) {
    const { expanded } = JSON.parse(savedState);
    setIsExpanded(expanded);
  }
}, [currentStep]);

// Save on change
const handleToggle = useCallback(() => {
  const newState = !isExpanded;
  setIsExpanded(newState);
  sessionStorage.setItem(storageKey, JSON.stringify({
    expanded: newState,
    timestamp: Date.now(),
  }));
  onToggle?.(newState);
}, [isExpanded, onToggle, storageKey]);
```

### 4.3 Responsive Behavior

#### Breakpoint Adaptations
```css
/* Mobile: 0-767px */
- Max height: 60vh (scrollable)
- Padding: 12px
- Font sizes: Slightly smaller for space efficiency

/* Tablet: 768-1279px */
- Max height: 50vh
- Padding: 16px
- Standard font sizes

/* Desktop: 1280px+ */
- Max height: 400px
- Padding: 20px
- Standard font sizes
- Coexists with PromptOutput sidebar (no conflicts)
```

#### Implementation
```typescript
const maxHeightClass = "max-h-[60vh] md:max-h-[50vh] lg:max-h-[400px]";
```

---

## 5. Design Specifications

### 5.1 Visual Design

#### Collapsed State
```
┌──────────────────────────────────────────────────────┐
│  ▶ Your Prompt So Far                         [3/5]  │
└──────────────────────────────────────────────────────┘
   ↑                                              ↑
  Icon                                      Completion count
```

**Dimensions:**
- Height: 48px (mobile), 56px (desktop)
- Full width of content container
- Border: 1px solid `border-divider`
- Border radius: 8px (base)

#### Expanded State
```
┌──────────────────────────────────────────────────────┐
│  ▼ Your Prompt So Far                         [3/5]  │
├──────────────────────────────────────────────────────┤
│                                                       │
│  SUBJECT                                              │
│  A futuristic robot exploring an abandoned space     │
│  station with flickering emergency lights            │
│                                                       │
│  ACTION & SETTING                                     │
│  Walking cautiously through zero-gravity corridors   │
│  with floating debris, in the year 2287              │
│                                                       │
│  CINEMATIC STYLE                                      │
│  Hard sci-fi aesthetic with realistic lighting,      │
│  inspired by films like "Gravity" and "2001: A       │
│  Space Odyssey"                                       │
│                                                       │
└──────────────────────────────────────────────────────┘
   ↑
 Scrollable if content exceeds max-height
```

### 5.2 Component Styling

#### Container
```css
/* Collapsed */
.accordion-container {
  background: var(--background-secondary);
  border: 1px solid var(--border-divider);
  border-radius: var(--radius-base);
  overflow: hidden;
}

/* Expanded */
.accordion-container.expanded {
  /* Same styling */
}
```

**Tailwind Classes:**
```typescript
className={cn(
  "bg-background-secondary border border-divider rounded-base overflow-hidden",
  "transition-all duration-300 ease-in-out",
  className
)}
```

#### Header Button
```css
.accordion-header {
  width: 100%;
  padding: 12px 16px;       /* Mobile */
  padding: 16px 20px;       /* Desktop */
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 200ms ease;
}

.accordion-header:hover {
  background: var(--background-tertiary);
}

.accordion-header:focus-visible {
  outline: 2px solid var(--gold-primary);
  outline-offset: -2px;
}
```

**Tailwind Classes:**
```typescript
className={cn(
  "w-full px-4 py-3 md:px-5 md:py-4",
  "flex items-center justify-between",
  "cursor-pointer transition-colors duration-200",
  "hover:bg-background-tertiary",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-inset"
)}
```

#### Header Text & Icon
```typescript
// Title
<div className="flex items-center gap-3">
  <ChevronRight 
    className={cn(
      "h-5 w-5 text-text-tertiary transition-transform duration-300",
      isExpanded && "rotate-90"
    )}
  />
  <h3 className="text-base md:text-lg font-semibold text-text-primary">
    Your Prompt So Far
  </h3>
</div>

// Count Badge
<span className="text-sm text-text-tertiary font-medium">
  [{completedCount}/{totalSteps}]
</span>
```

#### Content Area
```css
.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-content.expanded {
  max-height: 400px;        /* Desktop */
  max-height: 50vh;         /* Tablet */
  max-height: 60vh;         /* Mobile */
  overflow-y: auto;
}
```

**Tailwind Classes:**
```typescript
<div
  className={cn(
    "overflow-hidden transition-all duration-300 ease-in-out",
    isExpanded 
      ? "max-h-[60vh] md:max-h-[50vh] lg:max-h-[400px] overflow-y-auto" 
      : "max-h-0"
  )}
>
  <div className="p-4 md:p-5 space-y-4">
    {/* Field content */}
  </div>
</div>
```

#### Field Display
```typescript
// Field Container
<div className="space-y-1">
  {/* Label */}
  <div className="text-xs uppercase tracking-wide text-text-tertiary font-medium">
    {fieldLabel}
  </div>
  
  {/* Value */}
  <div className="text-sm md:text-base text-text-primary whitespace-pre-wrap leading-relaxed">
    {fieldValue}
  </div>
</div>
```

**Styling Details:**
- Label: 12px, uppercase, wide tracking, tertiary text color
- Value: 14px mobile / 16px desktop, primary text color, preserve line breaks
- Spacing: 16px between fields (space-y-4)

#### Scrollbar Styling
```css
/* Custom scrollbar for content area */
.accordion-content::-webkit-scrollbar {
  width: 6px;
}

.accordion-content::-webkit-scrollbar-track {
  background: var(--background-secondary);
}

.accordion-content::-webkit-scrollbar-thumb {
  background: var(--background-tertiary);
  border-radius: 3px;
}

.accordion-content::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}
```

### 5.3 Animation Specifications

#### Expand/Collapse Animation
```css
/* Timing function: ease-in-out cubic bezier */
transition: max-height 300ms cubic-bezier(0.4, 0, 0.2, 1),
            opacity 200ms ease-in-out;

/* States */
collapsed: max-height: 0; opacity: 0;
expanding: max-height: [computed]; opacity: 1;
```

**Note:** Use `max-height` transition instead of `height: auto` for smooth animation. Set max-height to a value larger than expected content (600px) to ensure smooth expansion.

#### Chevron Rotation
```css
transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);

/* States */
collapsed: transform: rotate(0deg);
expanded: transform: rotate(90deg);
```

#### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .accordion-content,
  .accordion-icon {
    transition: none;
  }
}
```

---

## 6. User Flows

### Flow 1: First-Time User Discovery
1. User completes Step 1 (Subject): "A vintage car driving through autumn forest"
2. User clicks "Continue" to proceed to Step 2
3. Page scrolls to top, Step 2 (Action & Setting) form appears
4. User notices new accordion panel above form: "Your Prompt So Far [1/5]"
5. User hovers over accordion header (cursor changes to pointer)
6. User clicks accordion header out of curiosity
7. Accordion expands smoothly, revealing Subject content
8. User reads: "A vintage car driving through autumn forest"
9. User thinks: "Great, now I'll add the action and setting"
10. User enters: "Cruising along winding mountain roads with golden leaves falling"
11. User leaves accordion expanded as reference while typing

### Flow 2: Power User - Quick Reference
1. User is on Step 4 (Camera & Shot), accordion is collapsed
2. User begins typing: "Wide establishing shot..."
3. User pauses, thinks: "Wait, did I mention the time of day?"
4. User clicks accordion header to expand
5. Accordion opens, shows Steps 1-3
6. User quickly scans to Action & Setting: "Late afternoon"
7. User confirms time of day is established
8. User clicks accordion header to collapse (reduce clutter)
9. User continues: "Wide establishing shot tracking the car from above"

### Flow 3: Mobile User - Limited Screen Space
1. User on mobile device, Step 3 (Cinematic Style)
2. Accordion is collapsed, taking up minimal space
3. User taps accordion to expand
4. Content area opens to 60% of viewport height
5. User scrolls within accordion to see all previous fields
6. After reviewing, user taps accordion header to collapse
7. Full vertical space now available for current step form
8. User completes Cinematic Style field efficiently

### Flow 4: Session Persistence
1. User on Step 3, expands accordion to review context
2. User navigates to Step 4 (clicks "Continue")
3. New step loads with accordion in expanded state (persisted)
4. User appreciates not having to re-expand manually
5. User decides they don't need constant visibility
6. User collapses accordion on Step 4
7. User navigates to Step 5
8. Accordion appears collapsed (per user's preference)

---

## 7. Accessibility Requirements

### 7.1 Semantic HTML
```html
<div class="accordion-container" role="region" aria-labelledby="accordion-header">
  <button 
    id="accordion-header"
    type="button"
    aria-expanded="false"
    aria-controls="accordion-content"
  >
    <!-- Header content -->
  </button>
  
  <div 
    id="accordion-content"
    role="region"
    aria-labelledby="accordion-header"
    hidden={!isExpanded}
  >
    <!-- Field content -->
  </div>
</div>
```

### 7.2 ARIA Attributes
- **Container:** `role="region"` with `aria-labelledby` pointing to header ID
- **Header Button:** 
  - `aria-expanded="true|false"` to indicate state
  - `aria-controls` pointing to content area ID
- **Content Area:** 
  - `role="region"` for landmark navigation
  - `hidden` attribute when collapsed (not just CSS display:none)

### 7.3 Keyboard Navigation
- **Tab:** Focus on accordion header button
- **Enter/Space:** Toggle expanded/collapsed state
- **Tab (when expanded):** Move focus into content area (if content is focusable)
- **Escape:** Collapse accordion if expanded (optional enhancement)

### 7.4 Focus Management
- **Focus Ring:** High contrast, 2px solid gold primary color
- **Focus Visible:** Only show focus ring for keyboard navigation (`:focus-visible`)
- **Focus Order:** Accordion header appears in natural tab order before step form fields

### 7.5 Screen Reader Announcements
```typescript
// When accordion expands
aria-live="polite" announcement: "Your Prompt So Far expanded. Showing 3 completed fields."

// When accordion collapses
aria-live="polite" announcement: "Your Prompt So Far collapsed."

// Alternative: Use aria-expanded and let screen reader handle
```

### 7.6 Color Contrast
All text must meet WCAG 2.1 AA standards:
- **Header Text (#E8E8E8 on #1A1A1A):** 11.6:1 ✓
- **Content Text (#E8E8E8 on #1A1A1A):** 11.6:1 ✓
- **Label Text (#666666 on #1A1A1A):** 4.9:1 ✓
- **Count Badge (#999999 on #1A1A1A):** 7.5:1 ✓

### 7.7 Touch Targets
- **Minimum Size:** 48x48px for header button on mobile
- **Actual Size:** 48px height on mobile, 56px on desktop
- **Spacing:** Adequate spacing above and below (24px) to prevent mis-taps

### 7.8 Motion & Animation
```css
@media (prefers-reduced-motion: reduce) {
  .accordion-content,
  .chevron-icon {
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Implementation Checklist

### Phase 1: Component Foundation
- [ ] Create `/frontend/components/builder/PromptSummaryAccordion.tsx`
- [ ] Define TypeScript interface `PromptSummaryAccordionProps`
- [ ] Set up component state (`isExpanded`)
- [ ] Create field mapping logic (`stepToFieldMap`)
- [ ] Create label mapping (`fieldLabels`)
- [ ] Add file header with Feature ID (F-15.2)

### Phase 2: Header Implementation
- [ ] Build accordion header button with proper semantics
- [ ] Add chevron icon with rotation animation
- [ ] Add "Your Prompt So Far" title text
- [ ] Add completion count badge `[X/5]`
- [ ] Implement hover and focus states
- [ ] Add click handler for toggle functionality

### Phase 3: Content Area
- [ ] Build content container with overflow handling
- [ ] Implement max-height transition for expand/collapse
- [ ] Map through completed fields and render each
- [ ] Style field labels (uppercase, tracking, small)
- [ ] Style field values (preserve whitespace, readable)
- [ ] Add internal scrolling for long content
- [ ] Style custom scrollbar

### Phase 4: State Management
- [ ] Implement sessionStorage read on mount
- [ ] Implement sessionStorage write on toggle
- [ ] Create unique storage key per step
- [ ] Handle edge cases (no saved state, invalid JSON)
- [ ] Add optional `onToggle` callback prop

### Phase 5: Integration
- [ ] Import component into `build/page.tsx`
- [ ] Add conditional rendering (steps 2-5 only)
- [ ] Pass `prompt` and `currentStep` props
- [ ] Position above step form components
- [ ] Test with real prompt data

### Phase 6: Styling & Responsiveness
- [ ] Apply Tailwind classes per design spec
- [ ] Implement responsive max-height (60vh mobile, 50vh tablet, 400px desktop)
- [ ] Implement responsive padding and font sizes
- [ ] Test on all breakpoints (320px, 768px, 1024px, 1280px+)
- [ ] Verify layout doesn't shift when expanding
- [ ] Test with very long content (overflow)

### Phase 7: Accessibility
- [ ] Add all ARIA attributes
- [ ] Implement keyboard navigation (Enter/Space)
- [ ] Add focus ring styling
- [ ] Test with screen reader (VoiceOver on Mac)
- [ ] Add `hidden` attribute to collapsed content
- [ ] Verify color contrast ratios
- [ ] Add `prefers-reduced-motion` support

### Phase 8: Polish & Edge Cases
- [ ] Handle empty prompt (no fields to show)
- [ ] Handle Step 1 (no accordion shown)
- [ ] Handle rapid clicking (debounce if needed)
- [ ] Add smooth scroll if accordion pushes content
- [ ] Test on slow devices (animation performance)
- [ ] Optimize re-renders with React.memo if needed

### Phase 9: Testing
- [ ] Unit tests for component
- [ ] Test sessionStorage persistence
- [ ] Test with all step transitions
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Mobile device testing (iOS Safari, Chrome Android)
- [ ] Accessibility audit with axe-core
- [ ] Performance testing (no jank)

### Phase 10: Documentation
- [ ] Add JSDoc comments to component
- [ ] Update `/docs/Architecture.md` with new component path
- [ ] Update `/docs/Components.md` with component documentation
- [ ] Create component usage examples

---

## 9. Testing Criteria

### Functional Tests
| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| Accordion appears on Step 2+ | Visible above form | [ ] |
| Accordion hidden on Step 1 | Not rendered | [ ] |
| Click header when collapsed | Expands with animation | [ ] |
| Click header when expanded | Collapses with animation | [ ] |
| Shows only completed fields | Doesn't show future steps | [ ] |
| Field labels are correct | Matches fieldLabels map | [ ] |
| Field values display correctly | Full content, line breaks preserved | [ ] |
| Completion count accurate | [X/5] matches completed steps | [ ] |
| State persists on navigation | Expanded stays expanded | [ ] |
| State is step-specific | Each step has own state | [ ] |
| Content scrolls when long | Scrollbar appears, functions correctly | [ ] |

### Visual Tests
| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| Collapsed height correct | 48px mobile, 56px desktop | [ ] |
| Expanded max-height correct | 60vh mobile, 50vh tablet, 400px desktop | [ ] |
| Chevron rotates smoothly | 0deg → 90deg in 300ms | [ ] |
| Hover state works | Background changes to tertiary | [ ] |
| Colors match design spec | All colors from DesignSpec.md | [ ] |
| Typography correct | Sizes, weights, families match spec | [ ] |
| Spacing consistent | Padding and margins per spec | [ ] |
| No layout shift | Page doesn't jump when expanding | [ ] |

### Accessibility Tests
| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| Tab focuses on header | Focus ring visible | [ ] |
| Enter/Space toggles | Keyboard activation works | [ ] |
| aria-expanded updates | "true" when expanded, "false" when collapsed | [ ] |
| Screen reader announces | "Button, Your Prompt So Far, collapsed/expanded" | [ ] |
| Focus ring visible | High contrast on dark background | [ ] |
| Color contrast passes | All text meets WCAG AA | [ ] |
| Touch target size adequate | ≥48x48px on mobile | [ ] |
| Reduced motion respected | No animation if user prefers | [ ] |

### Performance Tests
| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| Expand animation smooth | 60fps, no jank | [ ] |
| No memory leaks | Event listeners cleaned up | [ ] |
| sessionStorage efficient | No excessive reads/writes | [ ] |
| Fast initial render | No delay showing component | [ ] |

### Edge Case Tests
| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| Empty prompt (Step 1) | No accordion shown | [ ] |
| Very long content | Scrolls within accordion | [ ] |
| Rapid clicking | Doesn't break animation | [ ] |
| Invalid sessionStorage data | Gracefully defaults to collapsed | [ ] |
| Orientation change | Responds to new viewport size | [ ] |

---

## 10. Success Metrics

### Primary Metrics
1. **Adoption Rate**
   - **Definition:** % of users who expand accordion at least once per session
   - **Target:** 65%+
   - **Measurement:** Track accordion expand events via analytics

2. **Time to Complete Prompt**
   - **Definition:** Average time from Step 1 start to Step 5 completion
   - **Target:** 15% reduction from baseline
   - **Measurement:** Compare before/after feature deployment

3. **Back Navigation Reduction**
   - **Definition:** % decrease in clicking "Back" button to review previous steps
   - **Target:** 35% reduction
   - **Measurement:** Compare back button clicks before/after

### Secondary Metrics
4. **Accordion Engagement**
   - **Definition:** Average number of accordion expansions per session
   - **Expected:** 2.5-3.5 expansions
   - **Measurement:** Count expand events per user session

5. **Mobile Completion Rate**
   - **Definition:** % of mobile users who complete all 5 steps
   - **Target:** 18% increase (from lower baseline)
   - **Measurement:** Track mobile completion funnel

6. **Prompt Quality Score**
   - **Definition:** Subjective quality rating (1-5) of exported prompts
   - **Target:** 0.3 point increase in average
   - **Measurement:** Optional user survey post-export

### User Satisfaction Metrics
7. **Feature Usefulness**
   - **Survey Question:** "The 'Your Prompt So Far' accordion helps me create better prompts"
   - **Target:** 4.3/5 average agreement
   - **Measurement:** Post-session survey (optional)

8. **Discoverability**
   - **Survey Question:** "I easily found and understood how to use this feature"
   - **Target:** 4.5/5 average agreement
   - **Measurement:** First-time user survey

### Technical Metrics
9. **Performance Impact**
   - **Page Load Time:** No increase (< 50ms delta)
   - **Interaction to Paint:** Expand animation < 300ms
   - **Lighthouse Score:** Maintain 95+ accessibility score

10. **Error Rate**
    - **JavaScript Errors:** Zero errors related to accordion component
    - **Render Failures:** Zero failed renders in production

---

## 11. Open Questions & Risks

### Open Questions

#### Q1: Default Expanded State
**Question:** Should the accordion be expanded by default on first view of each step?

**Options:**
- A) Always collapsed (user opts in)
- B) Expanded on first view, then respects user preference
- C) Expanded on Step 2 only (first time seeing accordion), then collapsed

**Recommendation:** Option A (Always collapsed)
- Rationale: Respects minimal UI principle, lets users discover organically, doesn't assume all users need context at all times

#### Q2: Content Formatting
**Question:** Should field values show full content or have a character limit with "Show more"?

**Options:**
- A) Always show full content (current spec)
- B) Truncate at 200 chars with "Show more" button
- C) Truncate at 200 chars with automatic expansion if content exceeds 300 chars

**Recommendation:** Option A (Full content)
- Rationale: Users opened accordion specifically to see context; truncation adds friction. Scrollbar handles long content.

#### Q3: Step 1 Behavior
**Question:** Should Step 1 have a placeholder message like "Complete this step to see your prompt summary"?

**Options:**
- A) No accordion on Step 1 (current spec)
- B) Show disabled accordion with placeholder message
- C) Show "Tips" accordion instead with best practices

**Recommendation:** Option A (No accordion)
- Rationale: Step 1 has no previous context to show. Don't clutter with empty states.

### Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation Strategy |
|------|--------|------------|---------------------|
| Users don't discover accordion | High | Medium | Add subtle pulse animation on first appearance; show tooltip on first load |
| Long content makes page feel cluttered | Medium | Low | Limit max-height to 60vh mobile / 400px desktop; use scrolling |
| Animation causes jank on low-end devices | Medium | Low | Use CSS transforms only; test on older devices; respect prefers-reduced-motion |
| State persistence confuses users | Low | Low | Clear sessionStorage on new prompt; provide "Reset" option if needed |
| Accordion conflicts with existing PromptOutput on XL screens | Low | Very Low | Test coexistence; both can show simultaneously without issues |
| Accessibility issues with dynamic content | Medium | Low | Follow WAI-ARIA accordion pattern; test with multiple screen readers |

---

## 12. Future Enhancements

### Phase 2 Possibilities
1. **Quick Edit:** Allow inline editing of previous fields from accordion (click field to edit)
2. **Smart Highlight:** Highlight relevant previous content when AI suggests related improvements
3. **Search Within Accordion:** If content gets very long, add search/filter functionality
4. **Keyboard Shortcut:** `Cmd/Ctrl + K` to toggle accordion
5. **Auto-Collapse on Type:** Automatically collapse when user starts typing (reduce distraction)

### Long-Term Vision
1. **AI Context Awareness:** Accordion highlights fields that AI Co-pilot references in suggestions
2. **Version History:** Show previous versions of edited fields (track changes)
3. **Collaborative Indicators:** If multi-user support added, show who wrote which field
4. **Export from Accordion:** Quick export button directly in accordion header
5. **Smart Summary:** Show AI-generated summary instead of full content (toggle between views)

---

## 13. Related Documentation

- **PRD:** `/docs/PRD.md` - Product requirements and user experience goals
- **Design Spec:** `/docs/DesignSpec.md` - Design system, colors, typography, animations
- **Architecture:** `/docs/Architecture.md` - File structure and component patterns
- **Components:** `/docs/Components.md` - UI component library reference
- **Types:** `/frontend/lib/types.ts` - `Prompt` interface definition
- **Related Feature:** `/docs/features/context-memory-hybrid.md` - Alternative hybrid solution

---

## Appendix A: Code Examples

### Component Structure
```typescript
/**
 * @FeatureID F-15.2
 * @Purpose Expandable accordion showing completed prompt fields for context
 * @Spec /docs/features/context-memory-accordion.md
 * @Author Chat Bot Labs
 */

import { useState, useEffect, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Prompt } from "@/lib/types";

interface PromptSummaryAccordionProps {
  prompt: Partial<Prompt>;
  currentStep: number;
  onToggle?: (expanded: boolean) => void;
  className?: string;
}

export const PromptSummaryAccordion: React.FC<PromptSummaryAccordionProps> = ({
  prompt,
  currentStep,
  onToggle,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Field configuration
  const stepToFieldMap: Record<number, Array<keyof Prompt>> = {
    1: [],
    2: ["subject"],
    3: ["subject", "actionSetting"],
    4: ["subject", "actionSetting", "cinematicStyle"],
    5: ["subject", "actionSetting", "cinematicStyle", "cameraShot"],
  };
  
  const fieldLabels: Record<keyof Prompt, string> = {
    subject: "Subject",
    actionSetting: "Action & Setting",
    cinematicStyle: "Cinematic Style",
    cameraShot: "Camera & Shot",
    visualDetails: "Visual Details",
  };
  
  // Get fields to display
  const fieldsToShow = stepToFieldMap[currentStep] || [];
  const completedCount = fieldsToShow.length;
  
  // sessionStorage key
  const storageKey = `sora-accordion-step-${currentStep}`;
  
  // Load saved state on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const { expanded } = JSON.parse(saved);
        setIsExpanded(expanded);
      }
    } catch (error) {
      console.warn("Failed to load accordion state:", error);
    }
  }, [storageKey]);
  
  // Toggle handler
  const handleToggle = useCallback(() => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({
        expanded: newState,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.warn("Failed to save accordion state:", error);
    }
    
    onToggle?.(newState);
  }, [isExpanded, storageKey, onToggle]);
  
  // Don't render if no fields to show
  if (fieldsToShow.length === 0) {
    return null;
  }
  
  return (
    <div
      className={cn(
        "bg-background-secondary border border-divider rounded-base overflow-hidden",
        className
      )}
      role="region"
      aria-labelledby="accordion-header"
    >
      {/* Header */}
      <button
        id="accordion-header"
        type="button"
        onClick={handleToggle}
        aria-expanded={isExpanded}
        aria-controls="accordion-content"
        className={cn(
          "w-full px-4 py-3 md:px-5 md:py-4",
          "flex items-center justify-between",
          "cursor-pointer transition-colors duration-200",
          "hover:bg-background-tertiary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-inset"
        )}
      >
        <div className="flex items-center gap-3">
          <ChevronRight
            className={cn(
              "h-5 w-5 text-text-tertiary transition-transform duration-300",
              isExpanded && "rotate-90"
            )}
            aria-hidden="true"
          />
          <h3 className="text-base md:text-lg font-semibold text-text-primary">
            Your Prompt So Far
          </h3>
        </div>
        <span className="text-sm text-text-tertiary font-medium">
          [{completedCount}/5]
        </span>
      </button>
      
      {/* Content */}
      <div
        id="accordion-content"
        role="region"
        aria-labelledby="accordion-header"
        hidden={!isExpanded}
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded
            ? "max-h-[60vh] md:max-h-[50vh] lg:max-h-[400px] overflow-y-auto"
            : "max-h-0"
        )}
      >
        <div className="p-4 md:p-5 space-y-4">
          {fieldsToShow.map((field) => {
            const value = prompt[field];
            if (!value) return null;
            
            return (
              <div key={field} className="space-y-1">
                <div className="text-xs uppercase tracking-wide text-text-tertiary font-medium">
                  {fieldLabels[field]}
                </div>
                <div className="text-sm md:text-base text-text-primary whitespace-pre-wrap leading-relaxed">
                  {value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
```

### Usage Example
```typescript
// In build/page.tsx
import { PromptSummaryAccordion } from "@/components/builder/PromptSummaryAccordion";

// Inside component
<div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-12">
  {/* Show accordion on steps 2-5 */}
  {currentStep > 1 && (
    <PromptSummaryAccordion
      prompt={prompt}
      currentStep={currentStep}
      className="mb-6"
      onToggle={(expanded) => console.log("Accordion toggled:", expanded)}
    />
  )}
  
  {/* Current step component */}
  {renderStep()}
  
  {/* Step controls */}
  <StepControls {...controlProps} />
</div>
```

---

**Document End**

