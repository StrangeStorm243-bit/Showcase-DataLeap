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
