/** Absolute URL for client-side routes (GitHub Pages–safe). */
export function absoluteAppPath(path: string) {
  const raw = import.meta.env.BASE_URL || '/'
  const base = raw.replace(/\/$/, '')
  const p = path.replace(/^\//, '')
  return `${window.location.origin}${base ? `${base}/` : '/'}${p}`
}

/** Full shareable URL for the compare view (search params are encoded for deployment). */
export function compareShareAbsoluteUrl(ids: string[]) {
  const u = new URL(absoluteAppPath('compare'))
  u.searchParams.set('ids', ids.join(','))
  return u.href
}
