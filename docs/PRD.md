# **Product Requirements Document (PRD)**

**Product Name:** Sora Prompting Engine

**Owner:** Chat Bot Labs

**Version:** 1.2 (Final Draft, Oct 31, 2025\)

## **1\. Product Overview**

The Sora Prompting Engine is a web-based platform for building high-quality prompts for OpenAI's Sora video model. It combines a structured, step-by-step builder with a powerful **AI Co-pilot** to provide dynamic, contextual suggestions, helping users master cinematic prompting in an educational and fluid experience.

The app provides a static, guided builder for anonymous users and unlocks the full AI Co-pilot for registered users, creating a clear value proposition for signup.

## **2\. Objectives**

* Empower creators with a structured, cinematic prompt design process.  
* Teach and reinforce best practices using an **AI Co-pilot** for dynamic, contextual guidance (registered users).  
* Drive registration by offering powerful **AI-powered features** as a clear and compelling incentive for registered users.  
* Build a distinctive brand for creative Sora prompt learning and engineering.

## **3\. Scope**

**In Scope (MVP)**

* Step-by-step guided prompt builder with a static, rules-based version for anonymous users.  
* **AI Co-pilot** for dynamic suggestions, refinement, and education (registered users).  
* Real-time **Formatted Text Output** (text-only preview) and clarity indicators.  
* Autosave of user progress (see Multi-session Behavior below).  
* **Non-Hostile Gating:** Anonymous users can create and export up to two prompts using the static builder.  
* **Value-Driven Registration:** Registration is required to create a third prompt **and** to unlock all AI Co-pilot features.  
* Authentication via email and OAuth (Google/Apple).  
* Responsive design for desktop and tablet.

**Out of Scope (for MVP)**

* **Mobile-specific breakpoint support** (mobile web will be functional but not optimized).  
* Multi-shot/sequence builders.  
* Community prompt gallery (beyond a few onboarding examples).  
* Team collaboration.  
* Payment/subscription tiers.  
* **Sora API integration / direct video generation** (slated for v1.1).

## **4\. Target Audience**

Primary: Aspiring Sora prompt creators, filmmakers, marketers, AI artists.  
Secondary: Experienced users needing structure, documentation, or AI-powered refinement.

## **5\. User Experience Goals**

* **Educational:** Stepwise learning, with contextual "why" explanations from the AI Co-pilot.  
* **Fluid:** Immediate feedback, minimal friction.  
* **Cinematic:** Film-inspired design patterns and terminology.  
* **Rewarding:** Clear feedback on prompt structure and potential.  
* **Conversion-friendly:** A non-hostile registration gate that clearly communicates the value of upgrading to the AI Co-pilot.

## **6\. Functional Requirements**

| ID | Requirement | Approach/Details |
| :---- | :---- | :---- |
| F-1 | Guided step-by-step prompt building | Linear flow based on the Core Prompt Structure (see 8.1); users can backtrack/edit steps. |
| F-1.5 | **AI Co-pilot (Registered Users)** | Registered users have access to an AI Co-pilot. This co-pilot provides: a) Dynamic suggestions based on user intent (e.g., "make it more cinematic"). b) Refinement of existing text. c) Contextual education on cinematic terms. |
| F-2 | Multi-session autosave/resume | Anonymous users get local draft recovery (via localStorage) for up to 2 drafts. Drafts persist for 7 days or until local data is cleared. Registered users see all unfinished drafts on their dashboard (Firestore). |
| F-3 | Prompt editing and versioning | Registered users may edit any prompt; edits are non-destructive and versioned. Draft mode until exported/saved; can duplicate prompts for iteration. |
| F-4 | Static Suggestions (Anonymous) | Anonymous users see static, pre-defined suggestion chips and tooltips (e.g., "Try adding a time of day"). |
| F-5 | **Formatted Text Output** | A non-editable text area provides a real-time view of the final, formatted prompt as it's being built. **This is a text-only preview, not a visual (image/video) one.** |
| F-6 | Static Validation (Anonymous) | For anonymous users, the static builder provides basic validation (e.g., "Subject field is required"). It will provide warnings for best practices, but these can be overridden. |
| F-7 | **Non-Hostile Registration Gate** | Anonymous users can fully create and export 2 prompts. Upon clicking "Create 3rd Prompt", a modal appears requiring registration. Banners will advertise the benefits of the AI Co-pilot after the 1st prompt. |
| F-8 | **Registration & Data Migration** | Modal requires signup (email, OAuth). On first successful registration, the app will check for any data in localStorage and migrate those prompts to the new user's account one time. |
| F-9 | Export/copy functionality | Export final prompt as plaintext or formatted markdown (includes labeled sections, e.g., “Subject: ...”, plus full assembled prompt). Option for JSON export for power users. |
| F-10 | Prompt management dashboard | Registered users have a dashboard to view, edit, duplicate, delete, and organize prompts. |
| F-11 | Template usage/sharing | Registered users can save a prompt as a personal template for faster creation. |
| F-12 | Learning/onboarding resources | Inline tooltips, 3-5 sample prompts in a gallery usable as templates. |
| F-13 | Success metrics instrumentation | Track prompt creation, completion, **co-pilot feature engagement**, registration conversions. |
| F-14 | Responsive design & accessibility | Must support desktop/tablet; keyboard-only navigation; all validation feedback is screen reader accessible (WCAG 2.1 AA). |

