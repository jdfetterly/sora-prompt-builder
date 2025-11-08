# Architecture Documentation

**Version:** 1.0  
**Last Updated:** December 2024  
**Status:** Phase 1 Implementation

---

## Overview

The Sora Prompting Engine is built with Next.js 15 (App Router), TypeScript, and TailwindCSS. The application follows a component-based architecture with clear separation between UI components, business logic, and data storage.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** TailwindCSS with custom design tokens
- **Icons:** Lucide React
- **State Management:** React hooks (useState, useEffect, useCallback)
- **Storage:** localStorage (Phase 1), Firestore (Phase 2)
- **Fonts:** Playfair Display (headings), Inter (body), JetBrains Mono (code)

---

## File Organization

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── (builder)/                # Route group for builder pages
│   │   ├── build/               # Prompt builder page
│   │   ├── prompts/             # Prompts list page
│   │   └── layout.tsx           # Builder layout wrapper
│   ├── (marketing)/             # Route group for marketing pages (future)
│   ├── api/                     # API routes
│   │   ├── analytics/          # Analytics endpoint (Phase 2)
│   │   ├── copilot/            # AI Co-pilot endpoint (Phase 2)
│   │   └── prompts/            # Prompts API (Phase 2)
│   ├── dashboard/              # User dashboard (Phase 2)
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── error.tsx               # Error boundary
│   └── not-found.tsx           # 404 page
├── components/
│   ├── builder/                # Builder-specific components
│   │   ├── steps/             # Individual step components
│   │   ├── ExportModal.tsx
│   │   ├── PromptOutput.tsx
│   │   ├── StepControls.tsx
│   │   ├── StepNav.tsx
│   │   └── SuggestionChips.tsx
│   ├── feedback/              # Feedback components (future)
│   ├── layout/                 # Layout components
│   │   └── Header.tsx
│   └── ui/                     # Reusable UI components
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Skeleton.tsx
│       ├── Spinner.tsx
│       ├── Textarea.tsx
│       ├── Toast.tsx
│       └── Tooltip.tsx
├── lib/                        # Business logic and utilities
│   ├── hooks/                  # Custom React hooks
│   │   └── useLocalStorage.ts
│   ├── analytics.ts           # Analytics utilities (Phase 2)
│   ├── constants.ts           # App constants
│   ├── firebase.ts            # Firebase config (Phase 2)
│   ├── openai.ts              # OpenAI integration (Phase 2)
│   ├── promptFormatter.ts     # Prompt formatting logic
│   ├── storage.ts             # localStorage utilities
│   ├── suggestions.ts         # Static suggestion data
│   ├── types.ts               # TypeScript type definitions
│   ├── utils.ts               # General utilities (cn, etc.)
│   └── validation.ts          # Validation logic
├── styles/
│   └── globals.css            # Global styles and design tokens
├── public/                     # Static assets
│   ├── humans.txt
│   ├── llms.txt
│   ├── robots.txt
│   └── security.txt
└── tailwind.config.ts          # Tailwind configuration
```

---

## Routes

### Public Routes

| Route | File | Purpose | Feature ID |
|-------|------|---------|------------|
| `/` | `app/page.tsx` | Landing page with hero and features | Foundation |
| `/build` | `app/(builder)/build/page.tsx` | Main prompt builder (5-step flow) | F-1, F-2 |
| `/prompts` | `app/(builder)/prompts/page.tsx` | List of saved prompts | F-10 |
| `/error` | `app/error.tsx` | Error boundary fallback | Foundation |
| `/404` | `app/not-found.tsx` | Custom 404 page | Foundation |

### API Routes (Phase 2 Placeholders)

| Route | File | Purpose | Feature ID |
|-------|------|---------|------------|
| `/api/analytics` | `app/api/analytics/route.ts` | Analytics event tracking | F-13 |
| `/api/copilot` | `app/api/copilot/route.ts` | AI Co-pilot suggestions | F-1.5 |
| `/api/prompts` | `app/api/prompts/route.ts` | Prompts CRUD operations | F-3 |

---

## Component Tree

### Root Layout
```
RootLayout (app/layout.tsx)
├── Skip Links (accessibility)
└── {children}
```

### Landing Page
```
HomePage (app/page.tsx)
├── Header
└── Main
    ├── Hero Section
    └── Features Section
```

### Builder Flow
```
BuilderLayout (app/(builder)/layout.tsx)
└── Header

BuildPage (app/(builder)/build/page.tsx)
├── StepNav (sidebar/bottom nav)
├── Main Content Area
│   ├── SubjectStep (Step 1)
│   ├── ActionSettingStep (Step 2)
│   ├── StyleStep (Step 3)
│   ├── CameraStep (Step 4)
│   └── VisualDetailsStep (Step 5)
├── StepControls (Back/Continue buttons)
└── PromptOutput (live preview panel)
```

### Prompts List Page
```
PromptsPage (app/(builder)/prompts/page.tsx)
├── Header
└── Main
    ├── Filter/Sort Controls
    ├── PromptCard[] (grid/list)
    └── EmptyState (if no prompts)
```

---

## Data Flow

### Prompt Creation Flow

```
User Input → Step Component
    ↓
Field Validation (validateField)
    ↓
Update Prompt State (useState)
    ↓
Auto-save to localStorage (debounced 500ms)
    ↓
Live Preview Update (PromptOutput)
    ↓
Step Navigation (StepControls)
    ↓
