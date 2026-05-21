import { createContext } from 'react'
import type { OrganizationId } from '@/lib/organizations'
import type { Department, Persona, SupportModel, UsageWeight, WorkflowType } from '@/types/persona'

export type ExplorerContextValue = {
  organizationId: OrganizationId
  setOrganizationId: (id: OrganizationId) => void
  query: string
  setQuery: (q: string) => void
  department: Department | 'all'
  setDepartment: (d: Department | 'all') => void
  supportModel: SupportModel | 'all'
  setSupportModel: (m: SupportModel | 'all') => void
  usageWeight: UsageWeight | 'all'
  setUsageWeight: (u: UsageWeight | 'all') => void
  workflowType: WorkflowType | 'all'
  setWorkflowType: (w: WorkflowType | 'all') => void
  filteredPersonas: Persona[]
  compareMode: boolean
  setCompareMode: (v: boolean) => void
  compareIds: string[]
  setCompareIds: (ids: string[]) => void
  toggleCompareId: (id: string) => void
  clearCompare: () => void
}

export const ExplorerContext = createContext<ExplorerContextValue | null>(null)
