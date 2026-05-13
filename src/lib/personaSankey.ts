import { orderedWorkflowBuckets } from '@/lib/orderedWorkflowBuckets'
import type { PersonaWorkflow } from '@/types/persona'

export type SankeyNode = {
  id: string
  label: string
  type: 'persona' | 'bucket' | 'task'
  personaId: string
}

export type SankeyLink = {
  source: string
  target: string
  value: number
}

export function buildSankey(persona: PersonaWorkflow): {
  nodes: SankeyNode[]
  links: SankeyLink[]
} {
  const nodes: SankeyNode[] = []
  const links: SankeyLink[] = []

  nodes.push({
    id: persona.id,
    label: persona.name,
    type: 'persona',
    personaId: persona.id,
  })

  for (const bucket of orderedWorkflowBuckets(persona)) {
    const bucketId = `${persona.id}:${bucket.id}`
    nodes.push({
      id: bucketId,
      label: bucket.label,
      type: 'bucket',
      personaId: persona.id,
    })

    links.push({
      source: persona.id,
      target: bucketId,
      value: bucket.weight,
    })

    for (const task of bucket.tasks) {
      const taskId = `${persona.id}:${bucket.id}:${task.id}`
      nodes.push({
        id: taskId,
        label: task.label,
        type: 'task',
        personaId: persona.id,
      })

      links.push({
        source: bucketId,
        target: taskId,
        value: task.weight,
      })
    }
  }

  return { nodes, links }
}

type D3SankeyNode = { name: string }

type D3SankeyLink = {
  source: number
  target: number
  value: number
}

/** Maps string-id graph from {@link buildSankey} into index-based nodes/links for d3-sankey. */
export function buildSankeyD3Input(
  persona: PersonaWorkflow,
  rootLabel: string
): { nodes: D3SankeyNode[]; links: D3SankeyLink[] } {
  const { nodes, links } = buildSankey(persona)
  const indexById = new Map(nodes.map((n, i) => [n.id, i]))

  const d3Nodes: D3SankeyNode[] = nodes.map((n, i) => ({
    name: i === 0 ? rootLabel : n.label,
  }))

  const d3Links: D3SankeyLink[] = links.map((l) => ({
    source: indexById.get(l.source)!,
    target: indexById.get(l.target)!,
    value: Math.max(1, l.value),
  }))

  return { nodes: d3Nodes, links: d3Links }
}
