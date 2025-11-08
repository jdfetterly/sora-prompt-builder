# Sora Prompting Engine - Design Specification
**Version:** 1.0  
**Design System:** Cinematic Darkroom  
**Last Updated:** November 6, 2025

---

## 1. Design Philosophy

### Core Principles
- **Cinematic First:** Every design decision should evoke the feeling of professional filmmaking tools
- **Educational Clarity:** Visual hierarchy guides users through learning without overwhelming
- **Premium Precision:** Dark, sophisticated palette that feels like a professional creative tool
- **Purposeful Motion:** Animations mimic cinematic techniques (fades, dissolves, focus shifts)

### Mood & Tone
Think: Professional editing suite meets modern SaaS. Not a consumer toy, but not intimidating. Like sitting in a director's chair with a trusted advisor beside you.

---

## 2. Color System

### Base Colors
```
Background Primary:   #0A0A0A (near black)
Background Secondary: #1A1A1A (elevated surfaces, cards)
Background Tertiary:  #252525 (hover states, inputs)
Surface Elevated:     #2A2A2A (modals, dropdowns)
```

### Text Colors
```
Text Primary:    #E8E8E8 (main content)
Text Secondary:  #999999 (supporting text, labels)
Text Tertiary:   #666666 (disabled, timestamps)
Text Inverse:    #0A0A0A (text on light backgrounds)
```

### Accent Colors (Film Gold)
```
Gold Primary:   #D4AF37 (CTAs, highlights, AI features)
Gold Dark:      #8B6914 (hover states, pressed)
Gold Light:     #F4D03F (active glow effects)
Gold Muted:     rgba(212, 175, 55, 0.12) (subtle backgrounds)
```

### Semantic Colors
```
Success:  #4CAF50 (prompt complete, validation pass)
Error:    #F44336 (validation errors, critical warnings)
Warning:  #FF9800 (suggestions, optional improvements)
Info:     #2196F3 (tooltips, educational content)
```

### Border & Divider Colors
```
Border Subtle:    #2A2A2A (cards, containers)
Border Default:   #3A3A3A (inputs, interactive elements)
Border Accent:    #D4AF37 (focused states, AI features)
Divider:          #1F1F1F (section separators)
```

---

## 3. Typography

### Font Families
```css
/* Headings - Cinematic Serif */
--font-heading: 'Playfair Display', 'Georgia', serif;

/* Body - Clean Sans-Serif */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Technical/Code - Monospace */
--font-mono: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
```

### Type Scale
```
Display (Hero):       48px / 56px line-height / 700 weight
Heading 1:           36px / 44px / 700
Heading 2:           28px / 36px / 600
Heading 3:           24px / 32px / 600
Heading 4:           20px / 28px / 600
Body Large:          18px / 28px / 400
Body Default:        16px / 24px / 400
Body Small:          14px / 20px / 400
Caption:             12px / 16px / 400
Button Text:         16px / 24px / 500
Label:               14px / 20px / 500
```

### Typography Rules
- **Headings use Playfair Display** for cinematic elegance
- **Body text uses Inter** for readability and modern feel
- **Technical fields** (prompt output, JSON) use JetBrains Mono
- **Max line length:** 70 characters for body text (optimal readability)
- **Letter spacing:** -0.02em for headings, default for body
- **AI Co-pilot text** uses Body Default with Gold Primary color to differentiate

---

## 4. Spacing System

### Base Unit: 4px

```
Spacing Scale:
--space-1:  4px    (icon padding, tight elements)
--space-2:  8px    (small gaps, chip padding)
--space-3:  12px   (input padding vertical)
--space-4:  16px   (default gap between related elements)
--space-5:  24px   (section padding, card padding)
--space-6:  32px   (large gaps between sections)
--space-8:  48px   (major section breaks)
--space-10: 64px   (hero section spacing)
--space-12: 96px   (page-level margins)
```

### Layout Grid
- **Container max-width:** 1280px (desktop)
- **Container padding:** 24px (mobile), 48px (tablet), 64px (desktop)
- **Column gap:** 24px
- **Gutters:** 16px (mobile), 24px (desktop)

---

## 5. Layout Patterns