Final Export (ExportModal)
```

### Data Storage (Phase 1)

**localStorage Structure:**
```typescript
{
  "sora-prompt-drafts": {
    [promptId]: Prompt // Serialized Prompt object
  },
  "sora-prompt-last-draft": promptId // For recovery
}
```

**Storage Functions:**
- `saveDraft(prompt)` - Debounced save (500ms)
- `getDraft(id)` - Retrieve single draft
- `getAllDrafts()` - List all drafts
- `getLastDraft()` - Get most recent draft
- `deleteDraft(id)` - Remove draft

### Validation Flow

```
User Input
    ↓
validateField(field, value)
    ↓
FieldValidation Result
    ↓
UI Feedback (error/warning/success states)
    ↓
validatePrompt(prompt) [on step navigation]
    ↓
ValidationResult
    ↓
Enable/Disable Continue Button
```

---

## Component Architecture

### UI Components (`components/ui/`)

All UI components follow these patterns:
- **Props:** Extended from native HTML element props
- **Styling:** TailwindCSS classes with `cn()` utility
- **Accessibility:** ARIA labels, keyboard navigation, focus management
- **Variants:** Consistent variant system (primary/secondary/ghost, sm/md/lg)

**Key Components:**
- `Button` - Primary action button with loading states
- `Input` - Text input with validation states
- `Textarea` - Multi-line input with character count
- `Card` - Content container with hover effects
- `Modal` - Overlay dialog with backdrop blur
- `Toast` - Notification system
- `Badge` - Status indicators
- `Spinner` - Loading indicator
- `Skeleton` - Loading placeholder
- `Tooltip` - Contextual help

### Builder Components (`components/builder/`)

**Step Components:**
- Each step is a self-contained form component
- Receives `prompt` and `onChange` props
- Handles its own validation display
- Includes `SuggestionChips` for quick input

**Navigation:**
- `StepNav` - Sidebar navigation (desktop) / bottom nav (mobile)
- `StepControls` - Back/Continue buttons with validation

**Output:**
- `PromptOutput` - Live preview panel (sticky on desktop, drawer on mobile)
- `ExportModal` - Format selection and download

---

## State Management

### Local State (React Hooks)

**BuildPage State:**
```typescript
- currentStep: number (1-5)
- prompt: Prompt
- validation: ValidationResult
- isSaving: boolean
- showDraftRecovery: boolean
```

**PromptsPage State:**
```typescript
- prompts: Prompt[]
- filter: 'all' | 'draft' | 'complete'
- sort: 'modified' | 'created' | 'alphabetical'
- isLoading: boolean
```

### Persistence

- **Phase 1:** localStorage only (anonymous users)
- **Phase 2:** Firestore + localStorage sync (registered users)

---

## Styling System

### Design Tokens

Defined in `tailwind.config.ts` and `styles/globals.css`:

**Colors:**
- Background: `background-primary`, `background-secondary`, `background-elevated`
- Text: `text-primary`, `text-secondary`, `text-tertiary`
- Gold: `gold-primary`, `gold-light`, `gold-dark`, `gold-muted`
- Semantic: `success`, `error`, `warning`, `info`

**Typography:**
- Headings: `font-heading` (Playfair Display)
- Body: `font-body` (Inter)
- Code: `font-mono` (JetBrains Mono)

**Spacing:**
- Base unit: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

**Animations:**
- Standard: 200ms
- Fast: 150ms
- Slow: 300ms
- Reduced motion support via `prefers-reduced-motion`

---

## Performance Optimizations

### Code Splitting
- Lazy loading: `ExportModal` (only loaded when needed)
- Step components: Not lazy loaded (small size, immediate use)

### Memoization
- `PromptOutput` wrapped with `React.memo`
- Step components wrapped with `React.memo`
- Event handlers optimized with `useCallback`

### Rendering
- Debounced auto-save (500ms)
- Debounced preview updates (100ms)
- Proper key props in lists

---

## Accessibility

### WCAG 2.1 AA Compliance

**Keyboard Navigation:**
- All interactive elements keyboard accessible
- Focus indicators visible
- Skip links for main content
- ESC to close modals

**Screen Reader Support:**
- Semantic HTML elements
- ARIA labels on icons and buttons
- ARIA live regions for dynamic updates
- Form labels properly associated

**Visual:**
- Color contrast ratios meet AA standards
- Reduced motion support
- Focus indicators meet visibility requirements

---

## Error Handling

### Error Boundary
- `app/error.tsx` catches runtime errors
- User-friendly error message
- "Try again" and "Go home" actions
- Error logging in development mode

### 404 Handling
- `app/not-found.tsx` for unmatched routes
- Design system consistent
- Quick links to main pages

### Validation Errors
- Inline field validation
- Clear error messages
- Visual indicators (red border, icon)
- Prevents navigation on errors

---

## Future Architecture (Phase 2)

### Authentication
- Firebase Auth integration
- Email/password and OAuth (Google/Apple)
- Protected routes and API endpoints

### Data Sync
- Firestore for cloud storage
- localStorage sync for offline support
- Real-time updates across tabs

### AI Integration
- OpenAI Agent Builder API
- `/api/copilot` route for suggestions
- Dynamic prompt refinement

### Analytics
- Google Analytics integration
- Event tracking via `/api/analytics`
- User behavior insights

---

## Development Workflow

### Spec-Driven Development
1. Update specs in `/docs/` before coding
2. Reference Feature ID in code comments
3. Commit with Feature ID tag
4. Update Architecture.md after structural changes

### Code Quality
- TypeScript strict mode
- ESLint configuration
- Consistent component patterns
- JSDoc comments on utilities

---

**Last Updated:** December 2024  
**Next Review:** After Phase 2 implementation

