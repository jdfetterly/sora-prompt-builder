# Component Documentation

**Version:** 1.0  
**Last Updated:** December 2024  
**Status:** Phase 1

---

## Overview

This document provides comprehensive documentation for all React components in the Sora Prompting Engine. Components are organized by category: UI components (reusable design system components) and Builder components (application-specific components).

All components follow the design system specifications in `/docs/DesignSpec.md` and are built with TypeScript, TailwindCSS, and React.

---

## UI Components

### Button

**Location:** `frontend/components/ui/Button.tsx`  
**Feature ID:** Foundation  
**Purpose:** Primary action button with multiple variants and loading states

#### Props

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";  // Default: "primary"
  size?: "sm" | "md" | "lg";                    // Default: "md"
  isLoading?: boolean;                           // Default: false
  children: React.ReactNode;                     // Required
}
```

#### Usage

```tsx
import { Button } from "@/components/ui/Button";

// Primary button
<Button variant="primary" size="lg">Start Building</Button>

// Secondary button with loading state
<Button variant="secondary" isLoading={isLoading}>Save</Button>

// Ghost button
<Button variant="ghost">Cancel</Button>
```

#### Variants

- **primary:** Gold gradient background with hover lift effect
- **secondary:** Outlined border with gold accent on hover
- **ghost:** Transparent background with subtle hover effect

#### Design System Compliance

- Follows DesignSpec.md Section 6 (Buttons)
- Gold accent color (#D4AF37)
- 200ms transition duration
- Focus ring for accessibility

---

### Input

**Location:** `frontend/components/ui/Input.tsx`  
**Feature ID:** Foundation  
**Purpose:** Text input with validation states and helper text

#### Props

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;        // Optional label above input
  helperText?: string;   // Optional helper text below input
  error?: string;        // Error message (shows error state)
  success?: boolean;     // Show success state (default: false)
}
```

#### Usage

```tsx
import { Input } from "@/components/ui/Input";

// Basic input
<Input placeholder="Enter text" />

// With label and error
<Input 
  label="Email"
  error="Please enter a valid email"
  type="email"
/>

// Success state
<Input 
  label="Username"
  success={true}
  value={username}
/>
```

#### Design System Compliance

- Follows DesignSpec.md Section 6 (Form Elements)
- Error state: red border (#F44336) with AlertCircle icon
- Success state: green border (#4CAF50) with CheckCircle icon
- Minimum touch target: 48px on mobile, 44px on desktop

---

### Textarea

**Location:** `frontend/components/ui/Textarea.tsx`  
**Feature ID:** Foundation  
**Purpose:** Multi-line text input with auto-resize and character count

#### Props

```typescript
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;              // Optional label
  helperText?: string;         // Optional helper text
  error?: string;              // Error message
  success?: boolean;           // Success state
  showCharacterCount?: boolean; // Show character count (default: false)
  maxLength?: number;          // Maximum character length
}
```

#### Usage

```tsx
import { Textarea } from "@/components/ui/Textarea";

// Basic textarea
<Textarea placeholder="Enter description" />

// With character count
<Textarea 
  label="Description"
  showCharacterCount={true}
  maxLength={500}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>
```

#### Features

- Auto-resizes based on content (min: 120px, max: 400px)
- Character count indicator with warning at 90% of limit
- Same validation states as Input component

---

### Card

**Location:** `frontend/components/ui/Card.tsx`  
**Feature ID:** Foundation  
**Purpose:** Content container with consistent styling

#### Props

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "compact" | "spacious";  // Default: "default"
  hover?: boolean;                                 // Enable hover effect (default: false)
  children: React.ReactNode;                      // Required
}
```

#### Usage

```tsx
import { Card } from "@/components/ui/Card";

// Basic card
<Card>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>

// Card with hover effect
<Card hover={true}>
  <p>Hover to lift</p>
</Card>

// Compact padding
<Card variant="compact">Compact content</Card>
```

#### Padding Variants

- **default:** 24px (p-6)
- **compact:** 16px (p-4)
- **spacious:** 32px (p-8)

---

### Modal

**Location:** `frontend/components/ui/Modal.tsx`  
**Feature ID:** Foundation  
**Purpose:** Overlay dialog with backdrop blur and focus trap

#### Props

```typescript
interface ModalProps {
  isOpen: boolean;              // Required
  onClose: () => void;         // Required
  title?: string;              // Optional header title
  children: React.ReactNode;    // Required
  size?: "sm" | "md" | "lg";   // Default: "md"
  showCloseButton?: boolean;    // Default: true
}
```

#### Usage

```tsx
import { Modal } from "@/components/ui/Modal";

<Modal 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
>
  <p>Modal content here</p>
</Modal>
```

#### Features

- Backdrop blur effect
- ESC key to close
- Click outside to close
- Focus trap (keyboard navigation stays within modal)
- Prevents body scroll when open
- Restores focus to previous element on close

---

### Badge

**Location:** `frontend/components/ui/Badge.tsx`  
**Feature ID:** Foundation  
**Purpose:** Status indicator badge

#### Props

```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "draft" | "complete" | "warning" | "info" | "error";  // Default: "info"
  size?: "sm" | "md";                                             // Default: "md"
  icon?: React.ReactNode;                                         // Optional icon
  children: React.ReactNode;                                       // Required
}
```

#### Usage

```tsx
import { Badge } from "@/components/ui/Badge";
import { CheckCircle } from "lucide-react";

