import type { PersonaWorkflow } from '@/types/persona'

/** Resolve a Sankey task id to its label for the current persona workflow. */
export function taskLabelFromWorkflow(workflow: PersonaWorkflow, taskId: string): string {
  for (const b of workflow.buckets) {
    const t = b.tasks.find((x) => x.id === taskId)
    if (t) return t.label
  }
  return taskId
}
