import { useCallback, useEffect, useMemo, useState } from 'react'
import { matchPath, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import {
  Fingerprint,
  GitCompareArrows,
  Home,
  Layers,
  Menu,
  X,
} from 'lucide-react'
import { PersonaDetailSheet } from '@/components/PersonaDetailSheet'
import { ExplorerContext } from '@/context/ExplorerContext'
import { OrganizationSwitcher } from '@/components/layout/OrganizationSwitcher'
import { RoadmapGlobalCard } from '@/components/layout/RoadmapGlobalCard'
import { personas } from '@/data/personas'
import { MAX_COMPARE_SELECTIONS } from '@/lib/compareLimits'
import { filterPersonas } from '@/lib/personaFilters'
import { usePointerHalo, pointerHaloLayerClassName } from '@/hooks/usePointerHalo'
import { ComparePage } from '@/pages/ComparePage'
import { DirectoryPage } from '@/pages/DirectoryPage'
import { HomePage } from '@/pages/HomePage'
import { OverlapPage } from '@/pages/OverlapPage'
import { RoadmapPage } from '@/pages/RoadmapPage'
import { cn } from '@/lib/utils'
import { DEFAULT_ORGANIZATION_ID, type OrganizationId } from '@/lib/organizations'
import type { Department, UsageWeight, WorkflowType } from '@/types/persona'

const UNDERLAY_HOME: Location = {
  pathname: '/',
  search: '',
  hash: '',
  key: 'persona-underlay',
  state: null,
}

const nav = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/directory', label: 'Directory', icon: Layers },
  { to: '/overlap', label: 'Persona overlap', icon: Fingerprint },
  { to: '/compare', label: 'Compare', icon: GitCompareArrows },
]

const SIDEBAR_W = 288

