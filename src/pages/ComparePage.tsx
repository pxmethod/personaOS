import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Link2, X } from 'lucide-react'
import { TaskSankey } from '@/components/charts/TaskSankey'
import { WorkflowDayOverview } from '@/components/WorkflowDayOverview'
import { ToolLogo } from '@/components/ToolLogo'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { DepartmentPill } from '@/components/ui/DepartmentPill'
import { UsageBadge } from '@/components/ui/UsageBadge'
import { personaById } from '@/data/personas'
import { useExplorer } from '@/hooks/useExplorer'
import { MAX_COMPARE_SELECTIONS } from '@/lib/compareLimits'
import { MAIN_CONTENT_OUTER } from '@/lib/mainContentLayout'
import { personaCardPillBase } from '@/lib/personaCardPills'
import { compareShareAbsoluteUrl } from '@/lib/urls'
import { cn } from '@/lib/utils'
import type { Persona } from '@/types/persona'

function CompareSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-sm font-semibold tracking-wide text-ink-muted">
        {title}
      </h2>
      {children}
    </section>
  )
}

export function ComparePage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { setCompareIds, clearCompare, setCompareMode } = useExplorer()
  const [copied, setCopied] = useState(false)
  const copiedResetRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const idsKey = params.get('ids') ?? ''
  const ids = useMemo(() => {
    return idsKey
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, MAX_COMPARE_SELECTIONS)
  }, [idsKey])

  useEffect(() => {
    const parsed = idsKey
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, MAX_COMPARE_SELECTIONS)
    if (parsed.length >= 2) {
      setCompareIds(parsed)
    }
  }, [idsKey, setCompareIds])

  useEffect(
    () => () => {
      if (copiedResetRef.current) clearTimeout(copiedResetRef.current)
    },
    [],
  )

  const selected = useMemo(
    () => ids.map((id) => personaById[id]).filter(Boolean) as Persona[],
    [ids],
  )

  function handleClear() {
    clearCompare()
    setCompareMode(false)
    navigate('/compare', { replace: true })
  }

  async function copyShare() {
    const url = compareShareAbsoluteUrl(ids)
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      if (copiedResetRef.current) clearTimeout(copiedResetRef.current)
      copiedResetRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this link:', url)
    }
  }

  if (selected.length < 2) {
    return (
      <div className={cn(MAIN_CONTENT_OUTER, 'flex flex-col items-center space-y-4 py-48 text-center')}>
        <div className="mx-auto max-w-lg space-y-4 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">Compare personas to understand tradeoffs before you build</h1>
          <p className="text-sm text-ink-muted">
            See how goals, workflows, and pressures differ across roles to design decisions that work for the whole
            team.
          </p>
          <p className="text-sm text-ink-muted">
            Go to the directory to select two personas and open a comparison.
          </p>
          <Button className="mt-4" onClick={() => navigate('/directory')}>
            Back to directory
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(MAIN_CONTENT_OUTER, 'space-y-8')}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Persona comparison</h1>
          <p className="mt-2 max-w-3xl text-sm text-ink-muted">
            Columns stay aligned by section so you can scan goals, workflows, and tools side by side.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" className="gap-2 text-ink-muted hover:text-ink" onClick={handleClear}>
            <X className="size-4" aria-hidden />
            Clear comparison
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => void copyShare()}>
            <Link2 className="size-4" aria-hidden />
            {copied ? 'Copied link' : 'Copy share link'}
          </Button>
        </div>
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${selected.length}, minmax(0, 1fr))` }}
      >
        {selected.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            <CardHeader className="pb-4 pt-6 border-b border-edge bg-surface-1">
              <div className="flex flex-wrap gap-2">
                <DepartmentPill department={p.department} />
                <UsageBadge weight={p.usageWeight} />
                <span className={cn(personaCardPillBase, 'border-lime text-lime capitalize')}>
                  {p.workflowType}
                </span>
              </div>
              <CardTitle className="mt-3 text-xl">{p.name}</CardTitle>
              <p className="text-sm text-ink-muted">{p.role}</p>
            </CardHeader>
            <CardContent className="space-y-6 pt-5">
              <CompareSection title="Snapshot">
                <p className="text-md leading-relaxed text-ink">{p.description}</p>
              </CompareSection>
              <CompareSection title="Goals">
                <ul className="space-y-2 text-md text-white">
                  {p.goals.map((g) => (
                    <li key={g} className="flex gap-2">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-lime" />
                      {g}
                    </li>
                  ))}
                </ul>
              </CompareSection>
              <CompareSection title="Challenges">
                <ul className="space-y-2 text-md text-white">
                  {p.challenges.map((c) => (
                    <li key={c} className="flex gap-2">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-lime/50" />
                      {c}
                    </li>
                  ))}
                </ul>
              </CompareSection>
              <CompareSection title="Daily tasks">
                <div className="space-y-4">
                  <p className="text-md leading-relaxed text-white">{p.workflow.summary}</p>
                  <WorkflowDayOverview workflow={p.workflow} variant="compact" />
                  <TaskSankey rootLabel={`${p.name}`} workflow={p.workflow} height={260} />
                </div>
              </CompareSection>
              <CompareSection title="Tools">
                <div className="space-y-2">
                  {p.tools.map((t) => (
                    <div key={t.id} className="flex items-center gap-2">
                      <ToolLogo name={t.name} iconSlug={t.iconSlug} className="size-8" />
                      <span className="text-md font-medium">{t.name}</span>
                    </div>
                  ))}
                </div>
              </CompareSection>
              <CompareSection title="Pain points">
                <ul className="space-y-2 text-md text-white">
                  {p.painPoints.map((x) => (
                    <li key={x} className="flex gap-2">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-danger" />
                      {x}
                    </li>
                  ))}
                </ul>
              </CompareSection>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
