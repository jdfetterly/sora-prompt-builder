# Feature Specification: Context Memory - Interactive Preview Sidebar

**Feature ID:** F-15.3  
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
Users progressing through the 5-step prompt building workflow (Subject → Action & Setting → Cinematic Style → Camera & Shot → Visual Details) face a critical context retention challenge. As they advance through steps, previously entered information becomes invisible, forcing users to:

- **Rely on memory** to recall multiple pieces of detailed information
- **Navigate backward** repeatedly to review previous inputs, disrupting flow
- **Lose the holistic view** of how their prompt is coming together
- **Create inconsistent content** when current input doesn't align with earlier choices

### Current Implementation Gap
The existing `PromptOutput` component provides a beautiful, formatted preview of the complete prompt, but it's only accessible:
- On XL screens (≥1280px) as a fixed right sidebar
- Approximately 30-40% of users on laptop, tablet, and mobile devices cannot see it
- No way for non-XL users to preview their prompt without exporting

This creates a two-tier user experience where smaller-screen users are significantly disadvantaged.

### Business Impact
- **Lower conversion rates** on mobile and tablet (harder to complete prompts)
- **Reduced prompt quality** from users who can't see the full picture
- **User frustration** and potential churn on smaller devices
- **Missed opportunity** to showcase the formatted output during the building process

---

## 2. Proposed Solution

### Overview
Make the existing `PromptOutput` component universally accessible on all device sizes by adding a **floating preview button** that opens the formatted prompt in a **slide-in overlay panel**. This solution democratizes access to the preview functionality while maintaining a clean, uncluttered interface.

### Key Approach
1. **Floating Action Button (FAB):** A persistent, gold-colored button anchored to the bottom-right corner with an eye icon
2. **Slide-In Overlay:** Tapping the button reveals a panel that slides in from the right edge
3. **Existing Component Reuse:** The overlay displays the existing `PromptOutput` component (no duplication of logic)
4. **Responsive Sizing:** Overlay adapts to screen size (full-width on mobile, partial on tablet/desktop)
5. **Dismissible:** Multiple ways to close (backdrop tap, close button, ESC key, swipe gesture)

### Core Advantages
- **Universal Access:** Every user can see their formatted prompt regardless of device
- **Zero Clutter:** FAB has minimal footprint, overlay only appears on demand
- **Complete Preview:** Shows full `PromptOutput` with all formatting, not a truncated summary
- **Familiar Pattern:** FAB + overlay is a well-established mobile UI pattern
- **Code Reuse:** Leverages existing `PromptOutput` component (DRY principle)

### What This Is NOT
- Not a replacement for the XL sidebar (both coexist)
- Not a new preview format (uses existing `PromptOutput`)
- Not always-visible (user-triggered only)
- Not mobile-only (available on all screen sizes < 1280px)

---

## 3. User Stories

### US-15.3.1: Mobile User Accesses Full Preview
**As a** mobile user building a prompt  
**I want to** see my complete formatted prompt at any time  
**So that** I can verify my work is cohesive and well-structured

**Acceptance Criteria:**
- Floating preview button is visible in bottom-right corner
- Button has pulsing animation when prompt has content
- Tapping button opens full-screen overlay from right
- Overlay displays formatted prompt using `PromptOutput` component
- All completed fields are visible with proper formatting
- Can dismiss overlay by tapping backdrop or close button

### US-15.3.2: Tablet User Previews Progress
**As a** tablet user on Step 3  
**I want to** quickly check my prompt so far without leaving the step  
**So that** I can ensure my cinematic style choice aligns with my subject and setting

**Acceptance Criteria:**
- Preview button visible on tablet (< 1280px width)
- Overlay appears as 50% width panel (not full-screen)
- Can see formatted prompt with syntax highlighting
- Overlay dismisses when I tap outside the panel
- Focus returns to step form after dismissing

### US-15.3.3: Laptop User with Small Screen
**As a** laptop user with 1024x768 resolution  
**I want to** access the preview that desktop users see  
**So that** I have the same quality experience despite my smaller screen

**Acceptance Criteria:**
- Preview button appears on screens < 1280px
- Button is distinguishable (gold color, clear icon)
- Opening overlay doesn't slow down the interface
- Overlay content is identical to XL sidebar preview
- Can close overlay with ESC key (keyboard user)

### US-15.3.4: Quick Reference During Editing
**As a** user actively typing in Step 4  
**I want to** glance at my full prompt without losing my place  
**So that** I can make informed decisions about camera angles and shot types

**Acceptance Criteria:**
- Can open preview while in any step
- Current step's partial input is visible in preview
- Closing preview returns focus to where I was typing
- No scrolling or navigation disruption

---

## 4. Technical Specifications

### 4.1 Component Architecture

#### New Components

##### `FloatingPreviewButton.tsx`
**Location:** `/frontend/components/builder/FloatingPreviewButton.tsx`

