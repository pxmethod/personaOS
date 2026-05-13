import { useState } from 'react'
import { cn } from '@/lib/utils'
import { personaHumanAvatarUrl } from '@/lib/personaAvatars'

export function PersonaAvatar({
  personaId,
  name,
  className,
  size = 'lg',
}: {
  personaId: string
  name: string
  className?: string
  /** `lg` = 80px on cards; `xl` = 120px on detail header */
  size?: 'lg' | 'xl'
}) {
  const [failed, setFailed] = useState(false)
  const src = personaHumanAvatarUrl(personaId)
  const initial = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const dim = size === 'xl' ? 'size-[120px] text-2xl' : 'size-20 text-base'

  if (failed) {
    return (
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full font-bold text-lime',
          dim,
          className,
        )}
        role="img"
        aria-label={`Placeholder avatar for ${name}`}
      >
        {initial || '?'}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={`Avatar for ${name}`}
      width={size === 'xl' ? 120 : 80}
      height={size === 'xl' ? 120 : 80}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={cn(
        'shrink-0 rounded-full object-cover',
        dim,
        className,
      )}
      onError={() => setFailed(true)}
    />
  )
}
