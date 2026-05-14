import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Info } from 'lucide-react'
import { personaCardPillBase } from '@/lib/personaCardPills'
import { cn } from '@/lib/utils'
import type { Persona, PersonaConfidence, PersonaConfidenceModel, PersonaConfidenceTier } from '@/types/persona'

const DEFAULT_CONFIDENCE: PersonaConfidence = {
  model: 'early_model',
  tier: 'industry_baseline',
}

const MODEL_LABEL: Record<PersonaConfidenceModel, string> = {
  high: 'High',
  moderate: 'Moderate',
  early_model: 'Early model',
}

const TIER_LABEL: Record<PersonaConfidenceTier, string> = {
  industry_baseline: 'Industry baseline',
  moderate_confidence: 'Moderate confidence',
  validated_pattern: 'Validated pattern',
  customer_informed: 'Customer-informed',
  organization_specific: 'Organization-specific',
}

function resolveConfidence(persona: Persona): PersonaConfidence {
  return persona.confidence ?? DEFAULT_CONFIDENCE
}

const PANEL_MAX_W = 22 * 16

/** Scroll containers that can move the anchor without firing `window` scroll. */
function getScrollableAncestors(node: HTMLElement | null): EventTarget[] {
  const ordered: EventTarget[] = []
  const seen = new Set<EventTarget>()
  let cur = node?.parentElement
  while (cur) {
    const cs = getComputedStyle(cur)
    const oy = /(auto|scroll|overlay)/.test(cs.overflowY) || /(auto|scroll|overlay)/.test(cs.overflow)
    const ox = /(auto|scroll|overlay)/.test(cs.overflowX) || /(auto|scroll|overlay)/.test(cs.overflow)
    if ((oy || ox) && (cur.scrollHeight > cur.clientHeight || cur.scrollWidth > cur.clientWidth)) {
      if (!seen.has(cur)) {
        ordered.push(cur)
        seen.add(cur)
      }
    }
    cur = cur.parentElement
  }
  if (!seen.has(window)) {
    ordered.push(window)
  }
  return ordered
}

function ConfidenceInfoPopover() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null)

  const measureAndSet = useCallback(() => {
    const el = btnRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const width = Math.min(PANEL_MAX_W, window.innerWidth - 32)
    let left = r.left
    if (left + width > window.innerWidth - 16) {
      left = window.innerWidth - 16 - width
    }
    left = Math.max(16, left)
    setCoords({ top: r.bottom + 8, left, width })
  }, [])

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null)
      return
    }
    measureAndSet()
  }, [open, measureAndSet])

  useEffect(() => {
    if (!open || !btnRef.current) return

    let rafId = 0
    const schedule = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        rafId = 0
        measureAndSet()
      })
    }

    const targets = getScrollableAncestors(btnRef.current)
    for (const t of targets) {
      t.addEventListener('scroll', schedule, { passive: true })
    }
    window.addEventListener('resize', schedule)
    const vv = window.visualViewport
    vv?.addEventListener('resize', schedule)
    vv?.addEventListener('scroll', schedule)

    return () => {
      for (const t of targets) {
        t.removeEventListener('scroll', schedule)
      }
      window.removeEventListener('resize', schedule)
      vv?.removeEventListener('resize', schedule)
      vv?.removeEventListener('scroll', schedule)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [open, measureAndSet])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node
      if (wrapRef.current?.contains(t) || panelRef.current?.contains(t)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const panel =
    open &&
    coords && (
      <div
        ref={panelRef}
        id={panelId}
        role="region"
        aria-label="Industry baseline confidence"
        className={cn(
          'fixed z-[200] max-h-[min(70vh,28rem)] overflow-y-auto overscroll-contain',
          'rounded-xl border border-edge-strong bg-surface-2 p-4 text-left text-xs leading-relaxed text-ink shadow-xl',
        )}
        style={{ top: coords.top, left: coords.left, width: coords.width }}
      >
        <p className="font-display text-sm font-semibold tracking-tight text-lime">Industry baseline confidence</p>
        <div className="mt-3 space-y-3 text-white">
          <p>
            This persona profile is based on synthesized industry research, publicly available operational patterns,
            and common workflows observed across modern B2B support organizations.
          </p>
          <p>
            The information shown is intended to help teams explore likely user goals, responsibilities, workflows, and
            pain points. Actual organizational structures, processes, and product usage may differ based on team size,
            tooling, support model, and operational maturity.
          </p>
          <p>
            As PersonaOS evolves, future integrations and customer-specific data sources will allow these models to
            become more tailored and representative of real environments.
          </p>
        </div>
      </div>
    )

  return (
    <>
      <div ref={wrapRef} className="relative inline-flex shrink-0 items-center">
        <button
          ref={btnRef}
          type="button"
          className={cn(
            'rounded-full border border-edge bg-surface-0/80 p-1 text-ink-muted transition',
            'hover:border-lime/50 hover:bg-lime-muted hover:text-lime',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime',
            open && 'border-lime/50 bg-lime-muted text-lime',
          )}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          aria-label="About confidence levels"
        >
          <Info className="size-4" strokeWidth={2} aria-hidden />
        </button>
      </div>
      {panel ? createPortal(panel, document.body) : null}
    </>
  )
}

export function PersonaConfidenceCard({ persona }: { persona: Persona }) {
  const { model, tier } = resolveConfidence(persona)

  return (
    <div
      className={cn(
        'rounded-xl border border-edge bg-surface-1/80 p-4 sm:p-5',
        'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]',
      )}
    >
      <h3 className="font-display text-md font-semibold tracking-tight text-white">Data accuracy</h3>
      <p className="mt-1.5 max-w-auto text-sm leading-relaxed text-ink-muted">
        Industry-informed estimate based on public research and generalized customer support workflows and operational patterns.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={cn(personaCardPillBase, 'border-lime/80 text-lime')}>{TIER_LABEL[tier]}</span>
        <span className="text-sm font-medium text-ink">{MODEL_LABEL[model]}</span>
        <ConfidenceInfoPopover />
      </div>
    </div>
  )
}
