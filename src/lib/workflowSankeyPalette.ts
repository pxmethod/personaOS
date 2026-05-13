/** Persona column fills and link strokes — shared by TaskSankey (detail and compare). */
export const WORKFLOW_SANKEY_PERSONA_COLORS: readonly string[] = [
  '#ccff00',
  '#b8ea00',
  '#9fcc00',
  '#86b800',
  '#6fa300',
  '#5c8a00',
  '#4a7200',
  '#3d5f00',
  '#2d4700',
  '#1f3000',
]

/** Neutral nodes (buckets / tasks) on the day-flow Sankey. */
export const WORKFLOW_SANKEY_NEUTRAL_FILL = '#e4e4e7'

export const WORKFLOW_SANKEY_LINK_OPACITY = 0.35

/** Same roster order as {@link personas} for consistent persona colors across charts. */
export function workflowSankeyPersonaFill(
  personaId: string,
  rosterIds: readonly string[]
): string {
  const idx = rosterIds.indexOf(personaId)
  const i = idx >= 0 ? idx : 0
  return WORKFLOW_SANKEY_PERSONA_COLORS[i % WORKFLOW_SANKEY_PERSONA_COLORS.length]!
}
