import { cn } from '@/lib/utils'
import { PRODUCT_USAGE_LABELS, type UsageWeight } from '@/types/persona'

/** Fill width as % of track — heavy / moderate / light */
const fillPct: Record<UsageWeight, number> = {
  heavy: 100,
  moderate: 62,
  light: 34,
}

const palette: Record<
  UsageWeight,
  { label: string; track: string; fill: string }
> = {
  heavy: {
    label: 'text-lime',
    track: 'bg-lime/15',
    fill: 'bg-lime',
  },
  moderate: {
    label: 'text-warning-fg',
    track: 'bg-warning-fg/15',
    fill: 'bg-warning-fg',
  },
  light: {
    label: 'text-ink-muted',
    track: 'bg-ink-muted/20',
    fill: 'bg-ink-muted',
  },
}

const sizeConfig = {
  sm: {
    wrap: 'max-w-[11rem]',
    label: 'text-[11px] leading-tight',
    barWrap: 'mt-1.5 h-2',
  },
  lg: {
    wrap: 'max-w-2xl',
    label: 'text-sm leading-snug',
    barWrap: 'mt-2 h-3.5',
  },
} as const

export function UsageIntensityBar({
  weight,
  className,
  size = 'sm',
}: {
  weight: UsageWeight
  className?: string
  /** `lg` for persona detail; cards use default `sm`. */
  size?: keyof typeof sizeConfig
}) {
  const { label, track, fill } = palette[weight]
  const pct = fillPct[weight]
  const s = sizeConfig[size]

  const usageType = PRODUCT_USAGE_LABELS[weight]
  const usageLabel = `Product usage: ${usageType}`

  return (
    <div
      className={cn('w-full', s.wrap, className)}
      role="img"
      aria-label={usageLabel}
    >
      <p className={cn('text-left font-medium', s.label, label)}>
        {usageLabel}
      </p>
      <div className={cn('w-full overflow-hidden rounded-full', s.barWrap, track)}>
        <div
          className={cn('h-full rounded-full transition-[width] duration-300 ease-out', fill)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
