import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { MAIN_CONTENT_OUTER } from '@/lib/mainContentLayout'
import { cn } from '@/lib/utils'

export function HomePage() {
  const navigate = useNavigate()

  return (
    <div className={cn(MAIN_CONTENT_OUTER, 'space-y-4 pt-6 pb-8 sm:pb-12')}>
      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-4 md:gap-6">
          <img
            src={`${import.meta.env.BASE_URL}geo_shape_home.gif`}
            alt=""
            className="h-12 w-auto shrink-0 object-contain object-center sm:h-48 md:h-64"
          />
          <div className="w-full max-w-lg space-y-4 text-left sm:max-w-xl md:max-w-2xl sm:space-y-2">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
              Start at the problem.
            </h1>
            <p className="mx-auto max-w-prose text-base leading-relaxed text-white sm:text-lg">
              Great products are built by solving meaningful user problems — not by shipping features in isolation.
            </p>
          </div>
        </div>
      </div>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lime sm:text-lg md:text-xl md:leading-[1.15]">
            What is this?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg leading-relaxed text-ink sm:text-lg">
          <p>
            PersonaOS provides a starting point for product teams to explore the behaviors and motivations of the people they build for. Understand their workflows, goals, motivations, and operational challenges to build products that support how organizations actually operate.
          </p>
          <p>
            Use this workspace to better understand who uses your product, how they work, and where the biggest opportunities exist to improve efficiency, collaboration, and customer outcomes.
          </p>
        </CardContent>

        <div className="border-t border-edge" />

        <CardHeader className="pt-6">
          <CardTitle className="text-lime sm:text-lg md:text-xl md:leading-[1.15]">
            Examples for how teams can use PersonaOS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4 text-lg leading-relaxed text-ink sm:text-md">
          <ul className="space-y-4">
            {[
              'Align project teams around real user workflows before kickoff',
              'Identify which personas are most impacted by a proposed feature or workflow change',
              'Compare how different people experience the same product surface',
              'Prioritize roadmap investments based on operational pain points and business impact',
              'Understand where AI, automation, or workflow improvements can reduce friction',
              'Prepare product strategy, leadership reviews, and cross-functional planning discussions',
              'Onboard new product managers, engineers, and designers to customer operations workflows',
              'Discover gaps between customer expectations and internal operational processes',
              'Build a shared language around users, workflows, and organizational needs across teams',
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <Check className="mt-0.5 size-5 shrink-0 text-lime" aria-hidden strokeWidth={2.5} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button onClick={() => navigate('/directory')}>Explore personas</Button>
      </div>
    </div>
  )
}
