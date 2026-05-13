import { cn } from '@/lib/utils'
import { personaCardPillBase } from '@/lib/personaCardPills'
import type { Department } from '@/types/persona'

const palette: Record<Department, string> = {
  Support: 'border-sky-400/90 text-sky-400',
  'Customer Success': 'border-emerald-400/90 text-emerald-400',
  Operations: 'border-amber-400/90 text-amber-400',
  Sales: 'border-rose-400/90 text-rose-400',
  Product: 'border-violet-400/90 text-violet-400',
  Design: 'border-fuchsia-400/90 text-fuchsia-400',
  Leadership: 'border-neutral-500/90 text-neutral-300',
}

export function DepartmentPill({
  department,
  className,
}: {
  department: Department
  className?: string
}) {
  return (
    <span className={cn(personaCardPillBase, palette[department], className)}>{department}</span>
  )
}
