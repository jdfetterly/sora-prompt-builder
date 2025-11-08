# Context Memory Solutions - Localhost Testing & Validation Plan

**Document Type:** Testing & Validation Plan  
**Feature IDs:** F-15.1, F-15.2, F-15.3  
**Created:** November 8, 2025  
**Status:** Ready for Implementation  
**Owner:** Chat Bot Labs

---

## 1. Overview

This document outlines the strategy for building and testing all three Context Memory solutions in parallel on localhost before selecting a single solution for production deployment.

### Solutions to Test
1. **Solution #1 (F-15.1):** Hybrid Approach - Accordion + Preview Sidebar
2. **Solution #2 (F-15.2):** Expandable Accordion Only
3. **Solution #3 (F-15.3):** Interactive Preview Sidebar Only

### Testing Environment
- **Location:** Localhost only (`http://localhost:3000`)
- **Duration:** 7-10 days of actual usage
- **Method:** Toggle between modes using in-app controls
- **Outcome:** Select ONE solution for production, delete the rest

---

## 2. Implementation Strategy

### Phase 1: Build All Components (Day 1-2)

Build all three solutions as independent components in a **single branch**:

```
/frontend/components/builder/
├── PromptSummaryAccordion.tsx     # Used by: Accordion, Hybrid
├── FloatingPreviewButton.tsx      # Used by: Preview, Hybrid
├── PreviewOverlay.tsx             # Used by: Preview, Hybrid
└── README.md                      # Component documentation
```

**Key Principle:** Build basic, functional versions. Don't over-polish until winner is chosen.

### Phase 2: Add Mode Toggle System (Day 2)

#### Context Mode Enum
```typescript
// /frontend/lib/types.ts

export enum ContextMemoryMode {
  NONE = "none",           // Baseline (XL sidebar only)
  ACCORDION = "accordion", // Solution F-15.2
  PREVIEW = "preview",     // Solution F-15.3
  HYBRID = "hybrid",       // Solution F-15.1
}
```

#### Toggle UI Component
```typescript
// /frontend/components/dev/ContextModeToggle.tsx

"use client";

import { useState, useEffect } from "react";

const MODES = [
  { value: "none", label: "None (Baseline)", emoji: "🚫" },
  { value: "accordion", label: "Accordion Only", emoji: "📋" },
  { value: "preview", label: "Preview Sidebar", emoji: "👁️" },
  { value: "hybrid", label: "Hybrid (Both)", emoji: "🔀" },
] as const;

export const ContextModeToggle = () => {
  const [mode, setMode] = useState("hybrid");

  useEffect(() => {
    const saved = localStorage.getItem("context-mode");
    if (saved) setMode(saved);
  }, []);

  const handleChange = (newMode: string) => {
    setMode(newMode);
    localStorage.setItem("context-mode", newMode);
    window.location.reload();
  };

  return (
    <div className="fixed top-4 left-4 z-[100] bg-yellow-400 text-black p-3 rounded-lg shadow-2xl border-2 border-yellow-600">
      <div className="font-bold text-xs mb-2">🧪 TEST MODE</div>
      <select
        value={mode}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full bg-white text-black px-2 py-1 rounded text-sm font-medium cursor-pointer"
      >
        {MODES.map(({ value, label, emoji }) => (
          <option key={value} value={value}>
            {emoji} {label}
          </option>
        ))}
      </select>
      <div className="text-xs mt-2 text-yellow-900">
        Or press: 1️⃣ 2️⃣ 3️⃣ 4️⃣
      </div>
    </div>
  );
};
```

#### Keyboard Shortcuts
```typescript
// Add to /frontend/app/(builder)/build/page.tsx

useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Only trigger if not typing in input/textarea
    if (e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement) return;

    const modes = ["none", "accordion", "preview", "hybrid"];
    const index = parseInt(e.key) - 1;
    
    if (index >= 0 && index < modes.length) {
      localStorage.setItem("context-mode", modes[index]);
      window.location.reload();
    }
  };
  
  window.addEventListener("keypress", handleKeyPress);
  return () => window.removeEventListener("keypress", handleKeyPress);
}, []);
```

### Phase 3: Conditional Rendering Logic (Day 2)

