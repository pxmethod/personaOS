import { SUPPORT_MODEL_LABELS, type Persona, type SupportModel, type UsageWeight } from '@/types/persona'

/** Lower rank = heavier usage (directory default order). */
const USAGE_SORT_RANK: Record<UsageWeight, number> = {
  heavy: 0,
  moderate: 1,
  light: 2,
}

/** Highest product usage first; ties broken by persona name. */
export function sortPersonasByUsageDesc(personas: Persona[]): Persona[] {
  return [...personas].sort((a, b) => {
    const byUsage = USAGE_SORT_RANK[a.usageWeight] - USAGE_SORT_RANK[b.usageWeight]
    if (byUsage !== 0) return byUsage
    return a.name.localeCompare(b.name)
  })
}

export function personaMatchesKeyword(persona: Persona, q: string): boolean {
  if (!q.trim()) return true
  const needle = q.trim().toLowerCase()
  const hay = [
    persona.name,
    persona.role,
    persona.quote,
    persona.department,
    persona.workflowType,
    persona.description,
    ...persona.goals,
    ...persona.challenges,
    ...persona.painPoints,
    ...persona.painThemes,
    ...persona.tags,
    SUPPORT_MODEL_LABELS[persona.supportModel],
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
    supportModel: SupportModel | 'all'
    usageWeight: string | 'all'
    workflowType: string | 'all'
    query: string
  },
): Persona[] {
  return list.filter((p) => {
    if (opts.department !== 'all' && p.department !== opts.department) return false
    if (opts.supportModel !== 'all' && p.supportModel !== opts.supportModel) return false
    if (opts.usageWeight !== 'all' && p.usageWeight !== opts.usageWeight) return false
    if (opts.workflowType !== 'all' && p.workflowType !== opts.workflowType) return false
    if (!personaMatchesKeyword(p, opts.query)) return false
    return true
  })
}

export function departments(personas: Persona[]) {
  return [...new Set(personas.map((p) => p.department))].sort()
}
