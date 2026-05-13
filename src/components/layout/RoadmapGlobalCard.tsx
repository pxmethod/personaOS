import { NavLink } from 'react-router-dom'
import { Map } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { RoadmapList } from '@/components/roadmap/RoadmapList'
import { roadmapHasContent } from '@/data/roadmap'
import { cn } from '@/lib/utils'

type RoadmapGlobalCardProps = {
  /** e.g. close mobile drawer after navigation */
  onNavigate?: () => void
}

export function RoadmapGlobalCard({ onNavigate }: RoadmapGlobalCardProps) {
  const listEmpty = !roadmapHasContent()

  return (
    <Card
      className={cn(
        'flex min-h-0 w-full shrink-0 flex-col shadow-sm',
        listEmpty && 'min-h-[min(80px,14vh)]',
      )}
    >
      <NavLink
        to="/roadmap"
        onClick={() => onNavigate?.()}
        className={({ isActive }) =>
          cn(
            'flex min-h-0 flex-1 flex-col text-left outline-none transition-colors',
            'gap-3 px-4 py-4',
            listEmpty && 'justify-center',
            'hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime',
            isActive && 'bg-lime/10',
          )
        }
      >
        <div className="flex shrink-0 items-center gap-2">
          <Map className="size-4 shrink-0 text-lime" aria-hidden />
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-xl font-semibold tracking-tight text-lime">Roadmap</h3>
            <p className="mt-0.5 text-sm leading-snug text-white">What&apos;s coming...</p>
          </div>
        </div>
        {!listEmpty && (
          <div className="min-h-0 w-full max-h-[min(240px,36vh)] flex-1 overflow-y-auto overscroll-contain">
            <RoadmapList density="compact" />
          </div>
        )}
      </NavLink>
    </Card>
  )
}