### Main Application Layout
```
┌─────────────────────────────────────────┐
│  Header (64px height, sticky)           │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────┐  ┌─────────────────┐   │
│  │ Step Nav  │  │ Main Content    │   │
│  │ (240px)   │  │ (flex-grow)     │   │
│  │           │  │                 │   │
│  │ Sidebar   │  │ Builder Steps   │   │
│  │ Fixed     │  │                 │   │
│  │           │  │                 │   │
│  └───────────┘  └─────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Card Pattern (Standard Content Container)
- **Border radius:** 8px
- **Background:** #1A1A1A
- **Border:** 1px solid #2A2A2A
- **Padding:** 24px
- **Shadow:** none (flat by default), add on hover

### Modal Pattern
- **Backdrop:** rgba(0, 0, 0, 0.85) with backdrop-blur(8px)
- **Modal background:** #1A1A1A
- **Border:** 1px solid #3A3A3A
- **Max width:** 600px (standard), 900px (large)
- **Border radius:** 12px
- **Padding:** 32px

---

## 6. Component Specifications

### Buttons

#### Primary Button (CTAs, Main Actions)
```
Background: linear-gradient(135deg, #D4AF37 0%, #B8942B 100%)
Text: #0A0A0A (Inverse text)
Padding: 12px 24px
Border radius: 6px
Font: 16px / 500 weight
Transition: all 200ms ease

Hover:
  Transform: translateY(-1px)
  Shadow: 0 4px 12px rgba(212, 175, 55, 0.4)
  Background: linear-gradient(135deg, #F4D03F 0%, #D4AF37 100%)

Active/Pressed:
  Transform: translateY(0)
  Shadow: 0 2px 4px rgba(212, 175, 55, 0.3)

Disabled:
  Background: #2A2A2A
  Text: #666666
  Cursor: not-allowed
```

#### Secondary Button (Supporting Actions)
```
Background: transparent
Border: 1px solid #3A3A3A
Text: #E8E8E8
Padding: 12px 24px
Border radius: 6px

Hover:
  Border: 1px solid #D4AF37
  Text: #D4AF37
  Background: rgba(212, 175, 55, 0.08)

Active:
  Background: rgba(212, 175, 55, 0.12)
```

#### Ghost Button (Tertiary Actions)
```
Background: transparent
Border: none
Text: #999999
Padding: 12px 16px

Hover:
  Text: #E8E8E8
  Background: rgba(255, 255, 255, 0.05)
```

#### Icon Button
```
Size: 40px × 40px
Border radius: 6px
Background: transparent

Hover:
  Background: rgba(255, 255, 255, 0.08)
```

### Form Elements

#### Text Input
```
Background: #1A1A1A
Border: 1px solid #3A3A3A
Border radius: 6px
Padding: 12px 16px
Font: 16px Inter
Text: #E8E8E8
Placeholder: #666666

Focus:
  Border: 1px solid #D4AF37
  Shadow: 0 0 0 3px rgba(212, 175, 55, 0.12)
  Outline: none

Error:
  Border: 1px solid #F44336
  Shadow: 0 0 0 3px rgba(244, 67, 54, 0.12)

Disabled:
  Background: #151515
  Text: #666666
  Border: 1px solid #2A2A2A
```

#### Textarea
```
Same as Text Input, but:
Min-height: 120px
Padding: 16px
Resize: vertical
Max-height: 400px
```

#### Select Dropdown
```
Same base as Text Input
Icon: Chevron down (16px) in #999999
Icon position: Right 16px, centered vertically

Dropdown Menu:
  Background: #2A2A2A
  Border: 1px solid #3A3A3A
  Border radius: 6px
  Shadow: 0 8px 24px rgba(0, 0, 0, 0.4)
  Max-height: 320px (scrollable)
  
Menu Item:
  Padding: 12px 16px
  Hover: Background #3A3A3A
  Selected: Background rgba(212, 175, 55, 0.12), Text #D4AF37
```

#### Checkbox
```
Size: 20px × 20px
Border: 2px solid #3A3A3A
Border radius: 4px
Background: transparent

Checked:
  Background: #D4AF37
  Border: 2px solid #D4AF37
  Icon: White checkmark (14px)

Focus:
  Shadow: 0 0 0 3px rgba(212, 175, 55, 0.12)
```

#### Radio Button
```
Size: 20px × 20px
Border: 2px solid #3A3A3A
Border radius: 50%

Selected:
  Border: 2px solid #D4AF37
  Inner dot: 10px circle, #D4AF37
```

### Cards

#### Standard Content Card
```
Background: #1A1A1A
Border: 1px solid #2A2A2A
Border radius: 8px
Padding: 24px
Transition: all 200ms ease

Hover (if interactive):
  Border: 1px solid #3A3A3A
  Shadow: 0 4px 12px rgba(0, 0, 0, 0.3)
  Transform: translateY(-2px)
```

#### AI Co-pilot Suggestion Card
```
Background: linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.04) 100%)
Border: 1px solid rgba(212, 175, 55, 0.3)
Border radius: 8px
Padding: 16px
Position: relative

Before pseudo-element:
  Content: "✨"
  Position: absolute top-left
  Font-size: 20px
```

#### Prompt Output Card
```
Background: #0A0A0A
Border: 2px solid #3A3A3A
Border radius: 8px
Padding: 20px
Font: 14px JetBrains Mono
Color: #E8E8E8
Line-height: 1.6

Header (if showing sections):
  Font: 12px Inter uppercase
  Color: #999999
  Letter-spacing: 0.05em
  Margin-bottom: 8px
```

### Navigation

#### Top Header
```
Height: 64px
Background: #0A0A0A
Border-bottom: 1px solid #1F1F1F
Position: sticky, top 0
Z-index: 100
Padding: 0 24px

Logo:
  Height: 32px
  Font: 24px Playfair Display
  Color: #E8E8E8
  
Navigation links:
  Font: 14px Inter / 500 weight
  Color: #999999
  Padding: 8px 16px
  
  Hover: Color #E8E8E8
  Active: Color #D4AF37
```

#### Step Navigator (Sidebar)
```
Width: 240px
Background: #0A0A0A
Border-right: 1px solid #1F1F1F
Padding: 24px 16px
Position: fixed
Height: calc(100vh - 64px)

Step Item:
  Padding: 12px 16px
  Border-radius: 6px
  Margin-bottom: 4px
  
  Default:
    Background: transparent
    Text: #999999
  
  Active:
    Background: rgba(212, 175, 55, 0.12)
    Text: #D4AF37
    Border-left: 3px solid #D4AF37
  
  Completed:
    Text: #E8E8E8
    Icon: Checkmark in #4CAF50
  
  Hover:
    Background: rgba(255, 255, 255, 0.05)
