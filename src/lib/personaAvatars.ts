/**
 * Human AI avatars from [UI Faces — Human](https://uifaces.co/category/human), served from their CDN
 * (`mockmind-api.uifaces.co/content/human/{n}.jpg`, n = 1 … 222).
 */
const HUMAN_AVATAR_BASE = 'https://mockmind-api.uifaces.co/content/human'

/** Last verified image index that returns HTTP 200 (Feb 2026). */
const HUMAN_COUNT = 222

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

/** Deterministic index 1…222 from persona id (stable across reloads). */
export function personaHumanAvatarIndex(personaId: string): number {
  return (hashString(personaId) % HUMAN_COUNT) + 1
}

export function personaHumanAvatarUrl(personaId: string): string {
  return `${HUMAN_AVATAR_BASE}/${personaHumanAvatarIndex(personaId)}.jpg`
}
