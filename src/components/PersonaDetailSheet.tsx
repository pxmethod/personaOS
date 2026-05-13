import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { PersonaDetail } from '@/components/PersonaDetail'
import { personaById } from '@/data/personas'
import { MAIN_CONTENT_DETAIL_GUTTERS } from '@/lib/mainContentLayout'
import { cn } from '@/lib/utils'

type Phase = 'enter' | 'shown' | 'exit'

const SLIDE_MS = 300

export function PersonaDetailSheet({
  personaId,
  onClose,
}: {
  personaId: string
  onClose: () => void
}) {
  const persona = personaById[personaId]
  const [phase, setPhase] = useState<Phase>('enter')
  const [reducedMotion, setReducedMotion] = useState(false)
  const closingRef = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReducedMotion(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useLayoutEffect(() => {
    if (reducedMotion) {
      setPhase('shown')
      return
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase('shown'))
    })
    return () => cancelAnimationFrame(id)
  }, [reducedMotion])

  const runClose = useCallback(() => {
    if (closingRef.current) return
    if (reducedMotion) {
      closingRef.current = true
      onClose()
      return
    }
    closingRef.current = true
    setPhase((p) => (p === 'exit' ? p : 'exit'))
    window.setTimeout(() => {
      onClose()
    }, SLIDE_MS)
  }, [onClose, reducedMotion])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') runClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [runClose])

  if (!persona) return <Navigate to="/" replace />

  const panelY = reducedMotion
    ? 'translate-y-0'
    : phase === 'shown'
      ? 'translate-y-0'
      : 'translate-y-full'

  return (
    <div
      className="pointer-events-auto fixed inset-0 z-[100] flex flex-col justify-end overflow-hidden"
      aria-modal="true"
      role="dialog"
      aria-labelledby="persona-detail-title"
    >
      <div
        className={cn(
          'relative max-h-[min(100dvh,100%)] w-full min-h-0 overflow-hidden shadow-[0_-8px_40px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out motion-reduce:transition-none',
          panelY,
        )}
      >
        <div
          className={cn(
            'pointer-events-none absolute inset-0 border-t border-edge bg-canvas/55 backdrop-blur-2xl',
            reducedMotion && 'bg-canvas backdrop-blur-0',
          )}
          aria-hidden
        />
        <div
          className={cn(
            MAIN_CONTENT_DETAIL_GUTTERS,
            'relative z-10 min-h-0 max-h-full overflow-y-auto overflow-x-hidden',
          )}
        >
          <PersonaDetail persona={persona} onClose={runClose} />
        </div>
      </div>
    </div>
  )
}