**Interface:**
```typescript
interface FloatingPreviewButtonProps {
  /** Current prompt to determine if button should pulse */
  prompt: Partial<Prompt>;
  
  /** Click handler to open preview overlay */
  onClick: () => void;
  
  /** Whether the button should be visible (responsive control) */
  isVisible?: boolean;
  
  /** Optional CSS classes */
  className?: string;
}

export const FloatingPreviewButton: React.FC<FloatingPreviewButtonProps>
```

**Responsibilities:**
- Render fixed-position FAB in bottom-right corner
- Display eye icon (Lucide React)
- Pulse animation when prompt has content
- Handle click/tap interactions
- Maintain high z-index (above content, below modals)
- Show tooltip on hover (desktop)

**State:**
```typescript
const [isHovered, setIsHovered] = useState(false);
```

##### `PreviewOverlay.tsx`
**Location:** `/frontend/components/builder/PreviewOverlay.tsx`

**Interface:**
```typescript
interface PreviewOverlayProps {
  /** Controls overlay visibility */
  isOpen: boolean;
  
  /** Callback when overlay should close */
  onClose: () => void;
  
  /** Prompt data to pass to PromptOutput */
  prompt: Partial<Prompt>;
  
  /** Optional CSS classes */
  className?: string;
}

export const PreviewOverlay: React.FC<PreviewOverlayProps>
```

**Responsibilities:**
- Render full-screen backdrop with blur effect
- Slide in panel from right edge
- Render `PromptOutput` component within panel
- Handle multiple dismiss methods:
  - Backdrop click
  - Close button (×) click
  - ESC key press
  - Swipe right gesture (mobile)
- Lock body scroll when open
- Trap focus within overlay (accessibility)
- Smooth slide-in/out animations

**State:**
```typescript
const [isAnimating, setIsAnimating] = useState(false);
```

**Hooks:**
```typescript
// Prevent body scroll
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  return () => { document.body.style.overflow = ''; };
}, [isOpen]);

// ESC key handler
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  };
  window.addEventListener('keydown', handleEscape);
  return () => window.removeEventListener('keydown', handleEscape);
}, [isOpen, onClose]);
```

#### Modified Components

##### `build/page.tsx`
**Changes Required:**

1. **Add State:**
```typescript
const [previewOverlayOpen, setPreviewOverlayOpen] = useState(false);
```

2. **Add Responsive Check:**
```typescript
const [showPreviewButton, setShowPreviewButton] = useState(false);

useEffect(() => {
  const checkScreenSize = () => {
    setShowPreviewButton(window.innerWidth < 1280);
  };
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
  return () => window.removeEventListener('resize', checkScreenSize);
}, []);
```

3. **Import and Render:**
```typescript
import { FloatingPreviewButton } from "@/components/builder/FloatingPreviewButton";
import { PreviewOverlay } from "@/components/builder/PreviewOverlay";

// In JSX
{showPreviewButton && (
  <FloatingPreviewButton
    prompt={prompt}
    onClick={() => setPreviewOverlayOpen(true)}
    isVisible={true}
  />
)}

<PreviewOverlay
  isOpen={previewOverlayOpen}
  onClose={() => setPreviewOverlayOpen(false)}
  prompt={prompt}
/>
```

##### `PromptOutput.tsx` (Optional Enhancement)
**Potential Changes:**
- Add optional `compact` prop for tighter spacing in overlay
- Add optional `highlightMode` prop for enhanced visibility on dark backdrop
- No breaking changes to existing XL sidebar usage

### 4.2 Responsive Behavior

#### Visibility Logic
```typescript
// Show FAB when screen width < 1280px (no XL sidebar)
const showPreviewButton = window.innerWidth < 1280;

// On XL screens, hide FAB (sidebar already visible)
const showPreviewButton = window.innerWidth < 1280;
```

#### Overlay Panel Sizing
```css
/* Mobile: 0-767px */
width: 100vw (full screen)
height: 100vh
padding: 16px

/* Tablet: 768-1023px */
width: 66vw (two-thirds)
height: 100vh
padding: 20px

/* Laptop: 1024-1279px */
width: 480px (fixed)
height: 100vh
padding: 24px

/* Desktop XL: 1280px+ */
FAB hidden (sidebar visible)
```

#### Breakpoint Detection
```typescript
const getOverlayWidth = () => {
  const width = window.innerWidth;
  if (width < 768) return '100vw';
  if (width < 1024) return '66vw';
  return '480px';
};
```

### 4.3 Animation Specifications

#### Slide-In Animation
```css
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.preview-panel {
  animation: slideInRight 350ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### Backdrop Fade
```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.preview-backdrop {
  animation: fadeIn 250ms ease-in;
}
```

#### FAB Pulse (when prompt has content)
```css
@keyframes pulseShadow {
  0%, 100% {
    box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4),
                0 0 0 0 rgba(212, 175, 55, 0.7);
  }
  50% {
    box-shadow: 0 4px 30px rgba(212, 175, 55, 0.6),
                0 0 0 10px rgba(212, 175, 55, 0);
  }
}

.fab-pulse {
  animation: pulseShadow 2s infinite;
}
```

#### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .preview-panel,
  .preview-backdrop,
  .fab-pulse {
    animation-duration: 0.01ms !important;
  }
}
```

