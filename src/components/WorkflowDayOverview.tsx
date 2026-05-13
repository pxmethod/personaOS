import { useMemo } from 'react'
import { orderedWorkflowBuckets } from '@/lib/orderedWorkflowBuckets'
import { cn } from '@/lib/utils'
import type { PersonaWorkflow, TimeBucket } from '@/types/persona'

const segmentClass: Record<TimeBucket['id'], string> = {
  morning: 'bg-lime',
  throughoutDay: 'bg-lime/55',
  endOfDay: 'bg-lime/30',
}

function taskShareWithinBucket(bucket: TimeBucket, taskWeight: number) {
  const sum = bucket.tasks.reduce((a, t) => a + t.weight, 0)
  if (sum <= 0) return 0
  return Math.round((taskWeight / sum) * 100)
}

export function WorkflowDayOverview({
  workflow,
  variant = 'default',
  className,
}: {
  workflow: PersonaWorkflow
  variant?: 'default' | 'compact'
  className?: string
}) {
  const buckets = useMemo(() => orderedWorkflowBuckets(workflow), [workflow])
  const compact = variant === 'compact'

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className={cn(
          'flex h-2.5 w-full overflow-hidden rounded-full ring-1 ring-edge',
          compact && 'h-2',
        )}
        role="img"
        aria-label="Day split across morning, throughout the day, and end of day"
      >
        {buckets.map((b) => (
          <div
            key={b.id}
            style={{ width: `${b.weight}%` }}
            className={cn('min-w-0 shrink-0', segmentClass[b.id])}
            title={`${b.label}: ${b.weight}% of day`}
          />
        ))}
      </div>
      <div
        className={cn(
          'grid gap-3',
          compact ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {buckets.map((bucket) => (
          <div
            key={bucket.id}
            className={cn(
              'rounded-[var(--radius-card)] border border-edge bg-surface-1',
              compact ? 'p-3' : 'p-4',
            )}
          >
            <div className="flex items-start justify-between gap-2 border-b border-edge pb-2 pt-3">
              <h3 className={cn('font-semibold text-white', compact ? 'text-sm' : 'text-md')}>
                {bucket.label}
              </h3>
              <span
                className={cn(
                  'shrink-0 tabular-nums font-semibold text-lime',
                  compact ? 'text-sm' : 'text-md',
                )}
              >
                {bucket.weight}%
              </span>
            </div>
            <p className={cn('text-ink-muted', compact ? 'mt-1 text-sm' : 'mt-1.5 text-md')}>
              {compact ? (
                <>Tasks sum to {bucket.weight} in this bucket.</>
              ) : (
                <>of day · task weights sum to {bucket.weight} within this bucket.</>
              )}
            </p>
            <ul className={cn('mt-3 space-y-2', compact && 'mt-2 space-y-1.5')}>
              {bucket.tasks.map((t) => {
                const share = taskShareWithinBucket(bucket, t.weight)
                return (
                  <li key={t.id} className="min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className={cn(
                          'min-w-0 leading-snug text-white',
                          compact ? 'text-[12px]' : 'text-sm',
                        )}
                      >
                        {t.label}
                      </span>
                      <span
                        className={cn(
                          'shrink-0 tabular-nums text-white',
                          compact ? 'text-[14px]' : 'text-sm',
                        )}
                      >
                        {t.weight}
                        <span className="text-ink-muted/70"> ({share}%)</span>
                      </span>
                    </div>
                    {!compact && (
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface-2">
                        <div
                          className="h-full rounded-full bg-lime/80"
                          style={{ width: `${share}%` }}
                          aria-hidden
                        />
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
