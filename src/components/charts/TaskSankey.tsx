import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey'
import {
  useMemo,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  type CSSProperties,
} from 'react'
import { personas } from '@/data/personas'
import { buildSankeyD3Input } from '@/lib/personaSankey'
import {
  WORKFLOW_SANKEY_LINK_OPACITY,
  WORKFLOW_SANKEY_NEUTRAL_FILL,
  workflowSankeyPersonaFill,
} from '@/lib/workflowSankeyPalette'
import type { PersonaWorkflow } from '@/types/persona'

type SNode = {
  name: string
}

type SLink = {
  source: number
  target: number
  value: number
}

const PERSONA_ROSTER_IDS = personas.map((p) => p.id)

/** Root reads to the right of the bar; buckets/tasks anchor left of thin nodes so text stays in-frame. */
function formatNodeLabel(name: string, depth: number) {
  const max = depth === 0 ? 36 : depth === 1 ? 26 : 32
  const n = name ?? ''
  return n.length > max ? `${n.slice(0, max - 1)}…` : n
}

function linkTouchesNode(link: { source: unknown; target: unknown }, nodeIndex: number): boolean {
  const s = link.source as { index?: number }
  const t = link.target as { index?: number }
  return s.index === nodeIndex || t.index === nodeIndex
}

export function TaskSankey({
  rootLabel,
  workflow,
  height = 320,
}: {
  rootLabel: string
  workflow: PersonaWorkflow
  height?: number
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(560)
  const [hoveredLinkIndex, setHoveredLinkIndex] = useState<number | null>(null)
  const [hoveredNodeIndex, setHoveredNodeIndex] = useState<number | null>(null)

  const personaFill = useMemo(
    () => workflowSankeyPersonaFill(workflow.id, PERSONA_ROSTER_IDS),
    [workflow.id],
  )

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

  const graph = useMemo(() => {
    const { nodes, links } = buildSankeyD3Input(workflow, rootLabel)

    /** Pull the layout left so the task column and its labels sit inside the viewport. */
    const rightReserve = Math.min(100, Math.max(28, Math.round(width * 0.12)))

    const layout = d3Sankey<SNode, SLink>()
      .nodeWidth(10)
      .nodePadding(8)
      .extent([
        [8, 4],
        [width - rightReserve, height - 4],
      ])

    return layout({ nodes, links })
  }, [workflow, rootLabel, width, height])

  useEffect(() => {
    setHoveredLinkIndex(null)
    setHoveredNodeIndex(null)
  }, [workflow.id, rootLabel, width, height])

  const linkPath = sankeyLinkHorizontal()

  const transitionStyle = {
    transition: 'stroke-width 0.14s ease, stroke-opacity 0.14s ease',
  } as CSSProperties

  const textTransitionStyle = {
    transition: 'font-size 0.14s ease, font-weight 0.14s ease',
  } as CSSProperties

  return (
    <div ref={wrapRef} className="w-full">
      <svg
        width={width}
        height={height}
        className="overflow-visible text-ink-muted"
        role="img"
        aria-label="Sankey diagram of daily work streams"
      >
        {graph.links.map((link, i) => {
          const d = linkPath(link) ?? ''
          const baseW = Math.max(1, link.width ?? 1)
          const emphasized =
            hoveredLinkIndex === i ||
            (hoveredNodeIndex !== null && linkTouchesNode(link, hoveredNodeIndex))
          const visW = emphasized ? Math.min(20, Math.max(baseW * 1.65, baseW + 3)) : baseW
          const opacity = emphasized
            ? Math.min(0.85, WORKFLOW_SANKEY_LINK_OPACITY + 0.35)
            : WORKFLOW_SANKEY_LINK_OPACITY
          const hitW = Math.max(22, visW * 3.5, baseW * 5)

          return (
            <g key={i}>
              <path
                d={d}
                fill="none"
                stroke="transparent"
                strokeWidth={hitW}
                pointerEvents="stroke"
                className="cursor-pointer"
                onMouseEnter={() => {
                  setHoveredLinkIndex(i)
                  setHoveredNodeIndex(null)
                }}
                onMouseLeave={() => setHoveredLinkIndex(null)}
              />
              <path
                d={d}
                fill="none"
                stroke={personaFill}
                strokeOpacity={opacity}
                strokeWidth={visW}
                pointerEvents="none"
                style={transitionStyle}
              />
            </g>
          )
        })}
        {graph.nodes.map((node, i) => {
          const w = (node.x1 ?? 0) - (node.x0 ?? 0)
          const h = (node.y1 ?? 0) - (node.y0 ?? 0)
          const depth = node.depth ?? 0
          const isRoot = depth === 0
          const rawName = node.name ?? ''
          const label = formatNodeLabel(rawName, depth)
          const nodeHot = hoveredNodeIndex === i
          const setNodeHover = () => {
            setHoveredNodeIndex(i)
            setHoveredLinkIndex(null)
          }
          const clearNodeHover = () => setHoveredNodeIndex(null)

          return (
            <g key={i} transform={`translate(${node.x0 ?? 0},${node.y0 ?? 0})`}>
              <rect
                width={w}
                height={h}
                rx={3}
                fill={isRoot ? personaFill : WORKFLOW_SANKEY_NEUTRAL_FILL}
                stroke="currentColor"
                strokeOpacity={nodeHot ? 0.35 : 0.12}
                className="cursor-pointer"
                style={{
                  transition: 'stroke-opacity 0.14s ease',
                }}
                onMouseEnter={setNodeHover}
                onMouseLeave={clearNodeHover}
              />
              <text
                x={isRoot ? w + 8 : -8}
                y={h / 2}
                dominantBaseline="middle"
                textAnchor={isRoot ? 'start' : 'end'}
                style={{
                  ...textTransitionStyle,
                  fontSize: nodeHot ? 12.5 : 10,
                  fontWeight: nodeHot ? 700 : 600,
                }}
                className="fill-white"
                onMouseEnter={setNodeHover}
                onMouseLeave={clearNodeHover}
              >
                <title>{rawName}</title>
                {label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
