# Sora Prompting Engine

**Purpose:**  
A cinematic prompt builder and AI Co-pilot for OpenAI’s Sora model.  
Built by Chat Bot Labs using a spec-driven approach.

---

## 🚀 Tech Stack
- **Frontend:** Next.js 15 + TypeScript + TailwindCSS  
- **Backend:** Firebase (Auth + Firestore)  
- **AI Co-pilot:** OpenAI Agent Builder (via hosted Agent ID)  
- **Hosting:** Vercel (frontend + API), Firebase (back-end data)  

---

## 🏗️ Local Setup
```bash
# clone and install
git clone https://github.com/chatbotlabs/sora-prompting-engine.git
cd sora-prompting-engine
npm install
cd frontend && npm run dev
```

Create `.env.local` in `/frontend/` with:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
OPENAI_API_KEY=sk-...
AGENT_ID=agent_...
GA_MEASUREMENT_ID=G-XXXXXXX
```

---

## 📁 Repo Layout
| Folder | Purpose |
|---------|----------|
| `/frontend` | Next.js app (UI + API routes) |
| `/backend` | Firebase functions and rules |
| `/docs` | PRD, Design, Architecture specs |
| `/design` | Figma exports, tokens, assets |
| `/public` | SEO + compliance files |
| `/scripts` | Deployment and migration scripts |

---

## 🔌 Integration Notes
- `/app/api/copilot/route.ts` calls OpenAI’s **Agent ID** endpoint.  
- Firebase handles auth and draft storage.  
- Analytics routed through `/app/api/analytics`.

---

## 🧱 Development Workflow
1. Update specs in `/docs/` before coding.  
2. Implement component or API change.  
3. Commit with tag referencing PRD section (e.g., `[F-1.5]` AI Co-pilot`).  
4. Push → Vercel preview deploy.

---

## 🧭 Versioning
Agents are hosted in OpenAI; keep Agent IDs and version notes in `/docs/API.md`.

---

## ⚖️ Compliance Files
`robots.txt`, `llms.txt`, `security.txt`, `humans.txt`, and `.well-known/` are all served from `/frontend/public/`.

---
