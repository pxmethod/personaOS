import type { Persona } from '@/types/persona'

export function personaMatchesKeyword(persona: Persona, q: string): boolean {
  if (!q.trim()) return true
  const needle = q.trim().toLowerCase()
  const hay = [
    persona.name,
    persona.role,
    persona.department,
    persona.workflowType,
    persona.description,
    ...persona.goals,
    ...persona.challenges,
    ...persona.painPoints,
    ...persona.painThemes,
    ...persona.tags,
    ...persona.workflow.buckets.flatMap((b) =>
      b.tasks.map((t) => `${t.label} ${b.label}`)
    ),
    ...persona.tools.map((t) => t.name),
  ]
    .join(' ')
    .toLowerCase()
  return hay.includes(needle)
}

export function filterPersonas(
  list: Persona[],
  opts: {
    department: string | 'all'
    usageWeight: string | 'all'
    workflowType: string | 'all'
    query: string
  },
): Persona[] {
  return list.filter((p) => {
    if (opts.department !== 'all' && p.department !== opts.department) return false
    if (opts.usageWeight !== 'all' && p.usageWeight !== opts.usageWeight) return false
    if (opts.workflowType !== 'all' && p.workflowType !== opts.workflowType) return false
    if (!personaMatchesKeyword(p, opts.query)) return false
    return true
  })
}

export function departments(personas: Persona[]) {
  return [...new Set(personas.map((p) => p.department))].sort()
}
