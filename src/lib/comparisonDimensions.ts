import type { ComparisonDimension } from '@/types/persona'

/** Short labels for comparison matrix rows. */
export const COMPARISON_DIMENSION_LABELS: Record<ComparisonDimension, string> = {
  workflowStyle: 'Workflow style',
  operationalFocus: 'Operational focus',
  collaborationIntensity: 'Collaboration intensity',
  customerComplexity: 'Customer complexity',
  primaryKpis: 'Primary KPIs',
  toolingNeeds: 'Tooling needs',
  automationOpportunity: 'Automation opportunity',
  decisionMaking: 'Decision-making',
  supportModel: 'Support model',
}

/** Row order in the comparison highlights table. */
export const COMPARISON_DIMENSION_ORDER: ComparisonDimension[] = [
  'supportModel',
  'workflowStyle',
  'operationalFocus',
  'customerComplexity',
  'primaryKpis',
  'decisionMaking',
  'collaborationIntensity',
  'toolingNeeds',
  'automationOpportunity',
]