### 4.4 Gesture Support (Mobile)

#### Swipe to Dismiss
```typescript
// Basic swipe detection
const [touchStart, setTouchStart] = useState(0);
const [touchEnd, setTouchEnd] = useState(0);

const handleTouchStart = (e: TouchEvent) => {
  setTouchStart(e.targetTouches[0].clientX);
};

const handleTouchMove = (e: TouchEvent) => {
  setTouchEnd(e.targetTouches[0].clientX);
};

const handleTouchEnd = () => {
  if (touchStart - touchEnd < -50) {
    // Swipe right - close overlay
    onClose();
  }
};
```

---

## 5. Design Specifications

### 5.1 Floating Preview Button

#### Visual Design
```
                            ┌─────────┐
                            │         │
                            │    👁️   │  56x56px
                            │         │
                            └─────────┘
                          Bottom-right corner
```

#### Styling
```css
.floating-preview-button {
  position: fixed;
  bottom: 80px;           /* Above step controls */
  right: 16px;            /* Mobile */
  right: 24px;            /* Tablet/Desktop */
  
  width: 56px;
  height: 56px;
  border-radius: 50%;
  
  background: var(--gold-primary);
  color: var(--text-inverse);
  
  box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  cursor: pointer;
  z-index: 30;
  
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.floating-preview-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 30px rgba(212, 175, 55, 0.6);
}

.floating-preview-button:active {
  transform: scale(0.95);
}
```

**Tailwind Classes:**
```typescript
className={cn(
  "fixed bottom-20 right-4 md:right-6",
  "w-14 h-14 rounded-full",
  "bg-gold-primary text-text-inverse",
  "flex items-center justify-center",
  "shadow-2xl hover:shadow-[0_6px_30px_rgba(212,175,55,0.6)]",
  "transition-all duration-200",
  "hover:scale-110 active:scale-95",
  "z-30 cursor-pointer",
  hasContent && "animate-pulse-gold",
  className
)}
```

