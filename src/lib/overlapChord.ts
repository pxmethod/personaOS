import type { Persona } from '@/types/persona'

import { computeThemeOverlaps } from '@/lib/overlap'

/**
 * Symmetric matrix: entry [i][j] is the count of **shared organizational pain themes**
 * (same labels as the overlap list: themes mentioned by ≥2 personas) that both personas share.
 * Diagonal is 0.
 */
export function buildPersonaPainChordMatrix(personas: Persona[]): number[][] {
  const overlaps = computeThemeOverlaps(personas)
  const sharedThemeKeys = new Set(overlaps.map((o) => o.text))

  const n = personas.length
  const matrix: number[][] = Array.from({ length: n }, () => new Array(n).fill(0))
  for (let i = 0; i < n; i++) {
    const setI = new Set(
      personas[i].painThemes.map((t) => t.trim()).filter((k) => sharedThemeKeys.has(k)),
    )
    for (let j = i + 1; j < n; j++) {
      let cnt = 0
      for (const t of personas[j].painThemes) {
        const k = t.trim()
        if (setI.has(k) && sharedThemeKeys.has(k)) cnt++
      }
      matrix[i][j] = cnt
      matrix[j][i] = cnt
    }
  }
  return matrix
}

export function totalUndirectedChordWeight(matrix: number[][]): number {
  let s = 0
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (i < j) s += matrix[i][j] ?? 0
    }
  }
  return s
}
