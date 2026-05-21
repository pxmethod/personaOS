import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, type Location } from 'react-router-dom'
import { ArrowLeft, Link2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { PersonaAvatar } from '@/components/PersonaAvatar'
import { PersonaQuoteBlock } from '@/components/PersonaQuoteBlock'
import { PersonaConfidenceCard } from '@/components/PersonaConfidenceCard'
import { TaskSankey } from '@/components/charts/TaskSankey'
import { WorkflowDayOverview } from '@/components/WorkflowDayOverview'
import { ToolLogo } from '@/components/ToolLogo'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { DepartmentPill } from '@/components/ui/DepartmentPill'
import { UsageIntensityBar } from '@/components/ui/UsageIntensityBar'
import { personaById } from '@/data/personas'
import { copyTextToClipboard } from '@/lib/copyToClipboard'
import { personaCardPillBase } from '@/lib/personaCardPills'
import { taskLabelFromWorkflow } from '@/lib/workflowTaskLabels'
import { cn } from '@/lib/utils'
import type { Persona } from '@/types/persona'

function Section({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('space-y-3', className)}>
      <h2 className="font-display text-sm font-semibold tracking-wide text-ink-muted">
        {title}
      </h2>
      {children}
    </section>
  )
}

function BulletList({ items, columns = 1 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <ul
      className={cn(
        'text-base leading-relaxed text-ink',
        columns === 2 ? 'grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2' : 'space-y-2',
      )}
    >
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-lime" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function PersonaDetail({
  persona,
  onClose,
}: {
  persona: Persona
  /** When set, “Back to directory” closes the sheet instead of navigating in place. */
  onClose?: () => void
}) {
  const location = useLocation()
  const modalBackground = (location.state as { background?: Location } | null)?.background
  const relatedState = modalBackground
    ? { background: modalBackground }
    : { background: { pathname: '/directory', search: '', hash: '', key: 'persona-related', state: null } as Location }

  const related = persona.relatedPersonas
    .map((id) => personaById[id])
    .filter(Boolean) as Persona[]

  const [copied, setCopied] = useState(false)
  const copiedResetRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (copiedResetRef.current) clearTimeout(copiedResetRef.current)
    },
    [],
  )

  async function copyLink() {
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}`
    const ok = await copyTextToClipboard(url)
    if (!ok) return
    setCopied(true)
    if (copiedResetRef.current) clearTimeout(copiedResetRef.current)
    copiedResetRef.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-w-0 w-full space-y-8">
      <div className="space-y-6">
        <div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 text-md font-medium text-lime hover:text-lime-hover"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Back to directory
            </button>
          ) : (
            <Link
              to="/directory"
              className="inline-flex items-center gap-2 text-sm font-medium text-lime hover:text-lime-hover"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Back to directory
            </Link>
          )}
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <PersonaAvatar personaId={persona.id} name={persona.name} size="xl" className="shrink-0" />
            <div className="min-w-0 flex-1 space-y-2">
              <h1
                id="persona-detail-title"
                className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
              >
                {persona.name}
              </h1>
              <p className="max-w-2xl text-lg leading-snug text-ink-muted">{persona.role}</p>
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <DepartmentPill department={persona.department} className="shrink-0" />
                <span className={cn(personaCardPillBase, 'border-lime text-lime')}>{persona.workflowType}</span>
                {persona.tags.map((t) => (
                  <span key={t} className={cn(personaCardPillBase, 'border-lime text-lime')}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <Button variant="outline" className="gap-2" onClick={() => void copyLink()}>
              <Link2 className="size-4" aria-hidden />
              {copied ? 'Copied link' : 'Copy link'}
            </Button>
          </div>
        </div>
      </div>

      <p className="max-w-auto text-lg leading-relaxed text-white">{persona.description}</p>

      <PersonaQuoteBlock quote={persona.quote} />

      <UsageIntensityBar weight={persona.usageWeight} size="lg" className="max-w-full sm:max-w-2xl" />

      <PersonaConfidenceCard persona={persona} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold tracking-tight text-lime">Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <BulletList items={persona.goals} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold tracking-tight text-lime">Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <BulletList items={persona.challenges} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight text-lime">Pain points</CardTitle>
        </CardHeader>
        <CardContent>
          <BulletList items={persona.painPoints} columns={2} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight text-lime">Commonly used features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {persona.commonlyUsedFeatures.map((feature) => (
              <div
                key={feature.id}
                className="flex h-full min-h-0 flex-col gap-2 rounded-[var(--radius-card)] border border-edge bg-surface-1 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-md font-semibold leading-snug text-ink">{feature.label}</p>
                  <span
                    className="shrink-0 rounded-lg border border-lime/40 bg-lime/10 px-2 py-0.5 text-xs font-medium tabular-nums text-lime"
                    title="Importance score (0–100)"
                  >
                    {feature.importanceScore}
                  </span>
                </div>
                <p className="text-sm text-ink-muted">{feature.category}</p>
                <div className="mt-auto border-t border-edge/60 pt-2">
                  <p className="text-sm font-medium text-white">Related tasks</p>
                  <ul className="mt-1.5 flex flex-col gap-1">
                    {feature.relatedTasks.map((taskId) => (
                      <li key={taskId} className="text-sm leading-snug text-ink-muted">
                        {taskLabelFromWorkflow(persona.workflow, taskId)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight text-lime">Daily tasks</CardTitle>
          <p className="text-sm leading-relaxed text-ink-muted">{persona.workflow.summary}</p>
        </CardHeader>
        <CardContent className="space-y-8">
          <WorkflowDayOverview workflow={persona.workflow} />
          <div className="space-y-2">
            <p className="font-display text-xs font-semibold tracking-wide text-ink-muted">
              Flow view
            </p>
            <TaskSankey rootLabel={`${persona.name} — day`} workflow={persona.workflow} />
          </div>
        </CardContent>
      </Card>

      <Section title="Tools">
        <div className="grid gap-3 sm:grid-cols-2">
          {persona.tools.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-[var(--radius-card)] border border-edge bg-surface-1 p-3"
            >
              <ToolLogo name={t.name} iconSlug={t.iconSlug} />
              <div>
                <p className="text-sm font-semibold text-ink">{t.name}</p>
                {t.category && (
                  <p className="text-xs text-ink-muted">{t.category}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {related.length > 0 && (
        <Section title="Related personas">
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <Link
                key={r.id}
                to={`/persona/${r.id}`}
                state={relatedState}
                className="rounded-xl border border-lime/40 bg-surface-1 px-3 py-2 text-sm font-medium text-ink hover:border-lime hover:bg-lime-muted"
              >
                {r.name} · {r.role}
              </Link>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}
