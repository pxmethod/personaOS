import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force'
import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3-force'

import type { Persona, UsageWeight } from '@/types/persona'

export type ThemeOverlap = {
  text: string
  count: number
  personaNames: string[]
}

const USAGE_SCORE: Record<UsageWeight, number> = {
  heavy: 3,
  moderate: 2,
  light: 1,
}

function personaGraphNodeId(personaId: string): string {
  return `persona:${personaId}`
}

function themeGraphNodeId(theme: string): string {
  return `theme:${theme.trim()}`
}

/** Deterministic PRNG for stable initial node positions (avoids Strict Mode layout flicker). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a += 0x6d2b79f5
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function layoutSeed(personas: Persona[]): number {
  let s = personas.length
  for (const p of personas) {
    for (let i = 0; i < p.id.length; i++) s = (s + p.id.charCodeAt(i) * (i + 3)) | 0
  }
  return s >>> 0
}

type OverlapSimNode = SimulationNodeDatum & {
  id: string
  kind: 'persona' | 'theme'
  label: string
  radius: number
  usageScore: number
  personaCount: number
}

type OverlapSimLink = SimulationLinkDatum<OverlapSimNode> & {
  weight: number
}

export type PainThemeGraphNode = {
  id: string
  kind: 'persona' | 'theme'
  label: string
  x: number
  y: number
  radius: number
  /** Persona: usage 1–3; theme: 0 */
  usageScore: number
  /** Theme: count of personas; persona: 0 */
  personaCount: number
  /** Normalized degree centrality in this graph (0–1), i.e. degree / (N − 1). */
  degreeCentrality: number
  /** Betweenness on this graph, normalized to the max node score here (0–1). */
  betweennessCentrality: number
  /** Incident edges in the overlap graph (persona → count of shared themes; theme → personas). */
  linkCount: number
}

export type PainThemeGraphLink = {
  x1: number
  y1: number
  x2: number
  y2: number
  weight: number
  strokeWidth: number
  opacity: number
}

/**
 * Undirected unweighted Brandes betweenness; halved for undirected convention.
 * Indices align with `nodes` order.
 */
function betweennessUndirected(n: number, adj: number[][]): Float64Array {
  const CB = new Float64Array(n)
  if (n < 2) return CB

  for (let s = 0; s < n; s++) {
    const stack: number[] = []
    const pred: number[][] = Array.from({ length: n }, () => [])
    const sigma = new Float64Array(n)
    sigma[s] = 1
    const dist = new Int32Array(n).fill(-1)
    dist[s] = 0
    const Q: number[] = [s]

    for (let qi = 0; qi < Q.length; qi++) {
      const v = Q[qi]!
      stack.push(v)
      for (const w of adj[v]!) {
        if (dist[w] < 0) {
          dist[w] = dist[v] + 1
          Q.push(w)
        }
        if (dist[w] === dist[v] + 1) {
          pred[w]!.push(v)
          sigma[w] += sigma[v]
        }
      }
    }

    const delta = new Float64Array(n)
    while (stack.length > 0) {
      const w = stack.pop()!
      for (const v of pred[w]!) {
        const sw = sigma[w]
        if (sw > 0) delta[v] += (sigma[v] / sw) * (1 + delta[w])
      }
      if (w !== s) CB[w] += delta[w]
    }
  }

  for (let i = 0; i < n; i++) CB[i] /= 2
  return CB
}

function incidentLinkCounts(nodes: OverlapSimNode[], links: OverlapSimLink[]): number[] {
  const counts = new Array<number>(nodes.length).fill(0)
  const idToIdx = new Map(nodes.map((node, i) => [node.id, i]))
  for (const l of links) {
    const a = l.source as OverlapSimNode
    const b = l.target as OverlapSimNode
    const u = idToIdx.get(a.id)
    const v = idToIdx.get(b.id)
    if (u !== undefined) counts[u]++
    if (v !== undefined) counts[v]++
  }
  return counts
}

function computeCentralities(
  nodes: OverlapSimNode[],
  links: OverlapSimLink[],
): { degreeCentrality: number[]; betweennessCentrality: number[] } {
  const n = nodes.length
  if (n === 0) return { degreeCentrality: [], betweennessCentrality: [] }

  const idToIdx = new Map(nodes.map((node, i) => [node.id, i]))
  const adj: number[][] = Array.from({ length: n }, () => [])
  for (const l of links) {
    const a = l.source as OverlapSimNode
    const b = l.target as OverlapSimNode
    const u = idToIdx.get(a.id)
    const v = idToIdx.get(b.id)
    if (u === undefined || v === undefined) continue
    adj[u]!.push(v)
    adj[v]!.push(u)
  }

  const deg = adj.map((neighbors) => neighbors.length)
  const denom = Math.max(1, n - 1)
  const degreeCentrality = deg.map((d) => d / denom)

  const rawB = betweennessUndirected(n, adj)
  let maxB = 0
  for (let i = 0; i < n; i++) {
    if (rawB[i]! > maxB) maxB = rawB[i]!
  }
  const scale = maxB > 1e-12 ? maxB : 1
  const betweennessCentrality = [...rawB].map((x) => x / scale)

  return { degreeCentrality, betweennessCentrality }
}

/** Overlap on curated short pain themes (intentionally shared across personas). */
export function computeThemeOverlaps(personas: Persona[]): ThemeOverlap[] {
  const map = new Map<string, Set<string>>()
  for (const p of personas) {
    for (const theme of p.painThemes) {
      const key = theme.trim()
      const s = map.get(key) ?? new Set<string>()
      s.add(p.name)
      map.set(key, s)
    }
  }
  return [...map.entries()]
    .map(([text, names]) => ({
      text,
      count: names.size,
      personaNames: [...names].sort(),
    }))
    .filter((x) => x.count >= 2)
    .sort((a, b) => b.count - a.count || b.personaNames.length - a.personaNames.length)
}

