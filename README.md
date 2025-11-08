# Sora Prompting Engine

A web-based platform for building high-quality prompts for OpenAI's Sora video model. Built with Next.js 15, TypeScript, and TailwindCSS.

**Status:** Phase 1 (Anonymous Prompt Builder) - In Progress (~66% complete)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/chatbotlabs/sora-prompting-engine.git
cd sora-prompting-engine

# Install dependencies
cd frontend
npm install

# Copy environment template (optional for Phase 1)
cp .env.local.example .env.local
```

### Development

```bash
# Start development server
cd frontend
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
cd frontend
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
sora-prompting-engine/
├── frontend/              # Next.js application
│   ├── app/              # App Router pages and routes
│   ├── components/       # React components
│   ├── lib/              # Utilities and business logic
│   └── styles/           # Global styles
├── backend/              # Firebase functions (Phase 2)
├── docs/                 # Documentation and specs
│   ├── PRD.md           # Product Requirements
│   ├── DesignSpec.md    # Design specifications
│   ├── Architecture.md   # Technical architecture
│   └── Phase1-Tasks.md   # Implementation tasks
└── design/              # Design assets
```

---

## ✨ Phase 1 Features

### Core Functionality

- ✅ **Step-by-Step Builder** - Guided 5-step prompt creation flow
  - Subject
  - Action/Setting
  - Cinematic Style
  - Camera & Shot
  - Visual Details & Lighting

- ✅ **Real-Time Preview** - Live formatted prompt output
- ✅ **Auto-Save** - Automatic draft saving to localStorage
- ✅ **Draft Recovery** - Resume where you left off
- ✅ **Export Options** - Export as text, markdown, or JSON
- ✅ **Prompt Management** - View, edit, duplicate, and delete prompts
- ✅ **Static Suggestions** - Pre-defined suggestion chips with tooltips
- ✅ **Validation** - Real-time field validation with helpful feedback

### UI Components

- ✅ Complete design system with TailwindCSS
- ✅ Responsive design (desktop and tablet)
- ✅ Accessibility (WCAG 2.1 AA)
- ✅ Keyboard navigation
- ✅ Screen reader support

### Pages

- ✅ Landing page with hero and features
- ✅ Builder page (`/build`)
- ✅ Prompts list page (`/prompts`)
- ✅ Error boundary page
- ✅ Custom 404 page

---

## 🛠️ Available Scripts

### Frontend (`/frontend`)

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🎨 Design System

The application uses a custom design system based on cinematic aesthetics:

- **Colors:** Dark backgrounds with gold accents
- **Typography:** Playfair Display (headings), Inter (body), JetBrains Mono (code)
- **Spacing:** 4px base unit
- **Components:** Consistent button, input, card, and modal patterns

See `/docs/DesignSpec.md` for complete design specifications.

---

## 📚 Documentation

- **[PRD.md](docs/PRD.md)** - Product Requirements Document
- **[DesignSpec.md](docs/DesignSpec.md)** - Design specifications and patterns
- **[Architecture.md](docs/Architecture.md)** - Technical architecture and data flow
- **[Phase1-Tasks.md](docs/Phase1-Tasks.md)** - Implementation task tracking
- **[API.md](docs/API.md)** - API documentation (Phase 2)

---

## 🔄 Development Workflow

### Spec-Driven Development

This project follows a spec-driven development approach:

1. **Spec First** - All features are defined in `/docs/PRD.md` and `/docs/DesignSpec.md`
2. **Feature IDs** - Each feature has a unique ID (e.g., F-1, F-2)
3. **Code Comments** - All code includes Feature ID references
4. **Commit Tags** - Commits reference Feature IDs (e.g., `feat(F-1): add prompt builder`)

### Code Organization

- **Components:** `/frontend/components/` - Reusable UI components
- **Pages:** `/frontend/app/` - Next.js App Router pages
- **Utilities:** `/frontend/lib/` - Business logic and helpers
- **Types:** `/frontend/lib/types.ts` - TypeScript definitions

---

## 🚧 Phase 2 Roadmap

### Planned Features

- 🔐 **Authentication** - Email/password and OAuth (Google/Apple)
- 🤖 **AI Co-pilot** - Dynamic AI-powered suggestions and refinement
- ☁️ **Cloud Storage** - Firestore integration for registered users
- 📊 **Analytics** - User behavior tracking
- 🎯 **Registration Gate** - Non-hostile upgrade path after 2 prompts

See `/docs/PRD.md` for complete feature list.

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Complete prompt creation flow (all 5 steps)
- [ ] localStorage persistence and recovery
- [ ] Export functionality (all 3 formats)
- [ ] Responsive behavior (mobile, tablet, desktop)
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)

See `/docs/Phase1-Tasks.md` Section 15 for complete testing checklist.

---

## 🐛 Known Issues

See `/docs/KnownIssues.md` (to be created) for known issues and limitations.

**Phase 1 Limitations:**
- Mobile web not optimized (functional but not polished)
- No cloud sync (localStorage only)
- No AI features (static suggestions only)
- No authentication (anonymous users only)

---

## 📝 License

Copyright © 2024 Chat Bot Labs. All rights reserved.

---

## 👥 Contributing

This is a private project. For questions or issues, please contact the development team.

---

## 🔗 Links

- **Documentation:** `/docs/`
- **Design Specs:** `/docs/DesignSpec.md`
- **Architecture:** `/docs/Architecture.md`

---

**Last Updated:** December 2024  
**Version:** 0.1.0 (Phase 1)