```typescript
// In /frontend/app/(builder)/build/page.tsx

const [contextMode, setContextMode] = useState<string>("hybrid");

useEffect(() => {
  const saved = localStorage.getItem("context-mode") || "hybrid";
  setContextMode(saved);
}, []);

// Determine what to render
const showAccordion = contextMode === "accordion" || contextMode === "hybrid";
const showPreviewButton = contextMode === "preview" || contextMode === "hybrid";

return (
  <div className="min-h-screen bg-background-primary">
    {/* 🔧 DEV ONLY - Remove before production */}
    <ContextModeToggle />

    <div className="flex flex-col md:flex-row">
      <StepNav ... />
      
      <main className="flex-1 md:ml-16 lg:ml-60 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-12">
          {/* Accordion: Show in ACCORDION or HYBRID modes */}
          {showAccordion && currentStep > 1 && (
            <PromptSummaryAccordion
              prompt={prompt}
              currentStep={currentStep}
              className="mb-6"
            />
          )}

          {/* Current step form */}
          {renderStep()}
          
          <StepControls ... />
        </div>
      </main>

      {/* Existing XL sidebar (always visible on XL screens) */}
      <aside className="w-full md:w-80 md:p-6 hidden xl:block">
        <PromptOutput prompt={prompt} />
      </aside>
    </div>

    {/* Preview Button: Show in PREVIEW or HYBRID modes */}
    {showPreviewButton && (
      <FloatingPreviewButton
        prompt={prompt}
        onClick={() => setPreviewOverlayOpen(true)}
        isVisible={typeof window !== "undefined" && window.innerWidth < 1280}
      />
    )}

    {/* Preview Overlay: Always render, controlled by state */}
    <PreviewOverlay
      isOpen={previewOverlayOpen}
      onClose={() => setPreviewOverlayOpen(false)}
      prompt={prompt}
    />
  </div>
);
```

---

## 3. Testing Protocol

### Week 1: Structured Testing (Days 3-9)

Test each mode for **2 full days** of actual prompt building:

#### Day 3-4: Baseline (NONE mode)
**Goal:** Experience the current pain point

- [ ] Build 4-5 complete prompts (all 5 steps)
- [ ] Resize browser to different widths (mobile, tablet, laptop, XL)
- [ ] Note frustrations when trying to remember previous steps
- [ ] Count how many times you click "Back" to review
- [ ] Rate overall experience: __ / 10

**Notes:**
```
Pros:
- 

Cons:
- 

Key frustrations:
- 
```

#### Day 5-6: Accordion Only (ACCORDION mode)
**Goal:** Test inline context visibility

- [ ] Build 4-5 complete prompts
- [ ] Expand/collapse accordion multiple times per prompt
- [ ] Test on mobile (use phone or resize browser to 375px)
- [ ] Test on tablet (768px width)
- [ ] Test on laptop (1024px width)
- [ ] Note if you still feel need for full preview
- [ ] Rate overall experience: __ / 10

**Notes:**
```
Pros:
- 

Cons:
- 

Discovery: Easy to find? Yes/No
Usage frequency: How often did you expand it?
Mobile experience: Good/Okay/Poor
```

#### Day 7-8: Preview Sidebar (PREVIEW mode)
**Goal:** Test floating button + overlay pattern

- [ ] Build 4-5 complete prompts
- [ ] Click preview button at different steps
- [ ] Test on mobile (actual phone if possible)
- [ ] Test close methods (backdrop, X button, ESC key)
- [ ] Note if inline context would still be helpful
- [ ] Rate overall experience: __ / 10

**Notes:**
```
Pros:
- 

Cons:
- 

Button discovery: Easy to find? Yes/No
Usage frequency: How often did you open preview?
Mobile experience: Good/Okay/Poor
```

#### Day 9: Hybrid (HYBRID mode)
**Goal:** Test combined approach

- [ ] Build 4-5 complete prompts
- [ ] Use both accordion and preview during building
- [ ] Note if having both feels redundant or complementary
- [ ] Test on all screen sizes
- [ ] Determine if one feature overshadows the other
- [ ] Rate overall experience: __ / 10

**Notes:**
```
Pros:
- 

Cons:
- 

Do both features complement each other? Yes/No
Which did you use more: Accordion / Preview / Equal
Visual clutter: Too much / Just right / Minimal
```

### Mobile Testing (Important!)

Test on actual mobile device:

```bash
# Find your local IP
ifconfig | grep "inet " | grep -v 127.0.0.1
# Example output: inet 192.168.1.123

# Access from phone (same WiFi):
http://192.168.1.123:3000/build
```

Test modes 2, 3, 4 on mobile specifically:
- [ ] Accordion on 375px width phone
- [ ] Preview button visibility and tap target
- [ ] Overlay slide-in animation smoothness
- [ ] Swipe to dismiss gesture

---

## 4. Decision Matrix

After testing, score each solution:

| Criteria | Weight | None | Accordion | Preview | Hybrid |
|----------|--------|------|-----------|---------|--------|
| **Feels Natural** | 25% | - | ___/10 | ___/10 | ___/10 |
| **Mobile Experience** | 20% | 2/10 | ___/10 | ___/10 | ___/10 |
| **Reduces Back Clicks** | 20% | 2/10 | ___/10 | ___/10 | ___/10 |
| **Minimal Distraction** | 15% | 9/10 | ___/10 | ___/10 | ___/10 |
| **Easy to Discover** | 10% | - | ___/10 | ___/10 | ___/10 |
| **Implementation Cost** | 10% | - | 8/10 | 6/10 | 4/10 |
| **WEIGHTED TOTAL** | 100% | - | ____ | ____ | ____ |

### Qualitative Assessment

**Best for Mobile:** ________________  
**Best for Desktop:** ________________  
**Most Intuitive:** ________________  
**Least Cluttered:** ________________  
**Most Complete:** ________________  

**Winner:** ________________

