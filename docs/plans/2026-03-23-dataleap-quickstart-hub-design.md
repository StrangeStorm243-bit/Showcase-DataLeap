# Dataleap Quickstart Hub — Design Document

**Date:** 2026-03-23
**Author:** Niran
**Purpose:** Demo project for Dataleap Chief of Staff application

---

## Context

Dataleap (YC S24) is a 4-person AI agent platform ("the world's first vibe working platform"). The founder, Jan Damm (ex-Google PM, McKinsey), is hiring a Chief of Staff for growth + ops. This demo aims to demonstrate strategic thinking, shipping ability, product understanding, and "co-founder energy."

## Strategy: The Triple Threat

Three artifacts, each proving a different quality:

| Artifact | Format | Proves |
|----------|--------|--------|
| Agent Template Gallery + AI Advisor | Vite + React on Vercel | Growth systems thinking, shipping ability, market whitespace identification |
| 2-3 Dataleap Agents | Built on Dataleap platform | Product understanding, power user status |
| Strategy Memo + Loom | Notion/Google Doc + 3-4 min video | Strategic thinking, communication, co-founder energy |

This document covers **Artifact 2** (the deployed web tool) in detail. Artifacts 1 and 3 are sketched at the end.

---

## Artifact 2: Dataleap Quickstart Hub (Deployed Tool)

### Tech Stack