<Badge variant="complete" icon={<CheckCircle />}>
  Complete
</Badge>

<Badge variant="draft" size="sm">Draft</Badge>
```

---

### Toast

**Location:** `frontend/components/ui/Toast.tsx`  
**Feature ID:** Foundation  
**Purpose:** Notification toast with auto-dismiss

#### Props

```typescript
interface ToastProps {
  id: string;                    // Required unique ID
  type: "success" | "error" | "info" | "warning";  // Required
  message: string;               // Required
  duration?: number;             // Default: 5000ms
  onClose: (id: string) => void; // Required
}
```

#### Usage

```tsx
import { Toast } from "@/components/ui/Toast";

<Toast
  id="toast-1"
  type="success"
  message="Prompt saved successfully!"
  duration={3000}
  onClose={(id) => removeToast(id)}
/>
```

#### Toast Container

Use `ToastContainer` component to manage multiple toasts:

```tsx
import { ToastContainer } from "@/components/ui/Toast";

<ToastContainer toasts={toasts} />
```

---

### Tooltip

**Location:** `frontend/components/ui/Tooltip.tsx`  
**Feature ID:** F-12  
**Purpose:** Contextual help tooltip with auto-positioning

#### Props

```typescript
interface TooltipProps {
  content: string;                                    // Required tooltip text
  children: React.ReactNode;                          // Required trigger element
  placement?: "top" | "bottom" | "left" | "right";  // Default: "top"
  delay?: number;                                     // Default: 500ms
}
```

#### Usage

```tsx
import { Tooltip } from "@/components/ui/Tooltip";

<Tooltip content="This field is required" placement="top">
  <button>Hover me</button>
</Tooltip>
```

#### Features

- Auto-positioning (adjusts if off-screen)
- Hover and focus triggers
- Keyboard accessible
- Arrow indicator

---

### Spinner

**Location:** `frontend/components/ui/Spinner.tsx`  
**Feature ID:** Foundation  
**Purpose:** Loading spinner indicator

#### Props

```typescript
interface SpinnerProps {
  size?: "sm" | "md" | "lg";  // Default: "md"
  className?: string;          // Optional
}
```

#### Usage

```tsx
import { Spinner } from "@/components/ui/Spinner";

<Spinner size="lg" />
```

---

### Skeleton

**Location:** `frontend/components/ui/Skeleton.tsx`  
**Feature ID:** Foundation  
**Purpose:** Loading placeholder skeleton

#### Props

```typescript
interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular";  // Default: "rectangular"
  width?: string | number;
  height?: string | number;
}
```

#### Usage

```tsx
import { Skeleton } from "@/components/ui/Skeleton";

<Skeleton variant="rectangular" width={200} height={100} />
<Skeleton variant="text" width="100%" />
<Skeleton variant="circular" width={40} height={40} />
```

---

## Builder Components

### StepNav

**Location:** `frontend/components/builder/StepNav.tsx`  
**Feature ID:** F-1, F-14  
**Purpose:** Step navigation sidebar (desktop) / bottom nav (mobile)

#### Props

```typescript
interface StepNavProps {
  currentStep: number;           // Required (1-based)
  completedSteps: number[];      // Required array of step numbers
  onStepClick: (step: number) => void;  // Required
  className?: string;             // Optional
}
```

#### Usage

```tsx
import { StepNav } from "@/components/builder/StepNav";

<StepNav
  currentStep={2}
  completedSteps={[1]}
  onStepClick={(step) => setCurrentStep(step)}
/>
```

#### Responsive Behavior

- **Desktop:** Fixed 240px sidebar on left
- **Mobile:** Horizontal scrollable bottom navigation
- **Tablet:** Collapsible sidebar

---

### StepControls

**Location:** `frontend/components/builder/StepControls.tsx`  
**Feature ID:** F-1  
**Purpose:** Back/Continue navigation buttons

#### Props

```typescript
interface StepControlsProps {
  currentStep: number;            // Required
  totalSteps: number;             // Required
  canContinue: boolean;           // Required
  onBack: () => void;             // Required
  onNext: () => void;             // Required
  onSaveDraft: () => void;        // Required
  isLastStep?: boolean;           // Default: false
}
```

#### Usage

```tsx
import { StepControls } from "@/components/builder/StepControls";

<StepControls
  currentStep={2}
  totalSteps={5}
  canContinue={isValid}
  onBack={() => goToPreviousStep()}
  onNext={() => goToNextStep()}
  onSaveDraft={() => saveDraft()}
  isLastStep={currentStep === 5}
