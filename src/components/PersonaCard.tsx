import { Link, useLocation } from 'react-router-dom'
import { GitCompareArrows, LayoutGrid } from 'lucide-react'
import { PersonaAvatar } from '@/components/PersonaAvatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { DepartmentPill } from '@/components/ui/DepartmentPill'
import { UsageIntensityBar } from '@/components/ui/UsageIntensityBar'
import { cn } from '@/lib/utils'
import type { Persona } from '@/types/persona'

export function PersonaCard({
  persona,
  compareMode,
  selected,
  onToggleCompare,
}: {
  persona: Persona
  compareMode: boolean
  selected: boolean
  onToggleCompare: (id: string) => void
}) {
  const location = useLocation()

  return (
    <Card
      className={cn(
        'group flex h-full flex-col transition hover:-translate-y-0.5',
        selected && 'ring-2 ring-lime/70',
      )}
    >
      <DepartmentPill
        department={persona.department}
        className="absolute right-3 top-3 z-20 min-w-0 max-w-[min(11rem,calc(100%-4.5rem))] truncate"
      />
      {compareMode && (
        <label className="absolute left-3 top-3 z-20 flex cursor-pointer items-center gap-2 rounded-xl border border-lime bg-surface-1/95 px-2 py-1 text-xs font-medium text-ink shadow-sm">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleCompare(persona.id)}
            className="accent-[#ccff00]"
          />
          Select
        </label>
      )}
      {compareMode ? (
        <div className="flex min-h-0 flex-1 flex-col cursor-default text-left">
          <CardHeader>
            <PersonaAvatar personaId={persona.id} name={persona.name} className="mb-4" />
            <UsageIntensityBar weight={persona.usageWeight} />
            <CardTitle className="mt-2">{persona.name}</CardTitle>
            <CardDescription>{persona.role}</CardDescription>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
            <p className="line-clamp-3 min-h-0 flex-1 text-base text-ink-muted">{persona.description}</p>
          </CardContent>
        </div>
      ) : (
        <Link
          to={`/persona/${persona.id}`}
          state={{ background: location }}
          className="flex min-h-0 flex-1 flex-col text-left"
        >
          <CardHeader>
            <PersonaAvatar personaId={persona.id} name={persona.name} className="mb-4" />
            <UsageIntensityBar weight={persona.usageWeight} />
            <CardTitle className="mt-2 text-2xl">{persona.name}</CardTitle>
            <CardDescription>{persona.role}</CardDescription>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
            <p className="line-clamp-3 min-h-0 flex-1 text-sm text-ink-muted">{persona.description}</p>
            <div className="mt-auto flex items-center justify-between pt-1 text-xs font-semibold text-lime opacity-0 transition group-hover:opacity-100">
              <span className="inline-flex items-center gap-1">
                <LayoutGrid className="size-3.5" aria-hidden />
                Open detail
              </span>
              <GitCompareArrows className="size-3.5 opacity-60" aria-hidden />
            </div>
          </CardContent>
        </Link>
      )}
    </Card>
  )
}