- **Frontend:** Vite + React + TypeScript (matches Dataleap's app frontend)
- **Styling:** Tailwind CSS + shadcn/ui
- **AI:** Claude Haiku via Vercel AI SDK (`@ai-sdk/anthropic` + `@ai-sdk/react`)
- **Deployment:** Vercel
- **API:** Vercel Serverless Functions (for Claude proxy)
- **Data:** Static JSON (no database)

### Pages

1. `/` — Landing page with hero, value prop, two CTAs
2. `/templates` — Agent Template Gallery (browsable, filterable, searchable)
3. `/templates/:id` — Individual template detail page
4. `/advisor` — AI-powered "What Should You Automate?" advisor

### Landing Page (`/`)

- **Headline:** "Find Your First Dataleap Agent in 60 Seconds"
- **Subline:** "Browse proven agent templates or let AI match you to the perfect automation"
- **CTAs:** "Browse Templates" → `/templates`, "Get Matched" → `/advisor`
- **Below fold:** 3 stats (time saved, setup time, integrations count)
- **Design:** Dark mode, Dataleap's purple/blue gradient accent, minimal, modern
- **Footer:** "Built by [Name] — applying for Chief of Staff" + LinkedIn link

### Agent Template Gallery (`/templates`)

**Template Data Model:**

```typescript
interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  role: "Sales" | "Operations" | "Engineering" | "HR" | "Marketing" | "Executive";
  category: "Monitoring" | "Outreach" | "Reporting" | "Triage" | "Research" | "Onboarding";
  tools: string[];
  trigger: {
    type: "schedule" | "webhook" | "integration_event";
    description: string; // e.g., "Every Monday at 8am"
  };
  estimatedTimeSaved: string; // e.g., "5 hrs/week"
  setupTime: string; // e.g., "2 min"
  complexity: "Beginner" | "Intermediate" | "Advanced";
  instructions: string; // Full plain-English agent instructions (copy-paste ready)
  popularityScore: number; // Simulated usage count
}
```

**UI:**
- Filter bar: role, category, complexity dropdowns
- Search: fuzzy text across name + description
- Cards: name, role badge, tool icons, time saved, setup time, complexity tag, popularity
- Click → detail page with full instructions + "Try on Dataleap" CTA

**Complexity heuristic:**
- Beginner: 1 tool, schedule trigger
- Intermediate: 2-3 tools, any trigger
- Advanced: 3+ tools, multi-step logic, webhook

### 25 Curated Templates

**Sales (5):**
1. Pre-Call Brief Generator — Calendly booking → HubSpot, Gmail, LinkedIn — 3 hrs/week
2. Inbound Lead Enricher — HubSpot new contact → Apollo, Web Search, HubSpot — 5 hrs/week
3. Post-Demo Follow-Up Drafter — Daily schedule → Gmail, HubSpot — 4 hrs/week
4. Deal Stall Detector — Weekly schedule → HubSpot, Slack — 2 hrs/week
5. LinkedIn Outreach Personalizer — Webhook → LinkedIn, Gmail — 6 hrs/week

**Operations (4):**
6. Weekly Ops Standup Digest — Monday 8am → Notion, Slack, Linear — 3 hrs/week
7. Expense Auto-Reviewer — Ramp new expense → Ramp, Slack — 2 hrs/week
8. Vendor Invoice Processor — Gmail new email → Gmail, Google Sheets, Slack — 4 hrs/week
9. SLA Breach Alerter — Hourly schedule → Intercom, Slack, Linear — 3 hrs/week

**Engineering (4):**
10. PR Review Digest — Daily 9am → GitHub, Slack — 3 hrs/week
11. Bug Report Aggregator — Weekly schedule → Slack, Linear — 4 hrs/week
12. On-Call Incident Summarizer — PagerDuty webhook → PagerDuty, Slack, Linear — 5 hrs/week
13. Deployment Changelog Writer — GitHub push → GitHub, Notion, Slack — 2 hrs/week

**HR (4):**
14. New Hire Onboarding Orchestrator — New employee event → Google Calendar, Notion, Slack — 6 hrs/week
15. 1:1 Prep Brief Generator — Before meetings → Google Calendar, Notion — 2 hrs/week
16. Job Description Writer — Slack message → Notion, Slack — 3 hrs/week
17. Weekly Pulse Survey Sender — Friday schedule → Gmail, Google Sheets — 1 hr/week

**Marketing (4):**
18. Blog → Social Repurposer — Publish event → LinkedIn, Twitter, Buffer — 5 hrs/week
19. Competitor Mention Monitor — Daily schedule → Web Search, Slack — 3 hrs/week
20. Newsletter Draft Generator — Weekly schedule → Notion, Gmail — 4 hrs/week
21. Campaign Performance Digest — Monday schedule → Google Analytics, Slack — 2 hrs/week

**Executive (4):**
22. Daily Briefing Email — 7am daily → Gmail, Slack, Google Calendar — 5 hrs/week
23. Meeting Prep Assistant — Calendar event → Gmail, Slack, HubSpot — 3 hrs/week
24. Weekly Board Update Drafter — Friday schedule → Linear, Notion, Gmail — 4 hrs/week
25. NDA → DocuSign Sender — Gmail trigger → Gmail, Google Docs, DocuSign — 2 hrs/week

**Hero template:** Daily Briefing Email (most universally relatable)
**Showcase template:** Pre-Call Brief Generator (aligns with Dataleap homepage use cases)

### AI Advisor (`/advisor`)

**Flow:**
1. Welcome message + explanation
2. "What's your role?" (quick-select chips)
3. "What tools does your team use daily?" (multi-select chips)
4. "What's the most repetitive task you do each week?" (free text)
5. Optional: "How big is your team?"
6. Claude analyzes → returns top 3 template matches with reasoning + personalized ROI estimate
7. Each recommendation has "View Template" and "Try on Dataleap" CTAs

**Technical:**
- Vercel serverless function at `/api/advisor`
- Claude Haiku model via `@ai-sdk/anthropic`
- `useChat` hook from `@ai-sdk/react` for streaming
- System prompt includes full template JSON for matching
- Claude outputs structured JSON, frontend renders as styled cards
- Simple in-memory rate limiting
- Conversation state client-side only

### Design Language

- Dark mode default
- Dataleap brand colors (purple/blue gradient accent)
- Clean, minimal, modern (matching their Framer marketing site aesthetic)
- Subtle animations on cards and page transitions
- shadcn/ui components for consistency
- Mobile responsive
- Proper OG/meta tags for link sharing

---

## Artifact 1: Dataleap Platform Agents (Sketch)

Build 2-3 agents directly on Dataleap:

1. **Competitor Intel Digest** — weekly monitor of Lindy, Relevance AI, Bardeen; sends summary of new features, pricing, positioning changes
2. **New Signup Welcome Agent** — webhook-triggered; asks new user about role/pain points; recommends templates from the Quickstart Hub (ties Artifact 1 → Artifact 2)
3. **Content Repurposer** — takes blog post URL, generates LinkedIn post + Twitter thread + email snippet

## Artifact 3: Strategy Memo + Loom (Sketch)

**Memo structure (2-3 pages, Notion):**
1. Where Dataleap stands (competitive landscape)
2. The activation problem (time-to-first-agent as #1 growth lever)
3. 6-month growth playbook (5-6 specific experiments)
4. What I already built (links to Vercel app + Dataleap agents)
5. 30/60/90 day plan

**Loom (3-4 min):** Walk through memo, demo agents, show deployed site. Close with "I did this in a weekend — imagine what I'd do with access."

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Vercel AI SDK + Vite (less documented than Next.js) | Vercel serverless functions work with any frontend; `useChat` is framework-agnostic |
| API key exposure | Server-side only via Vercel env vars |
| Claude API costs | Haiku model, <$1 total lifetime for demo usage |
| Dataleap platform access issues | Build platform agents after exploring for a day; web tool is independent |
| Template instructions feel generic | Write each one with specific, actionable plain-English steps referencing real Dataleap capabilities |
