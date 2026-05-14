import { useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { Persona } from '@/types/persona'
import { layoutPainThemeGraph, type PainThemeGraphNode } from '@/lib/overlap'
import { buildOverlapHoverCard } from '@/lib/overlapTooltipCopy'

const GRAPH_HEIGHT = 420
const HOVER_SCALE = 1.18

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

function nodeKey(n: PainThemeGraphNode): string {
  return n.id
}

/** Viewport clamp; pair with tooltip rendered under `document.body` so `fixed` matches `clientX`/`clientY`. */
function tooltipPosition(clientX: number, clientY: number) {
  const margin = 8
  const offset = 10
  const tw = 384
  const th = 300
  const w = window.innerWidth
  const h = window.innerHeight
  const left = Math.max(margin, Math.min(clientX + offset, w - tw - margin))
  const top = Math.max(margin, Math.min(clientY + offset, h - th - margin))
  return { left, top }
}

export function OverlapNetworkGraph({ personas }: { personas: Persona[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(560)
  const themeFillId = `overlap-theme-fill-${useId().replace(/:/g, '')}`
  const [hover, setHover] = useState<{
    node: PainThemeGraphNode
    clientX: number
    clientY: number
  } | null>(null)

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setWidth(Math.max(280, Math.floor(el.getBoundingClientRect().width)))
    })
    ro.observe(el)
    setWidth(Math.max(280, Math.floor(el.getBoundingClientRect().width)))
    return () => ro.disconnect()
  }, [])

  const layout = useMemo(
    () => layoutPainThemeGraph(personas, width, GRAPH_HEIGHT),
    [personas, width],
  )

  const paintOrder = useMemo(() => {
    if (!layout) return []
    const { nodes } = layout
    if (!hover) return nodes
    return [...nodes].sort((a, b) => {
      if (a.id === hover.node.id) return 1
      if (b.id === hover.node.id) return -1
      return 0
    })
  }, [layout, hover])

  const tipStyle = useMemo(() => {
    if (!hover) return null
    return tooltipPosition(hover.clientX, hover.clientY)
  }, [hover])

  if (!layout) return null

  const { links, nodes: layoutNodes } = layout

  const hoverCard =
    hover ? buildOverlapHoverCard(hover.node, layoutNodes) : null

  const tooltipEl =
    hover && tipStyle && hoverCard ? (
      <div
        className="pointer-events-none fixed z-[200] w-[min(24rem,calc(100vw-1rem))] rounded-xl border border-edge-strong bg-surface-2 p-4 text-xs leading-snug text-ink shadow-float"
        style={{ left: tipStyle.left, top: tipStyle.top }}
      >
        <p className="font-display text-sm font-semibold tracking-tight text-ink">{hoverCard.title}</p>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{hoverCard.lead}</p>
        <div className="mt-4 space-y-4 border-t border-edge pt-4">
          {hoverCard.blocks.map((b) => (
            <div key={b.heading}>
              <p className="text-[13px] leading-snug text-ink">
                <span className="font-semibold">{b.heading}: </span>
                <span className="font-semibold text-lime">{b.tier}</span>
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">{b.detail}</p>
            </div>
          ))}
        </div>
      </div>
    ) : null

  return (
    <div ref={wrapRef} className="relative space-y-3">
      {typeof document !== 'undefined' && tooltipEl ? createPortal(tooltipEl, document.body) : null}

      <div className="rounded-xl border border-edge bg-surface-0 p-3 sm:p-4">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-ink">Overlap network</p>
            <p className="mt-0.5 max-w-2xl text-xs leading-relaxed text-ink-muted">
              Personas (lime) and shared pain themes (red). Hover a node for overlap, coordination, and
              operational impact in plain language; thicker edges still reflect tie strength from usage and
              theme reach.
            </p>
          </div>
        </div>

        <svg
          width={width}
          height={GRAPH_HEIGHT}
          viewBox={`0 0 ${width} ${GRAPH_HEIGHT}`}
          className="mx-auto block max-w-full text-ink-muted"
          role="img"
          aria-label="Force-directed network of personas and shared pain themes. Hover nodes for overlap and operational impact."
        >
          <defs>
            <linearGradient id={themeFillId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fecaca" />
              <stop offset="45%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
          </defs>

          {links.map((l, i) => (
            <line
              key={`l-${i}`}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke="var(--color-primary)"
              strokeWidth={l.strokeWidth}
              strokeOpacity={l.opacity}
              strokeLinecap="round"
            />
          ))}

          {paintOrder.map((n) => {
            const isPersona = n.kind === 'persona'
            const isHover = hover?.node.id === n.id
            const slug = n.id.replace(/^persona:/, '')
            const fill = isPersona ? mixPersonaLime(slug) : `url(#${themeFillId})`
            const label = isPersona ? shortLabel(n.label, 22) : shortLabel(n.label, 24)
            const sub =
              isPersona && n.usageScore > 0
                ? n.usageScore >= 3
                  ? 'Heavy usage'
                  : n.usageScore >= 2
                    ? 'Moderate usage'
                    : 'Light usage'
                : !isPersona && n.personaCount > 0
                  ? `${n.personaCount} personas`
                  : ''

            const rVis = n.radius * (isHover ? HOVER_SCALE : 1)

            return (
              <g
                key={nodeKey(n)}
                className="cursor-pointer"
                onMouseEnter={(e) => {
                  setHover({ node: n, clientX: e.clientX, clientY: e.clientY })
                }}
                onMouseMove={(e) => {
                  setHover({ node: n, clientX: e.clientX, clientY: e.clientY })
                }}
                onMouseLeave={() => {
                  setHover((h) => (h?.node.id === n.id ? null : h))
                }}
              >
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.radius + 14}
                  fill="transparent"
                  pointerEvents="all"
                />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={rVis}
                  fill={fill}
                  stroke="none"
                  pointerEvents="none"
                  style={{ transition: 'r 0.16s ease-out' }}
                />
                <text
                  x={n.x}
                  y={n.y + rVis + 13}
                  textAnchor="middle"
                  fill="var(--color-ink-muted)"
                  pointerEvents="none"
                  style={{
                    fontFamily: 'var(--font-sans, ui-sans-serif, system-ui)',
                    fontSize: isPersona ? 10 : 9.5,
                  }}
                >
                  {label}
                </text>
                {sub ? (
                  <text
                    x={n.x}
                    y={n.y + rVis + 25}
                    textAnchor="middle"
                    fill="var(--color-ink-subtle)"
                    pointerEvents="none"
                    style={{
                      fontFamily: 'var(--font-sans, ui-sans-serif, system-ui)',
                      fontSize: 8.5,
                    }}
                  >
                    {sub}
                  </text>
                ) : null}
              </g>
            )
          })}
        </svg>

        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 pt-3 text-[11px] text-white">
          <div className="flex items-center gap-2">
            <span
              className="inline-block size-3 shrink-0 rounded-full"
              style={{ background: 'rgb(190, 244, 68)' }}
            />
            <span>Personas — lime by role; size scales with usage intensity</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block size-3 shrink-0 rounded-full"
              style={{ background: 'linear-gradient(135deg, #fecaca, #ef4444 50%, #991b1b)' }}
            />
            <span>Themes — red gradient; size scales with personas sharing the theme</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-px w-5 bg-primary opacity-40" />
              <span className="inline-block h-0.5 w-5 bg-primary opacity-70" />
              <span className="inline-block h-1 w-5 bg-primary opacity-90" />
            </span>
            <span>Edges — thickness from overlap strength (usage × theme reach)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
