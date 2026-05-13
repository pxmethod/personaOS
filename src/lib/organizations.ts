export const ORGANIZATION_IDS = ['kustomer'] as const

export type OrganizationId = (typeof ORGANIZATION_IDS)[number]

export type Organization = {
  id: OrganizationId
  name: string
  /** Resolved URL for a file in `public/` (respects Vite `base` when deployed to a subpath). */
  logoSrc: string
}

/** Prefix `public/` asset paths so they work when `base` is not `/` (e.g. GitHub Pages). */
function publicAssetUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  const p = path.startsWith('/') ? path.slice(1) : path
  return `${base}${p}`
}

export const ORGANIZATIONS: Organization[] = [
  { id: 'kustomer', name: 'Kustomer', logoSrc: publicAssetUrl('kust_logo.svg') },
]

export const DEFAULT_ORGANIZATION_ID: OrganizationId = 'kustomer'

export function organizationById(id: OrganizationId): Organization {
  const o = ORGANIZATIONS.find((x) => x.id === id)
  if (!o) throw new Error(`Unknown organization: ${id}`)
  return o
}