/**
 * Bipartite graph: personas and shared pain themes (count ≥ 2) with link weights from
 * usage intensity and theme breadth (proxy for overlap strength / systemic reach).
 */
export function layoutPainThemeGraph(
  personas: Persona[],
  width: number,
  height: number,
): { nodes: PainThemeGraphNode[]; links: PainThemeGraphLink[] } | null {
  const overlaps = computeThemeOverlaps(personas)
  if (overlaps.length === 0) return null

  const sharedThemeKeys = new Set(overlaps.map((o) => o.text))
  const themeCountByKey = new Map(overlaps.map((o) => [o.text, o.count]))

  const personaById = new Map(personas.map((p) => [p.id, p]))
  const personaIds = new Set<string>()
  for (const p of personas) {
    for (const t of p.painThemes) {
      const key = t.trim()
      if (sharedThemeKeys.has(key)) personaIds.add(p.id)
    }
  }

  const nodes: OverlapSimNode[] = []
  for (const id of personaIds) {
    const p = personaById.get(id)
    if (!p) continue
    const usageScore = USAGE_SCORE[p.usageWeight]
    const radius = 11 + usageScore * 3.5
    nodes.push({
      id: personaGraphNodeId(p.id),
      kind: 'persona',
      label: p.name,
      radius,
      usageScore,
      personaCount: 0,
    })
  }

  for (const o of overlaps) {
    const radius = 10 + o.count * 2.8
    nodes.push({
      id: themeGraphNodeId(o.text),
      kind: 'theme',
      label: o.text,
      radius,
      usageScore: 0,
      personaCount: o.count,
    })
  }

  const linksRaw: OverlapSimLink[] = []
  for (const p of personas) {
    if (!personaIds.has(p.id)) continue
    const usageScore = USAGE_SCORE[p.usageWeight]
    for (const theme of p.painThemes) {
      const key = theme.trim()
      if (!sharedThemeKeys.has(key)) continue
      const breadth = themeCountByKey.get(key) ?? 1
      const weight = usageScore * Math.sqrt(breadth)
      linksRaw.push({
        source: personaGraphNodeId(p.id),
        target: themeGraphNodeId(key),
        weight,
      })
    }
  }

  const cx = width / 2
  const cy = height / 2
  const padding = 24
  const rand = mulberry32(layoutSeed(personas) ^ (width * 73856093) ^ (height * 19349663))
  const jitterX = Math.min(width, 168)
  const jitterY = Math.min(height, 168)

  for (const n of nodes) {
    n.x = cx + (rand() - 0.5) * jitterX
    n.y = cy + (rand() - 0.5) * jitterY
  }

  const linkForce = forceLink<OverlapSimNode, OverlapSimLink>(linksRaw)
    .id((d: OverlapSimNode) => d.id)
    .distance((l) => {
      const s = l.source as OverlapSimNode
      const t = l.target as OverlapSimNode
      return 52 + (s.radius + t.radius) * 1.15
    })
    .strength((l) => Math.min(0.22, 0.06 + l.weight * 0.028))

  const sim = forceSimulation<OverlapSimNode>(nodes)
    .force('link', linkForce)
    .force('charge', forceManyBody<OverlapSimNode>().strength((d) => (d.kind === 'theme' ? -220 : -140)))
    .force('center', forceCenter(cx, cy))
    .force(
      'collide',
      forceCollide<OverlapSimNode>().radius((d) => d.radius + 6).iterations(2),
    )
    .force('x', forceX(cx).strength(0.055))
    .force('y', forceY(cy).strength(0.055))
    .alphaDecay(0.022)
    .velocityDecay(0.35)

  const ticks = Math.max(220, Math.min(520, nodes.length * 42))
  sim.stop()
  for (let i = 0; i < ticks; i++) sim.tick()

  for (const n of nodes) {
    if (n.x === undefined || n.y === undefined) continue
    n.x = Math.min(width - padding - n.radius, Math.max(padding + n.radius, n.x))
    n.y = Math.min(height - padding - n.radius, Math.max(padding + n.radius, n.y))
  }

  const weights = linksRaw.map((l) => l.weight)
  const wMin = Math.min(...weights)
  const wMax = Math.max(...weights)

  const links: PainThemeGraphLink[] = linksRaw.map((l) => {
    const s = l.source as OverlapSimNode
    const t = l.target as OverlapSimNode
    const sx = s.x ?? cx
    const sy = s.y ?? cy
    const tx = t.x ?? cx
    const ty = t.y ?? cy
    const span = wMax - wMin || 1
    const norm = (l.weight - wMin) / span
    const strokeWidth = 0.9 + norm * 3.4
    const opacity = 0.22 + norm * 0.42
    return {
      x1: sx,
      y1: sy,
      x2: tx,
      y2: ty,
      weight: l.weight,
      strokeWidth,
      opacity,
    }
  })

  const { degreeCentrality, betweennessCentrality } = computeCentralities(nodes, linksRaw)
  const linkCounts = incidentLinkCounts(nodes, linksRaw)

  const outNodes: PainThemeGraphNode[] = nodes.map((node, i) => ({
    id: node.id,
    kind: node.kind,
    label: node.label,
    x: node.x ?? cx,
    y: node.y ?? cy,
    radius: node.radius,
    usageScore: node.usageScore,
    personaCount: node.personaCount,
    degreeCentrality: degreeCentrality[i] ?? 0,
    betweennessCentrality: betweennessCentrality[i] ?? 0,
    linkCount: linkCounts[i] ?? 0,
  }))

  return { nodes: outNodes, links }
}
