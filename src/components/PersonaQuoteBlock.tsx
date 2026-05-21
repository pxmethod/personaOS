import { cn } from '@/lib/utils'

/** Mindset quote for persona detail and compare column headers (not directory cards). */
export function PersonaQuoteBlock({ quote, className }: { quote: string; className?: string }) {
  return (
    <figure className={cn('m-0 w-full min-w-0 pb-5', className)}>
      <blockquote className="m-0 w-full border-l-2 border-lime/55 pl-4 text-base italic leading-relaxed text-lime sm:text-[1.05rem]">
        <span aria-hidden>“</span>
        <span>{quote}</span>
        <span aria-hidden>”</span>
      </blockquote>
    </figure>
  )
}
