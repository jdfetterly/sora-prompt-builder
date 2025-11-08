# AGENTS.md — Sora Prompting Engine

## Overview
This document describes the AI agents integrated into the **Sora Prompting Engine**.

All agents are built using the **OpenAI Agent Builder** and accessed via their unique `AGENT_ID`.  
Each agent is versioned and mapped to corresponding features in the Product Requirements Document (PRD).

| Agent Name | Version | Role | Owner | Linked PRD Features |
|-------------|----------|------|--------|----------------------|
| `SoraPromptingAgent` | v1.0 | AI Co-pilot for cinematic prompting | Chat Bot Labs | F-1.5, F-9 |
| `DirectorAgent` | v1.0 | Cinematic style specialist | Chat Bot Labs | F-1.5 |
| `CriticAgent` | v1.0 | Prompt quality assessor | Chat Bot Labs | F-1.5 |

---

## 1. Agent Summary

### SoraPromptingAgent (v1.0)
- **Purpose:** Guides users through cinematic prompt construction using contextual refinement and educational feedback.
- **Hosted Location:** OpenAI Agent Builder (Production)
- **API Integration:** `/app/api/copilot/route.ts`
- **Invocation Method:** `POST https://api.openai.com/v1/agents/{AGENT_ID}/completions`
- **Auth:** `OPENAI_API_KEY` (server-side env)

---

## 2. Configuration

### Environment Variables
```
AGENT_ID=agent_xxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

### Agent Settings
| Parameter | Value | Notes |
|------------|--------|-------|
| Temperature | 0.7 | Balanced creativity for educational output |
| Max Tokens | 1024 | Optimized for short prompt refinements |
| Tools | None (direct text response) |
| Memory | Stateless |

---

## 3. System Prompt (Summary)

> “You are the Sora Prompting Engine Co-pilot, guiding users to craft cinematic, clear, and educational prompts.  
You teach concepts such as framing, lighting, and movement while refining user text into Sora-ready format.”

Full version stored in `/frontend/lib/openai.ts` as a constant.

---

## 4. API Integration Flow

1. User enters text in the Prompt Builder (F-1).  
2. `/app/api/copilot/route.ts` receives user input.  
3. Server calls OpenAI Agent using `AGENT_ID`.  
4. Response is formatted, stored, and rendered in real-time.  
5. Event logged to `/app/api/analytics`.

---

## 5. Version History

| Version | Date | Change Summary | Linked PRD Update |
|----------|------|----------------|-------------------|
| v1.0 | Nov 2025 | Initial release with static refinement and contextual feedback | PRD 1.2 |
| v1.1 | TBD | Introduce Sora API integration and image/video preview | PRD 1.3 |

---

## 6. Additional Agents

### DirectorAgent (v1.0)
- **Purpose:** Specialized agent for cinematic style guidance, director signatures, and genre expertise.
- **Hosted Location:** OpenAI Agent Builder (Production)
- **API Integration:** `/app/api/copilot/route.ts` (with `agentType: 'director'`)
- **Invocation:** When user is on Step 3 (Style) or asks style-related questions
- **Configuration:** Temperature 0.8, Max Tokens 800
- **See:** `/docs/agents/AGENT_GUIDANCE.md` for full system prompt

### CriticAgent (v1.0)
- **Purpose:** Evaluates prompt quality, provides structured feedback, and scores prompts across multiple dimensions.
- **Hosted Location:** OpenAI Agent Builder (Production)
- **API Integration:** `/app/api/copilot/route.ts` (with `agentType: 'critic'`)
- **Invocation:** After step completion or when user requests quality feedback
- **Configuration:** Temperature 0.5, Max Tokens 1500
- **See:** `/docs/agents/AGENT_GUIDANCE.md` for full system prompt

## 7. Future Enhancements

- Explore shared memory between Builder UI and Agent.  
- Enable structured feedback (scorecards, learning hints).
- Agent collaboration (multiple agents working together).
- Custom user-created agents for specific styles.

---

## 8. Governance

### Governance Rules
- All agent changes must be logged in this file before deployment.  
- Update the PRD and Architecture docs when agent capabilities change.  
- Agent version increments must correspond to PRD version increments.  
- Test staging agents in a separate OpenAI project before promoting to production.

---

## 9. References

- `/docs/PRD.md#F-1.5` — AI Co-pilot functionality  
- `/docs/agents/AGENT_GUIDANCE.md` — Complete agent creation guide with system prompts
- `/docs/Architecture.md` — Integration overview  
- `/frontend/lib/openai.ts` — Agent interface  
