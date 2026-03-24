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
