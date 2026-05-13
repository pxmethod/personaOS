import { forwardRef, useCallback } from 'react'
import type { HTMLAttributes, MutableRefObject, Ref } from 'react'
import { usePointerHalo, pointerHaloLayerClassName } from '@/hooks/usePointerHalo'
import { cn } from '@/lib/utils'

function assignRef<T>(ref: Ref<T | null> | undefined, node: T | null) {
  if (ref == null) return
  if (typeof ref === 'function') ref(node)
  else (ref as MutableRefObject<T | null>).current = node
}

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Card({ className, children, ...props }, ref) {
    const { surfaceRef, haloStyle, onPointerMove, onPointerLeave } = usePointerHalo<HTMLDivElement>()

    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        surfaceRef.current = node
        assignRef(ref, node)
      },
      [ref, surfaceRef],
    )

    return (
      <div
        ref={mergedRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className={cn(
          'relative overflow-hidden rounded-[var(--radius-card)] border border-edge bg-surface-0/95 backdrop-blur-sm',
          className,
        )}
        {...props}
      >
        <div
          className={pointerHaloLayerClassName}
          style={{ opacity: haloStyle.opacity, background: haloStyle.background }}
          aria-hidden
        />
        <div className="relative z-10 flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    )
  },
)

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1 p-5 pb-0', className)} {...props} />
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-display text-lg font-semibold tracking-tight text-ink', className)}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm leading-relaxed text-ink-muted', className)} {...props} />
  )
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)} {...props} />
}
