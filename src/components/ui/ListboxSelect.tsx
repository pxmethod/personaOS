import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ListboxOption<T extends string = string> = {
  value: T
  label: string
  /** Shown left of the label on the trigger and each option (e.g. org logo). */
  leading?: ReactNode
}

type ListboxSelectProps<T extends string> = {
  /** When set, renders the small caption above the trigger (Organization switcher style). */
  label?: string
  value: T
  options: ListboxOption<T>[]
  onChange: (value: T) => void
  /** Extra classes on the root `relative` wrapper (e.g. min-width). */
  className?: string
  /** Extra classes on the trigger button. */
  triggerClassName?: string
}

export function ListboxSelect<T extends string>({
  label: caption,
  value,
  options,
  onChange,
  className,
  triggerClassName,
}: ListboxSelectProps<T>) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const baseId = useId()
  const listId = `${baseId}-list`
  const labelId = caption ? `${baseId}-caption` : undefined

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
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

  if (!options.length) return null

  const current = options.find((o) => o.value === value) ?? options[0]
  const activeIndex = options.findIndex((o) => o.value === value)
  const activeDescendantId = activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined

  const triggerClasses = cn(
    'flex w-full min-h-10 items-center gap-2.5 rounded-xl border border-edge bg-surface-0/80 px-2.5 py-2 text-left text-sm font-medium text-ink transition',
    'hover:border-lime/30 hover:bg-surface-0',
    open && 'border-lime/40 ring-1 ring-lime/25',
    triggerClassName,
  )

  return (
    <div ref={rootRef} className={cn('relative min-w-0', className)}>
      {caption ? (
        <p id={labelId} className="mb-1.5 text-[11px] font-medium text-ink-muted">
          {caption}
        </p>
      ) : null}
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        {...(labelId ? { 'aria-labelledby': labelId } : {})}
        className={triggerClasses}
        onClick={() => setOpen((o) => !o)}
      >
        {current.leading ? <span className="shrink-0">{current.leading}</span> : null}
        <span className="min-w-0 flex-1 truncate text-left">{current.label}</span>
        <ChevronDown
          className={cn('size-4 shrink-0 text-ink-muted transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open && (
        <div
          id={listId}
          role="listbox"
          {...(activeDescendantId ? { 'aria-activedescendant': activeDescendantId } : {})}
          className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-edge bg-surface-0/98 py-1 shadow-lg backdrop-blur-sm"
        >
          {options.map((opt, i) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={opt.value === value}
              id={`${listId}-option-${i}`}
              className={cn(
                'flex w-full items-center gap-2.5 px-2.5 py-2 text-left text-sm font-medium transition',
                opt.value === value ? 'bg-lime/15 text-ink' : 'text-ink-muted hover:bg-surface-1 hover:text-ink',
              )}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
            >
              {opt.leading ? <span className="shrink-0">{opt.leading}</span> : null}
              <span className="truncate">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
