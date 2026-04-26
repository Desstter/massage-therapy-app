import { useState, useMemo } from 'react'
import { Hand, Search } from 'lucide-react'
import { TECHNIQUES } from '../../../data/techniques'
import { filterTechniques } from '../../../utils/filterHelpers'
import { SectionHeader } from '../../shared/SectionHeader'
import { SearchBar } from '../../shared/SearchBar'
import { Badge } from '../../shared/Badge'
import { EmptyState } from '../../shared/EmptyState'
import { TechniqueDetail } from './TechniqueDetail'
import type { Technique } from '../../../types/technique.types'
import { cn } from '../../../utils/cn'

const CATEGORIES = [
  'all', 'effleurage', 'petrissage', 'friction', 'tapotement',
  'vibration', 'compression', 'range-of-motion', 'stretching',
] as const

const pressureColors: Record<string, 'green' | 'amber' | 'orange' | 'red' | 'gray'> = {
  superficial: 'green',
  light: 'green',
  moderate: 'amber',
  deep: 'red',
  variable: 'gray',
}

export function TechniqueLibrary() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [selected, setSelected] = useState<Technique | null>(null)
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list')

  const filtered = useMemo(
    () => filterTechniques(TECHNIQUES, search, category),
    [search, category],
  )

  const grouped = useMemo(() => {
    const map = new Map<string, Technique[]>()
    for (const t of filtered) {
      const key = t.category
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(t)
    }
    return map
  }, [filtered])

  return (
    <div className="flex flex-col h-full">
      <SectionHeader
        title="Technique Library"
        subtitle="All 8 massage technique categories with full clinical detail"
        icon={<Hand className="w-5 h-5" />}
      />

      {/* ── Desktop layout (lg+): two-column ── */}
      <div className="hidden lg:flex gap-4 flex-1 overflow-hidden">
        {/* Left: search + list */}
        <div className="flex flex-col gap-3 w-80 overflow-hidden">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search techniques…"
          />

          {/* Category filter */}
          <div className="flex flex-wrap gap-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
                  category === c
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'border-bg-border text-gray-500 hover:text-gray-300',
                )}
              >
                {c === 'all' ? 'All' : c.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {filtered.length === 0 ? (
              <EmptyState
                icon={<Search className="w-8 h-8" />}
                title="No techniques found"
              />
            ) : (
              Array.from(grouped.entries()).map(([cat, techniques]) => (
                <div key={cat}>
                  <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 px-1">
                    {cat.replace('-', ' ')} ({techniques.length})
                  </p>
                  <div className="space-y-1.5">
                    {techniques.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelected(selected?.id === t.id ? null : t)}
                        className={cn(
                          'w-full text-left px-3.5 py-3 rounded-xl border transition-all',
                          selected?.id === t.id
                            ? 'bg-amber-500/15 border-amber-500/40'
                            : 'bg-bg-secondary border-bg-border hover:bg-bg-elevated hover:border-amber-500/30',
                        )}
                      >
                        <p className="text-sm font-medium text-white">{t.name}</p>
                        <div className="flex gap-1.5 mt-1.5">
                          <Badge variant={pressureColors[t.pressure] ?? 'gray'} size="sm">
                            {t.pressure}
                          </Badge>
                          <Badge variant="blue" size="sm">{t.rhythm}</Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: detail or empty state */}
        <div className="flex-1 overflow-hidden rounded-xl border border-bg-border">
          {selected ? (
            <TechniqueDetail
              technique={selected}
              onClose={() => setSelected(null)}
            />
          ) : (
            <EmptyState
              icon={<Hand className="w-10 h-10" />}
              title="Select a technique"
              description="Click any technique to see full clinical detail, hand positions, and effects"
            />
          )}
        </div>
      </div>

      {/* ── Mobile layout (<lg): single-pane with view switcher ── */}
      <div className="lg:hidden flex-1 flex flex-col overflow-hidden">
        {/* View switcher */}
        <div className="flex gap-1 mb-3 bg-bg-secondary rounded-xl p-1 border border-bg-border">
          {(['list', 'detail'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setMobileView(v)}
              className={cn(
                'flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-colors',
                mobileView === v
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'text-gray-500 hover:text-gray-300',
              )}
            >
              {v}
            </button>
          ))}
        </div>

        {/* List pane */}
        {mobileView === 'list' && (
          <div className="flex flex-col gap-3 flex-1 overflow-hidden">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search techniques…"
            />
            <div className="flex flex-wrap gap-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
                    category === c
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'border-bg-border text-gray-500 hover:text-gray-300',
                  )}
                >
                  {c === 'all' ? 'All' : c.replace('-', ' ')}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {filtered.length === 0 ? (
                <EmptyState
                  icon={<Search className="w-8 h-8" />}
                  title="No techniques found"
                />
              ) : (
                Array.from(grouped.entries()).map(([cat, techniques]) => (
                  <div key={cat}>
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 px-1">
                      {cat.replace('-', ' ')} ({techniques.length})
                    </p>
                    <div className="space-y-1.5">
                      {techniques.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => { setSelected(selected?.id === t.id ? null : t); setMobileView('detail') }}
                          className={cn(
                            'w-full text-left px-3.5 py-3 rounded-xl border transition-all',
                            selected?.id === t.id
                              ? 'bg-amber-500/15 border-amber-500/40'
                              : 'bg-bg-secondary border-bg-border hover:bg-bg-elevated hover:border-amber-500/30',
                          )}
                        >
                          <p className="text-sm font-medium text-white">{t.name}</p>
                          <div className="flex gap-1.5 mt-1.5">
                            <Badge variant={pressureColors[t.pressure] ?? 'gray'} size="sm">
                              {t.pressure}
                            </Badge>
                            <Badge variant="blue" size="sm">{t.rhythm}</Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Detail pane */}
        {mobileView === 'detail' && (
          <div className="flex-1 overflow-hidden rounded-xl border border-bg-border flex flex-col">
            {selected ? (
              <TechniqueDetail
                technique={selected}
                onClose={() => { setSelected(null); setMobileView('list') }}
              />
            ) : (
              <EmptyState
                icon={<Hand className="w-10 h-10" />}
                title="Select a technique"
                description="Tap a technique from the List to see full clinical detail"
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
