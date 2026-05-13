import { Link2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { personas } from '@/data/personas'
import { computeThemeOverlaps } from '@/lib/overlap'
import { MAIN_CONTENT_OUTER } from '@/lib/mainContentLayout'
import { absoluteAppPath } from '@/lib/urls'
import { cn } from '@/lib/utils'

export function OverlapPage() {
  const overlaps = computeThemeOverlaps(personas)

  async function copyLink() {
    const url = absoluteAppPath('overlap')
    await navigator.clipboard.writeText(url)
  }

  return (
    <div className={cn(MAIN_CONTENT_OUTER, 'space-y-8')}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Persona overlap</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-ink-muted sm:text-base">
          Explore where personas share similar goals, workflows, tools, and pain points across the organization. Use overlap analysis to identify common operational patterns, cross-functional dependencies, and opportunities to build features that create impact across multiple teams.
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => void copyLink()}>
          <Link2 className="size-4" aria-hidden />
          Copy link
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shared pain themes</CardTitle>
          <p className="text-sm text-ink-muted">
            Sorted by how many distinct personas mention the same theme.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {overlaps.length === 0 ? (
            <p className="text-sm text-ink-muted">No overlapping themes in the current dataset.</p>
          ) : (
            overlaps.map((o) => (
              <div
                key={o.text}
                className="flex flex-col gap-2 rounded-xl border border-edge bg-surface-1 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-ink">{o.text}</p>
                  <p className="mt-1 text-xs text-ink-muted">{o.personaNames.join(' · ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-xl bg-lime px-3 py-1 text-xs font-bold text-canvas">
                    {o.count} personas
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
