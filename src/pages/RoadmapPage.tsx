import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { RoadmapList } from '@/components/roadmap/RoadmapList'
import { Button } from '@/components/ui/Button'
import { MAIN_CONTENT_OUTER } from '@/lib/mainContentLayout'
import { cn } from '@/lib/utils'

const SHARE_IDEA_MAILTO = 'mailto:john.menard@kustomer.com'

export function RoadmapPage() {
  return (
    <div className={cn(MAIN_CONTENT_OUTER, 'space-y-6 pt-6 pb-8 sm:pb-12')}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-3xl space-y-2">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Roadmap</h1>
          <p className="text-sm leading-relaxed text-white sm:text-base">
            What's coming next.
          </p>
        </div>
        <Button href={SHARE_IDEA_MAILTO} className="shrink-0">
          Share an idea
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lime">Phases</CardTitle>
        </CardHeader>
        <CardContent>
          <RoadmapList density="comfortable" />
        </CardContent>
      </Card>
    </div>
  )
}
