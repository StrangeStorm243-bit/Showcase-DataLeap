# Dataleap Quickstart Hub — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a deployable growth tool (Agent Template Gallery + AI Advisor) for Dataleap, showcasing growth thinking for a Chief of Staff application.

**Architecture:** Vite + React + TypeScript SPA with Tailwind CSS and shadcn/ui components. One Vercel Edge Function proxies Claude Haiku for the AI advisor. All template data is static JSON. React Router handles client-side navigation.

**Tech Stack:** Vite, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Vercel AI SDK (`@ai-sdk/react`, `@ai-sdk/anthropic`, `ai`), React Router, Vercel (deployment + edge functions)

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`
- Create: `src/main.tsx`, `src/App.tsx`, `src/index.css`
- Create: `components.json` (shadcn config)
- Create: `vercel.json`

**Step 1: Scaffold Vite + React + TypeScript project**

Run:
```bash
npm create vite@latest . -- --template react-ts
```

If the directory isn't empty, confirm overwrite.

**Step 2: Install core dependencies**

Run:
```bash
npm install react-router-dom lucide-react clsx tailwind-merge class-variance-authority
npm install -D tailwindcss @tailwindcss/vite
```

**Step 3: Configure Tailwind CSS v4**

Replace `src/index.css` with:
```css
@import "tailwindcss";
```

Update `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Update `tsconfig.json` to add path alias (merge into `compilerOptions`):
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Also update `tsconfig.app.json` similarly if it exists.

**Step 4: Initialize shadcn/ui**

Run:
```bash
npx shadcn@latest init
```

Select: style = default, base color = neutral, CSS variables = yes. Make sure `rsc` is `false` (not a Next.js project).

Then install needed components:
```bash
npx shadcn@latest add button card input badge select
```

**Step 5: Create Vercel config**

Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

This ensures client-side routing works and `/api/*` routes hit serverless functions.

**Step 6: Set up React Router shell**