export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileNav, setMobileNav] = useState(false)
  const { surfaceRef, haloStyle, onPointerMove, onPointerLeave } = usePointerHalo<HTMLElement>()

  const background = (location.state as { background?: Location } | null)?.background
  const personaMatch = matchPath({ path: '/persona/:personaId', end: true }, location.pathname)
  const hideChrome = Boolean(personaMatch)

  const routeLocation = useMemo(() => {
    if (background) return background
    if (personaMatch) return UNDERLAY_HOME
    return location
  }, [background, personaMatch, location])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [routeLocation.pathname, routeLocation.search, routeLocation.hash])

  const closePersona = useCallback(() => {
    if (background) {
      navigate(`${background.pathname}${background.search}${background.hash}`, { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }, [background, navigate])

  const [organizationId, setOrganizationId] = useState<OrganizationId>(DEFAULT_ORGANIZATION_ID)
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState<Department | 'all'>('all')
  const [usageWeight, setUsageWeight] = useState<UsageWeight | 'all'>('all')
  const [workflowType, setWorkflowType] = useState<WorkflowType | 'all'>('all')
  const [compareMode, setCompareMode] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>([])

  const filteredPersonas = useMemo(
    () => filterPersonas(personas, { query, department, usageWeight, workflowType }),
    [query, department, usageWeight, workflowType],
  )

  const toggleCompareId = useCallback((id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= MAX_COMPARE_SELECTIONS) return prev
      return [...prev, id]
    })
  }, [])

  const clearCompare = useCallback(() => setCompareIds([]), [])

  const setCompareIdsClamped = useCallback((ids: string[]) => {
    setCompareIds(ids.slice(0, MAX_COMPARE_SELECTIONS))
  }, [])

  const ctx = useMemo(
    () => ({
      organizationId,
      setOrganizationId,
      query,
      setQuery,
      department,
      setDepartment,
      usageWeight,
      setUsageWeight,
      workflowType,
      setWorkflowType,
      filteredPersonas,
      compareMode,
      setCompareMode,
      compareIds,
      setCompareIds: setCompareIdsClamped,
      toggleCompareId,
      clearCompare,
    }),
    [
      organizationId,
      query,
      department,
      usageWeight,
      workflowType,
      filteredPersonas,
      compareMode,
      compareIds,
      setCompareIdsClamped,
      toggleCompareId,
      clearCompare,
    ],
  )

  return (
    <ExplorerContext.Provider value={ctx}>
      <div className="min-h-dvh bg-canvas">
        <div
          style={{ width: SIDEBAR_W }}
          className={cn(
            'fixed left-5 top-5 z-40 flex min-h-0 max-w-[min(288px,calc(100vw-2.5rem))] flex-col gap-[10px]',
            'max-h-[calc(100dvh-5rem)]',
            mobileNav ? 'translate-x-0' : '-translate-x-[calc(100%+20px)] lg:translate-x-0',
            'transition-transform duration-200 ease-out',
            hideChrome && 'hidden',
          )}
        >
          <aside
            ref={surfaceRef}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            className={cn(
              'flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-card)] border border-edge',
              'bg-surface-1/95 backdrop-blur-sm',
            )}
          >
            <div
              className={pointerHaloLayerClassName}
              style={{ opacity: haloStyle.opacity, background: haloStyle.background }}
              aria-hidden
            />
            <div className="relative z-10 flex min-h-0 flex-1 flex-col">
              <div className="flex shrink-0 items-center justify-between gap-2 border-b border-edge px-4 py-4">
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <img
                    src={`${import.meta.env.BASE_URL}dodecahedron.gif`}
                    alt=""
                    className="h-9 w-auto shrink-0 object-contain object-left sm:h-10"
                    decoding="async"
                  />
                  <div className="min-w-0">
                    <p className="font-display text-xl font-semibold tracking-tight text-lime">
                      PersonaOS
                    </p>
                    <p className="text-xs leading-snug text-ink-muted">
                      Persona-based intelligence for product builders
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-xl p-2 text-ink-muted hover:bg-surface-1 hover:text-ink lg:hidden"
                  onClick={() => setMobileNav(false)}
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="border-b border-edge px-4 py-3">
                <OrganizationSwitcher value={organizationId} onChange={setOrganizationId} />
              </div>

              <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden p-3 pb-4">
                {nav.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    onClick={() => setMobileNav(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition',
                        isActive
                          ? 'bg-lime text-canvas shadow-sm'
                          : 'text-ink hover:bg-surface-1 hover:text-ink',
                      )
                    }
                  >
                    <Icon className="size-4 shrink-0 opacity-90" aria-hidden />
                    {label}
                    {to === '/compare' && compareIds.length > 0 && (
                      <span className="ml-auto rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold text-inherit">
                        {compareIds.length}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>

          <RoadmapGlobalCard onNavigate={() => setMobileNav(false)} />
        </div>

        {mobileNav && !hideChrome && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-canvas/70 backdrop-blur-sm lg:hidden"
            aria-label="Close overlay"
            onClick={() => setMobileNav(false)}
          />
        )}

        <div className="relative flex min-w-0 flex-col lg:pl-[328px]">
          <button
            type="button"
            className={cn(
              'fixed left-3 top-3 z-30 flex size-10 items-center justify-center rounded-xl border border-lime bg-surface-1 text-lime shadow-lg backdrop-blur-sm hover:bg-surface-2 lg:hidden',
              hideChrome && 'hidden',
            )}
            onClick={() => setMobileNav(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <main className="flex-1 bg-canvas max-lg:pt-12">
            <Routes location={routeLocation}>
              <Route index element={<HomePage />} />
              <Route path="directory" element={<DirectoryPage />} />
              <Route path="compare" element={<ComparePage />} />
              <Route path="overlap" element={<OverlapPage />} />
              <Route path="roadmap" element={<RoadmapPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        {hideChrome && (
          <div
            className="fixed inset-0 z-[90] bg-black/45"
            aria-hidden
          />
        )}

        {personaMatch?.params.personaId && (
          <PersonaDetailSheet
            key={personaMatch.params.personaId}
            personaId={personaMatch.params.personaId}
            onClose={closePersona}
          />
        )}
      </div>
    </ExplorerContext.Provider>
  )
}
