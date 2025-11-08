# Feature Specification: Context Memory - Hybrid Approach

**Feature ID:** F-15.1  
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
When users navigate through the 5-step prompt building process (Subject → Action & Setting → Cinematic Style → Camera & Shot → Visual Details), they lose context of what they've entered in previous steps. This creates several challenges:

- **Cognitive Load:** Users must remember multiple pieces of information across steps
- **Context Switching:** Moving between steps requires mental reconstruction of prior inputs
- **Quality Impact:** Without seeing the full picture, users may create disjointed or redundant content
- **Inefficiency:** Users may navigate back and forth repeatedly to review previous inputs

### Current Limitations
The existing `PromptOutput` component provides a preview panel, but:
- Only visible on XL screens (≥1280px) in a fixed sidebar
- Not accessible on mobile or tablet devices
- No inline context within the step flow
- Users on smaller screens have zero visibility of their progress

### Impact
- Increased time to complete prompts
- Lower quality outputs due to lack of holistic view
- User frustration and potential abandonment
- Reduced confidence in prompt coherence

---

## 2. Proposed Solution

### Overview
The **Hybrid Approach** combines two complementary UI patterns to provide optimal context visibility across all device types:

1. **Expandable Accordion (Desktop/Tablet):** An inline "Your Prompt So Far" section above each step form that expands to show all previously completed fields
2. **Floating Preview Button (Mobile/Tablet):** A persistent floating action button that opens the `PromptOutput` component as a slide-in overlay

This dual approach ensures users always have access to their context while maintaining a clean, uncluttered interface.

### Key Benefits
- **Device-Adaptive:** Best pattern for each screen size
- **User Control:** Optional visibility - users choose when to view context
- **Zero Clutter:** Minimal visual footprint when not in use
- **Complete Context:** Full content visibility, not truncated
- **Leverages Existing Components:** Reuses `PromptOutput` for consistency

---

## 3. User Stories

### US-15.1.1: Desktop Context Review
**As a** desktop user building a prompt  
**I want to** quickly review what I've entered in previous steps  
**So that** I can ensure my new input aligns with and enhances my existing prompt

**Acceptance Criteria:**
- Expandable accordion appears above the step form (Steps 2-5)
- Clicking accordion header toggles content visibility
- All completed fields are displayed with clear labels
- Content preserves line breaks and formatting
- Accordion state persists during session

### US-15.1.2: Mobile Context Access
**As a** mobile user building a prompt  
**I want to** view my complete prompt preview at any time  
**So that** I can see the full context without leaving my current step

**Acceptance Criteria:**
- Floating preview button visible at all times (bottom-right corner)
- Tapping button slides in preview panel from right
- Preview shows formatted prompt output using `PromptOutput` component
- Panel can be dismissed via close button or overlay tap
- Smooth animations enhance perceived performance

### US-15.1.3: Tablet Flexibility
**As a** tablet user in portrait or landscape mode  
**I want to** choose between inline accordion or overlay preview  
**So that** I can use the method that best suits my current context

**Acceptance Criteria:**
- Both accordion (portrait/landscape) and floating button (portrait) available
- Interface responds to orientation changes
- Accordion preferred on landscape for screen real estate
- Floating button available as fallback

---

## 4. Technical Specifications

### 4.1 Component Architecture

#### New Components

##### `PromptSummaryAccordion.tsx`
Location: `/frontend/components/builder/PromptSummaryAccordion.tsx`

```typescript
interface PromptSummaryAccordionProps {
  prompt: Partial<Prompt>;
  currentStep: number;
  className?: string;
}

export const PromptSummaryAccordion: React.FC<PromptSummaryAccordionProps>
```

**Responsibilities:**
- Render expandable/collapsible accordion header
- Display all completed fields up to current step
- Format field content with proper labels
- Maintain expanded/collapsed state in sessionStorage
- Handle keyboard navigation (Enter/Space to toggle)

**Props:**
- `prompt`: Current prompt object with all field values
- `currentStep`: Current step number (1-5) to filter completed fields
- `className`: Optional Tailwind classes for customization

##### `FloatingPreviewButton.tsx`
Location: `/frontend/components/builder/FloatingPreviewButton.tsx`

```typescript
interface FloatingPreviewButtonProps {
  prompt: Partial<Prompt>;
  onClick: () => void;
  className?: string;
}

export const FloatingPreviewButton: React.FC<FloatingPreviewButtonProps>
```

**Responsibilities:**
- Render fixed-position floating action button
- Show/hide based on responsive breakpoint
- Pulse animation when prompt has content
- Handle touch interactions
- Maintain high z-index for visibility