#### Icon
- **Source:** Lucide React `Eye` icon
- **Size:** 24x24px
- **Color:** Inherit (text-inverse / #0A0A0A)
- **Stroke Width:** 2

#### Tooltip (Desktop Only)
```html
<div class="tooltip">Preview Prompt</div>
```

Styling:
- Appears on hover after 500ms delay
- Positioned above button
- Background: `bg-background-elevated`
- Text: `text-text-primary text-sm`
- Arrow pointing down to button

### 5.2 Preview Overlay

#### Layout Structure
```
┌─────────────────────────────────────────────┐
│ [Backdrop: dark blur]                       │
│                                             │
│                      ┌──────────────────┐  │
│                      │  ✕  Preview      │  │ Header
│                      ├──────────────────┤  │
│                      │                  │  │
│                      │  [PromptOutput   │  │ Content
│                      │   Component]     │  │
│                      │                  │  │
│                      │                  │  │
│                      │                  │  │
│                      └──────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
        ↑
    Slide in from right
```

#### Backdrop Styling
```css
.preview-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 10, 0.75);
  backdrop-filter: blur(4px);
  z-index: 50;
}
```

**Tailwind:**
```typescript
className="fixed inset-0 bg-background-primary/75 backdrop-blur-sm z-50"
```

#### Panel Styling
```css
.preview-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  
  /* Responsive width (see breakpoints) */
  width: 100vw;          /* Mobile */
  width: 66vw;           /* Tablet */
  width: 480px;          /* Laptop */
  
  background: var(--background-primary);
  border-left: 1px solid var(--divider);
  
  box-shadow: -8px 0 40px rgba(0, 0, 0, 0.5);
  
  display: flex;
  flex-direction: column;
  
  z-index: 51;
}
```

**Tailwind:**
```typescript
className={cn(
  "fixed top-0 right-0 h-screen",
  "w-screen md:w-2/3 lg:w-[480px]",
  "bg-background-primary border-l border-divider",
  "shadow-[-8px_0_40px_rgba(0,0,0,0.5)]",
  "flex flex-col z-[51]"
)}
```

#### Header Styling
```css
.preview-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--divider);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
```

**Tailwind:**
```typescript
<div className="px-5 py-4 border-b border-divider flex items-center justify-between flex-shrink-0">
  <h2 className="text-lg font-semibold text-text-primary">
    Preview
  </h2>
  <button
    onClick={onClose}
    className="text-text-secondary hover:text-text-primary transition-colors"
    aria-label="Close preview"
  >
    <X className="h-6 w-6" />
  </button>
</div>
```

#### Content Area Styling
```css
.preview-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
```

**Tailwind:**
```typescript
<div className="flex-1 overflow-y-auto p-5 md:p-6">
  <PromptOutput prompt={prompt} compact />
</div>
```

#### Scrollbar Styling
```css
.preview-content::-webkit-scrollbar {
  width: 8px;
}

.preview-content::-webkit-scrollbar-track {
  background: var(--background-primary);
}

.preview-content::-webkit-scrollbar-thumb {
  background: var(--background-tertiary);
  border-radius: 4px;
}

.preview-content::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}
```

---

## 6. User Flows

### Flow 1: First-Time Mobile User Discovery
1. User opens builder on mobile device
2. User completes Step 1 (Subject)
3. User notices golden button appears in bottom-right corner (pulsing)
4. User hovers/taps button, sees tooltip: "Preview Prompt"
5. User taps button with curiosity
6. Full-screen overlay slides in from right (350ms animation)
7. User sees beautifully formatted prompt with Subject field
8. User reads: "Oh, this is what my final prompt will look like!"
9. User taps dark area outside panel or taps × button
10. Overlay slides out smoothly
11. User continues to Step 2 with confidence

### Flow 2: Tablet User Mid-Step Reference
1. User is on Step 3 (Cinematic Style) on tablet
2. User types: "Film noir aesthetic with..."
3. User pauses, unsure if this matches subject/setting
4. User taps floating preview button (bottom-right)
5. Panel slides in (66% width, 350ms)
6. User reviews formatted prompt:
   - Subject: "A detective walking through rainy streets"
   - Action & Setting: "Late night in 1940s Los Angeles"
   - Cinematic Style: "Film noir aesthetic with..." (current typing)
7. User confirms film noir matches the detective theme
8. User taps backdrop to close
9. User continues typing with confidence

### Flow 3: Laptop User Iterative Review
1. User on 1024x768 laptop screen (no XL sidebar visible)
2. User completes all 5 steps
3. Before clicking "Complete," user wants to review full prompt
4. User clicks floating preview button
5. 480px panel slides in from right
6. User scrolls through complete formatted prompt
7. User notices typo in Step 2
8. User keeps overlay open, clicks "Back" to Step 2
9. Overlay auto-closes on navigation (or user manually closes)
10. User fixes typo, navigates forward
11. User re-opens preview to confirm fix
12. User closes preview, clicks "Complete"

### Flow 4: Desktop User with Small Monitor
1. User has 1280x800 monitor (just barely XL)
2. Browser window is not full-screen (1100px wide)
3. XL sidebar doesn't show (viewport < 1280px)
4. Floating preview button visible
5. User's workflow identical to laptop user (Flow 3)
6. If user maximizes window → sidebar appears, button hides

### Flow 5: Keyboard User Accessibility
1. User navigating with keyboard only
2. User tabs through interface
3. Tab focus reaches floating preview button
4. Visible focus ring appears (gold, high contrast)
5. User presses Enter or Space
6. Overlay opens, focus moves to close button
7. User can Tab through overlay content
8. User presses ESC key
9. Overlay closes, focus returns to preview button
10. User continues tabbing through page

---

## 7. Accessibility Requirements

### 7.1 Floating Preview Button

#### Semantic HTML
```html
<button
  type="button"
  aria-label="Open prompt preview"
  aria-expanded="false"
  className="floating-preview-button"
>
  <Eye aria-hidden="true" />
</button>
```

#### ARIA Attributes
- `aria-label`: "Open prompt preview" (descriptive action)
- `aria-expanded`: "false" when closed, "true" when overlay open
- Icon has `aria-hidden="true"` (decorative)

#### Keyboard Support
- **Tab:** Focus on button
- **Enter/Space:** Open overlay
- **Focus Ring:** 2px solid gold, high contrast

#### Touch Target
- Minimum: 48x48px (WCAG guideline)
- Actual: 56x56px (exceeds requirement)
- Adequate spacing from screen edges and other touch targets

### 7.2 Preview Overlay

#### Semantic HTML
```html
<div 
  role="dialog" 
  aria-modal="true" 
  aria-labelledby="preview-title"
  className="preview-overlay"
>
  <div className="preview-panel">
    <header>
      <h2 id="preview-title">Preview</h2>
      <button aria-label="Close preview">
        <X aria-hidden="true" />
      </button>
    </header>
    <div role="region" aria-label="Prompt preview content">
      <PromptOutput {...} />
    </div>
  </div>
</div>
```

#### ARIA Attributes
- `role="dialog"` on overlay container
- `aria-modal="true"` to indicate modal behavior
- `aria-labelledby` pointing to header title ID
- Close button has descriptive `aria-label`

#### Focus Management
```typescript
// Trap focus within overlay
const focusableElements = overlay.querySelectorAll(
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
);

const firstElement = focusableElements[0];
const lastElement = focusableElements[focusableElements.length - 1];

// On Tab from last element → cycle to first
// On Shift+Tab from first → cycle to last
```

#### Focus Return
```typescript
// Store reference to trigger button
const triggerRef = useRef<HTMLButtonElement>(null);

// When overlay closes
useEffect(() => {
  if (!isOpen && triggerRef.current) {
    triggerRef.current.focus();
  }
}, [isOpen]);
```

#### Keyboard Support
- **ESC:** Close overlay
- **Tab:** Navigate through focusable elements (trapped)
- **Shift+Tab:** Reverse navigation (trapped)
- **Enter/Space:** Activate buttons

#### Screen Reader Announcements
```typescript
// When overlay opens
<div role="status" aria-live="polite" className="sr-only">
  Preview dialog opened. Press Escape to close.
</div>

// When overlay closes
<div role="status" aria-live="polite" className="sr-only">
  Preview dialog closed.
</div>
```

### 7.3 Color Contrast
| Element | Foreground | Background | Ratio | Standard |
|---------|-----------|------------|-------|----------|
| FAB icon | #0A0A0A | #D4AF37 | 9.2:1 | AAA ✓ |
| Panel header text | #E8E8E8 | #0A0A0A | 11.6:1 | AAA ✓ |
| Close button | #999999 | #0A0A0A | 7.5:1 | AA ✓ |
| PromptOutput text | (inherited) | #0A0A0A | (verified in PromptOutput) | ✓ |

### 7.4 Motion & Animation
```css
@media (prefers-reduced-motion: reduce) {
  .preview-panel,
  .preview-backdrop,
  .floating-preview-button {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Implementation Checklist

### Phase 1: Floating Preview Button
- [ ] Create `FloatingPreviewButton.tsx` component
- [ ] Implement fixed positioning (bottom-right)
- [ ] Add Eye icon from Lucide React
- [ ] Style button per design spec (gold, 56x56px, rounded)
- [ ] Add hover effects (scale, shadow)
- [ ] Implement pulse animation when prompt has content
- [ ] Add responsive positioning (adjusts margin for screen size)
- [ ] Add tooltip on hover (desktop only)
- [ ] Add ARIA attributes (`aria-label`, `aria-expanded`)
- [ ] Ensure 56x56px touch target
- [ ] Add file header with Feature ID (F-15.3)

### Phase 2: Preview Overlay
- [ ] Create `PreviewOverlay.tsx` component
- [ ] Implement backdrop with blur effect
- [ ] Implement panel with slide-in animation
- [ ] Add responsive width logic (100vw → 66vw → 480px)
- [ ] Create header with title and close button
- [ ] Create content area with scroll
- [ ] Integrate `PromptOutput` component
- [ ] Style scrollbar for dark theme
- [ ] Add backdrop click handler (dismiss)
- [ ] Add close button handler
- [ ] Add ESC key handler
- [ ] Implement body scroll lock when open
- [ ] Add file header with Feature ID (F-15.3)

### Phase 3: Integration
- [ ] Import components into `build/page.tsx`
- [ ] Add `previewOverlayOpen` state
- [ ] Add responsive breakpoint detection (< 1280px)
- [ ] Conditionally render `FloatingPreviewButton`
- [ ] Render `PreviewOverlay` with open state
- [ ] Pass `prompt` data to both components
- [ ] Test open/close flow
- [ ] Verify button hides on XL screens (≥1280px)

### Phase 4: Animations
- [ ] Implement panel slide-in animation (350ms)
- [ ] Implement backdrop fade-in animation (250ms)
- [ ] Implement FAB pulse animation (2s loop)
- [ ] Add reduced motion support
- [ ] Test animation performance (60fps)
- [ ] Smooth out any jank or stuttering

### Phase 5: Gesture Support (Mobile)
- [ ] Implement swipe right to dismiss
- [ ] Add touch event handlers
- [ ] Detect swipe distance threshold (50px)
- [ ] Trigger close on valid swipe
- [ ] Test on iOS Safari and Chrome Android
- [ ] Ensure no conflicts with scroll gestures

### Phase 6: Accessibility
- [ ] Add all ARIA attributes to button and overlay
- [ ] Implement focus trap in overlay
- [ ] Implement focus return on close
- [ ] Add screen reader announcements
- [ ] Test with VoiceOver (iOS/Mac)
- [ ] Test with TalkBack (Android)
- [ ] Test with NVDA/JAWS (Windows)
- [ ] Verify keyboard navigation (Tab, ESC)
- [ ] Verify color contrast ratios
- [ ] Run axe-core accessibility audit

### Phase 7: Responsive Testing
- [ ] Test on mobile (320px - 767px)
- [ ] Test on tablet portrait (768px - 1023px)
- [ ] Test on tablet landscape (1024px - 1279px)
- [ ] Test on desktop (1024px - 1279px)
- [ ] Test on XL desktop (1280px+, button hidden)
- [ ] Test orientation changes (landscape ↔ portrait)
- [ ] Test browser zoom (100%, 150%, 200%)

### Phase 8: Edge Cases
- [ ] Test with empty prompt (Step 1)
- [ ] Test with partial prompt (mid-step)
- [ ] Test with complete prompt (all 5 steps)
- [ ] Test rapid open/close clicks
- [ ] Test backdrop click during animation
- [ ] Test ESC during animation
- [ ] Test with very long content (scroll behavior)
- [ ] Test on slow network (component loading)

### Phase 9: Performance
- [ ] Optimize component renders (React.memo if needed)
- [ ] Lazy load overlay (render only when needed)
- [ ] Measure interaction to paint time
- [ ] Verify no memory leaks (event listeners)
- [ ] Test on low-end devices
- [ ] Verify smooth 60fps animations

### Phase 10: Documentation
- [ ] Add JSDoc comments to components
- [ ] Update `/docs/Architecture.md` with new component paths
- [ ] Update `/docs/Components.md` with usage examples
- [ ] Create Storybook stories (if applicable)
- [ ] Document accessibility features

---

## 9. Testing Criteria

### Functional Tests

| Test Case | Expected Result | Pass/Fail |
|-----------|----------------|-----------|
| **Button Visibility** |
| Screen width ≥ 1280px | Button hidden (sidebar visible) | [ ] |
| Screen width < 1280px | Button visible | [ ] |
| Resize from XL to laptop | Button appears when crossing 1280px | [ ] |
| **Button Interaction** |
| Click button | Overlay opens | [ ] |
| Tap button (mobile) | Overlay opens | [ ] |
| Keyboard Enter on button | Overlay opens | [ ] |
| Keyboard Space on button | Overlay opens | [ ] |
| **Overlay Behavior** |
| Overlay opens | Panel slides in from right | [ ] |
| Click backdrop | Overlay closes | [ ] |
| Click close button | Overlay closes | [ ] |
| Press ESC key | Overlay closes | [ ] |
| Swipe right (mobile) | Overlay closes | [ ] |
| **Content Display** |
| Empty prompt (Step 1) | Shows empty state message | [ ] |
| Partial prompt (Step 2) | Shows completed fields only | [ ] |
| Complete prompt | Shows all 5 fields formatted | [ ] |
| Current step partial input | Shows partial content in preview | [ ] |
| **State Management** |
| Open overlay, navigate to next step | Overlay closes on navigation | [ ] |
| Button aria-expanded | "false" when closed, "true" when open | [ ] |
| Body scroll when overlay open | Scroll locked | [ ] |
| Body scroll when overlay closed | Scroll restored | [ ] |

### Visual Tests

| Test Case | Expected Result | Pass/Fail |
|-----------|----------------|-----------|
| **Button Styling** |
| Button size | 56x56px on all screens | [ ] |
| Button color | Gold (#D4AF37) | [ ] |
| Button icon | Eye icon, 24px, dark color | [ ] |
| Button shadow | Gold glow shadow | [ ] |
| Hover effect | Scales to 1.1x, shadow increases | [ ] |
| Active effect | Scales to 0.95x | [ ] |
| Pulse animation (with content) | Subtle gold pulse every 2s | [ ] |
| **Overlay Styling** |
| Backdrop opacity | 75% dark with blur | [ ] |
| Panel width (mobile) | 100vw | [ ] |
| Panel width (tablet) | 66vw | [ ] |
| Panel width (laptop) | 480px | [ ] |
| Panel height | 100vh (full height) | [ ] |
| Panel shadow | Subtle left shadow | [ ] |
| Header height | ~64px | [ ] |
| Content scroll | Smooth scroll with styled scrollbar | [ ] |
| **Animations** |
| Panel slide-in | 350ms smooth from right | [ ] |
| Backdrop fade-in | 250ms smooth fade | [ ] |
| Panel slide-out | 350ms smooth to right | [ ] |
| Backdrop fade-out | 250ms smooth fade | [ ] |
| No animation jank | Solid 60fps | [ ] |

### Accessibility Tests

| Test Case | Expected Result | Pass/Fail |
|-----------|----------------|-----------|
| **Keyboard Navigation** |
| Tab to button | Focus ring visible | [ ] |
| Enter on button | Opens overlay | [ ] |
| Space on button | Opens overlay | [ ] |
| ESC in overlay | Closes overlay | [ ] |
| Tab in overlay | Focus trapped, cycles through elements | [ ] |
| Focus return on close | Returns to button | [ ] |
| **Screen Reader** |
| Button announcement | "Button, Open prompt preview" | [ ] |
| Overlay announcement | "Preview dialog opened" | [ ] |
| Close button | "Button, Close preview" | [ ] |
| Dialog role | Announced as dialog/modal | [ ] |
| **ARIA** |
| Button aria-label | Present and descriptive | [ ] |
| Button aria-expanded | Updates on open/close | [ ] |
| Overlay role="dialog" | Present | [ ] |
| Overlay aria-modal="true" | Present | [ ] |
| Overlay aria-labelledby | Points to title | [ ] |
| **Color Contrast** |
| All text | Meets WCAG AA (4.5:1+) | [ ] |
| Button icon | Meets WCAG AAA (7:1+) | [ ] |
| **Motion** |
| prefers-reduced-motion | Animations disabled | [ ] |

### Performance Tests

| Test Case | Target | Pass/Fail |
|-----------|--------|-----------|
| Button render time | < 16ms | [ ] |
| Overlay open time | < 350ms | [ ] |
| Animation frame rate | 60fps | [ ] |
| Memory usage | No leaks | [ ] |
| Component unmount | Event listeners removed | [ ] |

---

## 10. Success Metrics

### Primary KPIs

#### 1. Feature Adoption
- **Metric:** % of non-XL users who open preview at least once
- **Target:** 70%
- **Measurement:** Track FAB clicks via analytics
- **Rationale:** High adoption indicates feature discoverability and perceived value

#### 2. Prompt Completion Rate
- **Metric:** % increase in completion rate for non-XL users
- **Baseline:** Current completion rate on < 1280px screens
- **Target:** 25% increase
- **Measurement:** Compare completion funnel before/after
- **Rationale:** Preview access should reduce abandonment

#### 3. Preview Engagement
- **Metric:** Average preview opens per completed prompt
- **Expected:** 2-4 opens
- **Measurement:** Track open count per session
- **Rationale:** Indicates users find preview valuable for reference

### Secondary KPIs

#### 4. Mobile Experience Improvement
- **Metric:** Mobile user satisfaction score
- **Target:** 4.3/5 (from baseline 3.6/5)
- **Measurement:** Optional survey: "Preview feature improved my mobile experience"
- **Rationale:** Direct user feedback on value

#### 5. Error Reduction
- **Metric:** % reduction in prompts with obvious inconsistencies
- **Target:** 20% reduction
- **Measurement:** Manual quality audit sampling
- **Rationale:** Better context visibility should improve coherence

#### 6. Time to Complete
- **Metric:** Average time from Step 1 to Export
- **Target:** 10-15% reduction (more efficient, less back navigation)
- **Measurement:** Track session duration
- **Rationale:** Preview eliminates need to navigate backward

### Technical KPIs

#### 7. Performance
- **Page Load Impact:** < 50ms increase
- **Animation Performance:** Maintain 60fps on 70% of devices
- **Error Rate:** Zero JavaScript errors from feature
- **Measurement:** Real User Monitoring (RUM)

#### 8. Accessibility
- **Lighthouse Score:** Maintain 95+ accessibility score
- **Screen Reader Compatibility:** 100% functional on VoiceOver, TalkBack, NVDA
- **Keyboard Navigation:** 100% of actions accessible via keyboard
- **Measurement:** Automated and manual testing

### Qualitative Metrics

#### 9. User Feedback
- "This feature makes it easy to see my full prompt on mobile" (Target: 85% agree)
- "The floating button is easy to find and use" (Target: 90% agree)
- "The preview helped me create a better prompt" (Target: 75% agree)

---

## 11. Open Questions & Risks

### Open Questions

#### Q1: Overlay Panel Width on Desktop
**Question:** Should laptop users (1024-1279px) see full-width, 66%, or fixed 480px overlay?

**Options:**
- A) Full-width (immersive, like mobile)
- B) 66% width (balanced, like tablet)
- C) 480px fixed (consistent, doesn't obscure)

**Recommendation:** C) 480px fixed
- Rationale: Allows users to see both preview and form, feels less disruptive, matches common pattern

#### Q2: Overlay Behavior During Navigation
**Question:** Should overlay auto-close when user clicks "Continue" to next step?

**Options:**
- A) Auto-close (reduce clutter)
- B) Stay open (user explicitly opened it)
- C) User preference toggle

**Recommendation:** A) Auto-close
- Rationale: New step likely means user is done reviewing, reduces confusion

#### Q3: FAB Position on Mobile Keyboards
**Question:** When mobile keyboard opens, should FAB reposition above keyboard?

**Options:**
- A) Stay in fixed position (may be hidden by keyboard)
- B) Move above keyboard (always visible)
- C) Hide when keyboard open

**Recommendation:** A) Stay in fixed position
- Rationale: Users don't typically need preview while typing, repositioning adds complexity

#### Q4: Empty State Message
**Question:** What should overlay show when prompt is completely empty (Step 1, no input)?

**Options:**
- A) Empty state: "Start building your prompt to see preview"
- B) Show PromptOutput component (empty)
- C) Disable button until prompt has content

**Recommendation:** A) Empty state message
- Rationale: Clear feedback, encourages action, prevents confusion

### Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **FAB obscures content** | Medium | Medium | Position carefully (bottom-right, adequate margins); make draggable in Phase 2 if needed |
| **Poor performance on low-end devices** | High | Medium | Test on older devices; optimize animations; respect reduced motion preference |
| **Users don't discover FAB** | High | Medium | Add pulse animation; show tooltip on first load; consider onboarding pointer |
| **Overlay conflicts with existing sidebar on XL** | Low | Very Low | Hide FAB when sidebar visible (< 1280px check); test edge cases |
| **Gesture conflicts (swipe to dismiss)** | Medium | Low | Test thoroughly on iOS/Android; ensure swipe only from panel edge, not content area |
| **Accessibility issues** | Medium | Low | Follow WCAG 2.1 AA strictly; test with multiple assistive technologies |
| **Code duplication with XL sidebar** | Low | Low | Both use same `PromptOutput` component; no duplication |

---

## 12. Future Enhancements

### Phase 2 Features
1. **Draggable FAB:** Allow users to reposition button if it obscures content
2. **Mini Preview Mode:** Show condensed preview (just field names + first 20 chars)
3. **Keyboard Shortcut:** `Cmd/Ctrl + P` to open preview
4. **Quick Edit:** Edit fields directly from preview overlay (inline editing)
5. **Share from Preview:** Add share/export buttons directly in overlay header

### Long-Term Vision
1. **Smart Timing:** Auto-open preview when user pauses for 5+ seconds (optional)
2. **Progress Indicator:** Show completion percentage in FAB badge
3. **Multi-View:** Toggle between formatted text, JSON, and markdown in overlay
4. **Comparison Mode:** Compare current draft with saved version side-by-side
5. **AI Feedback:** Integrate AI suggestions directly in preview overlay
6. **Voice Preview:** Read prompt aloud (text-to-speech) from overlay

---

## 13. Related Documentation

- **PRD:** `/docs/PRD.md` - Product vision and user experience goals
- **Design Spec:** `/docs/DesignSpec.md` - Design system, colors, animations
- **Architecture:** `/docs/Architecture.md` - Component structure and patterns
- **Components:** `/docs/Components.md` - UI component library
- **PromptOutput:** `/frontend/components/builder/PromptOutput.tsx` - Component to be reused in overlay
- **Related Features:**
  - `/docs/features/context-memory-hybrid.md` - Hybrid approach (recommended)
  - `/docs/features/context-memory-accordion.md` - Accordion-only approach

---

## Appendix A: Code Examples

### FloatingPreviewButton Component

```typescript
/**
 * @FeatureID F-15.3
 * @Purpose Floating action button to open preview overlay on non-XL screens
 * @Spec /docs/features/context-memory-preview-sidebar.md
 * @Author Chat Bot Labs
 */

import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Prompt } from "@/lib/types";

