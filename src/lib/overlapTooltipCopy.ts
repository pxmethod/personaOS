import type { PainThemeGraphNode } from '@/lib/overlap'

export type OverlapHoverTier = 'Low' | 'Moderate' | 'High'

export type OverlapHoverBlock = {
  heading: string
  tier: OverlapHoverTier
  detail: string
}

export type OverlapHoverCard = {
  title: string
  lead: string
  blocks: [OverlapHoverBlock, OverlapHoverBlock]
}

function tier3FromRatio(r: number): OverlapHoverTier {
  if (r < 1 / 3) return 'Low'
  if (r < 2 / 3) return 'Moderate'
  return 'High'
}

function tier3FromCoordination(betweennessNorm: number): OverlapHoverTier {
  if (betweennessNorm < 0.28) return 'Low'
  if (betweennessNorm < 0.62) return 'Moderate'
  return 'High'
}

function maxPersonaLinks(nodes: PainThemeGraphNode[]): number {
  let m = 1
  for (const n of nodes) {
    if (n.kind === 'persona' && n.linkCount > m) m = n.linkCount
  }
  return m
}

function maxThemePersonas(nodes: PainThemeGraphNode[]): number {
  let m = 2
  for (const n of nodes) {
    if (n.kind === 'theme' && n.personaCount > m) m = n.personaCount
  }
  return m
}

function personaSharedOverlapTier(node: PainThemeGraphNode, peers: PainThemeGraphNode[]): OverlapHoverTier {
  const mx = maxPersonaLinks(peers)
  const r = node.linkCount / mx
  return tier3FromRatio(r)
}

function themeReachTier(node: PainThemeGraphNode, peers: PainThemeGraphNode[]): OverlapHoverTier {
  const mx = maxThemePersonas(peers)
  const r = node.personaCount / mx
  return tier3FromRatio(r)
}

function personaLead(overlap: OverlapHoverTier): string {
  if (overlap === 'High') {
    return 'This persona shares workflows and operational challenges with many teams.'
  }
  if (overlap === 'Moderate') {
    return 'This persona shares workflows and operational challenges with multiple teams.'
  }
  return 'This persona overlaps on a narrower set of shared operational pain in this view.'
}

function personaSharedBody(tier: OverlapHoverTier): string {
  if (tier === 'High') {
    return 'Connected to many common organizational pain points that show up across teams.'
  }
  if (tier === 'Moderate') {
    return 'Connected to several common organizational pain points.'
  }
  return 'Connected to a small number of shared organizational pain points.'
}

function personaCoordinationBody(tier: OverlapHoverTier): string {
  if (tier === 'High') {
    return 'Frequently involved in cross-functional workflows and team coordination.'
  }
  if (tier === 'Moderate') {
    return 'Often involved in handoffs, reviews, and cross-team workflow moments.'
  }
  return 'Less often on the critical path for multi-team coordination in this snapshot.'
}

function themeLead(reach: OverlapHoverTier): string {
  if (reach === 'High') {
    return 'This theme shows up across many roles in day-to-day execution, reporting, and handoffs.'
  }
  if (reach === 'Moderate') {
    return 'This theme surfaces in multiple teams’ workflows and operational rhythms.'
  }
  return 'This theme is visible in a smaller set of roles in the overlap captured here.'
}

function themeReachBody(tier: OverlapHoverTier): string {
  if (tier === 'High') {
    return 'Touches many personas—broad organizational exposure in this map.'
  }
  if (tier === 'Moderate') {
    return 'Shows up for several personas—meaningful cross-team exposure.'
  }
  return 'Shared by a few personas—more localized operational impact in this view.'
}

function themeWorkflowBody(tier: OverlapHoverTier): string {
  if (tier === 'High') {
    return 'Often sits between teams in workflows—high potential for coordination drag and rework.'
  }
  if (tier === 'Moderate') {
    return 'Shows up in cross-team workflows often enough to shape prioritization and process design.'
  }
  return 'Less central to multi-team workflow paths in this snapshot—still worth monitoring.'
}

/** Operational / workflow language for overlap graph hovers (no graph-theory jargon). */
export function buildOverlapHoverCard(
  node: PainThemeGraphNode,
  peers: PainThemeGraphNode[],
): OverlapHoverCard {
  if (node.kind === 'persona') {
    const shared = personaSharedOverlapTier(node, peers)
    const coord = tier3FromCoordination(node.betweennessCentrality)
    return {
      title: node.label,
      lead: personaLead(shared),
      blocks: [
        { heading: 'Shared overlap', tier: shared, detail: personaSharedBody(shared) },
        { heading: 'Coordination impact', tier: coord, detail: personaCoordinationBody(coord) },
      ],
    }
  }

  const reach = themeReachTier(node, peers)
  const load = tier3FromCoordination(node.betweennessCentrality)
  return {
    title: node.label,
    lead: themeLead(reach),
    blocks: [
      { heading: 'Organizational reach', tier: reach, detail: themeReachBody(reach) },
      { heading: 'Operational & workflow load', tier: load, detail: themeWorkflowBody(load) },
    ],
  }
}