**Props:**
- `prompt`: Current prompt object (to determine if button should pulse)
- `onClick`: Callback to open preview overlay
- `className`: Optional Tailwind classes

##### `PreviewOverlay.tsx`
Location: `/frontend/components/builder/PreviewOverlay.tsx`

```typescript
interface PreviewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: Partial<Prompt>;
  className?: string;
}

export const PreviewOverlay: React.FC<PreviewOverlayProps>
```

**Responsibilities:**
- Render full-screen overlay with backdrop
- Slide in preview panel from right
- Integrate `PromptOutput` component
- Handle dismiss interactions (close button, backdrop click, ESC key)
- Prevent body scroll when open
- Smooth slide animations

**Props:**
- `isOpen`: Controls overlay visibility
- `onClose`: Callback when overlay should close
- `prompt`: Current prompt object to pass to `PromptOutput`
- `className`: Optional Tailwind classes

#### Modified Components

##### `build/page.tsx`
**Changes Required:**
- Add state for accordion expanded status
- Add state for preview overlay visibility
- Import and render `PromptSummaryAccordion` (conditionally based on breakpoint)
- Import and render `FloatingPreviewButton` (conditionally based on breakpoint)
- Import and render `PreviewOverlay`
- Add handlers for overlay open/close

##### `PromptOutput.tsx`
**Changes Required (Optional):**
- Add optional `compact` prop for mobile optimization
- Adjust spacing for overlay context
- No breaking changes to existing XL sidebar usage

### 4.2 Responsive Behavior

#### Breakpoint Strategy
```css
/* Mobile: 0-767px */
- Show: FloatingPreviewButton + PreviewOverlay
- Hide: PromptSummaryAccordion

/* Tablet: 768-1023px */
- Show: PromptSummaryAccordion + FloatingPreviewButton (portrait)
- Show: PromptSummaryAccordion only (landscape)

/* Desktop: 1024-1279px */
- Show: PromptSummaryAccordion
- Hide: FloatingPreviewButton

/* Desktop XL: 1280px+ */
- Show: PromptSummaryAccordion + Fixed PromptOutput sidebar (existing)
- Hide: FloatingPreviewButton
```

#### Implementation
Use Tailwind responsive classes and React hooks to conditionally render:

```typescript
const [isMobile, setIsMobile] = useState(false);
const [showPreviewOverlay, setShowPreviewOverlay] = useState(false);

useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 768);
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);
```

### 4.3 State Management

#### Session State
Store accordion expanded state in `sessionStorage`:
```typescript
key: `accordion-expanded-step-${currentStep}`
value: "true" | "false"
```

#### Component State
In `build/page.tsx`:
```typescript
const [accordionExpanded, setAccordionExpanded] = useState<Record<number, boolean>>({});
const [previewOverlayOpen, setPreviewOverlayOpen] = useState(false);
```

---

## 5. Design Specifications

### 5.1 PromptSummaryAccordion

#### Visual Design
```
┌─────────────────────────────────────────────────────┐
│ ▶ Your Prompt So Far                          [3/5] │ ← Header (collapsed)
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ ▼ Your Prompt So Far                          [3/5] │ ← Header (expanded)
├─────────────────────────────────────────────────────┤
│                                                      │
│ Subject                                              │
│ A futuristic robot walking through a neon city      │
│                                                      │
│ Action & Setting                                     │
│ Late at night in a cyberpunk metropolis with        │
│ rain-soaked streets and holographic billboards      │
│                                                      │
│ Cinematic Style                                      │
│ Blade Runner aesthetic with rich blue and purple    │
│ tones, film grain, anamorphic lens                   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

#### Styling
- **Container:** `bg-background-secondary border border-divider rounded-base p-4 mb-6`
- **Header:** `flex items-center justify-between cursor-pointer hover:bg-background-tertiary transition-colors`
- **Title:** `text-lg font-semibold text-text-primary`
- **Count Badge:** `text-sm text-text-tertiary`
- **Icon:** Chevron (rotate 90deg when expanded)
- **Content:** `pt-4 space-y-4 text-text-secondary`
- **Field Label:** `text-xs uppercase tracking-wide text-text-tertiary mb-1`
- **Field Value:** `text-sm text-text-primary whitespace-pre-wrap`

#### Animations
```css
/* Accordion content */
transition: max-height 300ms cubic-bezier(0.4, 0, 0.2, 1);

/* Chevron rotation */
transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