Replace `src/App.tsx`:
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/templates" element={<div>Templates</div>} />
          <Route path="/templates/:id" element={<div>Template Detail</div>} />
          <Route path="/advisor" element={<div>Advisor</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

Create `src/components/Layout.tsx`:
```tsx
import { Outlet, Link } from 'react-router-dom'

export function Layout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800">
        <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Dataleap Quickstart Hub
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/templates" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              Templates
            </Link>
            <Link to="/advisor" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              Advisor
            </Link>
            <a
              href="https://dataleap.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors"
            >
              Try Dataleap
            </a>
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-zinc-800 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-zinc-500">
          Built by Niran — applying for Chief of Staff at Dataleap
        </div>
      </footer>
    </div>
  )
}
```

**Step 7: Verify dev server runs**

Run: `npm run dev`
Expected: App loads at localhost:5173 with nav bar, placeholder pages, dark background.

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + React + Tailwind + shadcn project"
```

---

## Task 2: Template Data

**Files:**
- Create: `src/data/templates.ts`
- Create: `src/types/template.ts`

**Step 1: Define TypeScript types**

Create `src/types/template.ts`:
```typescript
export type Role = 'Sales' | 'Operations' | 'Engineering' | 'HR' | 'Marketing' | 'Executive'

export type Category = 'Monitoring' | 'Outreach' | 'Reporting' | 'Triage' | 'Research' | 'Onboarding' | 'Communication' | 'Automation'

export type Complexity = 'Beginner' | 'Intermediate' | 'Advanced'

export type TriggerType = 'schedule' | 'webhook' | 'integration_event'

export interface AgentTemplate {
  id: string
  name: string
  description: string
  role: Role
  category: Category
  tools: string[]
  trigger: {
    type: TriggerType
    description: string
  }
  estimatedTimeSaved: string
  setupTime: string
  complexity: Complexity
  instructions: string
  popularityScore: number
}
```

**Step 2: Create template data file**

Create `src/data/templates.ts` with all 25 templates. Each template must have complete, thoughtful `instructions` — these are the copy-paste-ready agent instructions that would work in Dataleap. Here are the first 3 as examples of the quality bar; all 25 must follow this pattern:

```typescript
import type { AgentTemplate } from '@/types/template'

export const templates: AgentTemplate[] = [
  {
    id: 'daily-briefing-email',
    name: 'Daily Briefing Email',
    description: 'Compiles your calendar, unread emails, and Slack highlights into a single morning briefing delivered to your inbox at 7am.',
    role: 'Executive',
    category: 'Reporting',
    tools: ['Gmail', 'Google Calendar', 'Slack'],
    trigger: { type: 'schedule', description: 'Every day at 7:00 AM' },
    estimatedTimeSaved: '5 hrs/week',
    setupTime: '3 min',
    complexity: 'Beginner',
    instructions: `You are an executive briefing assistant. Every morning, compile a concise daily briefing email.

## What to do:
1. Check Google Calendar for all meetings scheduled today. For each meeting, include: time, attendees, and any linked agenda docs.
2. Scan Gmail inbox for unread emails received since yesterday 5pm. Summarize the top 5 most important ones (prioritize by sender seniority and urgency keywords).
3. Check Slack for messages in #general, #leadership, and any channels with unread mentions. Summarize key threads in 1-2 sentences each.

## Format:
Send an email with subject "Daily Briefing — [Today's Date]" with three sections:
- 📅 Today's Schedule (table: time | meeting | attendees)
- 📧 Email Highlights (bullet list: sender — subject — one-line summary)
- 💬 Slack Digest (bullet list: channel — topic — summary)

Keep the entire briefing under 300 words. Be concise and actionable.`,
    popularityScore: 2847,
  },
  {
    id: 'pre-call-brief-generator',
    name: 'Pre-Call Brief Generator',
    description: 'Automatically researches prospects and generates a one-page brief before every sales call, pulling from your CRM, LinkedIn, and recent news.',
    role: 'Sales',
    category: 'Research',
    tools: ['HubSpot', 'Gmail', 'LinkedIn', 'Web Search'],
    trigger: { type: 'integration_event', description: 'New Calendly booking' },
    estimatedTimeSaved: '3 hrs/week',
    setupTime: '5 min',
    complexity: 'Intermediate',
    instructions: `You are a sales research assistant. When a new meeting is booked, generate a pre-call brief for the sales rep.

## What to do:
1. Extract the attendee's name and email from the calendar event.
2. Look up the contact in HubSpot. Pull: company name, deal stage, last activity date, any notes from previous calls.
3. Search LinkedIn for the attendee. Pull: current title, time in role, career history, recent posts or activity.
4. Run a web search for "[Company Name] news" filtered to last 30 days. Summarize the top 3 relevant results (funding, product launches, leadership changes).
5. Check Gmail for any previous email threads with this contact. Summarize the last exchange.

## Format:
Send an email to the sales rep with subject "Pre-Call Brief: [Contact Name] @ [Company]" containing:
- 👤 Contact Snapshot (name, title, LinkedIn URL, time in role)
- 🏢 Company Context (industry, size, deal stage, last CRM activity)
- 📰 Recent News (3 bullet points)
- 💬 Previous Interactions (summary of last email/call)
- 🎯 Suggested Talking Points (3 bullets based on the above)

Keep it to one page. Focus on what helps the rep have a better conversation.`,
    popularityScore: 1923,
  },
  {
    id: 'pr-review-digest',
    name: 'PR Review Digest',
    description: 'Sends a daily Slack summary of all open PRs needing review, who\'s blocking whom, and which PRs have been open longest.',
    role: 'Engineering',
    category: 'Monitoring',
    tools: ['GitHub', 'Slack'],
    trigger: { type: 'schedule', description: 'Every weekday at 9:00 AM' },
    estimatedTimeSaved: '3 hrs/week',
    setupTime: '2 min',
    complexity: 'Beginner',
    instructions: `You are an engineering workflow assistant. Every morning, post a PR review digest to Slack.

## What to do:
1. Fetch all open pull requests from the team's GitHub repositories.
2. For each PR, check: title, author, reviewers requested, review status (approved/changes requested/pending), how many days it's been open, and CI status.
3. Sort PRs into three groups:
   - 🔴 Needs Review (no reviews yet, or changes requested and re-submitted)
   - 🟡 In Review (has pending reviews)
   - 🟢 Ready to Merge (approved, CI passing)

## Format:
Post to #engineering channel with:
- Header: "📋 PR Review Digest — [Date]"
- Each group as a section with PR title, author, days open, and link
- A "⚠️ Stale PRs" callout for anything open > 3 days
- Footer: total open PRs count and average review time

Keep it scannable. Use emoji and formatting for quick visual parsing.`,
    popularityScore: 1456,
  },
  // ... remaining 22 templates follow the same pattern
  // IMPORTANT: Write all 25 with equal quality instructions
]
```

Write ALL 25 templates with complete, detailed instructions. The remaining templates (see design doc for the full list of 25):
- Sales: Inbound Lead Enricher, Post-Demo Follow-Up Drafter, Deal Stall Detector, LinkedIn Outreach Personalizer
- Operations: Weekly Ops Standup Digest, Expense Auto-Reviewer, Vendor Invoice Processor, SLA Breach Alerter
- Engineering: Bug Report Aggregator, On-Call Incident Summarizer, Deployment Changelog Writer
- HR: New Hire Onboarding Orchestrator, 1:1 Prep Brief Generator, Job Description Writer, Weekly Pulse Survey Sender
- Marketing: Blog → Social Repurposer, Competitor Mention Monitor, Newsletter Draft Generator, Campaign Performance Digest
- Executive: Meeting Prep Assistant, Weekly Board Update Drafter, NDA → DocuSign Sender

**Step 3: Verify data compiles**

Run: `npm run dev`
Expected: No TypeScript errors.

**Step 4: Commit**

```bash
git add src/types/template.ts src/data/templates.ts
git commit -m "feat: add template data model and 25 curated agent templates"
```

---

## Task 3: Landing Page

**Files:**
- Create: `src/pages/Home.tsx`
- Modify: `src/App.tsx` (wire up route)

**Step 1: Build the landing page**

Create `src/pages/Home.tsx`:
```tsx
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Zap, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-24 pb-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight leading-tight">
          Find Your First Dataleap Agent
          <br />
          <span className="text-indigo-400">in 60 Seconds</span>
        </h1>
        <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
          Browse proven agent templates or let AI match you to the perfect automation.
          Every template is copy-paste ready for Dataleap.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-500">
            <Link to="/templates">
              Browse Templates <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            <Link to="/advisor">
              Get Matched by AI
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Clock className="h-8 w-8 text-indigo-400 mx-auto" />
            <div className="mt-4 text-3xl font-bold">15 hrs/week</div>
            <div className="mt-2 text-sm text-zinc-400">Average time saved per user</div>
          </div>
          <div className="text-center">
            <Zap className="h-8 w-8 text-indigo-400 mx-auto" />
            <div className="mt-4 text-3xl font-bold">Under 5 min</div>
            <div className="mt-2 text-sm text-zinc-400">Average setup time</div>
          </div>
          <div className="text-center">
            <Layers className="h-8 w-8 text-indigo-400 mx-auto" />
            <div className="mt-4 text-3xl font-bold">3,000+</div>
            <div className="mt-2 text-sm text-zinc-400">Supported integrations</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Pick a Template', desc: 'Browse by role or let AI recommend one based on your workflow.' },
            { step: '2', title: 'Copy Instructions', desc: 'Each template has ready-to-paste agent instructions for Dataleap.' },
            { step: '3', title: 'Launch Your Agent', desc: 'Paste into Dataleap, connect your tools, and start automating.' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto font-bold">
                {item.step}
              </div>
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
```

**Step 2: Wire up the route in App.tsx**

Replace the `<Route path="/" element={<div>Home</div>} />` with:
```tsx
import { Home } from '@/pages/Home'
// ...
<Route path="/" element={<Home />} />
```

**Step 3: Verify**

Run: `npm run dev`
Expected: Landing page renders with hero, stats, how-it-works. Both CTAs link correctly.

**Step 4: Commit**

```bash
git add src/pages/Home.tsx src/App.tsx
git commit -m "feat: add landing page with hero, stats, and how-it-works"
```

---

## Task 4: Template Gallery Page

**Files:**
- Create: `src/pages/Templates.tsx`
- Create: `src/components/TemplateCard.tsx`
- Create: `src/components/TemplateFilters.tsx`
- Modify: `src/App.tsx` (wire up route)

**Step 1: Build the TemplateCard component**

Create `src/components/TemplateCard.tsx`:
```tsx
import { Link } from 'react-router-dom'
import { Clock, Users, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { AgentTemplate } from '@/types/template'

const complexityColor: Record<string, string> = {
  Beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
  Intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const roleColor: Record<string, string> = {
  Sales: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Operations: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Engineering: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  HR: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Marketing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Executive: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

export function TemplateCard({ template }: { template: AgentTemplate }) {
  return (
    <Link to={`/templates/${template.id}`}>
      <Card className="bg-zinc-900 border-zinc-800 p-5 hover:border-zinc-600 transition-colors cursor-pointer h-full flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-zinc-50 leading-tight">{template.name}</h3>
          <Badge variant="outline" className={complexityColor[template.complexity]}>
            {template.complexity}
          </Badge>
        </div>

        <p className="mt-2 text-sm text-zinc-400 line-clamp-2 flex-1">{template.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge variant="outline" className={roleColor[template.role]}>
            {template.role}
          </Badge>
          {template.tools.slice(0, 3).map((tool) => (
            <Badge key={tool} variant="outline" className="bg-zinc-800 text-zinc-300 border-zinc-700">
              {tool}
            </Badge>
          ))}
          {template.tools.length > 3 && (
            <Badge variant="outline" className="bg-zinc-800 text-zinc-500 border-zinc-700">
              +{template.tools.length - 3}
            </Badge>
          )}
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {template.estimatedTimeSaved}
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" /> {template.setupTime}
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <Users className="h-3 w-3" /> {template.popularityScore.toLocaleString()}
          </span>
        </div>
      </Card>
    </Link>
  )
}
```

**Step 2: Build the TemplateFilters component**

Create `src/components/TemplateFilters.tsx`:
```tsx
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import type { Role, Complexity } from '@/types/template'

interface FiltersProps {
  search: string
  onSearchChange: (value: string) => void
  role: string
  onRoleChange: (value: string) => void
  complexity: string
  onComplexityChange: (value: string) => void
}

const roles: Role[] = ['Sales', 'Operations', 'Engineering', 'HR', 'Marketing', 'Executive']
const complexities: Complexity[] = ['Beginner', 'Intermediate', 'Advanced']

export function TemplateFilters({ search, onSearchChange, role, onRoleChange, complexity, onComplexityChange }: FiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Search templates..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-50 placeholder:text-zinc-500"
        />
      </div>
      <Select value={role} onValueChange={onRoleChange}>
        <SelectTrigger className="w-full sm:w-[160px] bg-zinc-900 border-zinc-800 text-zinc-50">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-800">
          <SelectItem value="all">All Roles</SelectItem>
          {roles.map((r) => (
            <SelectItem key={r} value={r}>{r}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={complexity} onValueChange={onComplexityChange}>
        <SelectTrigger className="w-full sm:w-[160px] bg-zinc-900 border-zinc-800 text-zinc-50">
          <SelectValue placeholder="All Levels" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-800">
          <SelectItem value="all">All Levels</SelectItem>
          {complexities.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
```

**Step 3: Build the Templates page**

Create `src/pages/Templates.tsx`:
```tsx
import { useState, useMemo } from 'react'
import { templates } from '@/data/templates'
import { TemplateCard } from '@/components/TemplateCard'
import { TemplateFilters } from '@/components/TemplateFilters'

export function Templates() {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('all')
  const [complexity, setComplexity] = useState('all')

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch = search === '' ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      const matchesRole = role === 'all' || t.role === role
      const matchesComplexity = complexity === 'all' || t.complexity === complexity
      return matchesSearch && matchesRole && matchesComplexity
    })
  }, [search, role, complexity])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Agent Templates</h1>
        <p className="mt-2 text-zinc-400">
          {templates.length} ready-to-use agent templates with copy-paste instructions for Dataleap.
        </p>
      </div>

      <TemplateFilters
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
        complexity={complexity}
        onComplexityChange={setComplexity}
      />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-zinc-500">
          No templates match your filters. Try adjusting your search.
        </div>
      )}
    </div>
  )
}
```

**Step 4: Wire up route in App.tsx**

```tsx
import { Templates } from '@/pages/Templates'
// ...
<Route path="/templates" element={<Templates />} />
```

**Step 5: Verify**

Run: `npm run dev`, navigate to `/templates`
Expected: Grid of template cards with working filters and search.

**Step 6: Commit**

```bash
git add src/pages/Templates.tsx src/components/TemplateCard.tsx src/components/TemplateFilters.tsx src/App.tsx
git commit -m "feat: add template gallery with filtering and search"
```

---

## Task 5: Template Detail Page

**Files:**
- Create: `src/pages/TemplateDetail.tsx`
- Modify: `src/App.tsx` (wire up route)

**Step 1: Build the detail page**

Create `src/pages/TemplateDetail.tsx`:
```tsx
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Zap, Users, Copy, ExternalLink, Calendar, Webhook, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { templates } from '@/data/templates'
import { useState } from 'react'

const triggerIcon = {
  schedule: Calendar,
  webhook: Webhook,
  integration_event: Mail,
}

export function TemplateDetail() {
  const { id } = useParams<{ id: string }>()
  const template = templates.find((t) => t.id === id)
  const [copied, setCopied] = useState(false)

  if (!template) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-zinc-400">Template not found.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/templates">Back to Templates</Link>
        </Button>
      </div>
    )
  }

  const TriggerIcon = triggerIcon[template.trigger.type]

  const handleCopy = async () => {
    await navigator.clipboard.writeText(template.instructions)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/templates" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-50 transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Templates
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{template.name}</h1>
          <p className="mt-2 text-zinc-400 max-w-2xl">{template.description}</p>
        </div>
        <a
          href="https://app.dataleap.ai"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="bg-indigo-600 hover:bg-indigo-500 shrink-0">
            Try on Dataleap <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </a>
      </div>

      {/* Meta grid */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800 p-4">
          <div className="text-xs text-zinc-500 uppercase tracking-wide">Time Saved</div>
          <div className="mt-1 flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-400" />
            <span className="font-semibold">{template.estimatedTimeSaved}</span>
          </div>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 p-4">
          <div className="text-xs text-zinc-500 uppercase tracking-wide">Setup Time</div>
          <div className="mt-1 flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-400" />
            <span className="font-semibold">{template.setupTime}</span>
          </div>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 p-4">
          <div className="text-xs text-zinc-500 uppercase tracking-wide">Trigger</div>
          <div className="mt-1 flex items-center gap-2">
            <TriggerIcon className="h-4 w-4 text-indigo-400" />
            <span className="font-semibold text-sm">{template.trigger.description}</span>
          </div>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 p-4">
          <div className="text-xs text-zinc-500 uppercase tracking-wide">Users</div>
          <div className="mt-1 flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-400" />
            <span className="font-semibold">{template.popularityScore.toLocaleString()}</span>
          </div>
        </Card>
      </div>

      {/* Tools */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">Required Tools</h2>
        <div className="flex flex-wrap gap-2">
          {template.tools.map((tool) => (
            <Badge key={tool} variant="outline" className="bg-zinc-900 text-zinc-300 border-zinc-700 px-3 py-1">
              {tool}
            </Badge>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Agent Instructions</h2>
          <Button variant="outline" size="sm" onClick={handleCopy} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            <Copy className="h-3 w-3 mr-2" />
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <Card className="bg-zinc-900 border-zinc-800 p-6">
          <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-mono leading-relaxed">
            {template.instructions}
          </pre>
        </Card>
      </div>
    </div>
  )
}
```

**Step 2: Wire up route**

```tsx
import { TemplateDetail } from '@/pages/TemplateDetail'
// ...
<Route path="/templates/:id" element={<TemplateDetail />} />
```

**Step 3: Verify**

Run: `npm run dev`, click any template card → detail page loads with instructions and copy button.

**Step 4: Commit**

```bash
git add src/pages/TemplateDetail.tsx src/App.tsx
git commit -m "feat: add template detail page with copy-paste instructions"
```

---

## Task 6: AI Advisor — API Route

**Files:**
- Create: `api/advisor.ts` (Vercel Edge Function — at project root, NOT in src/)

**Step 1: Install AI SDK dependencies**

Run:
```bash
npm install ai @ai-sdk/anthropic @ai-sdk/react
```

**Step 2: Create the serverless function**

Create `api/advisor.ts` at project root:
```typescript
import { anthropic } from '@ai-sdk/anthropic'
import { streamText, convertToModelMessages, type UIMessage } from 'ai'

// Import template data as a string for the system prompt
import { templates } from '../src/data/templates'

const systemPrompt = `You are the Dataleap Quickstart Advisor — a friendly, concise AI that helps people find the right automation agent for their workflow.

You have access to a library of ${templates.length} proven agent templates. Your job is to understand the user's role, tools, and pain points, then recommend the best templates.

## Conversation Flow:
1. Start by asking their role (suggest: Sales, Operations, Engineering, HR, Marketing, Executive)
2. Ask what tools their team uses daily (suggest common ones: Gmail, Slack, HubSpot, GitHub, Notion, etc.)
3. Ask about their most repetitive/annoying weekly task (free text)
4. Optionally ask team size for ROI scaling

After gathering info, recommend the TOP 3 templates from the library below. For each:
- Name and why it's a match
- Estimated time saved (scale by team size if known)
- Setup time
- A brief personalization note

## Style:
- Be warm, concise, and consultative
- Use short messages (2-3 sentences max per message)
- Use quick-select options when possible (format as bullet points with emoji)
- Never be pushy — you're a helpful advisor, not a salesperson
- End recommendations with a note that they can browse all templates at /templates

## Template Library:
${JSON.stringify(templates.map(t => ({
  id: t.id,
  name: t.name,
  description: t.description,
  role: t.role,
  tools: t.tools,
  estimatedTimeSaved: t.estimatedTimeSaved,
  setupTime: t.setupTime,
  complexity: t.complexity,
})), null, 2)}
`

export const config = { runtime: 'edge' }

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: anthropic('claude-haiku-4-5-20251001'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
```

**Step 3: Add environment variable note**

Create `.env.example`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

The `@ai-sdk/anthropic` provider reads `ANTHROPIC_API_KEY` from environment automatically.

**Step 4: Verify build doesn't break**

Run: `npm run build`
Expected: Build succeeds (the API route is handled by Vercel separately, not bundled by Vite).

Note: The `api/` directory import of `../src/data/templates` may need adjustment. If Vercel can't resolve it, inline a simplified template list in the system prompt instead. Test this during deployment (Task 8).

**Step 5: Commit**

```bash
git add api/advisor.ts .env.example
git commit -m "feat: add AI advisor Vercel edge function with Claude Haiku"
```

---

## Task 7: AI Advisor — Chat UI

**Files:**
- Create: `src/pages/Advisor.tsx`
- Create: `src/components/ChatMessage.tsx`
- Modify: `src/App.tsx` (wire up route)

**Step 1: Build the ChatMessage component**

Create `src/components/ChatMessage.tsx`:
```tsx
import { Bot, User } from 'lucide-react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        role === 'user' ? 'bg-indigo-600' : 'bg-zinc-700'
      }`}>
        {role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        role === 'user'
          ? 'bg-indigo-600 text-white'
          : 'bg-zinc-800 text-zinc-200'
      }`}>
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  )
}
```

**Step 2: Build the Advisor page**

Create `src/pages/Advisor.tsx`:
```tsx
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChatMessage } from '@/components/ChatMessage'

export function Advisor() {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/advisor',
    }),
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        parts: [
          {
            type: 'text',
            text: "Hey! I'm the Dataleap Quickstart Advisor. I'll help you find the perfect agent template for your workflow.\n\nFirst up — what's your role?\n\n• 💼 Sales\n• ⚙️ Operations\n• 💻 Engineering\n• 👥 HR\n• 📣 Marketing\n• 👔 Executive",
          },
        ],
      },
    ],
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && status === 'ready') {
      sendMessage({ text: input })
      setInput('')
    }
  }

  const handleQuickSelect = (option: string) => {
    if (status === 'ready') {
      sendMessage({ text: option })
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">AI Advisor</h1>
        <p className="text-sm text-zinc-400 mt-1">Tell me about your workflow and I'll match you to the right agent template.</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((message) => {
          const textContent = message.parts
            ?.filter((p) => p.type === 'text')
            .map((p) => ('text' in p ? p.text : ''))
            .join('') || ''

          return (
            <ChatMessage
              key={message.id}
              role={message.role as 'user' | 'assistant'}
              content={textContent}
            />
          )
        })}
        {status === 'streaming' && messages[messages.length - 1]?.role !== 'assistant' && (
          <ChatMessage role="assistant" content="Thinking..." />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t border-zinc-800">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer..."
          disabled={status !== 'ready'}
          className="bg-zinc-900 border-zinc-800 text-zinc-50 placeholder:text-zinc-500"
        />
        <Button type="submit" disabled={status !== 'ready' || !input.trim()} className="bg-indigo-600 hover:bg-indigo-500">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
```

**Step 3: Wire up route**

```tsx
import { Advisor } from '@/pages/Advisor'
// ...
<Route path="/advisor" element={<Advisor />} />
```

**Step 4: Verify locally**

Run: `npm run dev`
Expected: Advisor page loads with welcome message and input. (API calls won't work locally without the Vercel dev server — that's fine, we'll test end-to-end after deployment.)

To test locally with the API, run: `npx vercel dev` (requires Vercel CLI login and `ANTHROPIC_API_KEY` in `.env.local`).

**Step 5: Commit**

```bash
git add src/pages/Advisor.tsx src/components/ChatMessage.tsx src/App.tsx
git commit -m "feat: add AI advisor chat UI with streaming"
```

---

## Task 8: Polish & Meta Tags

**Files:**
- Modify: `index.html` (OG tags, title, favicon)
- Modify: `src/components/Layout.tsx` (mobile responsive nav)
- Modify: `src/index.css` (global styles, scrollbar, animations)

**Step 1: Update index.html with meta tags**

```html
<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dataleap Quickstart Hub — Find Your First Agent in 60 Seconds</title>
    <meta name="description" content="Browse 25 proven agent templates or let AI match you to the perfect Dataleap automation. Built by Niran." />
    <meta property="og:title" content="Dataleap Quickstart Hub" />
    <meta property="og:description" content="Find your first Dataleap agent in 60 seconds. Browse templates or get AI-matched." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Dataleap Quickstart Hub" />
    <meta name="twitter:description" content="Find your first Dataleap agent in 60 seconds." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 2: Add mobile hamburger menu to Layout**

Update `src/components/Layout.tsx` to add a mobile menu toggle (hamburger icon with slide-out nav). Use a simple `useState` toggle — no additional library needed.

**Step 3: Add global CSS polish**

Update `src/index.css`:
```css
@import "tailwindcss";

html {
  scroll-behavior: smooth;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom scrollbar for dark theme */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #3f3f46;
  border-radius: 3px;
}
```

**Step 4: Verify responsive**

Run: `npm run dev`, test at 375px, 768px, 1024px widths.

**Step 5: Commit**

```bash
git add index.html src/index.css src/components/Layout.tsx
git commit -m "feat: add meta tags, mobile nav, and CSS polish"
```

---

## Task 9: Deploy to Vercel

**Step 1: Ensure .gitignore is clean**

Verify `.gitignore` includes `node_modules`, `dist`, `.env`, `.env.local`.

**Step 2: Push to GitHub**

```bash
git remote add origin https://github.com/<your-username>/Showcase-DataLeap.git
git push -u origin main
```

**Step 3: Deploy via Vercel CLI or dashboard**

Option A (CLI):
```bash
npx vercel --prod
```

Option B (Dashboard): Connect GitHub repo in Vercel dashboard.

**Step 4: Set environment variable**

In Vercel dashboard → Settings → Environment Variables:
- `ANTHROPIC_API_KEY` = your key

**Step 5: Test the deployment**

- Visit the deployed URL
- Check: landing page renders, templates page loads with filters, template detail shows instructions + copy button, AI advisor streams responses
- Test on mobile
- Test OG tags by pasting URL in Slack/Twitter

**Step 6: Fix any deployment issues**

Common issues:
- If `api/advisor.ts` can't import from `../src/data/templates`, move a simplified template list inline into the API file
- If shadcn components don't render, check that Tailwind is processing the right content paths
- If streaming doesn't work, verify the edge function is deployed (check Vercel Functions tab)

**Step 7: Commit any deployment fixes**

```bash
git add -A
git commit -m "fix: deployment adjustments"
git push
```

---

## Summary

| Task | Description | Est. Time |
|------|-------------|-----------|
| 1 | Project scaffold | 30 min |
| 2 | Template data (25 templates) | 2-3 hrs |
| 3 | Landing page | 30 min |
| 4 | Template gallery (list + filter) | 1 hr |
| 5 | Template detail page | 45 min |
| 6 | AI Advisor API route | 30 min |
| 7 | AI Advisor chat UI | 1 hr |
| 8 | Polish & meta tags | 45 min |
| 9 | Deploy to Vercel | 30 min |
| **Total** | | **~8-10 hrs** |

After deployment, move to Artifact 1 (Dataleap platform agents) and Artifact 3 (strategy memo + Loom).
