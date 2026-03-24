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