#### Positioning
- Appears above step form content (below step title)
- Only visible on steps 2-5 (no need on step 1)
- Full width of content container

### 5.2 FloatingPreviewButton

#### Visual Design
```
    [Screen Content]


                        ┌───────┐
                        │   👁️  │  ← Floating Button
                        └───────┘
                        (bottom-right)
```

#### Styling
- **Size:** 56x56px (mobile touch target)
- **Position:** `fixed bottom-20 right-4 md:bottom-24 md:right-6`
- **Background:** `bg-gold-primary hover:bg-gold-dark`
- **Shadow:** `shadow-2xl` with gold glow
- **Icon:** Eye icon from Lucide React
- **Z-index:** 30 (below modals, above content)

#### Pulse Animation (when content exists)
```css
@keyframes pulse-gold {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(212, 175, 55, 0);
  }
}

animation: pulse-gold 2s infinite;
```

#### Interaction States
- **Default:** Gold background, eye icon
- **Hover/Press:** Darker gold, slight scale (1.05x)
- **Active:** Brief scale down (0.95x) then bounce back

### 5.3 PreviewOverlay

#### Visual Design
```
┌─────────────────────────────────────────────────────┐
│ [Backdrop: dark overlay 50% opacity]                │
│                                                      │
│                           ┌──────────────────────┐ │
│                           │ ✕  Preview           │ │
│                           ├──────────────────────┤ │
│                           │                      │ │
│                           │ [PromptOutput        │ │
│                           │  Component]          │ │
│                           │                      │ │
│                           │                      │ │
│                           └──────────────────────┘ │
│                                      ↑             │
│                                 Slide in from right │
└─────────────────────────────────────────────────────┘
```

#### Styling
- **Backdrop:** `fixed inset-0 bg-background-primary/50 backdrop-blur-sm z-50`
- **Panel:** `fixed top-0 right-0 h-full w-full md:w-96 bg-background-primary border-l border-divider z-50 shadow-2xl`
- **Header:** `flex items-center justify-between p-4 border-b border-divider`
- **Close Button:** `text-text-secondary hover:text-text-primary transition-colors`
- **Content:** `overflow-y-auto p-4 h-[calc(100vh-64px)]`

#### Animations
```css
/* Panel slide in */
@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

animation: slideIn 300ms cubic-bezier(0.4, 0, 0.2, 1);

/* Backdrop fade in */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

animation: fadeIn 200ms ease-in;
```

---

## 6. User Flows

### Flow 1: Desktop User Reviews Context (Accordion)
1. User completes Step 1 (Subject)
2. User clicks "Continue" to Step 2
3. `PromptSummaryAccordion` appears above Action & Setting form
4. Accordion is collapsed by default with "Your Prompt So Far [1/5]" header
5. User clicks accordion header
6. Accordion expands with smooth animation, showing Subject field
7. User reviews subject: "A futuristic robot walking through a neon city"
8. User begins entering Action & Setting with full context visible
9. User can collapse accordion by clicking header again if desired
10. Process repeats for Steps 3-5 with cumulative context

### Flow 2: Mobile User Accesses Preview
1. User is on Step 3 (Cinematic Style) on mobile device
2. User sees floating preview button in bottom-right corner (pulsing)
3. User taps floating preview button
4. Preview overlay slides in from right with backdrop
5. User sees complete formatted prompt with all completed fields
6. User reviews Subject, Action & Setting, and partial Style entries
7. User taps backdrop or close button (×) to dismiss
8. Overlay slides out with smooth animation
9. User continues editing current step with refreshed context

### Flow 3: Tablet User in Portrait Mode
1. User rotates tablet to portrait orientation
2. Screen width < 1024px triggers responsive layout
3. Both accordion and floating button are available
4. User prefers accordion for quick reference (less intrusive)
5. User taps floating button when needing full formatted preview
6. Interface adapts seamlessly to user preference

---

## 7. Accessibility Requirements

### 7.1 PromptSummaryAccordion
- **ARIA:** `role="region"` with `aria-labelledby` linking to header
- **Button:** `aria-expanded="true/false"` on accordion header button
- **Keyboard:** Enter/Space to toggle, Tab to navigate through content
- **Focus:** Visible focus ring on header button
- **Screen Reader:** Announce "Expanded/Collapsed" state changes

### 7.2 FloatingPreviewButton
- **Label:** `aria-label="Open prompt preview"`
- **Keyboard:** Accessible via Tab navigation, Enter/Space to activate
- **Focus:** High contrast focus ring visible on dark background
- **Touch Target:** Minimum 48x48px (56x56px for comfort)
- **Screen Reader:** "Button, Open prompt preview"

