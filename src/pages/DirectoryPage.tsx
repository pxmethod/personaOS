import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PersonaCard } from '@/components/PersonaCard'
import { Button } from '@/components/ui/Button'
import { ListboxSelect, type ListboxOption } from '@/components/ui/ListboxSelect'
import { useExplorer } from '@/hooks/useExplorer'
import { personas } from '@/data/personas'
import { MAX_COMPARE_SELECTIONS } from '@/lib/compareLimits'
import { MAIN_CONTENT_OUTER } from '@/lib/mainContentLayout'
import { departments, sortPersonasByUsageDesc } from '@/lib/personaFilters'
import { cn } from '@/lib/utils'
import { PRODUCT_USAGE_LABELS, SUPPORT_MODEL_LABELS, type Department, type SupportModel, type UsageWeight, type WorkflowType } from '@/types/persona'

export function DirectoryPage() {
  const navigate = useNavigate()
  const {
    filteredPersonas,
    compareMode,
    setCompareMode,
    compareIds,
    toggleCompareId,
    clearCompare,
    query,
    department,
    setDepartment,
    supportModel,
    setSupportModel,
    usageWeight,
    setUsageWeight,
    workflowType,
    setWorkflowType,
  } = useExplorer()

  const deptOptions = useMemo(() => departments(personas), [])

  const departmentOptions = useMemo((): ListboxOption<Department | 'all'>[] => {
    return [{ value: 'all', label: 'All departments' }, ...deptOptions.map((d) => ({ value: d, label: d }))]
  }, [deptOptions])

  const supportModelOptions = useMemo((): ListboxOption<SupportModel | 'all'>[] => {
    return [
      { value: 'all', label: 'All' },
      { value: 'b2b', label: SUPPORT_MODEL_LABELS.b2b },
      { value: 'b2c', label: SUPPORT_MODEL_LABELS.b2c },
      { value: 'hybrid', label: SUPPORT_MODEL_LABELS.hybrid },
    ]
  }, [])

  const usageOptions = useMemo((): ListboxOption<UsageWeight | 'all'>[] => {
    return [
      { value: 'all', label: 'All' },
      { value: 'heavy', label: PRODUCT_USAGE_LABELS.heavy },
      { value: 'moderate', label: PRODUCT_USAGE_LABELS.moderate },
      { value: 'light', label: PRODUCT_USAGE_LABELS.light },
    ]
  }, [])

  const workflowOptions = useMemo((): ListboxOption<WorkflowType | 'all'>[] => {
    return [
      { value: 'all', label: 'All' },
      { value: 'reactive', label: 'Reactive' },
      { value: 'proactive', label: 'Proactive' },
      { value: 'hybrid', label: 'Hybrid' },
      { value: 'analytical', label: 'Analytical' },
      { value: 'commercial', label: 'Commercial' },
    ]
  }, [])

  const directoryPersonas = useMemo(
    () => sortPersonasByUsageDesc(filteredPersonas),
    [filteredPersonas],
  )

  const exitCompare = () => {
    if (compareMode) {
      clearCompare()
      setCompareMode(false)
    } else {
      setCompareMode(true)
    }
  }

  const openComparison = () => {
    if (compareIds.length < MAX_COMPARE_SELECTIONS) return
    navigate(`/compare?ids=${compareIds.join(',')}`)
  }

  return (
    <div className={cn(MAIN_CONTENT_OUTER, 'space-y-6')}>
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Personas directory
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-ink-muted sm:text-base">
          Browse personas specific to the selected organization, explore how different teams use the product, and
          open detailed views for their goals, workflows, tools, challenges, and pain points.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-edge bg-surface-0/60 p-4 sm:flex-row sm:items-start sm:gap-6">
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <label className="flex min-w-0 flex-col gap-1.5 text-[11px] font-medium text-ink-muted">
            <span>Function</span>
            <ListboxSelect
              className="w-full min-w-0"
              value={department}
              options={departmentOptions}
              onChange={setDepartment}
            />
          </label>
          <label className="flex min-w-0 flex-col gap-1.5 text-[11px] font-medium text-ink-muted">
            <span>Support model</span>
            <ListboxSelect
              className="w-full min-w-0"
              value={supportModel}
              options={supportModelOptions}
              onChange={setSupportModel}
            />
          </label>
          <label className="flex min-w-0 flex-col gap-1.5 text-[11px] font-medium text-ink-muted">
            <span>Product usage</span>
            <ListboxSelect
              className="w-full min-w-0"
              value={usageWeight}
              options={usageOptions}
              onChange={setUsageWeight}
            />
          </label>
          <label className="flex min-w-0 flex-col gap-1.5 text-[11px] font-medium text-ink-muted">
            <span>Workflow</span>
            <ListboxSelect
              className="w-full min-w-0"
              value={workflowType}
              options={workflowOptions}
              onChange={setWorkflowType}
            />
          </label>
        </div>
        <div className="flex w-full shrink-0 flex-col items-center justify-center gap-3 border-t border-edge pt-4 sm:w-56 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
          {compareMode && compareIds.length >= 2 && (
            <Button className="w-full max-w-[16rem] sm:w-full" onClick={openComparison}>
              Open comparison
            </Button>
          )}
          <Button
            variant={compareMode ? 'subtle' : 'outline'}
            onClick={exitCompare}
            className={cn('min-w-[9rem] px-8', compareMode && 'ring-1 ring-lime/40')}
          >
            {compareMode ? 'Cancel' : 'Compare'}
          </Button>
        </div>
      </div>

      {(query || department !== 'all' || supportModel !== 'all' || usageWeight !== 'all' || workflowType !== 'all') && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
          {query && <span className="tag-lime px-2 py-1 text-ink-muted">Search: “{query}”</span>}
          {department !== 'all' && (
            <span className="tag-lime px-2 py-1 text-ink-muted">{department}</span>
          )}
          {supportModel !== 'all' && (
            <span className="tag-lime px-2 py-1 text-ink-muted">{SUPPORT_MODEL_LABELS[supportModel]}</span>
          )}
          {usageWeight !== 'all' && (
            <span className="tag-lime px-2 py-1 text-ink-muted">
              {PRODUCT_USAGE_LABELS[usageWeight]}
            </span>
          )}
          {workflowType !== 'all' && (
            <span className="tag-lime px-2 py-1 text-ink-muted">{workflowType} workflow</span>
          )}
        </div>
      )}

      {directoryPersonas.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-lime/50 bg-surface-0/80 px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold text-ink">No personas match</p>
          <p className="mt-2 text-sm text-ink-muted">
            Loosen filters or clear search to see the full library again.
          </p>
        </div>
      ) : (
        <>
          {compareMode && (
            <div className="space-y-1 rounded-[var(--radius-card)] border border-edge bg-surface-0/50 px-4 py-3">
              <p className="text-sm leading-snug text-ink-muted">
                Select up to two personas—click anywhere on a card (or use its checkbox) to toggle selection.
              </p>
              <p className="text-sm font-semibold tabular-nums text-lime">
                {compareIds.length} of {MAX_COMPARE_SELECTIONS} selected
              </p>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {directoryPersonas.map((p, i) => (
              <div
                key={p.id}
                className="h-full animate-fade-up"
                style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
              >
                <PersonaCard
                  persona={p}
                  compareMode={compareMode}
                  selected={compareIds.includes(p.id)}
                  onToggleCompare={toggleCompareId}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
