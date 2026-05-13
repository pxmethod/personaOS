import type { RoadmapBlock, RoadmapPhase, RoadmapStatusKind, RoadmapWorkItem } from '@/data/roadmap'
import { roadmapHasContent, roadmapPhases } from '@/data/roadmap'
import { cn } from '@/lib/utils'

type RoadmapListProps = {
  density?: 'compact' | 'comfortable'
}

const statusConfig: Record<
  RoadmapStatusKind,
  { label: string; dotClass: string }
> = {
  completed: { label: 'Completed', dotClass: 'bg-lime shadow-[0_0_0_1px_rgba(204,255,0,0.35)]' },
  in_progress: { label: 'In progress', dotClass: 'bg-warning-fg' },
  planned: { label: 'Planned', dotClass: 'bg-primary' },
}

function StatusLine({ status, compact }: { status: RoadmapStatusKind; compact?: boolean }) {
  const cfg = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-ink-muted',
        compact ? 'text-[11px]' : 'text-xs',
      )}
    >
      <span
        className={cn('size-2 shrink-0 rounded-full', cfg.dotClass)}
        aria-hidden
      />
      <span>{cfg.label}</span>
    </span>
  )
}

function BlockContent({ block, compact }: { block: RoadmapBlock; compact: boolean }) {
  if (block.kind === 'paragraph') {
    if (!block.text.trim()) return null
    return (
      <div className={cn(compact ? 'mt-1.5' : 'mt-2')}>
        {block.heading ? (
          <p
            className={cn(
              'font-medium text-ink-muted',
              compact ? 'text-[10px] tracking-wide text-ink-muted' : 'text-xs font-semibold text-ink',
            )}
          >
            {block.heading}
          </p>
        ) : null}
        <p
          className={cn(
            'leading-relaxed text-ink-muted',
            block.heading ? (compact ? 'mt-0.5 text-[11px]' : 'mt-1 text-xs sm:text-sm') : compact
              ? 'text-[11px]'
              : 'text-xs sm:text-sm',
            !block.heading && !compact && 'text-sm text-ink/90',
          )}
        >
          {block.text}
        </p>
      </div>
    )
  }

  return (
    <div className={cn(compact ? 'mt-1.5' : 'mt-2')}>
      {block.heading ? (
        <p
          className={cn(
            'font-medium text-ink-muted',
            compact ? 'text-[10px] tracking-wide text-ink-muted' : 'text-xs font-semibold text-ink',
          )}
        >
          {block.heading}
        </p>
      ) : null}
      <ul
        className={cn(
          'list-disc space-y-0.5 pl-4 text-ink-muted',
          block.heading ? (compact ? 'mt-0.5 text-[11px]' : 'mt-1 text-xs sm:text-sm') : compact
            ? 'mt-0.5 text-[11px]'
            : 'mt-1 text-xs sm:text-sm',
        )}
      >
        {block.items.map((line) => (
          <li key={line} className="leading-relaxed">
            {line}
          </li>
        ))}
      </ul>
    </div>
  )
}

function WorkItemCard({
  item,
  compact,
}: {
  item: RoadmapWorkItem
  compact: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-edge bg-surface-1/80',
        compact ? 'px-3 py-2' : 'px-4 py-3 sm:px-5 sm:py-4',
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p
          className={cn(
            'min-w-0 font-medium text-ink',
            compact ? 'text-xs leading-snug' : 'text-sm sm:text-base',
          )}
        >
          {item.title}
        </p>
        <StatusLine status={item.status} compact={compact} />
      </div>
      {!compact &&
        item.blocks.map((block, i) => (
          <BlockContent key={i} block={block} compact={false} />
        ))}
    </div>
  )
}

function PhaseSection({
  phase,
  compact,
  isFirst,
}: {
  phase: RoadmapPhase
  compact: boolean
  isFirst: boolean
}) {
  return (
    <section className={cn(!isFirst && (compact ? 'mt-4 border-t border-edge pt-4' : 'mt-8 border-t border-edge pt-8'))}>
      <h2
        className={cn(
          'font-display font-semibold tracking-tight text-lime',
          compact ? 'text-[11px] leading-snug' : 'text-sm sm:text-base',
        )}
      >
        {phase.title}
      </h2>
      <ul className={cn('mt-2 space-y-2', !compact && 'sm:mt-3 sm:space-y-3')}>
        {phase.items.map((item) => (
          <li key={item.id}>
            <WorkItemCard item={item} compact={compact} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export function RoadmapList({ density = 'comfortable' }: RoadmapListProps) {
  if (!roadmapHasContent()) {
    return null
  }

  const compact = density === 'compact'

  return (
    <div className={cn(!compact && 'space-y-0')}>
      {roadmapPhases.map((phase, idx) => (
        <PhaseSection key={phase.id} phase={phase} compact={compact} isFirst={idx === 0} />
      ))}
    </div>
  )
}
