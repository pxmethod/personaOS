import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Link2, X, ChevronDown } from 'lucide-react'
import { PersonaAvatar } from '@/components/PersonaAvatar'
import { PersonaQuoteBlock } from '@/components/PersonaQuoteBlock'
import { WorkflowDayOverview } from '@/components/WorkflowDayOverview'
import { ToolLogo } from '@/components/ToolLogo'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { DepartmentPill } from '@/components/ui/DepartmentPill'
import { UsageIntensityBar } from '@/components/ui/UsageIntensityBar'
import { personaById } from '@/data/personas'
import { useExplorer } from '@/hooks/useExplorer'
import { MAX_COMPARE_SELECTIONS } from '@/lib/compareLimits'
import { MAIN_CONTENT_OUTER } from '@/lib/mainContentLayout'
import { personaCardPillBase } from '@/lib/personaCardPills'
import { copyTextToClipboard } from '@/lib/copyToClipboard'
import { COMPARISON_DIMENSION_LABELS, COMPARISON_DIMENSION_ORDER } from '@/lib/comparisonDimensions'
import { compareShareAbsoluteUrl } from '@/lib/urls'
import { cn } from '@/lib/utils'
import type { Persona } from '@/types/persona'

function parseCompareIdsParam(idsKey: string): string[] {
  return idsKey
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX_COMPARE_SELECTIONS)
}

function CompareSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="space-y-3">
      <h3 className="font-display text-xl font-semibold tracking-wide text-lime">{title}</h3>
      {children}
    </section>
  )
}

