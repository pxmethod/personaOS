export type RoadmapStatusKind = 'completed' | 'in_progress' | 'planned'

export type RoadmapBlock =
  | { kind: 'paragraph'; heading?: string; text: string }
  | { kind: 'bullets'; heading: string; items: string[] }

export type RoadmapWorkItem = {
  id: string
  title: string
  status: RoadmapStatusKind
  blocks: RoadmapBlock[]
}

export type RoadmapPhase = {
  id: string
  title: string
  items: RoadmapWorkItem[]
}

export const roadmapPhases: RoadmapPhase[] = [
  {
    id: 'phase-0',
    title: 'Phase 0 — Foundation (completed / MVP)',
    items: [
      {
        id: 'interactive-explorer',
        title: 'Interactive persona explorer',
        status: 'completed',
        blocks: [
          { kind: 'paragraph', heading: 'Problem', text: 'Personas exist as static documents nobody uses.' },
          { kind: 'paragraph', heading: 'Solution', text: 'Interactive browser-based persona system.' },
          {
            kind: 'bullets',
            heading: 'Value',
            items: [
              'Shared mental model across teams',
              'Faster onboarding',
              'Better design discussions',
            ],
          },
          { kind: 'paragraph', heading: 'Personas impacted', text: 'All' },
        ],
      },
      {
        id: 'structured-model',
        title: 'Structured persona data model',
        status: 'completed',
        blocks: [
          {
            kind: 'paragraph',
            text: 'Creates reusable schema powering all future intelligence features.',
          },
        ],
      },
    ],
  },
  {
    id: 'phase-1',
    title: 'Phase 1 — Product demo platform (now)',
    items: [
      {
        id: 'persona-detail',
        title: 'Persona detail experience',
        status: 'in_progress',
        blocks: [
          {
            kind: 'bullets',
            heading: 'Features',
            items: ['goals', 'workflows', 'challenges', 'tools', 'product needs'],
          },
          { kind: 'paragraph', heading: 'Value', text: 'Turns personas into decision tools.' },
        ],
      },
      {
        id: 'comparison-mode',
        title: 'Persona comparison mode',
        status: 'in_progress',
        blocks: [
          {
            kind: 'paragraph',
            heading: 'Problem',
            text: 'Teams optimize for one persona accidentally harming another.',
          },
          { kind: 'paragraph', heading: 'Solution', text: 'Side-by-side comparison view.' },
          {
            kind: 'paragraph',
            heading: 'Impact',
            text: 'Product alignment during roadmap planning.',
          },
        ],
      },
      {
        id: 'relationship-map',
        title: 'Relationship map',
        status: 'in_progress',
        blocks: [
          {
            kind: 'bullets',
            heading: 'Visualizes how work moves between',
            items: ['agents', 'CSMs', 'managers', 'sales', 'engineering'],
          },
          { kind: 'paragraph', heading: 'Outcome', text: 'Reveals cross-team friction.' },
        ],
      },
      {
        id: 'shareable-demo',
        title: 'Shareable demo mode',
        status: 'in_progress',
        blocks: [
          {
            kind: 'bullets',
            heading: 'One-click presentation mode for',
            items: ['Leadership demos', 'Workshops', 'Design critiques'],
          },
        ],
      },
    ],
  },
  {
    id: 'phase-2',
    title: 'Phase 2 — Organizational intelligence (next)',
    items: [
      {
        id: 'living-profiles',
        title: 'Living persona profiles',
        status: 'planned',
        blocks: [
          {
            kind: 'paragraph',
            heading: 'Idea',
            text: 'Personas update based on real usage data.',
          },
          {
            kind: 'bullets',
            heading: 'Integrations',
            items: ['Product analytics', 'Support platforms', 'CRM data'],
          },
          { kind: 'paragraph', heading: 'Outcome', text: 'Personas become operational truth.' },
        ],
      },
      {
        id: 'insights-dashboard',
        title: 'Persona insights dashboard',
        status: 'planned',
        blocks: [
          {
            kind: 'paragraph',
            heading: 'Problem',
            text: "Teams don't know how many users match each persona.",
          },
          {
            kind: 'bullets',
            heading: 'Features',
            items: [
              'Persona distribution',
              'Usage trends',
              'Behavioral changes over time',
            ],
          },
        ],
      },
      {
        id: 'workflow-simulator',
        title: 'Workflow simulator',
        status: 'planned',
        blocks: [
          {
            kind: 'bullets',
            heading: 'Example — select scenario',
            items: ['Major outage', 'Renewal risk', 'Escalation'],
          },
          {
            kind: 'paragraph',
            heading: 'See',
            text: 'Which personas activate and how work flows.',
          },
        ],
      },
    ],
  },
  {
    id: 'phase-3',
    title: 'Phase 3 — Data integrations',
    items: [
      {
        id: 'product-analytics',
        title: 'Product analytics integration',
        status: 'planned',
        blocks: [
          {
            kind: 'bullets',
            heading: 'Pull from tools like',
            items: ['Mixpanel', 'Amplitude'],
          },
          { kind: 'paragraph', heading: 'Output', text: 'Behavior-driven personas.' },
        ],
      },
      {
        id: 'support-platform',
        title: 'Support platform integration',
        status: 'planned',
        blocks: [
          {
            kind: 'bullets',
            heading: 'Integrate',
            items: ['Zendesk', 'Kustomer'],
          },
          {
            kind: 'bullets',
            heading: 'Unlocks',
            items: ['Escalation patterns', 'Resolution behavior', 'Workload personas'],
          },
        ],
      },
      {
        id: 'crm',
        title: 'CRM integration',
        status: 'planned',
        blocks: [
          {
            kind: 'bullets',
            heading: 'Add',
            items: ['Salesforce', 'HubSpot'],
          },
          { kind: 'paragraph', heading: 'Value', text: 'Connect personas to revenue outcomes.' },
        ],
      },
    ],
  },
  {
    id: 'phase-4',
    title: 'Phase 4 — AI intelligence layer (later)',
    items: [
      {
        id: 'ai-generator',
        title: 'AI persona generator',
        status: 'planned',
        blocks: [
          {
            kind: 'bullets',
            heading: 'Upload',
            items: ['Support exports', 'Interviews', 'Analytics data'],
          },
          {
            kind: 'bullets',
            heading: 'What AI produces',
            items: ['Persona summaries', 'Behavior clusters', 'Opportunity insights'],
          },
        ],
      },
      {
        id: 'ai-copilot',
        title: 'AI design copilot',
        status: 'planned',
        blocks: [
          {
            kind: 'bullets',
            heading: 'Select persona → generate',
            items: ['Feature risks', 'Usability concerns', 'Workflow expectations'],
          },
        ],
      },
      {
        id: 'meeting-assistant',
        title: 'Meeting assistant mode',
        status: 'planned',
        blocks: [
          {
            kind: 'paragraph',
            heading: 'Before a roadmap meeting',
            text: '“Show impact across personas.” An instant alignment tool.',
          },
        ],
      },
    ],
  },
]

export function roadmapHasContent(): boolean {
  return roadmapPhases.some((p) => p.items.length > 0)
}
