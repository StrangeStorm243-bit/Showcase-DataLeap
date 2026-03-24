import { anthropic } from '@ai-sdk/anthropic'
import { streamText, convertToModelMessages, type UIMessage } from 'ai'

// Simplified template data inlined for the edge function
// (Can't import from src/ since this runs in Vercel's serverless runtime, not Vite)
const templateSummaries = [
  { id: 'daily-briefing-email', name: 'Daily Briefing Email', description: 'Compiles your calendar, unread emails, and Slack highlights into a single morning briefing delivered to your inbox at 7am.', role: 'Executive', tools: ['Gmail', 'Google Calendar', 'Slack'], estimatedTimeSaved: '5 hrs/week', setupTime: '3 min', complexity: 'Beginner' },
  { id: 'pre-call-brief-generator', name: 'Pre-Call Brief Generator', description: 'Automatically researches prospects and generates a one-page brief before every sales call.', role: 'Sales', tools: ['HubSpot', 'Gmail', 'LinkedIn', 'Web Search'], estimatedTimeSaved: '3 hrs/week', setupTime: '5 min', complexity: 'Intermediate' },
  { id: 'inbound-lead-enricher', name: 'Inbound Lead Enricher', description: 'Auto-enriches new CRM contacts with company data, tech stack, and social profiles.', role: 'Sales', tools: ['HubSpot', 'Web Search', 'LinkedIn'], estimatedTimeSaved: '5 hrs/week', setupTime: '5 min', complexity: 'Intermediate' },
  { id: 'post-demo-follow-up-drafter', name: 'Post-Demo Follow-Up Drafter', description: 'Drafts personalized follow-up emails after sales demos using CRM notes.', role: 'Sales', tools: ['HubSpot', 'Gmail'], estimatedTimeSaved: '4 hrs/week', setupTime: '3 min', complexity: 'Beginner' },
  { id: 'deal-stall-detector', name: 'Deal Stall Detector', description: 'Monitors pipeline for stalled deals and alerts reps with re-engagement suggestions.', role: 'Sales', tools: ['HubSpot', 'Slack'], estimatedTimeSaved: '2 hrs/week', setupTime: '3 min', complexity: 'Beginner' },
  { id: 'linkedin-outreach-personalizer', name: 'LinkedIn Outreach Personalizer', description: 'Generates personalized LinkedIn connection requests and messages based on prospect research.', role: 'Sales', tools: ['LinkedIn', 'Gmail', 'Web Search'], estimatedTimeSaved: '6 hrs/week', setupTime: '5 min', complexity: 'Intermediate' },
  { id: 'weekly-ops-standup-digest', name: 'Weekly Ops Standup Digest', description: 'Aggregates updates from project tools into a weekly ops summary.', role: 'Operations', tools: ['Notion', 'Slack', 'Linear'], estimatedTimeSaved: '3 hrs/week', setupTime: '3 min', complexity: 'Beginner' },
  { id: 'expense-auto-reviewer', name: 'Expense Auto-Reviewer', description: 'Reviews new expenses for policy compliance and flags anomalies.', role: 'Operations', tools: ['Slack', 'Google Sheets'], estimatedTimeSaved: '2 hrs/week', setupTime: '5 min', complexity: 'Intermediate' },
  { id: 'vendor-invoice-processor', name: 'Vendor Invoice Processor', description: 'Extracts data from vendor invoices in email and logs to spreadsheet.', role: 'Operations', tools: ['Gmail', 'Google Sheets', 'Slack'], estimatedTimeSaved: '4 hrs/week', setupTime: '5 min', complexity: 'Intermediate' },
  { id: 'sla-breach-alerter', name: 'SLA Breach Alerter', description: 'Monitors support tickets approaching SLA deadlines and escalates.', role: 'Operations', tools: ['Slack', 'Linear'], estimatedTimeSaved: '3 hrs/week', setupTime: '5 min', complexity: 'Intermediate' },
  { id: 'pr-review-digest', name: 'PR Review Digest', description: 'Daily Slack summary of open PRs needing review.', role: 'Engineering', tools: ['GitHub', 'Slack'], estimatedTimeSaved: '3 hrs/week', setupTime: '2 min', complexity: 'Beginner' },
  { id: 'bug-report-aggregator', name: 'Bug Report Aggregator', description: 'Collects bug reports from Slack and creates organized tickets.', role: 'Engineering', tools: ['Slack', 'Linear'], estimatedTimeSaved: '4 hrs/week', setupTime: '3 min', complexity: 'Beginner' },
  { id: 'oncall-incident-summarizer', name: 'On-Call Incident Summarizer', description: 'Summarizes production incidents with timeline, impact, and action items.', role: 'Engineering', tools: ['Slack', 'Linear', 'Web Search'], estimatedTimeSaved: '5 hrs/week', setupTime: '5 min', complexity: 'Advanced' },
  { id: 'deployment-changelog-writer', name: 'Deployment Changelog Writer', description: 'Generates user-facing changelogs from merged PRs.', role: 'Engineering', tools: ['GitHub', 'Notion', 'Slack'], estimatedTimeSaved: '2 hrs/week', setupTime: '3 min', complexity: 'Intermediate' },
  { id: 'new-hire-onboarding-orchestrator', name: 'New Hire Onboarding Orchestrator', description: 'Coordinates onboarding tasks across tools when new employee starts.', role: 'HR', tools: ['Google Calendar', 'Notion', 'Slack'], estimatedTimeSaved: '6 hrs/week', setupTime: '10 min', complexity: 'Advanced' },
  { id: 'one-on-one-prep-brief', name: '1:1 Prep Brief Generator', description: 'Generates prep briefs before manager 1:1s with recent work and notes.', role: 'HR', tools: ['Google Calendar', 'Notion'], estimatedTimeSaved: '2 hrs/week', setupTime: '3 min', complexity: 'Beginner' },
  { id: 'job-description-writer', name: 'Job Description Writer', description: 'Drafts job descriptions based on role requirements and company voice.', role: 'HR', tools: ['Notion', 'Slack'], estimatedTimeSaved: '3 hrs/week', setupTime: '3 min', complexity: 'Beginner' },
  { id: 'weekly-pulse-survey', name: 'Weekly Pulse Survey Sender', description: 'Sends brief employee satisfaction surveys and aggregates results.', role: 'HR', tools: ['Gmail', 'Google Sheets'], estimatedTimeSaved: '1 hr/week', setupTime: '5 min', complexity: 'Beginner' },
  { id: 'blog-social-repurposer', name: 'Blog to Social Repurposer', description: 'Converts blog posts into LinkedIn, Twitter, and email content.', role: 'Marketing', tools: ['Web Search', 'LinkedIn', 'Gmail'], estimatedTimeSaved: '5 hrs/week', setupTime: '3 min', complexity: 'Intermediate' },
  { id: 'competitor-mention-monitor', name: 'Competitor Mention Monitor', description: 'Tracks competitor activity and summarizes key developments.', role: 'Marketing', tools: ['Web Search', 'Slack'], estimatedTimeSaved: '3 hrs/week', setupTime: '3 min', complexity: 'Beginner' },
  { id: 'newsletter-draft-generator', name: 'Newsletter Draft Generator', description: 'Compiles weekly highlights into a newsletter draft.', role: 'Marketing', tools: ['Notion', 'Gmail'], estimatedTimeSaved: '4 hrs/week', setupTime: '5 min', complexity: 'Intermediate' },
  { id: 'campaign-performance-digest', name: 'Campaign Performance Digest', description: 'Summarizes marketing campaign metrics with trends and recommendations.', role: 'Marketing', tools: ['Google Sheets', 'Slack'], estimatedTimeSaved: '2 hrs/week', setupTime: '5 min', complexity: 'Intermediate' },
  { id: 'meeting-prep-assistant', name: 'Meeting Prep Assistant', description: 'Prepares meeting briefs with attendee context and agenda.', role: 'Executive', tools: ['Gmail', 'Slack', 'HubSpot', 'Google Calendar'], estimatedTimeSaved: '3 hrs/week', setupTime: '5 min', complexity: 'Intermediate' },
  { id: 'weekly-board-update-drafter', name: 'Weekly Board Update Drafter', description: 'Drafts weekly investor/board updates from project and metrics tools.', role: 'Executive', tools: ['Linear', 'Notion', 'Gmail'], estimatedTimeSaved: '4 hrs/week', setupTime: '5 min', complexity: 'Intermediate' },
  { id: 'nda-docusign-sender', name: 'NDA DocuSign Sender', description: 'Detects NDA requests in email and initiates signing workflow.', role: 'Executive', tools: ['Gmail', 'Google Docs'], estimatedTimeSaved: '2 hrs/week', setupTime: '5 min', complexity: 'Intermediate' },
]

const systemPrompt = `You are the Dataleap Quickstart Advisor — a friendly, concise AI that helps people find the right automation agent for their workflow.

You have access to a library of ${templateSummaries.length} proven agent templates. Your job is to understand the user's role, tools, and pain points, then recommend the best templates.

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
${JSON.stringify(templateSummaries, null, 2)}
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
