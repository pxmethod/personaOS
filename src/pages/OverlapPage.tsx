import { Link2 } from 'lucide-react'
import { useState } from 'react'
import { OverlapChordDiagram } from '@/components/charts/OverlapChordDiagram'
import { OverlapNetworkGraph } from '@/components/charts/OverlapNetworkGraph'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { personas } from '@/data/personas'
import { computeThemeOverlaps } from '@/lib/overlap'
import { MAIN_CONTENT_OUTER } from '@/lib/mainContentLayout'
import { absoluteAppPath } from '@/lib/urls'
import { cn } from '@/lib/utils'

type SharedPainView = 'network' | 'chord'

export function OverlapPage() {
  const overlaps = computeThemeOverlaps(personas)
  const [sharedPainView, setSharedPainView] = useState<SharedPainView>('network')

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
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 pb-0">
          <div className="min-w-0 flex-1 space-y-1">
            <CardTitle>Shared pain themes</CardTitle>
            <p className="text-sm text-ink-muted">
              Sorted by how many distinct personas mention the same theme.
            </p>
          </div>
          <div
            className="flex shrink-0 rounded-xl border border-edge bg-surface-1 p-0.5"
            role="group"
            aria-label="Visualization type"
          >
            <button
              type="button"
              onClick={() => setSharedPainView('network')}
              className={cn(
                'rounded-[10px] px-3 py-1.5 text-xs font-medium transition-colors',
                sharedPainView === 'network'
                  ? 'bg-surface-2 text-ink shadow-sm'
                  : 'text-ink-muted hover:text-ink',
              )}
              aria-pressed={sharedPainView === 'network'}
            >
              Network
            </button>
            <button
              type="button"
              onClick={() => setSharedPainView('chord')}
              className={cn(
                'rounded-[10px] px-3 py-1.5 text-xs font-medium transition-colors',
                sharedPainView === 'chord'
                  ? 'bg-surface-2 text-ink shadow-sm'
                  : 'text-ink-muted hover:text-ink',
              )}
              aria-pressed={sharedPainView === 'chord'}
            >
              Chord
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {overlaps.length === 0 ? (
            <p className="text-sm text-ink-muted">No overlapping themes in the current dataset.</p>
          ) : (
            <>
              {sharedPainView === 'network' ? (
                <OverlapNetworkGraph personas={personas} />
              ) : (
                <OverlapChordDiagram personas={personas} />
              )}
              <div className="space-y-4">
                {overlaps.map((o) => (
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
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
