# Dev Components

This directory contains temporary development-only components used for testing and validation.

## ContextModeToggle.tsx

**Purpose:** Allows switching between different Context Memory UI solutions for localhost testing.

**Feature IDs:** F-15.1, F-15.2, F-15.3

**Status:** TEMPORARY - DELETE after selecting winning solution

### Usage

The component is automatically rendered in the top-left corner of the build page during development. It provides:

1. **Visual Dropdown:** Select between 4 modes
   - 🚫 None (Baseline) - Only XL sidebar
   - 📋 Accordion Only - Expandable summary above form
   - 👁️ Preview Sidebar - Floating button with overlay
   - 🔀 Hybrid (Both) - Accordion + Preview button

2. **Keyboard Shortcuts:**
   - Press **1** → None mode
   - Press **2** → Accordion mode
   - Press **3** → Preview mode
   - Press **4** → Hybrid mode

### How It Works

- Selection is saved to `localStorage` as `"context-mode"`
- Page reloads automatically when mode changes
- Mode persists across sessions until changed

### Cleanup Instructions

After testing and selecting the winning solution (Day 10):

1. Delete this entire `/dev/` directory
2. Remove `<ContextModeToggle />` from `build/page.tsx`
3. Remove conditional rendering logic (`showAccordion`, `showPreview`)
4. Keep only the winning solution's components
5. Remove unused imports and state

See `/docs/features/context-memory-validation-plan.md` Section 5 for full cleanup steps.