## **7\. Non-Functional Requirements**

* **Performance:** Static validation update within 100ms. **AI Co-pilot suggestions should return \< 1s.**  
* **Accessibility:** WCAG 2.1 AA compliance.  
* **Privacy:** GDPR compliant; anonymous ID hashed; users can fully delete account/data.  
* **Reliability:** Autosave after every field edit; local recovery on reload.  
* **Analytics:** Event tracking for prompt creation, abandonment, AI feature adoption, and registration.

## **8\. Data Model**

The core prompt is built from a structured data model. The builder UI will guide the user through these (or similar) fields, which are then assembled into the final prompt. The AI Co-pilot will use this structure to inform its suggestions.

### **8.1 Core Prompt Structure (Baseline)**

1. **Subject:** The main character, object, or element of focus.  
   * *Example: "A golden retriever wearing a vintage space helmet..."*  
2. **Action/Setting:** What the subject is doing and where the scene takes place.  
   * *Example: "...trotting happily on the dusty, red surface of Mars, kicking up small clouds of red dust..."*  
3. **Cinematic Style:** The overall aesthetic, artist reference, or film genre.  
   * *Example: "In the style of a Wes Anderson film, highly symmetrical, high-contrast, vintage pastel color palette..."*  
4. **Camera & Shot:** The type of camera shot, angle, and movement.  
   * *Example: "Medium shot, eye-level, smooth tracking shot that follows the subject..."*  
5. **Visual Details & Lighting:** Time of day, lighting, textures, and other key details.  
   * *Example: "Golden hour lighting, casting long, sharp shadows. The texture of the spacesuit is slightly reflective."*

## **9\. Success Metrics**

* Session completion rate \>75% (prompt created)  
* **AI Co-pilot adoption \> 50%** (Registered users who use at least one AI suggestion).  
* **Signup conversion after gating \> 15%**  
* Avg. prompt time to completion \<5min  
* Registered user 7-day retention \>30%

## **10\. Risks & Dependencies**

| Risk | Mitigation |
| :---- | :---- |
| **Platform Risk (High)** | **What if OpenAI releases their own official prompt builder with native video preview?** Mitigation: Build a strong brand and community. Focus on an exceptional educational UX that serves as a "learning layer" regardless of the underlying tool. |
| **User Expectation Risk (High)** | **Users may expect a *visual* (image/video) preview.** Mitigation: Clearly label the "Formatted Text Output" and manage expectations in all onboarding materials. Do not use ambiguous terms like "Live Preview." |
| **LLM Model Drift** | **The AI Co-pilot's suggestions may become stale or misaligned as the Sora model evolves.** Mitigation: Regularly fine-tune the co-pilot's system prompt with the latest official Sora documentation and community best practices. |
| **Anonymous Data Volatility** | **Anonymous user drafts in localStorage are volatile** and can be cleared by browser settings, wiping out user work and resetting the prompt gate. Mitigation: Be transparent. A small, persistent banner can state "Your 2 free drafts are saved in this browser. Sign up to save them permanently." |
| Overly restrictive AI | The AI Co-pilot's suggestions may block valid creativity. |

## **11\. Phased Roadmap & Open Questions**

* **v1.0 (MVP):** Launch with the Static Builder (Anon) and AI Co-pilot (Registered) as defined above.  
* **v1.1 (Fast Follow):** **Prioritize Sora API integration.** This is critical to close the user loop and allow users to generate video (or at least stills) directly, moving the app from a "dead-end" tool to an integrated platform.  
* **Open Questions:**  
  * Which 3-5 templates are most critical for the onboarding gallery?  
  * Finalize auth: Is email \+ Google/Apple all needed for MVP, or just Google to start?  
  * How do we collect user feedback in-app? (e.g., simple "Was this suggestion helpful?" on AI outputs).

## **12\. Out-of-Scope (Future Phases)**

* Team collaboration, community sharing/remixing.  
* Multi-shot dialogue, scene transitions.  
* Payment/premium tiers (beyond the free/registered split).