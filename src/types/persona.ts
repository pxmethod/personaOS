export type UsageWeight = 'heavy' | 'moderate' | 'light'

/** Display strings for product usage (title case). */
export const PRODUCT_USAGE_LABELS: Record<UsageWeight, string> = {
  heavy: 'Heavy',
  moderate: 'Moderate',
  light: 'Light',
}

export type Department =
  | 'Support'
  | 'Customer Success'
  | 'Operations'
  | 'Sales'
  | 'Product'
  | 'Design'
  | 'Leadership'

export type WorkflowType =
  | 'reactive'
  | 'proactive'
  | 'hybrid'
  | 'analytical'
  | 'commercial'

export type PersonaUsage = UsageWeight

export type SankeyTask = {
  id: string
  label: string
  /** Relative share within the time bucket */
  weight: number
}

export type TimeBucketId = 'morning' | 'throughoutDay' | 'endOfDay'

export type TimeBucket = {
  id: TimeBucketId
  label: string
  /** Share of the persona's day */
  weight: number
  tasks: SankeyTask[]
}

export type PersonaWorkflow = {
  id: string
  name: string
  usage: PersonaUsage
  summary: string
  buckets: TimeBucket[]
}

export type Tool = {
  id: string
  name: string
  /** simple-icons slug for https://cdn.simpleicons.org/{slug} */
  iconSlug?: string
  category?: string
}

export type PersonaConfidenceModel = 'high' | 'moderate' | 'early_model'

export type PersonaConfidenceTier =
  | 'industry_baseline'
  | 'moderate_confidence'
  | 'validated_pattern'
  | 'customer_informed'
  | 'organization_specific'

export type PersonaConfidence = {
  model: PersonaConfidenceModel
  tier: PersonaConfidenceTier
}

export type CommonlyUsedFeature = {
  id: string
  label: string
  category: string
  /** 0–100; higher = more central to the persona's workflow */
  importanceScore: number
  relatedTasks: string[]
}

export type PersonaFeatureSet = {
  personaId: string
  commonlyUsedFeatures: CommonlyUsedFeature[]
}

export type Persona = {
  id: string
  name: string
  role: string
  department: Department
  usageWeight: UsageWeight
  workflowType: WorkflowType
  description: string
  goals: string[]
  challenges: string[]
  workflow: PersonaWorkflow
  tools: Tool[]
  painPoints: string[]
  /** Short theme labels for overlap analysis (curated) */
  painThemes: string[]
  relatedPersonas: string[]
  tags: string[]
  /** Short labels for persona → job emphasis (research weights) */
  topJobs: { label: string; weight: number }[]
  /** Product surfaces this persona uses most often (for detail page grid). */
  commonlyUsedFeatures: CommonlyUsedFeature[]
  /** Model confidence; omitted defaults to early model + industry baseline. */
  confidence?: PersonaConfidence
}

export type PersonaIndex = Pick<
  Persona,
  | 'id'
  | 'name'
  | 'role'
  | 'department'
  | 'usageWeight'
  | 'workflowType'
  | 'description'
  | 'tags'
>