interface FloatingPreviewButtonProps {
  prompt: Partial<Prompt>;
  onClick: () => void;
  isVisible?: boolean;
  className?: string;
}

export const FloatingPreviewButton: React.FC<FloatingPreviewButtonProps> = ({
  prompt,
  onClick,
  isVisible = true,
  className,
}) => {
  // Check if prompt has any content (for pulse animation)
  const hasContent = !!(
    prompt.subject ||
    prompt.actionSetting ||
    prompt.cinematicStyle ||
    prompt.cameraShot ||
    prompt.visualDetails
  );

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open prompt preview"
      aria-expanded={false}
      className={cn(
        "fixed bottom-20 right-4 md:bottom-24 md:right-6",
        "w-14 h-14 rounded-full",
        "bg-gold-primary text-text-inverse",
        "flex items-center justify-center",
        "shadow-2xl hover:shadow-[0_6px_30px_rgba(212,175,55,0.6)]",
        "transition-all duration-200",
        "hover:scale-110 active:scale-95",
        "z-30 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary",
        hasContent && "animate-pulse-gold",
        className
      )}
    >
      <Eye className="h-6 w-6" aria-hidden="true" />
    </button>
  );
};
```

### PreviewOverlay Component

```typescript
/**
 * @FeatureID F-15.3
 * @Purpose Full-screen overlay with slide-in panel for preview
 * @Spec /docs/features/context-memory-preview-sidebar.md
 * @Author Chat Bot Labs
 */

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PromptOutput } from "@/components/builder/PromptOutput";
import type { Prompt } from "@/lib/types";