### 7.3 PreviewOverlay
- **Focus Trap:** Focus locked within overlay when open
- **ESC Key:** Close overlay on Escape key press
- **Focus Management:** Return focus to floating button on close
- **ARIA:** `role="dialog"` with `aria-modal="true"` and `aria-labelledby`
- **Screen Reader:** Announce "Preview dialog opened" on open
- **Backdrop:** `aria-hidden="true"` to prevent screen reader access

### 7.4 General
- **Color Contrast:** All text meets WCAG 2.1 AA standards (4.5:1 minimum)
- **Motion:** Respect `prefers-reduced-motion` for animations
- **Touch Targets:** All interactive elements ≥44x44px
- **Semantic HTML:** Proper heading hierarchy, button elements

---

## 8. Implementation Checklist

### Phase 1: Foundation
- [ ] Create `PromptSummaryAccordion.tsx` component with basic structure
- [ ] Create `FloatingPreviewButton.tsx` component with positioning
- [ ] Create `PreviewOverlay.tsx` component with slide-in animation
- [ ] Add TypeScript interfaces for all new components
- [ ] Set up responsive breakpoint detection hook

### Phase 2: Integration
- [ ] Integrate `PromptSummaryAccordion` into build page (Steps 2-5)
- [ ] Add accordion state management (expanded/collapsed)
- [ ] Integrate `FloatingPreviewButton` with conditional rendering
- [ ] Integrate `PreviewOverlay` with open/close handlers
- [ ] Connect components to existing prompt state

### Phase 3: Styling & Animation
- [ ] Implement accordion expand/collapse animation
- [ ] Implement overlay slide-in/out animation
- [ ] Add floating button pulse animation
- [ ] Style all components per design specifications
- [ ] Add hover and focus states

### Phase 4: Accessibility
- [ ] Add ARIA attributes to all components
- [ ] Implement keyboard navigation
- [ ] Add focus trap to overlay
- [ ] Test with screen readers (VoiceOver, NVDA)
- [ ] Verify color contrast ratios

### Phase 5: Responsive & Edge Cases
- [ ] Test on mobile (320px - 767px)
- [ ] Test on tablet portrait (768px - 1023px)
- [ ] Test on tablet landscape (1024px - 1279px)
- [ ] Test on desktop (1280px+)
- [ ] Handle orientation changes
- [ ] Test with empty prompt state
- [ ] Test with long content (overflow handling)

### Phase 6: Performance & Polish
- [ ] Add sessionStorage persistence for accordion state
- [ ] Prevent body scroll when overlay open
- [ ] Optimize re-renders with React.memo if needed
- [ ] Add loading states if needed
- [ ] Implement smooth scroll behavior

### Phase 7: Testing
- [ ] Unit tests for each component
- [ ] Integration tests for build page
- [ ] Accessibility audit with axe-core
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] User acceptance testing

---

## 9. Testing Criteria

### Functional Testing
- [ ] Accordion expands/collapses on click
- [ ] Accordion shows only completed fields up to current step
- [ ] Floating button appears only on mobile/small screens
- [ ] Floating button opens preview overlay on click
- [ ] Overlay closes on backdrop click, close button, and ESC key
- [ ] Accordion state persists during session
- [ ] Components render correctly on all breakpoints
- [ ] Orientation changes trigger correct responsive behavior

### Visual Testing
- [ ] Accordion animation is smooth (no jank)
- [ ] Overlay slide-in animation is smooth
- [ ] Floating button pulse animation works correctly
- [ ] All colors match design specification
- [ ] Typography scales correctly
- [ ] Focus states are clearly visible
- [ ] Components maintain layout on different screen sizes

### Accessibility Testing
- [ ] All interactive elements keyboard accessible
- [ ] Screen reader announces all content correctly
- [ ] Focus trap works in overlay
- [ ] Focus returns correctly after overlay closes
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets meet size requirements (44x44px min)
- [ ] ARIA attributes properly implemented

### Performance Testing
- [ ] No layout shift when accordion expands
- [ ] Animations run at 60fps
- [ ] No memory leaks from event listeners
- [ ] Responsive breakpoint detection efficient
- [ ] Component renders don't block main thread

### Edge Case Testing
- [ ] Empty prompt (Step 1) - no accordion shown
- [ ] Very long field content (overflow handling)
- [ ] Rapid expand/collapse clicks (debouncing)
- [ ] Orientation change during overlay open
- [ ] Slow network (component loading)
- [ ] Browser back button behavior

---

