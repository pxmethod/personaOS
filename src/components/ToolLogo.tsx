import { useState } from 'react'
import { cn } from '@/lib/utils'

const SI_CDN = 'https://cdn.simpleicons.org'

export function ToolLogo({
  name,
  iconSlug,
  className,
}: {
  name: string
  iconSlug?: string
  className?: string
}) {
  const [ok, setOk] = useState(true)
  const initial = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  if (!iconSlug || !ok) {
    return (
      <div
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-lg border border-lime/35 bg-surface-1 text-[10px] font-bold text-ink',
          className,
        )}
        aria-hidden
      >
        {initial}
      </div>
    )
  }

  return (
    <img
      src={`${SI_CDN}/${iconSlug}/6b7280`}
      alt=""
      width={36}
      height={36}
      className={cn(
        'size-9 shrink-0 rounded-lg border border-lime/35 bg-zinc-200 p-1.5',
        className,
      )}
      loading="lazy"
      onError={() => setOk(false)}
    />
  )
}