/>
```

---

### PromptOutput

**Location:** `frontend/components/builder/PromptOutput.tsx`  
**Feature ID:** F-5, F-14  
**Purpose:** Live preview of assembled prompt

#### Props

```typescript
interface PromptOutputProps {
  prompt: Partial<Prompt>;  // Required
  className?: string;        // Optional
}
```

#### Usage

```tsx
import { PromptOutput } from "@/components/builder/PromptOutput";

<PromptOutput prompt={currentPrompt} />
```

#### Features

- Real-time updates as prompt changes
- Copy to clipboard functionality
- Sticky on desktop, drawer on mobile
- Monospace font for readability

---

### SuggestionChips

**Location:** `frontend/components/builder/SuggestionChips.tsx`  
**Feature ID:** F-4, F-12  
**Purpose:** Clickable suggestion chips with tooltips

#### Props

```typescript
interface SuggestionChipsProps {
  suggestions: Suggestion[];              // Required
  onSelect: (text: string) => void;       // Required
  className?: string;                     // Optional
}
```

#### Usage

```tsx
import { SuggestionChips } from "@/components/builder/SuggestionChips";
import { getSuggestionsForStep } from "@/lib/suggestions";

<SuggestionChips
  suggestions={getSuggestionsForStep("subject")}
  onSelect={(text) => setSubject(text)}
/>
```

#### Features

- Horizontal scrollable row
- Info icon with tooltip explaining suggestion
- Click to insert text into field

---

### Step Components

All step components follow the same prop pattern:

#### Props (All Steps)

```typescript
interface StepProps {
  value: string;      // Required current value
  onChange: (value: string) => void;  // Required callback
  validation?: {      // Optional validation result
    level: "error" | "warning" | "success";
    message: string;
  } | null;
}
```

#### Available Steps

1. **SubjectStep** (`steps/SubjectStep.tsx`) - Step 1: Main subject input
2. **ActionSettingStep** (`steps/ActionSettingStep.tsx`) - Step 2: Action and setting
3. **StyleStep** (`steps/StyleStep.tsx`) - Step 3: Cinematic style
4. **CameraStep** (`steps/CameraStep.tsx`) - Step 4: Camera shot details
5. **VisualDetailsStep** (`steps/VisualDetailsStep.tsx`) - Step 5: Visual details and lighting

#### Usage

```tsx
import { SubjectStep } from "@/components/builder/steps/SubjectStep";

<SubjectStep
  value={prompt.subject}
  onChange={(value) => updatePrompt({ subject: value })}
  validation={validation.subject}
/>
```

---

### ExportModal

**Location:** `frontend/components/builder/ExportModal.tsx`  
**Feature ID:** F-9  
**Purpose:** Export prompt in multiple formats

#### Props

```typescript
interface ExportModalProps {
  isOpen: boolean;      // Required
  onClose: () => void; // Required
  prompt: Prompt;      // Required complete prompt
}
```

#### Usage

```tsx
import { ExportModal } from "@/components/builder/ExportModal";

<ExportModal
  isOpen={showExport}
  onClose={() => setShowExport(false)}
  prompt={completePrompt}
/>
```

#### Features

- Format selection: Text, Markdown, JSON
- Preview of formatted output
- Copy to clipboard
- Download as file
- Auto-generates filename with timestamp

---

## Layout Components

### Header

**Location:** `frontend/components/layout/Header.tsx`  
**Feature ID:** F-14  
**Purpose:** Site header with navigation

#### Props

None (uses internal state for mobile menu)

#### Usage

```tsx
import { Header } from "@/components/layout/Header";

<Header />
```

#### Features

- Responsive design (mobile hamburger menu)
- Logo and site name
- Navigation links
- Sticky positioning

---

## Design System Compliance

All components follow the design system specifications:

- **Colors:** Dark backgrounds (#0A0A0A) with gold accents (#D4AF37)
- **Typography:** Playfair Display (headings), Inter (body), JetBrains Mono (code)
- **Spacing:** 4px base unit
- **Animations:** 200ms standard transitions
- **Accessibility:** WCAG 2.1 AA compliant
- **Responsive:** Mobile-first approach

---

## Component Patterns

### Forward Refs

Most components use `React.forwardRef` to support ref forwarding:

```tsx
export const Component = React.forwardRef<HTMLElement, ComponentProps>(
  (props, ref) => { ... }
);
```

### Memoization

Performance-critical components use `React.memo`:

```tsx
export const Component = React.memo<ComponentProps>(({ ... }) => { ... });
```

### Client Components

Components using hooks or browser APIs are marked as client components:

```tsx
"use client";
```

---

## Type Safety

All components are fully typed with TypeScript:

- Props extend native HTML element types where applicable
- Required vs optional props clearly documented
- Type-safe event handlers
- Exported prop interfaces for reuse

---

**Last Updated:** December 2024  
**Next Review:** After Phase 2 implementation

