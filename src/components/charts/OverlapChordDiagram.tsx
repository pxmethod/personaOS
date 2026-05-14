import { chord, ribbon } from 'd3-chord'
import type { Chord, ChordGroup } from 'd3-chord'
import { arc } from 'd3-shape'
import { useId, useLayoutEffect, useMemo, useRef, useState } from 'react'

import type { Persona } from '@/types/persona'
import { buildPersonaPainChordMatrix, totalUndirectedChordWeight } from '@/lib/overlapChord'

const DEFAULT_SIZE = 420

function mixPersonaLime(personaSlug: string): string {
  let hash = 0
  for (let i = 0; i < personaSlug.length; i++) {
    hash = (hash * 31 + personaSlug.charCodeAt(i)) >>> 0
  }
  const t = (hash % 17) / 16
  const a = [156, 232, 18]
  const b = [228, 255, 118]
  const r = Math.round(a[0] + (b[0] - a[0]) * t)
  const g = Math.round(a[1] + (b[1] - a[1]) * t)
  const bl = Math.round(a[2] + (b[2] - a[2]) * t)
  return `rgb(${r},${g},${bl})`
}

function shortLabel(s: string, max: number): string {
  const t = s.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}

export function OverlapChordDiagram({ personas }: { personas: Persona[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(DEFAULT_SIZE)
  const ribbonGradientId = `chord-ribbon-${useId().replace(/:/g, '')}`

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const w = Math.max(280, Math.floor(el.getBoundingClientRect().width))
      setSize(Math.min(w, 520))
    })
    ro.observe(el)
    setSize(Math.min(Math.max(280, Math.floor(el.getBoundingClientRect().width)), 520))
    return () => ro.disconnect()
  }, [])

  const { matrix, chords, outerRadius, cx, ribbonGen, arcGen, maxRibbon } = useMemo(() => {
    const matrix = buildPersonaPainChordMatrix(personas)
    if (personas.length === 0 || totalUndirectedChordWeight(matrix) === 0) {
      return {
        matrix,
        chords: null as ReturnType<ReturnType<typeof chord>> | null,
        outerRadius: 0,
        cx: 0,
        ribbonGen: null as ReturnType<typeof ribbon> | null,
        arcGen: null as ReturnType<typeof arc<ChordGroup>> | null,
        maxRibbon: 0,
      }
    }

    const chordLayout = chord().padAngle(0.04).sortSubgroups((a, b) => b - a)
    const chords = chordLayout(matrix)

    const cx = size / 2
    const outerRadius = size / 2 - 36
    const innerRadius = outerRadius - 22

    const ribbonGen = ribbon().radius(innerRadius - 2)

    const arcGen = arc<ChordGroup>().innerRadius(innerRadius).outerRadius(outerRadius)

    let maxRibbon = 0
    for (const c of chords as Chord[]) {
      const v = Math.max(c.source.value, c.target.value)
      if (v > maxRibbon) maxRibbon = v
    }

    return { matrix, chords, innerRadius, outerRadius, cx, ribbonGen, arcGen, maxRibbon: maxRibbon || 1 }
  }, [personas, size])

  if (personas.length === 0) {
    return (
      <div ref={wrapRef} className="rounded-xl border border-edge bg-surface-0 p-4">
        <p className="text-sm text-ink-muted">No personas to chart.</p>
      </div>
    )
  }

  if (!chords || !ribbonGen || !arcGen || totalUndirectedChordWeight(matrix) === 0) {
    return (
      <div ref={wrapRef} className="rounded-xl border border-edge bg-surface-0 p-4">
        <p className="text-sm text-ink-muted">No shared pain themes between personas for a chord view.</p>
      </div>
    )
  }

  const groups = chords.groups
  const labelR = outerRadius + 14

  return (
    <div ref={wrapRef} className="rounded-xl border border-edge bg-surface-0 p-3 sm:p-4">
      <div className="mb-2">
        <p className="text-sm font-medium text-ink">Persona chord</p>
        <p className="mt-0.5 max-w-2xl text-xs leading-relaxed text-ink-muted">
          Arcs are personas; ribbons connect pairs with thickness from how many pain themes they share.
        </p>
      </div>

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="mx-auto block max-w-full"
        role="img"
        aria-label="Chord diagram of personas linked by shared pain themes."
      >
        <defs>
          <linearGradient id={ribbonGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(124, 156, 255)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <g transform={`translate(${cx},${cx})`}>
          {[...chords]
            .sort(
              (a, b) =>
                a.source.value + a.target.value - (b.source.value + b.target.value),
            )
            .map((d, i) => {
            const v = Math.max(d.source.value, d.target.value)
            const t = maxRibbon > 0 ? v / maxRibbon : 0
            const fillOpacity = 0.18 + t * 0.55
            const path = (ribbonGen as (datum: Chord) => string | null)(d)
            if (path == null || path === '') return null
            return (
              <path
                key={`r-${d.source.index}-${d.target.index}-${i}`}
                d={path}
                fill={`url(#${ribbonGradientId})`}
                fillOpacity={fillOpacity}
                stroke="var(--color-primary)"
                strokeOpacity={0.12 + t * 0.35}
                strokeWidth={0.35 + t * 1.1}
              />
            )
          })}

          {groups.map((g) => {
            const d = arcGen(g)
            if (!d) return null
            const slug = personas[g.index]?.id ?? ''
            const fill = mixPersonaLime(slug)
            return <path key={`a-${g.index}`} d={d} fill={fill} stroke="none" />
          })}

          {groups.map((g) => {
            const a = (g.startAngle + g.endAngle) / 2 - Math.PI / 2
            const x = Math.cos(a) * labelR
            const y = Math.sin(a) * labelR
            const rot = (a * 180) / Math.PI
            const name = personas[g.index]?.name ?? ''
            const flip = rot > 90 && rot < 270
            const textRot = flip ? rot + 180 : rot
            return (
              <text
                key={`t-${g.index}`}
                x={x}
                y={y}
                dy="0.35em"
                textAnchor="middle"
                transform={`rotate(${textRot},${x},${y})`}
                fill="var(--color-ink-muted)"
                style={{
                  fontFamily: 'var(--font-sans, ui-sans-serif, system-ui)',
                  fontSize: 9.5,
                }}
              >
                {shortLabel(name, 20)}
              </text>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
