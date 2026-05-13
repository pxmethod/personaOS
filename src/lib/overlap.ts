import type { Persona } from '@/types/persona'

export type ThemeOverlap = {
  text: string
  count: number
  personaNames: string[]
}

/** Overlap on curated short pain themes (intentionally shared across personas). */
export function computeThemeOverlaps(personas: Persona[]): ThemeOverlap[] {
  const map = new Map<string, Set<string>>()
  for (const p of personas) {
    for (const theme of p.painThemes) {
      const key = theme.trim()
      const s = map.get(key) ?? new Set<string>()
      s.add(p.name)
      map.set(key, s)
    }
  }
  return [...map.entries()]
    .map(([text, names]) => ({
      text,
      count: names.size,
      personaNames: [...names].sort(),
    }))
    .filter((x) => x.count >= 2)
    .sort((a, b) => b.count - a.count || b.personaNames.length - a.personaNames.length)
}
