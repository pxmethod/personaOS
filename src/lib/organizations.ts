export const ORGANIZATION_IDS = ['kustomer'] as const

export type OrganizationId = (typeof ORGANIZATION_IDS)[number]

export type Organization = {
  id: OrganizationId
  name: string
  /** Public URL (e.g. file in `/public`) */
  logoSrc: string
}

export const ORGANIZATIONS: Organization[] = [
  { id: 'kustomer', name: 'Kustomer', logoSrc: '/kust_logo.svg' },
]

export const DEFAULT_ORGANIZATION_ID: OrganizationId = 'kustomer'

export function organizationById(id: OrganizationId): Organization {
  const o = ORGANIZATIONS.find((x) => x.id === id)
  if (!o) throw new Error(`Unknown organization: ${id}`)
  return o
}