```

### Badges & Tags

#### Status Badge
```
Padding: 4px 12px
Border-radius: 12px (pill shape)
Font: 12px Inter / 600 weight
Display: inline-flex
Align-items: center

Success (Complete):
  Background: rgba(76, 175, 80, 0.15)
  Text: #4CAF50
  
Warning (In Progress):
  Background: rgba(255, 152, 0, 0.15)
  Text: #FF9800
  
Info (Draft):
  Background: rgba(33, 150, 243, 0.15)
  Text: #2196F3
```

#### Suggestion Chip
```
Background: #1A1A1A
Border: 1px solid #3A3A3A
Border-radius: 16px
Padding: 6px 12px
Font: 14px Inter
Color: #E8E8E8
Display: inline-flex
Gap: 6px
Cursor: pointer

Hover:
  Background: #252525
  Border: 1px solid #D4AF37
  
Active:
  Background: rgba(212, 175, 55, 0.12)
  Border: 1px solid #D4AF37
```

### Modals & Overlays

#### Registration Gate Modal
```
Backdrop: rgba(0, 0, 0, 0.85) + backdrop-blur(8px)
Modal background: #1A1A1A
Border: 1px solid #3A3A3A
Border-radius: 12px
Max-width: 480px
Padding: 40px
Box-shadow: 0 24px 48px rgba(0, 0, 0, 0.6)

Header:
  Icon: Lock or Star icon (32px) in Gold
  Heading: H2 size
  Subheading: Body Large in #999999
  
CTA Section:
  Primary button: Full width
  Secondary option: Text link below
  
Close button:
  Position: absolute top-right
  Size: 32px
  Icon: X in #999999
```

#### Tooltip
```
Background: #2A2A2A
Border: 1px solid #3A3A3A
Border-radius: 6px
Padding: 8px 12px
Font: 14px Inter
Color: #E8E8E8
Max-width: 280px
Shadow: 0 4px 12px rgba(0, 0, 0, 0.4)
Arrow: 6px triangle matching background

Position: 8px offset from trigger
Animation: fade-in 150ms
```

### Loading States

#### Spinner
```
Size: 24px (small), 40px (default), 64px (large)
Border: 3px solid rgba(212, 175, 55, 0.2)
Border-top: 3px solid #D4AF37
Border-radius: 50%
Animation: spin 800ms linear infinite
```

#### Skeleton Loader
```
Background: linear-gradient(
  90deg,
  #1A1A1A 0%,
  #252525 50%,
  #1A1A1A 100%
)
Border-radius: match component
Animation: shimmer 1.5s infinite
```

#### Progress Bar
```
Height: 4px
Background: #2A2A2A
Border-radius: 2px

