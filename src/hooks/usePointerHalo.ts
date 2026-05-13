import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'

/** Match Kong-style halo: only when user has not requested reduced motion. */
const POINTER_HALO_MEDIA = '(prefers-reduced-motion: no-preference)'

export const pointerHaloLayerClassName =
  'pointer-events-none absolute inset-0 z-0 rounded-[var(--radius-card)] transition-opacity duration-[1100ms] ease-out'

export function usePointerHalo<T extends HTMLElement = HTMLElement>() {
  const surfaceRef = useRef<T | null>(null)
  const haloRaf = useRef<number | null>(null)
  const pointerRef = useRef({ x: 0, y: 0 })
  const [haloStyle, setHaloStyle] = useState<{ opacity: number; background: string }>({
    opacity: 0,
    background: 'transparent',
  })
  const [haloMotionOk, setHaloMotionOk] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(POINTER_HALO_MEDIA)
    const apply = () => setHaloMotionOk(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(
    () => () => {
      if (haloRaf.current != null) window.cancelAnimationFrame(haloRaf.current)
    },
    [],
  )

  const flushHalo = useCallback(() => {
    haloRaf.current = null
    const el = surfaceRef.current
    if (!el) return
    const { x, y } = pointerRef.current
    setHaloStyle({
      opacity: 1,
      background: `radial-gradient(240px circle at ${x}px ${y}px, rgba(204, 255, 0, 0.22) 0%, rgba(204, 255, 0, 0.08) 38%, transparent 62%)`,
    })
  }, [])

  const scheduleHalo = useCallback(() => {
    if (haloRaf.current != null) return
    haloRaf.current = window.requestAnimationFrame(flushHalo)
  }, [flushHalo])

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (!haloMotionOk) return
      const el = surfaceRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      pointerRef.current = {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
      }
      scheduleHalo()
    },
    [haloMotionOk, scheduleHalo],
  )

  const onPointerLeave = useCallback(() => {
    if (haloRaf.current != null) {
      window.cancelAnimationFrame(haloRaf.current)
      haloRaf.current = null
    }
    setHaloStyle((s) => ({ ...s, opacity: 0 }))
  }, [])

  return {
    surfaceRef,
    haloStyle,
    onPointerMove,
    onPointerLeave,
  }
}
