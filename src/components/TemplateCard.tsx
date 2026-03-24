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