## 10. Success Metrics

### Quantitative Metrics
- **Context Access Rate:** % of users who expand accordion or open preview (Target: 60%+)
- **Time to Complete Prompt:** Average time reduction from baseline (Target: 15% reduction)
- **Back Navigation Rate:** % reduction in back button clicks (Target: 30% reduction)
- **Mobile Completion Rate:** % increase in mobile prompt completions (Target: 20% increase)
- **Accordion Engagement:** Average expansions per session (Expected: 2-3)

### Qualitative Metrics
- **User Satisfaction:** Post-feature survey score (Target: 4.5/5)
- **Perceived Value:** "This feature helps me create better prompts" agreement rate (Target: 80%+)
- **Usability:** "Easy to use and understand" rating (Target: 4.5/5)
- **Discovery:** "I found this feature immediately" agreement rate (Target: 75%+)

### Technical Metrics
- **Load Time Impact:** No increase to page load time
- **Interaction to Paint:** Accordion expand < 300ms
- **Accessibility Score:** Maintain 100/100 on Lighthouse Accessibility audit
- **Error Rate:** Zero console errors related to new components

---

## 11. Open Questions & Risks

### Open Questions
1. **Accordion Default State:** Should accordion be expanded by default on first view per step?
   - *Recommendation:* Collapsed by default, expand on first click, persist choice
2. **Mobile Button Position:** Bottom-right vs bottom-center for floating button?
   - *Recommendation:* Bottom-right (doesn't obstruct content, thumb-friendly)
3. **Overlay Width on Tablet:** Full width vs 50% width in landscape?
   - *Recommendation:* 66% width (400px) for balance between preview and context
4. **Animation Duration:** 200ms vs 300ms for overlay slide?
   - *Recommendation:* 300ms (feels more cinematic, less jarring)

### Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Performance impact on older devices | Medium | Low | Use CSS transforms, test on low-end devices, add reduced motion option |
| User confusion with multiple access methods | Medium | Medium | Clear visual design, onboarding tooltip on first use |
| Accordion content too long on mobile | Low | Medium | Limit expanded height, add scroll within accordion |
| Floating button obscures content | Medium | Low | Position carefully, make draggable if needed, test with real content |
| Increased code complexity | Low | High | Modular components, comprehensive tests, clear documentation |

---

## 12. Future Enhancements

### Phase 2 Considerations
- **Smart Collapse:** Auto-collapse accordion when user starts typing (reduce clutter)
- **Quick Edit:** Allow editing previous fields directly from accordion
- **Draggable Button:** Let users reposition floating button
- **Keyboard Shortcuts:** `Cmd/Ctrl + P` to open preview
- **Sticky Scroll:** Keep most recent completed field visible as user scrolls
- **AI Context:** Highlight relevant previous content when AI suggests improvements

### Long-term Vision
- **Multi-device Sync:** Accordion state synced via Firebase
- **Customization:** User preferences for default expanded/collapsed state
- **Analytics:** Track which fields users review most frequently
- **Smart Suggestions:** AI suggests when to review previous context

---

## 13. Related Documentation

- **PRD:** `/docs/PRD.md` - Section 5 (User Experience Goals)
- **Design Spec:** `/docs/DesignSpec.md` - Section 2 (Color System), Section 3 (Typography), Section 22 (Responsive Design)
- **Architecture:** `/docs/Architecture.md` - File organization and component patterns
- **Components Doc:** `/docs/Components.md` - UI component library reference
- **Existing Preview:** `/frontend/components/builder/PromptOutput.tsx` - Component to be reused

---

## Appendix A: Technical Implementation Notes

### sessionStorage Schema
```typescript
// Accordion state
key: `sora-accordion-expanded-step-${stepNumber}`
value: { expanded: boolean, timestamp: number }

// Example
"sora-accordion-expanded-step-2": { "expanded": true, "timestamp": 1699478400000 }
```

### Component File Headers
All new components should include standard file header:

```typescript
/**
 * @FeatureID F-15.1
 * @Purpose [Component purpose]
 * @Spec /docs/features/context-memory-hybrid.md
 * @Author Chat Bot Labs
 */
```

### Import Structure
```typescript
// React & Next.js
import { useState, useEffect, useCallback } from "react";

// Components
import { PromptOutput } from "@/components/builder/PromptOutput";
import { Button } from "@/components/ui/Button";

// Icons
import { ChevronDown, Eye, X } from "lucide-react";

// Utilities
import { cn } from "@/lib/utils";

// Types
import type { Prompt } from "@/lib/types";
```

---

**Document End**

