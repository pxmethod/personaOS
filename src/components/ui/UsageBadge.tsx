import { cn } from '@/lib/utils'
import { personaCardPillBase } from '@/lib/personaCardPills'
import { PRODUCT_USAGE_LABELS, type UsageWeight } from '@/types/persona'

const styles: Record<UsageWeight, string> = {
  heavy: 'border-lime text-lime',
  moderate: 'border-warning-fg text-warning-fg',
  light: 'border-ink-muted text-ink-muted',
}

export function UsageBadge({
  weight,
  className,
}: {
  weight: UsageWeight
  className?: string
}) {
  return (
    <span className={cn(personaCardPillBase, styles[weight], className)}>
      {PRODUCT_USAGE_LABELS[weight]}
    </span>
  )
}
