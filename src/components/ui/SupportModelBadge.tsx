import { personaCardPillBase } from '@/lib/personaCardPills'
import { cn } from '@/lib/utils'
import { SUPPORT_MODEL_LABELS, type SupportModel } from '@/types/persona'

const palette: Record<SupportModel, string> = {
  b2b: 'border-sky-400/90 text-sky-300',
  b2c: 'border-amber-400/90 text-amber-400',
  hybrid: 'border-violet-400/90 text-violet-400',
}

export function SupportModelBadge({
  model,
  className,
}: {
  model: SupportModel
  className?: string
}) {
  return (
    <span
      className={cn(
        personaCardPillBase,
        palette[model],
        'shrink-0 whitespace-nowrap min-w-max',
        className,
      )}
    >
      {SUPPORT_MODEL_LABELS[model]}
    </span>
  )
}