function ComparisonHighlightsTable({ left, right }: { left: Persona; right: Persona }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] table-fixed border-collapse text-left text-sm">
        <colgroup>
          <col style={{ width: '24%' }} />
          <col style={{ width: '38%' }} />
          <col style={{ width: '38%' }} />
        </colgroup>
        <thead>
          <tr className="border-b border-edge">
            <th
              scope="col"
              className="pb-3 pl-[10px] pr-4 align-bottom font-display text-xs font-semibold uppercase tracking-wider text-ink-muted"
            >
              Theme
            </th>
            <th scope="col" className="px-3 pb-3 align-bottom font-display text-base font-semibold tracking-tight text-ink">
              {left.name}
            </th>
            <th scope="col" className="px-3 pb-3 align-bottom font-display text-base font-semibold tracking-tight text-ink">
              {right.name}
            </th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON_DIMENSION_ORDER.map((dim) => {
            const va = left.comparisonProfile[dim]
            const vb = right.comparisonProfile[dim]
            const differs = va !== vb
            return (
              <tr
                key={dim}
                className={cn(
                  'border-b border-edge/70 last:border-b-0',
                  differs ? 'bg-lime/[0.045]' : undefined,
                )}
              >
                <th
                  scope="row"
                  className="py-3 pl-[10px] pr-4 align-middle font-medium leading-snug text-lime"
                >
                  {COMPARISON_DIMENSION_LABELS[dim]}
                </th>
                <td className="px-3 py-3 align-top leading-relaxed text-ink">{va}</td>
                <td className="px-3 py-3 align-top leading-relaxed text-ink">{vb}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function ComparisonHighlightsCard({ left, right }: { left: Persona; right: Persona }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <Card>
      <CardHeader className="border-b border-edge pb-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-md text-left outline-none ring-lime/40 focus-visible:ring-2"
          aria-expanded={expanded}
          aria-controls="comparison-highlights-panel"
          id="comparison-highlights-trigger"
          onClick={() => setExpanded((e) => !e)}
        >
          <ChevronDown
            className={cn(
              'size-5 shrink-0 text-lime transition-transform duration-200',
              expanded ? 'rotate-0' : '-rotate-90',
            )}
            aria-hidden
          />
          <h2 className="min-w-0 flex-1 font-display text-xl font-semibold tracking-tight text-lime">
            Highlights
          </h2>
        </button>
      </CardHeader>
      <CardContent
        id="comparison-highlights-panel"
        hidden={!expanded}
        className="pt-5"
        role="region"
        aria-labelledby="comparison-highlights-trigger"
      >
        <ComparisonHighlightsTable left={left} right={right} />
      </CardContent>
    </Card>
  )
}

function ComparePersonaColumn({ persona: p }: { persona: Persona }) {
  const headerRef = useRef<HTMLDivElement>(null)
  const [pinnedHeaderVisible, setPinnedHeaderVisible] = useState(false)

  useEffect(() => {
    const target = headerRef.current
    if (!target) return

    const io = new IntersectionObserver(
      ([entry]) => {
        setPinnedHeaderVisible(!entry.isIntersecting)
      },
      { threshold: 0 },
    )

    io.observe(target)
    return () => io.disconnect()
  }, [p.id])

  return (
    <Card className="overflow-visible">
      <div ref={headerRef}>
        <CardHeader className="gap-3 border-b border-edge bg-surface-1 pb-4 pt-6">
          <PersonaAvatar personaId={p.id} name={p.name} />
          <CardTitle className="text-2xl">{p.name}</CardTitle>
          <p className="text-sm text-ink-muted">{p.role}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <DepartmentPill department={p.department} />
            <span className={cn(personaCardPillBase, 'border-lime text-lime capitalize')}>
              {p.workflowType}
            </span>
          </div>
          <PersonaQuoteBlock quote={p.quote} className="-mx-5 w-auto min-w-0 self-stretch px-5 pt-1" />
          <UsageIntensityBar weight={p.usageWeight} className="max-w-none" />
        </CardHeader>
      </div>

      {pinnedHeaderVisible ? (
        <div
          className={cn(
            'sticky top-2 z-30 mx-[10px] flex h-16 min-h-16 shrink-0 items-center gap-2.5 rounded-[var(--radius-card)]',
            'border border-edge/70 bg-surface-1/70 px-3 backdrop-blur-xl',
            'shadow-[0_10px_40px_rgba(0,0,0,0.45)]',
          )}
          aria-label={p.name}
        >
          <PersonaAvatar personaId={p.id} name={p.name} size="sm" />
          <p className="min-w-0 flex-1 font-display text-sm font-semibold leading-tight tracking-tight text-ink line-clamp-1">
            {p.name}
          </p>
        </div>
      ) : null}

      <CardContent className="space-y-6 pt-5">
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
          <CompareSection title="Workflows">
            <div className="space-y-4">
              <p className="text-md leading-relaxed text-white">{p.workflow.summary}</p>
              <WorkflowDayOverview workflow={p.workflow} variant="compact" />
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
          <CompareSection title="Features">
            <ul className="space-y-2 text-md text-white">
              {[...p.commonlyUsedFeatures]
                .sort((a, b) => b.importanceScore - a.importanceScore)
                .slice(0, 6)
                .map((f) => (
                  <li key={f.id} className="flex gap-2">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-lime/70" aria-hidden />
                    <span>
                      <span className="font-medium">{f.label}</span>
                      <span className="text-ink-muted"> — {f.category}</span>
                    </span>
                  </li>
                ))}
            </ul>
          </CompareSection>
          <CompareSection title="KPIs">
            <ul className="space-y-2 text-md text-white">
              {p.topJobs.map((j) => (
                <li key={j.label} className="flex gap-2">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-lime" aria-hidden />
                  <span>
                    {j.label}
                    <span className="text-ink-muted"> ({j.weight}% emphasis)</span>
                  </span>
                </li>
              ))}
            </ul>
          </CompareSection>
        </CardContent>
    </Card>
  )
}

export function ComparePage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { setCompareIds, clearCompare, setCompareMode, compareIds } = useExplorer()
  const [copied, setCopied] = useState(false)
  const copiedResetRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const idsKey = params.get('ids') ?? ''
  const idsFromUrl = useMemo(() => parseCompareIdsParam(idsKey), [idsKey])

  const comparisonIds = useMemo(() => {
    if (idsFromUrl.length >= 2) return idsFromUrl
    if (compareIds.length >= 2) return compareIds.slice(0, MAX_COMPARE_SELECTIONS)
    return idsFromUrl
  }, [idsFromUrl, compareIds])

  useEffect(() => {
    if (idsFromUrl.length >= 2) {
      setCompareIds(idsFromUrl)
    }
  }, [idsFromUrl, setCompareIds])

  useEffect(() => {
    if (idsFromUrl.length >= 2) return
    if (compareIds.length >= 2) {
      const qs = compareIds
        .slice(0, MAX_COMPARE_SELECTIONS)
        .map((id) => encodeURIComponent(id))
        .join(',')
      navigate(`/compare?ids=${qs}`, { replace: true })
    }
  }, [idsKey, compareIds, navigate])

  useEffect(
    () => () => {
      if (copiedResetRef.current) clearTimeout(copiedResetRef.current)
    },
    [],
  )

  const selected = useMemo(
    () => comparisonIds.map((id) => personaById[id]).filter(Boolean) as Persona[],
    [comparisonIds],
  )

  function handleClear() {
    clearCompare()
    setCompareMode(false)
    navigate('/compare', { replace: true })
  }

  async function copyShare() {
    const url = compareShareAbsoluteUrl(comparisonIds)
    const ok = await copyTextToClipboard(url)
    if (!ok) return
    setCopied(true)
    if (copiedResetRef.current) clearTimeout(copiedResetRef.current)
    copiedResetRef.current = setTimeout(() => setCopied(false), 2000)
  }

  if (selected.length < 2) {
    return (
      <div className={cn(MAIN_CONTENT_OUTER, 'flex flex-col items-center space-y-4 py-48 text-center')}>
        <div className="mx-auto max-w-lg space-y-4 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">Compare personas to understand tradeoffs before you design and build.</h1>
          <p className="text-sm text-ink-muted">
            See how goals, workflows, and pressures differ across roles to design decisions that work for the whole
            team.
          </p>
          <p className="text-sm text-ink-muted">
            Go to the directory to select two personas and open a comparison.
          </p>
          <Button className="mt-4" onClick={() => navigate('/directory')}>
            Go to directory
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

      {selected[0] && selected[1] ? (
        <ComparisonHighlightsCard left={selected[0]} right={selected[1]} />
      ) : null}

      <div className="space-y-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">Detailed Comparison</h2>
        <p className="max-w-3xl text-sm text-ink-muted">
          Goals, workflows, tools, pain points, product features, and KPI-style job emphasis side by side.
        </p>
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${selected.length}, minmax(0, 1fr))` }}
        >
          {selected.map((p) => (
            <ComparePersonaColumn key={p.id} persona={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