Fill:
  Background: linear-gradient(90deg, #D4AF37, #F4D03F)
  Border-radius: 2px
  Transition: width 300ms ease
  
With steps:
  Height: 8px
  Show notches for each step
```

---

## 7. Iconography

### Icon System
- **Library:** Lucide React (outline style)
- **Default size:** 20px
- **Large:** 24px (headers, features)
- **Small:** 16px (inline, compact UI)
- **Stroke width:** 2px

### Icon Colors
```
Default:   #999999
Hover:     #E8E8E8
Active:    #D4AF37
Success:   #4CAF50
Error:     #F44336
Warning:   #FF9800
```

### Key Icons
```
✨ Sparkles - AI Co-pilot features
📹 Film - Cinematic elements
💡 Lightbulb - Tips and learning
✓ Check - Completion, validation
⚠ Alert Triangle - Warnings
ℹ Info - Information tooltips
🔒 Lock - Gated features
→ Arrow Right - Next, continue
← Arrow Left - Back, previous
⋯ More Horizontal - Options menu
+ Plus - Add, create new
📋 Copy - Copy to clipboard
⬇ Download - Export
```

---

## 8. Animation & Motion

### Timing Functions
```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0.0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

### Duration Scale
```
--duration-fast: 150ms (micro-interactions, hovers)
--duration-base: 200ms (standard transitions)
--duration-slow: 300ms (page transitions, complex animations)
--duration-slower: 500ms (modal entry/exit)
```

### Standard Transitions
```css
/* Buttons */
transition: all 200ms var(--ease-in-out);

/* Cards */
transition: transform 200ms var(--ease-out), 
            box-shadow 200ms var(--ease-out);

/* Modals */
transition: opacity 300ms var(--ease-in-out),
            transform 300ms var(--ease-out);

/* Page transitions */
transition: opacity 300ms var(--ease-in-out);
```

### Animation Patterns

#### Fade In
```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

#### Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Film Grain Effect
```css
/* Subtle animated noise overlay on dark backgrounds */
background-image: url('data:image/svg+xml;base64,...'); /* grain pattern */
opacity: 0.05;
mix-blend-mode: overlay;
animation: grain 8s steps(10) infinite;

@keyframes grain {
  0%, 100% { transform: translate(0, 0) }
  10% { transform: translate(-5%, -10%) }
  /* ... more steps */
}
```

#### Spotlight Glow (for CTAs)
```css
@keyframes spotlightGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(212, 175, 55, 0.5);
  }
}
```

### Interaction Patterns
- **Hover:** Lift (translateY -2px) + shadow
- **Click:** Brief scale down (0.98) then return
- **Focus:** Gold border + subtle glow
- **Loading:** Fade in spinner after 300ms delay
- **Success:** Brief scale pulse (1.0 → 1.05 → 1.0)

---

## 9. Responsive Breakpoints

```css
/* Mobile First Approach */
--mobile: 320px (default, no media query)
--tablet: 768px
--desktop: 1024px
--desktop-lg: 1280px
--desktop-xl: 1920px
```

### Breakpoint Behavior

#### Mobile (< 768px)
- Single column layout
- Side navigation becomes bottom sheet or full-screen overlay
- Stack all cards vertically
- Reduce padding: 16px containers
- Font sizes: -2px from desktop scale
- Hide secondary information, show on expand

#### Tablet (768px - 1023px)
- Two column grid where applicable
- Side navigation becomes collapsible drawer
- Container padding: 24px
- Font sizes: -1px from desktop scale

#### Desktop (1024px+)
- Full sidebar navigation (240px fixed)
- Multi-column layouts
- Full container padding: 48px
- Hover states active
- Desktop font scale

### Component Responsive Rules
- **Buttons:** Full width on mobile, auto width on desktop
- **Modals:** Full screen on mobile, centered on desktop
- **Forms:** Stack on mobile, side-by-side labels on desktop
- **Cards:** Full width on mobile, grid on desktop

---

## 10. Texture & Special Effects

### Film Grain Overlay
```
Apply to: Main background (#0A0A0A)
Opacity: 5%
Blend mode: overlay
Pattern: Seamless noise texture
Animation: Subtle drift (8s loop)
```

### Spotlight Effects
```
Apply to: Primary CTAs, AI Co-pilot sections
Effect: Radial gradient overlay
From: rgba(212, 175, 55, 0.15) center
To: transparent at edges
Size: 200% of element
Position: Follow cursor on hover (subtle)
```

### Depth & Shadows
```
None (default):        0
Subtle (cards):        0 2px 4px rgba(0, 0, 0, 0.2)
Elevated (hover):      0 4px 12px rgba(0, 0, 0, 0.3)
Floating (modals):     0 24px 48px rgba(0, 0, 0, 0.6)
Focus (inputs):        0 0 0 3px rgba(212, 175, 55, 0.12)
Glow (AI features):    0 0 20px rgba(212, 175, 55, 0.3)
```

### Border Treatments
```
Standard: 1px solid #2A2A2A
Emphasized: 1px solid #3A3A3A
Accent: 1px solid #D4AF37
Glow: 1px solid #D4AF37 + outer shadow

Film Strip Perforations (for step indicators):
  Small squares (4px) in border
  Spacing: 8px apart
  Color: #3A3A3A
```

---

## 11. Accessibility Requirements

### WCAG 2.1 AA Compliance

#### Color Contrast Ratios
```
Text Primary (#E8E8E8) on Background (#0A0A0A):     15.8:1 ✓
Text Secondary (#999999) on Background (#0A0A0A):  7.2:1 ✓
Gold Primary (#D4AF37) on Black:                   9.1:1 ✓
White on Gold Primary (#D4AF37):                   4.8:1 ✓
```

#### Focus Indicators
- All interactive elements MUST have visible focus state
- Focus ring: 3px solid rgba(212, 175, 55, 0.5) with 2px offset
- Never remove outline without replacement
- Focus order follows logical reading order

#### Keyboard Navigation
- All features accessible via keyboard
- Tab order: logical left-to-right, top-to-bottom
- Skip links provided for main content
- Escape key closes modals/dropdowns
- Arrow keys navigate lists and menus

#### Screen Reader Support
- All images have alt text
- Form inputs have associated labels
- ARIA landmarks used (header, nav, main, aside, footer)
- Dynamic content updates announced (aria-live)
- Button vs link semantic distinction
- Status messages use role="status" or aria-live

#### Motion & Animation
- Respect prefers-reduced-motion
- Disable non-essential animations if set
- Keep critical animations (loading states)
- No auto-playing video/animation

---

## 12. States & Feedback

### Interactive States
```
Default:  Base styling
Hover:    Visual lift, color shift, cursor change
Focus:    Gold border + glow
Active:   Slight scale down, darker color
Disabled: Reduced opacity (0.5), muted colors, no-drop cursor
Loading:  Spinner or skeleton, disabled interaction
```

### Validation States

#### Success
```
Border: 1px solid #4CAF50
Icon: Checkmark in #4CAF50
Message: Green text below field
Animation: Brief scale pulse
```

#### Error
```
Border: 1px solid #F44336
Icon: X or Alert in #F44336
Message: Red text below field
Shake animation on submit
```

#### Warning
```
Border: 1px solid #FF9800
Icon: Alert Triangle in #FF9800
Message: Orange text below field
No animation (less critical)
```

### Empty States
```
Icon: Large (48px) in #666666
Heading: H3 in #E8E8E8
Description: Body in #999999
CTA: Primary or secondary button
Background: Subtle pattern or illustration
```

### Toast Notifications
```
Position: Top-right, 24px from edges
Width: 360px
Background: #2A2A2A
Border: 1px solid corresponding color (success/error/info)
Border-radius: 8px
Padding: 16px
Shadow: 0 8px 24px rgba(0, 0, 0, 0.4)
Duration: 5s (auto-dismiss), closeable
Animation: Slide in from right

Types:
- Success: Green left border (4px)
- Error: Red left border
- Info: Blue left border
- Warning: Orange left border
```

---

## 13. Content Guidelines

### Voice & Tone
- **Professional but approachable:** "Let's build something amazing" not "Create professional prompts"
- **Educational without condescension:** "Try adding..." not "You should..."
- **Encouraging:** Celebrate progress, frame errors as learning
- **Cinematic language:** Use film terms where natural (shot, scene, cut, frame)

### Microcopy Examples
```
Empty state: "Your first masterpiece starts here"
Loading: "Setting the scene..."
Error: "Hmm, let's adjust that"
Success: "Perfect! This is looking cinematic"
AI suggestion intro: "Consider this approach..."
Registration gate: "Unlock the full studio"
```

### Button Labels
```
Primary actions: "Create Prompt", "Save & Continue", "Generate"
Secondary: "Edit", "Duplicate", "Export"
Tertiary: "Learn More", "Skip for Now"
Destructive: "Delete Prompt" (always require confirmation)
```

---

## 14. Brand Assets

### Logo Treatment
```
Wordmark: "Sora Prompting Engine" in Playfair Display
Monogram: "SPE" in geometric frame (film sprocket inspiration)
Color: Gold Primary on dark, or White on dark
Min size: 120px width (wordmark), 32px (monogram)
Clear space: 16px on all sides
```

### Photography Style
- Cinematic stills from films
- High contrast, dramatic lighting
- Muted colors with gold accent overlays
- Never literal "AI" imagery (no robots, circuits)

### Illustration Style
- Line art in gold (#D4AF37)
- Simple geometric shapes
- Film equipment iconography (reels, clapperboards, lights)
- 2px stroke weight
- Used sparingly for empty states and onboarding

---

## 15. Implementation Notes

### CSS Architecture
```
Use CSS Custom Properties for theming
BEM naming convention for classes
Utility classes for spacing (Tailwind-inspired)
Component-scoped styles in React
```

### Performance Considerations
- Critical CSS inlined for above-fold content
- Lazy load images below fold
- Font loading: display swap for body, optional for headings
- Skeleton screens for async content
- Debounce autosave (500ms)
- Optimize animations (will-change, transform, opacity only)

### Dark Mode Only
- This design system is dark mode ONLY
- No light mode variant needed for MVP
- System preference detection not required

### Browser Support
- Modern evergreen browsers (last 2 versions)
- Chrome, Firefox, Safari, Edge
- No IE11 support
- CSS Grid and Flexbox required
- backdrop-filter support (graceful degradation)

---

## 16. Design Token Export

```json
{
  "colors": {
    "background": {
      "primary": "#0A0A0A",
      "secondary": "#1A1A1A",
      "tertiary": "#252525",
      "elevated": "#2A2A2A"
    },
    "text": {
      "primary": "#E8E8E8",
      "secondary": "#999999",
      "tertiary": "#666666",
      "inverse": "#0A0A0A"
    },
    "gold": {
      "primary": "#D4AF37",
      "dark": "#8B6914",
      "light": "#F4D03F",
      "muted": "rgba(212, 175, 55, 0.12)"
    },
    "semantic": {
      "success": "#4CAF50",
      "error": "#F44336",
      "warning": "#FF9800",
      "info": "#2196F3"
    }
  },
  "typography": {
    "fontFamily": {
      "heading": "'Playfair Display', Georgia, serif",
      "body": "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      "mono": "'JetBrains Mono', 'SF Mono', monospace"
    },
    "fontSize": {
      "display": "48px",
      "h1": "36px",
      "h2": "28px",
      "h3": "24px",
      "h4": "20px",
      "bodyLarge": "18px",
      "body": "16px",
      "bodySmall": "14px",
      "caption": "12px"
    }
  },
  "spacing": {
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "5": "24px",
    "6": "32px",
    "8": "48px",
    "10": "64px",
    "12": "96px"
  },
  "borderRadius": {
    "sm": "4px",
    "base": "6px",
    "md": "8px",
    "lg": "12px",
    "pill": "9999px"
  },
  "shadows": {
    "none": "none",
    "subtle": "0 2px 4px rgba(0, 0, 0, 0.2)",
    "elevated": "0 4px 12px rgba(0, 0, 0, 0.3)",
    "floating": "0 24px 48px rgba(0, 0, 0, 0.6)",
    "focus": "0 0 0 3px rgba(212, 175, 55, 0.12)",
    "glow": "0 0 20px rgba(212, 175, 55, 0.3)"
  }
}
```

---

## 17. Page-Specific Layouts

### Landing Page
```
Hero Section:
  - Full viewport height
  - Centered content (max-width 800px)
  - Display heading with gold accent word
  - Subheading in Text Secondary
  - Primary CTA + Secondary link
  - Background: Subtle animated film grain

Feature Section:
  - 3-column grid (1 column mobile)
  - Icon + H3 + Body per feature
  - Icons in Gold Primary (48px)
  - Cards with hover lift effect

Social Proof:
  - Testimonial cards in horizontal scroll
  - Quote in Body Large
  - Attribution in Caption
  - Gold quotation mark decoration
```

### Dashboard (Registered Users)
```
Layout:
  ┌─────────────────────────────────────┐
  │ Header (64px)                       │
  ├─────────────────────────────────────┤
  │                                     │
  │  Welcome back, [Name]               │
  │  [Stats: X prompts | Y this week]   │
  │                                     │
  │  ┌──────┐  ┌──────┐  ┌──────┐     │
  │  │Recent│  │Recent│  │Recent│     │
  │  │ Card │  │ Card │  │ Card │     │
  │  └──────┘  └──────┘  └──────┘     │
  │                                     │
  │  All Prompts (sortable grid/list)   │
  │                                     │
  └─────────────────────────────────────┘

Prompt Cards:
  - Thumbnail: First 60 chars of prompt
  - Status badge (Draft, Complete)
  - Last edited timestamp
  - Quick actions: Edit, Duplicate, Delete
  - Hover: Expand to show full prompt
```

### Builder Interface
```
Layout:
  ┌─────────────────────────────────────┐
  │ Header with progress (64px)         │
  ├──────────┬──────────────────────────┤
  │          │                          │
  │ Step Nav │  Active Step Content     │
  │ (240px)  │                          │
  │          │  [Form Fields]           │
  │ ● Step 1 │                          │
  │ ○ Step 2 │  [AI Suggestions]        │
  │ ○ Step 3 │                          │
  │ ○ Step 4 │  ┌──────────────────┐   │
  │ ○ Step 5 │  │ Formatted Output │   │
  │          │  │ (sticky bottom)  │   │
  │          │  └──────────────────┘   │
  └──────────┴──────────────────────────┘

Active Step Panel:
  - Heading: Step name + number
  - Description: What to include
  - Main input area (textarea or fields)
  - AI Co-pilot section (if registered)
  - Navigation: Back + Continue buttons
  - Save draft link (ghost button)

AI Co-pilot Panel:
  - Gold gradient background card
  - Sparkle icon identifier
  - Suggestion chips (if applicable)
  - "Refine this" button
  - Educational tooltip trigger
  - Collapsible for focus mode
```

### Registration Modal
```
Structure:
  ┌────────────────────────────────┐
  │  [Close X]                     │
  │                                │
  │  [Gold Star Icon]              │
  │  Unlock Your Creative Studio   │
  │  Access AI-powered suggestions │
  │                                │
  │  ┌──────────────────────────┐ │
  │  │ Continue with Google     │ │
  │  └──────────────────────────┘ │
  │                                │
  │  ┌──────────────────────────┐ │
  │  │ Continue with Apple      │ │
  │  └──────────────────────────┘ │
  │                                │
  │  or                            │
  │                                │
  │  [Email input]                 │
  │  [Password input]              │
  │                                │
  │  ┌──────────────────────────┐ │
  │  │ Create Account           │ │
  │  └──────────────────────────┘ │
  │                                │
  │  Already have an account?      │
  │  [Sign in]                     │
  │                                │
  └────────────────────────────────┘

Features List:
  - AI Co-pilot suggestions
  - Unlimited prompt creation
  - Save & organize prompts
  - Version history
  - Export templates
```

---

## 18. Micro-interactions Catalog

### Button Click
```
Timeline:
  0ms:    Scale 1.0
  100ms:  Scale 0.98 (pressed)
  200ms:  Scale 1.0 (release)
  
If success action:
  300ms:  Brief green checkmark overlay
```

### Form Field Focus
```
Timeline:
  0ms:    Border #3A3A3A
  150ms:  Border #D4AF37 with ease-out
          Shadow grows to full (3px glow)
```

### Suggestion Chip Select
```
Timeline:
  0ms:    Click detected
  100ms:  Scale 1.05
  200ms:  Scale 1.0
  300ms:  Fade content into main input
          Gold border pulse on input
```

### Prompt Completion
```
Timeline:
  0ms:    Final field filled
  200ms:  Green checkmark appears
  400ms:  Confetti burst (8-10 gold particles)
  600ms:  "Export" button glows
          Formatted output panel slides up
```

### AI Co-pilot Thinking
```
Timeline:
  0ms:    User triggers AI action
  300ms:  Loading spinner appears (delay for fast responses)
  Loop:   Pulse animation on sparkle icon
          "Analyzing..." text cycles through phrases:
          - "Setting the scene..."
          - "Finding the right angle..."
          - "Perfecting the lighting..."
  Done:   Fade out spinner
          Slide in suggestion card from right
```

### Step Navigation
```
Timeline:
  0ms:    User clicks "Continue"
  150ms:  Current content fades out (opacity 1 → 0)
  200ms:  Current step marked complete (green checkmark)
  250ms:  Next step highlighted in sidebar
  300ms:  New content fades in from slight right offset
          Scroll to top of content area
```

### Error Shake
```
Timeline:
  0ms:    Validation fails
  50ms:   TranslateX(-8px)
  100ms:  TranslateX(8px)
  150ms:  TranslateX(-6px)
  200ms:  TranslateX(6px)
  250ms:  TranslateX(0)
          Border changes to error red
          Error message slides down below field
```

### Toast Notification Entry
```
Timeline:
  0ms:    Trigger event
  0-300ms: Slide in from right (translateX(100%) → 0)
           Opacity 0 → 1
  5000ms: Begin exit if not hovered
  5000-5300ms: Slide out to right
               Opacity 1 → 0
  
On hover: Pause auto-dismiss timer
On click close: Immediate slide out
```

### Card Hover (Interactive Cards)
```
Timeline:
  0ms:    Cursor enters
  200ms:  Transform translateY(-2px)
          Shadow subtle → elevated
          Border #2A2A2A → #3A3A3A
  
  Exit:
  0ms:    Cursor leaves
  200ms:  Return to default state
```

### Spotlight Follow (on CTAs)
```
Continuous:
  Track mouse position
  Update radial gradient center
  Smooth interpolation (lerp 0.1)
  Max offset: 20px from actual cursor
  
Effect creates subtle "shine" that follows mouse
Only active on :hover state
```

---

## 19. Educational UI Patterns

### Tooltip System
```
Trigger: 
  - Hover for 500ms
  - Focus on keyboard navigation
  - Tap on mobile

Placement:
  - Prefer top, fallback to bottom
  - Auto-adjust if near viewport edge
  - 8px offset from trigger

Content Structure:
  - Bold term/concept (if applicable)
  - 1-2 sentence explanation
  - Optional: "Learn more" link
  
Max width: 280px
Dismissal: Click outside, ESC, or move away

Special: "Pro Tip" tooltips in gold background
```

### Inline Help
```
Icon: Info circle (16px) in #999999
Placement: Right of label or term
Color scheme: Blue info semantic

Click behavior:
  - Expand inline explanation
  - Push content down (no overlay)
  - Collapse on second click
  
Content:
  - Title in Body Small Bold
  - Explanation in Body Small
  - Optional code example in mono font
  - Optional visual diagram
```

### Progress Indicators
```
Step Counter:
  Display: "Step 2 of 5"
  Position: Top of content area
  Font: Caption uppercase
  Color: Text Secondary

Visual Progress:
  - Linear bar (4px height)
  - Position: Below header, full width
  - Fill: Gold gradient
  - Animated on step completion
  
  Segments:
  - Each step = segment
  - Completed: Full gold
  - Current: 50% gold
  - Upcoming: Background secondary
```

### Contextual Examples
```
Trigger: "Show example" link near input
Behavior: 
  - Expand accordion below input
  - Show 2-3 example variations
  - Each example clickable to insert
  
Example Card:
  - Light background (#1A1A1A)
  - Mono font for example text
  - Small "Use this" button
  - Gold indicator if "best practice"
```

---

## 20. Error & Empty State Patterns

### Form Validation Errors
```
Timing: On blur OR on submit attempt

Inline Error:
  - Red border on field (1px #F44336)
  - Error icon inside field (right side)
  - Error message below field
    Font: Body Small
    Color: #F44336
    Icon: Alert Circle (16px)
  
Multiple errors:
  - Show first error only
  - Update on fix to show next

Success State:
  - Green border (1px #4CAF50)
  - Checkmark icon (right side)
  - Optional success message
```

### Empty Dashboard
```
Layout:
  - Centered in main content area
  - Max width: 480px
  
Content:
  - Illustration: Film camera icon (64px) in #666666
  - Heading: "No prompts yet"
    Font: H2
    Color: Text Primary
  - Description: "Create your first cinematic prompt"
    Font: Body Large
    Color: Text Secondary
  - CTA: "Create First Prompt" primary button
  - Secondary: "View Examples" ghost button
  
Background: Subtle pattern or film strip decoration
```

### Search No Results
```
Content:
  - Search icon (48px) in #666666
  - Heading: "No matches found"
  - Description: Show search term in quotes
  - Suggestions:
    • Check spelling
    • Try different keywords
    • Browse all prompts
  - Clear Search button
```

### Network Error
```
Toast or inline banner:
  - Icon: Wifi Off or Cloud Off
  - Message: "Connection lost. Changes saving locally."
  - Color: Warning orange
  - Action: "Retry" button
  - Auto-dismiss on reconnect
  
Persistent state indicator:
  - Small dot in header
  - Red = offline
  - Green = online
  - Tooltip explains status
```

### AI Co-pilot Unavailable
```
In place of AI suggestions panel:
  - Icon: Sparkles (grayed out)
  - Heading: "AI Co-pilot temporarily unavailable"
  - Description: "Continue building manually"
  - Static suggestions still shown
  - "Retry" button if temporary error
```

---

## 21. Data Visualization

### Prompt Stats (Dashboard)
```
Stat Card:
  Background: #1A1A1A
  Border: 1px solid #2A2A2A
  Padding: 20px
  Border-radius: 8px
  
Layout:
  - Large number: Display size in Gold Primary
  - Label: Caption in Text Secondary
  - Change indicator: Small badge (+5 this week)
  
Examples:
  - Total Prompts Created
  - Avg. Time per Prompt
  - Completion Rate
  - Most Used Style
```

### Activity Timeline (if applicable)
```
Visual: Vertical line with nodes
  
Node:
  - Date on left (Caption, Text Tertiary)
  - Action card on right
    • Icon representing action
    • "Created [prompt name]"
    • Timestamp
  - Line: 2px #2A2A2A
  - Active node: Gold dot (8px)
  - Past node: Gray dot (6px)
```

### Quality Indicator (Prompt Strength)
```
Display: Horizontal bar with segments

Segments:
  - 5 segments total
  - Filled based on completeness:
    • All required fields
    • Cinematic details included
    • Optimal length
    • Specific camera work
    • Lighting/mood defined
    
Colors:
  - 1-2 segments: Red (#F44336)
  - 3 segments: Orange (#FF9800)
  - 4 segments: Yellow-green (#9C27B0)
  - 5 segments: Gold (#D4AF37)
  
Label: "Prompt Strength: [Weak/Good/Excellent]"
```

---

## 22. Responsive Component Adaptations

### Mobile Header (< 768px)
```
Height: 56px (reduced from 64px)
Logo: Monogram only (32px)
Menu: Hamburger icon (tap to expand)

Expanded menu:
  - Full screen overlay
  - Slide from right
  - Close X top-right
  - Nav links stacked
  - User info at bottom
```

### Mobile Step Navigation
```
Transform to:
  - Horizontal scroll at top
  - Chips instead of sidebar
  - Current step centered
  - Past steps: Gray with checkmark
  - Future steps: Outlined
  
OR (alternative):
  - Stepper at bottom (sticky)
  - Show current step only
  - Progress dots above
  - Back/Next arrows
```

### Mobile Forms
```
Adaptations:
  - Full width inputs
  - Larger touch targets (48px min)
  - Floating labels instead of side labels
  - Stack all form fields
  - Full-width buttons
  - Reduce padding to 16px
```

### Mobile Modals
```
Transform to:
  - Full screen takeover
  - Slide up from bottom
  - Header with title + close
  - Content scrollable
  - CTA sticky at bottom
  - No backdrop (full coverage)
```

### Tablet Adaptations (768px - 1023px)
```
Side Navigation:
  - Collapsed by default (icon only, 64px)
  - Expand on hover or click
  - Overlay content when expanded
  
Grid Systems:
  - 2 columns instead of 3
  - Cards slightly larger
  
Typography:
  - Reduce headings by 4px
  - Body text same as desktop
```

---

## 23. Print Styles (for Prompt Export)

```css
@media print {
  /* Hide UI chrome */
  header, nav, .ai-copilot, .cta-buttons {
    display: none !important;
  }
  
  /* Optimize for print */
  body {
    background: white;
    color: black;
  }
  
  .prompt-output {
    background: white;
    border: 2px solid black;
    padding: 20mm;
    font-family: 'Courier New', monospace;
    font-size: 12pt;
    line-height: 1.6;
  }
  
  /* Section headers */
  .prompt-section-label {
    font-weight: bold;
    text-transform: uppercase;
    font-size: 10pt;
    margin-top: 12pt;
    page-break-after: avoid;
  }
  
  /* Break control */
  .prompt-card {
    page-break-inside: avoid;
  }
  
  /* Add metadata footer */
  @page {
    margin: 20mm;
    @bottom-center {
      content: "Generated by Sora Prompting Engine";
      font-size: 8pt;
      color: #666;
    }
  }
}
```

---

## 24. Performance Budget

### Load Time Targets
```
First Contentful Paint:     < 1.5s
Largest Contentful Paint:   < 2.5s
Time to Interactive:        < 3.5s
Cumulative Layout Shift:    < 0.1
First Input Delay:          < 100ms
```

### Asset Size Limits
```
CSS Bundle:           < 50KB gzipped
JS Bundle (initial):  < 150KB gzipped
Fonts (total):        < 100KB
Images per page:      < 200KB total
Icons (SVG sprite):   < 20KB
```

### Optimization Strategies
- Lazy load below-the-fold content
- Code splitting by route
- Tree shake unused code
- Inline critical CSS (< 14KB)
- Preload key fonts
- Compress images (WebP with JPEG fallback)
- Cache static assets (1 year)
- CDN for all static resources

---

## 25. Version History & Changelog Template

### Format for Design Updates
```markdown
## Version X.X - [Date]

### Added
- New component: [Component Name]
- New pattern: [Pattern Name]

### Changed
- Updated [Component]: [Description]
- Revised color: [Old] → [New]

### Deprecated
- [Component/Pattern] will be removed in vX.X

### Removed
- Removed [Component/Pattern]

### Fixed
- Corrected accessibility issue in [Component]
- Fixed responsive behavior for [Component]
```

---

## 26. Handoff Checklist

### For Developers
- [ ] Design tokens file (JSON format)
- [ ] Figma file link (if applicable)
- [ ] Component library documentation
- [ ] Icon set exported (SVG sprite)
- [ ] Font files provided (WOFF2, WOFF)
- [ ] Color contrast audit passed
- [ ] Responsive breakpoint behaviors documented
- [ ] Animation timing specifications
- [ ] Accessibility requirements list
- [ ] Browser support matrix

### For QA
- [ ] Visual regression test baseline
- [ ] Interaction flow documentation
- [ ] Accessibility testing checklist (WCAG 2.1 AA)
- [ ] Responsive testing device list
- [ ] Performance budget metrics
- [ ] Error state examples
- [ ] Loading state examples

### For Content
- [ ] Voice & tone guidelines
- [ ] Microcopy examples
- [ ] Error message templates
- [ ] Success message templates
- [ ] Empty state content
- [ ] Tooltip content guidelines

---

## 27. Future Considerations

### Phase 2 Enhancements
- Light mode variant (if user demand exists)
- Advanced animations (WebGL effects)
- Customizable themes (user preferences)
- High contrast mode
- Larger text mode (accessibility)
- Custom color schemes for power users

### Scalability
- Component versioning strategy
- Design token management system
- Multi-brand support (if product expands)
- Localization considerations (RTL support)
- Dark pattern avoidance as features grow

---

## 28. Contact & Governance

### Design System Ownership
**Maintained by:** Chat Bot Labs Design Team  
**Review cycle:** Quarterly  
**Update process:** RFC (Request for Comments) for major changes  
**Feedback:** design@chatbotlabs.com

### Contribution Guidelines
1. Propose changes via RFC document
2. Design team review (1 week)
3. Prototype in Figma
4. Developer feasibility check
5. Accessibility audit
6. Approval & implementation
7. Documentation update

---

*This design specification is a living document and should be updated as the product evolves. All changes should be versioned and communicated to the team.*

**Last Updated:** November 6, 2025  
**Version:** 1.0  
**Status:** Ready for Implementation