interface PreviewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: Partial<Prompt>;
  className?: string;
}

export const PreviewOverlay: React.FC<PreviewOverlayProps> = ({
  isOpen,
  onClose,
  prompt,
  className,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ESC key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
      onClick={handleBackdropClick}
      className={cn(
        "fixed inset-0 bg-background-primary/75 backdrop-blur-sm z-50",
        "animate-fadeIn",
        className
      )}
    >
      <div
        className={cn(
          "fixed top-0 right-0 h-screen",
          "w-screen md:w-2/3 lg:w-[480px]",
          "bg-background-primary border-l border-divider",
          "shadow-[-8px_0_40px_rgba(0,0,0,0.5)]",
          "flex flex-col",
          "animate-slideInRight"
        )}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-divider flex items-center justify-between flex-shrink-0">
          <h2
            id="preview-title"
            className="text-lg font-semibold text-text-primary"
          >
            Preview
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className={cn(
              "text-text-secondary hover:text-text-primary transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary rounded"
            )}
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div
          role="region"
          aria-label="Prompt preview content"
          className="flex-1 overflow-y-auto p-5 md:p-6"
        >
          <PromptOutput prompt={prompt} />
        </div>
      </div>
    </div>
  );
};
```

### Tailwind Animation Config

```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      animation: {
        'pulse-gold': 'pulseShadow 2s infinite',
        'fadeIn': 'fadeIn 250ms ease-in',
        'slideInRight': 'slideInRight 350ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        pulseShadow: {
          '0%, 100%': {
            boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4), 0 0 0 0 rgba(212, 175, 55, 0.7)',
          },
          '50%': {
            boxShadow: '0 4px 30px rgba(212, 175, 55, 0.6), 0 0 0 10px rgba(212, 175, 55, 0)',
          },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
    },
  },
};
```

---

**Document End**

