import type { PersonaWorkflow, TimeBucket, TimeBucketId } from '@/types/persona'

/** Stable column order for workflow Sankey and day breakdowns. */
export const WORKFLOW_BUCKET_ORDER: TimeBucketId[] = ['morning', 'throughoutDay', 'endOfDay']

export function orderedWorkflowBuckets(workflow: PersonaWorkflow): TimeBucket[] {
  return WORKFLOW_BUCKET_ORDER.map((id) => {
    const b = workflow.buckets.find((x) => x.id === id)
    if (!b) {
      throw new Error(`PersonaWorkflow "${workflow.id}" is missing time bucket "${id}"`)
    }
    return b
  })
}
