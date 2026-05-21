import type { PersonaWorkflow } from '@/types/persona'

export const personaWorkflows: PersonaWorkflow[] = [
  {
    id: 'support-agent-b2c',
    name: 'Support Agent (B2C)',
    usage: 'heavy',
    summary:
      'High-volume frontline support across chat, email, voice, and self-service: triage quickly, resolve transactional issues, and keep SLAs and CSAT healthy.',
    buckets: [
      {
        id: 'morning',
        label: 'Morning',
        weight: 15,
        tasks: [
          { id: 'b2c-review-queue', label: 'Review assigned queue and channel coverage', weight: 5 },
          { id: 'b2c-check-sla', label: 'Check SLA-risk conversations', weight: 5 },
          { id: 'b2c-review-incidents', label: 'Review active incidents/outages', weight: 3 },
          { id: 'b2c-prioritize', label: 'Prioritize urgent customer requests', weight: 2 },
        ],
      },
      {
        id: 'throughoutDay',
        label: 'Throughout the Day',
        weight: 65,
        tasks: [
          { id: 'b2c-handle-conversations', label: 'Handle incoming chats/emails/calls', weight: 11 },
          { id: 'b2c-authenticate', label: 'Authenticate and identify customers', weight: 7 },
          { id: 'b2c-investigate-issues', label: 'Investigate account/order/subscription issues', weight: 10 },
          { id: 'b2c-search-kb', label: 'Search knowledge base and macros', weight: 7 },
          { id: 'b2c-resolve-common', label: 'Resolve common support requests', weight: 7 },
          { id: 'b2c-escalate', label: 'Escalate unresolved technical or billing issues', weight: 6 },
          { id: 'b2c-update-status', label: 'Update conversation status and notes', weight: 5 },
          { id: 'b2c-manage-multiple', label: 'Manage multiple concurrent conversations', weight: 4 },
          { id: 'b2c-handle-refunds', label: 'Handle refunds, replacements, or account changes', weight: 4 },
          { id: 'b2c-close-conversations', label: 'Close resolved conversations', weight: 4 },
        ],
      },
      {
        id: 'endOfDay',
        label: 'End of Day',
        weight: 20,
        tasks: [
          { id: 'b2c-handoff', label: 'Handoff unresolved customer conversations', weight: 7 },
          { id: 'b2c-follow-ups', label: 'Clear pending follow-ups', weight: 5 },
          { id: 'b2c-eod-updates', label: 'Update statuses and notes', weight: 4 },
          { id: 'b2c-queue-health', label: 'Review queue health and remaining SLA risks', weight: 4 },
        ],
      },
    ],
  },

  {
    id: 'support-agent-b2b',
    name: 'Support Agent (B2B)',
    usage: 'heavy',
    summary:
      'Named-account and organization support: fewer tickets, higher complexity, stronger coordination with CS and sales, and tighter expectations around contracts, entitlements, and revenue risk.',
    buckets: [
      {
        id: 'morning',
        label: 'Morning',
        weight: 15,
        tasks: [
          { id: 'b2b-review-queue', label: 'Review priority B2B queue and account tiers', weight: 5 },
          { id: 'b2b-contract-sla', label: 'Check contractual SLA and severity obligations', weight: 5 },
          { id: 'b2b-sync-accounts', label: 'Sync with CSM/AE on at-risk or launch accounts', weight: 3 },
          { id: 'b2b-incidents', label: 'Review incidents impacting enterprise customers', weight: 2 },
        ],
      },
      {
        id: 'throughoutDay',
        label: 'Throughout the Day',
        weight: 65,
        tasks: [
          { id: 'b2b-thread-triage', label: 'Triage multi-threaded email and portal cases', weight: 12 },
          { id: 'b2b-stakeholder-comms', label: 'Coordinate responses across customer stakeholders', weight: 10 },
          { id: 'b2b-entitlements', label: 'Validate entitlements, contracts, and usage limits', weight: 10 },
          { id: 'b2b-deep-investigation', label: 'Investigate product, integration, and data issues', weight: 12 },
          { id: 'b2b-eng-escalation', label: 'Package and escalate engineering-ready defects', weight: 8 },
          { id: 'b2b-internal-alignment', label: 'Align with CS, sales, and product on account context', weight: 8 },
          { id: 'b2b-documentation', label: 'Document workarounds, RCAs, and customer commitments', weight: 5 },
        ],
      },
      {
        id: 'endOfDay',
        label: 'End of Day',
        weight: 20,
        tasks: [
          { id: 'b2b-handoff', label: 'Hand off open issues with clear customer commitments', weight: 7 },
          { id: 'b2b-account-health', label: 'Update account notes and health signals', weight: 6 },
          { id: 'b2b-exec-escalations', label: 'Prep or close executive-escalation threads', weight: 4 },
          { id: 'b2b-queue-risk', label: 'Review contractual SLA risk and backlog aging', weight: 3 },
        ],
      },
    ],
  },

  {
    id: 'support-manager',
    name: 'Support Manager / Team Lead',
    usage: 'heavy',
    summary: 'Monitors team health, escalations, staffing, and operational performance.',
    buckets: [
      {
        id: 'morning',
        label: 'Morning',
        weight: 20,
        tasks: [
          { id: 'sm-review-health', label: 'Review queue health and backlog', weight: 8 },
          { id: 'sm-review-sla', label: 'Check SLA performance and escalations', weight: 6 },
          { id: 'sm-staffing', label: 'Assess staffing and coverage', weight: 6 },
        ],
      },
      {
        id: 'throughoutDay',
        label: 'Throughout the Day',
        weight: 55,
        tasks: [
          { id: 'sm-reassign', label: 'Reassign work and balance load', weight: 12 },
          { id: 'sm-escalations', label: 'Handle customer escalations', weight: 12 },
          { id: 'sm-coach', label: 'Coach and unblock agents', weight: 10 },
          { id: 'sm-sync', label: 'Coordinate with cross-functional teams', weight: 11 },
          { id: 'sm-monitor', label: 'Monitor trends and customer sentiment', weight: 10 },
        ],
      },
      {
        id: 'endOfDay',
        label: 'End of Day',
        weight: 25,
        tasks: [
          { id: 'sm-review-kpis', label: 'Review team KPIs and exceptions', weight: 10 },
          { id: 'sm-plan', label: 'Plan staffing and coverage changes', weight: 8 },
          { id: 'sm-summary', label: 'Prepare summaries and follow-ups', weight: 7 },
        ],
      },
    ],
  },

  {
    id: 'csm',
    name: 'Customer Success Manager',
    usage: 'moderate',
    summary: 'Focuses on adoption, renewal risk, stakeholder health, and account growth.',
    buckets: [
      {
        id: 'morning',
        label: 'Morning',
        weight: 20,
        tasks: [
          { id: 'csm-health', label: 'Review account health and renewal risk', weight: 8 },
          { id: 'csm-prioritize', label: 'Prioritize strategic accounts', weight: 6 },
          { id: 'csm-prepare', label: 'Prepare for customer meetings', weight: 6 },
        ],
      },
      {
        id: 'throughoutDay',
        label: 'Throughout the Day',
        weight: 50,
        tasks: [
          { id: 'csm-meetings', label: 'Run customer meetings and business reviews', weight: 15 },
          { id: 'csm-adoption', label: 'Review adoption and usage trends', weight: 10 },
          { id: 'csm-coordinate', label: 'Coordinate internally across teams', weight: 10 },
          { id: 'csm-success-plan', label: 'Manage success plans and action items', weight: 7 },
          { id: 'csm-risks', label: 'Track blockers and escalation risk', weight: 8 },
        ],
      },
      {
        id: 'endOfDay',
        label: 'End of Day',
        weight: 30,
        tasks: [
          { id: 'csm-crm', label: 'Update CRM and account notes', weight: 10 },
          { id: 'csm-followups', label: 'Send follow-ups and recap emails', weight: 10 },
          { id: 'csm-qbr', label: 'Prepare for renewals and QBRs', weight: 10 },
        ],
      },
    ],
  },

  {
    id: 'support-operations',
    name: 'Support Operations / Admin',
    usage: 'moderate',
    summary: 'Builds workflows, improves automation, and maintains support system quality.',
    buckets: [
      {
        id: 'morning',
        label: 'Morning',
        weight: 25,
        tasks: [
          { id: 'ops-metrics', label: 'Review support metrics and trends', weight: 8 },
          { id: 'ops-automation', label: 'Inspect automation failures', weight: 9 },
          { id: 'ops-queue', label: 'Check queue anomalies and routing issues', weight: 8 },
        ],
      },
      {
        id: 'throughoutDay',
        label: 'Throughout the Day',
        weight: 50,
        tasks: [
          { id: 'ops-build', label: 'Build and update workflows', weight: 12 },
          { id: 'ops-routing', label: 'Tune routing and assignment logic', weight: 10 },
          { id: 'ops-data', label: 'Maintain reporting and data quality', weight: 10 },
          { id: 'ops-integrations', label: 'Troubleshoot integrations', weight: 8 },
          { id: 'ops-stakeholders', label: 'Gather and translate stakeholder requests', weight: 10 },
        ],
      },
      {
        id: 'endOfDay',
        label: 'End of Day',
        weight: 25,
        tasks: [
          { id: 'ops-validate', label: 'Validate changes and test workflows', weight: 8 },
          { id: 'ops-docs', label: 'Document process updates', weight: 9 },
          { id: 'ops-impact', label: 'Review impact and open follow-ups', weight: 8 },
        ],
      },
    ],
  },

  {
    id: 'tam',
    name: 'Technical Account Manager',
    usage: 'moderate',
    summary: 'Investigates complex technical issues and coordinates with engineering.',
    buckets: [
      {
        id: 'morning',
        label: 'Morning',
        weight: 20,
        tasks: [
          { id: 'tam-incidents', label: 'Review incidents and technical escalations', weight: 7 },
          { id: 'tam-risk', label: 'Check high-risk strategic accounts', weight: 7 },
          { id: 'tam-env', label: 'Review environment health and changes', weight: 6 },
        ],
      },
      {
        id: 'throughoutDay',
        label: 'Throughout the Day',
        weight: 55,
        tasks: [
          { id: 'tam-debug', label: 'Investigate and reproduce issues', weight: 15 },
          { id: 'tam-eng', label: 'Coordinate with engineering and product', weight: 12 },
          { id: 'tam-architecture', label: 'Review architecture and integrations', weight: 10 },
          { id: 'tam-inc-manage', label: 'Manage incidents and workarounds', weight: 10 },
          { id: 'tam-communicate', label: 'Communicate status to customers', weight: 8 },
        ],
      },
      {
        id: 'endOfDay',
        label: 'End of Day',
        weight: 25,
        tasks: [
          { id: 'tam-notes', label: 'Update technical notes and customer context', weight: 8 },
          { id: 'tam-actions', label: 'Track action items and next steps', weight: 9 },
          { id: 'tam-postmortem', label: 'Prepare postmortems and follow-ups', weight: 8 },
        ],
      },
    ],
  },

  {
    id: 'ai-automation-manager',
    name: 'AI / Automation Manager',
    usage: 'moderate',
    summary: 'Tracks automation performance, improves AI quality, and tunes workflows.',
    buckets: [
      {
        id: 'morning',
        label: 'Morning',
        weight: 25,
        tasks: [
          { id: 'ai-metrics', label: 'Review AI and automation metrics', weight: 10 },
          { id: 'ai-failures', label: 'Inspect failed automations and handoffs', weight: 8 },
          { id: 'ai-escalations', label: 'Review bot-generated escalations', weight: 7 },
        ],
      },
      {
        id: 'throughoutDay',
        label: 'Throughout the Day',
        weight: 50,
        tasks: [
          { id: 'ai-tune', label: 'Tune prompts, intents, and routing', weight: 12 },
          { id: 'ai-review', label: 'Review conversations and model outputs', weight: 10 },
          { id: 'ai-containment', label: 'Analyze deflection and containment', weight: 10 },
          { id: 'ai-knowledge', label: 'Update knowledge and training content', weight: 9 },
          { id: 'ai-test', label: 'Test automations and rollout changes', weight: 9 },
        ],
      },
      {
        id: 'endOfDay',
        label: 'End of Day',
        weight: 25,
        tasks: [
          { id: 'ai-report', label: 'Report outcomes and performance changes', weight: 8 },
          { id: 'ai-experiments', label: 'Queue experiments and refinements', weight: 9 },
          { id: 'ai-review2', label: 'Review risk, quality, and next steps', weight: 8 },
        ],
      },
    ],
  },

  {
    id: 'account-executive',
    name: 'Account Executive',
    usage: 'light',
    summary: 'Uses support and account signals to protect renewals and find expansion.',
    buckets: [
      {
        id: 'morning',
        label: 'Morning',
        weight: 20,
        tasks: [
          { id: 'ae-renewal', label: 'Review renewals and at-risk accounts', weight: 8 },
          { id: 'ae-prioritize', label: 'Prioritize customer outreach', weight: 6 },
          { id: 'ae-prepare', label: 'Prepare for customer calls and meetings', weight: 6 },
        ],
      },
      {
        id: 'throughoutDay',
        label: 'Throughout the Day',
        weight: 50,
        tasks: [
          { id: 'ae-outreach', label: 'Run customer outreach and follow-ups', weight: 15 },
          { id: 'ae-renewals', label: 'Coordinate renewals and expansion deals', weight: 12 },
          { id: 'ae-support-signal', label: 'Review support sentiment and risks', weight: 9 },
          { id: 'ae-stakeholders', label: 'Map stakeholders and influence', weight: 7 },
          { id: 'ae-crm', label: 'Update CRM and forecast fields', weight: 7 },
        ],
      },
      {
        id: 'endOfDay',
        label: 'End of Day',
        weight: 30,
        tasks: [
          { id: 'ae-forecast', label: 'Update forecast and pipeline health', weight: 10 },
          { id: 'ae-followups', label: 'Send follow-ups and recap notes', weight: 10 },
          { id: 'ae-exec', label: 'Prepare executive or renewal briefings', weight: 10 },
        ],
      },
    ],
  },

  {
    id: 'implementation-manager',
    name: 'Implementation / Onboarding Manager',
    usage: 'moderate',
    summary: 'Drives onboarding, setup, stakeholder coordination, and launch readiness.',
    buckets: [
      {
        id: 'morning',
        label: 'Morning',
        weight: 25,
        tasks: [
          { id: 'im-review', label: 'Review project milestones and blockers', weight: 8 },
          { id: 'im-kickoff', label: 'Prepare kickoff and agenda', weight: 9 },
          { id: 'im-prioritize', label: 'Prioritize onboarding tasks', weight: 8 },
        ],
      },
      {
        id: 'throughoutDay',
        label: 'Throughout the Day',
        weight: 55,
        tasks: [
          { id: 'im-sessions', label: 'Run customer working sessions', weight: 15 },
          { id: 'im-configure', label: 'Configure setup and validate requirements', weight: 12 },
          { id: 'im-coordinate', label: 'Coordinate dependencies across teams', weight: 10 },
          { id: 'im-blockers', label: 'Resolve issues and unblock progress', weight: 9 },
          { id: 'im-launch', label: 'Validate launch readiness', weight: 9 },
        ],
      },
      {
        id: 'endOfDay',
        label: 'End of Day',
        weight: 20,
        tasks: [
          { id: 'im-status', label: 'Share project status updates', weight: 7 },
          { id: 'im-handoff', label: 'Prepare handoff and training notes', weight: 7 },
          { id: 'im-next', label: 'Plan next steps and dependencies', weight: 6 },
        ],
      },
    ],
  },

  {
    id: 'engineering-escalation',
    name: 'Engineering / Product Escalation',
    usage: 'moderate',
    summary: 'Handles bug reproduction, fixes, incident response, and postmortems.',
    buckets: [
      {
        id: 'morning',
        label: 'Morning',
        weight: 15,
        tasks: [
          { id: 'eng-review', label: 'Review escalations and incident queue', weight: 5 },
          { id: 'eng-triage', label: 'Triage bugs and customer impact', weight: 5 },
          { id: 'eng-priority', label: 'Prioritize backlog and severity', weight: 5 },
        ],
      },
      {
        id: 'throughoutDay',
        label: 'Throughout the Day',
        weight: 60,
        tasks: [
          { id: 'eng-repro', label: 'Reproduce bugs and isolate root cause', weight: 15 },
          { id: 'eng-fix', label: 'Implement fixes and patches', weight: 15 },
          { id: 'eng-comm', label: 'Communicate status and workarounds', weight: 10 },
          { id: 'eng-collab', label: 'Collaborate with support/TAMs', weight: 10 },
          { id: 'eng-verify', label: 'Verify releases and regression impact', weight: 10 },
        ],
      },
      {
        id: 'endOfDay',
        label: 'End of Day',
        weight: 25,
        tasks: [
          { id: 'eng-close', label: 'Close incidents and update status', weight: 8 },
          { id: 'eng-postmortem', label: 'Run postmortems and root-cause review', weight: 9 },
          { id: 'eng-followups', label: 'Create follow-up bugs and action items', weight: 8 },
        ],
      },
    ],
  },

  {
    id: 'executive-leadership',
    name: 'Executive / Leadership',
    usage: 'light',
    summary: 'Uses the product for strategic visibility, risk review, and decision-making.',
    buckets: [
      {
        id: 'morning',
        label: 'Morning',
        weight: 10,
        tasks: [
          { id: 'exec-dashboard', label: 'Review leadership dashboards', weight: 4 },
          { id: 'exec-risk', label: 'Scan strategic account and churn risk', weight: 3 },
          { id: 'exec-prepare', label: 'Prepare for leadership meetings', weight: 3 },
        ],
      },
      {
        id: 'throughoutDay',
        label: 'Throughout the Day',
        weight: 40,
        tasks: [
          { id: 'exec-syncs', label: 'Attend leadership and cross-functional syncs', weight: 12 },
          { id: 'exec-decisions', label: 'Make prioritization and investment decisions', weight: 10 },
          { id: 'exec-unblock', label: 'Resolve escalations and unblock teams', weight: 8 },
          { id: 'exec-trends', label: 'Review customer and support trends', weight: 10 },
        ],
      },
      {
        id: 'endOfDay',
        label: 'End of Day',
        weight: 50,
        tasks: [
          { id: 'exec-plan', label: 'Plan next priorities and initiatives', weight: 15 },
          { id: 'exec-portfolio', label: 'Review portfolio health and strategic accounts', weight: 15 },
          { id: 'exec-approve', label: 'Approve investments and major changes', weight: 10 },
          { id: 'exec-share', label: 'Share updates with broader leadership', weight: 10 },
        ],
      },
    ],
  },
]

export const personaWorkflowById = Object.fromEntries(
  personaWorkflows.map((w) => [w.id, w])
) as Record<string, PersonaWorkflow>
