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

/** Primary customer motion the persona most often serves in this library. */
export type SupportModel = 'b2b' | 'b2c' | 'hybrid'

export const SUPPORT_MODEL_LABELS: Record<SupportModel, string> = {
  b2b: 'B2B',
  b2c: 'B2C',
  hybrid: 'Hybrid',
}

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

/** Axes used to synthesize side-by-side comparison highlights (curated per persona). */
export type ComparisonDimension =
  | 'workflowStyle'
  | 'operationalFocus'
  | 'collaborationIntensity'
  | 'customerComplexity'
  | 'primaryKpis'
  | 'toolingNeeds'
  | 'automationOpportunity'
  | 'decisionMaking'
  | 'supportModel'

/** One-line expert phrases per axis — compared programmatically on the compare page. */
export type PersonaComparisonProfile = Record<ComparisonDimension, string>

export type Persona = {
  id: string
  name: string
  role: string
  department: Department
  supportModel: SupportModel
  usageWeight: UsageWeight
  workflowType: WorkflowType
  /** Guiding question / mindset quote for detail and compare headers. */
  quote: string
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
  /** Structured axes for comparison highlights vs other personas. */
  comparisonProfile: PersonaComparisonProfile
}

export type PersonaIndex = Pick<
  Persona,
  | 'id'
  | 'name'
  | 'role'
  | 'department'
  | 'supportModel'
  | 'usageWeight'
  | 'workflowType'
  | 'description'
  | 'tags'
>