**Reasoning:**
```
[Write 2-3 sentences on why this solution won]
```

---

## 5. Post-Decision Cleanup

Once winner is selected (Day 10):

### Keep Only Winner's Components

**Example: If Hybrid wins, keep:**
```
✅ /frontend/components/builder/PromptSummaryAccordion.tsx
✅ /frontend/components/builder/FloatingPreviewButton.tsx
✅ /frontend/components/builder/PreviewOverlay.tsx
```

**Example: If Accordion wins, delete:**
```
❌ /frontend/components/builder/FloatingPreviewButton.tsx
❌ /frontend/components/builder/PreviewOverlay.tsx
```

### Remove Testing Infrastructure

1. **Delete toggle component:**
   ```bash
   rm /frontend/components/dev/ContextModeToggle.tsx
   ```

2. **Remove conditional rendering:**
   ```typescript
   // Replace conditional logic with direct rendering
   // Before:
   {showAccordion && <PromptSummaryAccordion ... />}
   
   // After:
   <PromptSummaryAccordion ... />
   ```

3. **Remove localStorage checks:**
   ```typescript
   // Delete these lines:
   const contextMode = localStorage.getItem("context-mode");
   const showAccordion = contextMode === "accordion" || ...;
   ```

4. **Remove keyboard shortcuts:**
   ```typescript
   // Delete the entire useEffect for key press handling
   ```

### Update Documentation

1. **Update Architecture.md:**
   - Add new component paths
   - Document integration points

2. **Update winning feature spec:**
   - Change status from "Proposed" to "Implemented"
   - Add implementation notes

3. **Archive losing specs:**
   - Move to `/docs/archive/` or delete

4. **Update Components.md:**
   - Document new components with usage examples

### Git Commit

```bash
git add .
git commit -m "feat(F-15.X): Add [Winning Solution Name]

- Implements [solution description]
- Tested locally with parallel validation approach
- Improves context visibility across all device sizes

Closes #[issue-number]"
```

---

## 6. Implementation Checklist

### Setup Phase
- [ ] Create all three component files
- [ ] Add ContextMemoryMode enum to types.ts
- [ ] Create ContextModeToggle component
- [ ] Add toggle UI to build page
- [ ] Add keyboard shortcuts (1-4)
- [ ] Add conditional rendering logic
- [ ] Test mode switching works (localStorage + reload)

### Component Implementation
- [ ] PromptSummaryAccordion component (basic version)
- [ ] FloatingPreviewButton component (basic version)
- [ ] PreviewOverlay component (basic version)
- [ ] Integration in build/page.tsx
- [ ] Test each component in isolation

### Testing Phase
- [ ] Day 3-4: Test NONE mode (baseline)
- [ ] Day 5-6: Test ACCORDION mode
- [ ] Day 7-8: Test PREVIEW mode
- [ ] Day 9: Test HYBRID mode
- [ ] Mobile device testing (all modes)
- [ ] Fill out decision matrix

### Decision & Cleanup
- [ ] Select winning solution
- [ ] Delete unused component files
- [ ] Remove ContextModeToggle component
- [ ] Remove conditional rendering logic
- [ ] Remove localStorage and mode switching code
- [ ] Remove keyboard shortcuts
- [ ] Update documentation
- [ ] Git commit with proper feature ID

---

## 7. Quick Reference

### Keyboard Shortcuts
- Press **1**: Switch to NONE mode (baseline)
- Press **2**: Switch to ACCORDION mode
- Press **3**: Switch to PREVIEW mode
- Press **4**: Switch to HYBRID mode

### localStorage Keys
- `context-mode`: Current testing mode ("none" | "accordion" | "preview" | "hybrid")

### Testing URLs
- Localhost: `http://localhost:3000/build`
- Mobile (same WiFi): `http://[YOUR_IP]:3000/build`

### Component Locations
```
/frontend/components/builder/
├── PromptSummaryAccordion.tsx
├── FloatingPreviewButton.tsx
└── PreviewOverlay.tsx

/frontend/components/dev/
└── ContextModeToggle.tsx (temporary, delete after)
```

---

## 8. Expected Timeline

| Day | Activity | Time |
|-----|----------|------|
| 1 | Build all 3 components (basic versions) | 4-5 hours |
| 2 | Add toggle system + conditional rendering | 2 hours |
| 3-4 | Test NONE mode + take notes | - |
| 5-6 | Test ACCORDION mode + take notes | - |
| 7-8 | Test PREVIEW mode + take notes | - |
| 9 | Test HYBRID mode + take notes | - |
| 10 | Decision + cleanup + commit | 2 hours |
| **Total** | **Development + Testing** | **~8 hours dev + 7 days testing** |

---

## 9. Success Criteria

This validation plan is successful when:

✅ All three solutions have been built and tested in real usage  
✅ Clear winner has been identified based on data  
✅ Unused code has been removed  
✅ Production-ready code remains  
✅ Documentation has been updated  
✅ Feature is committed to main branch

---

## 10. Notes & Observations

Use this space for any additional notes during testing:

```
[Add observations, surprises, or insights here]
```

---

**Document End**

