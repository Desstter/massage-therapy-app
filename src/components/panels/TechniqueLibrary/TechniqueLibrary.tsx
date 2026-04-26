import { useState, useMemo } from 'react'
import { Hand, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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

  const TechniqueList = ({ onSelect }: { onSelect: (t: Technique) => void }) => (
    <div className="flex-1 overflow-y-auto space-y-4 pr-1">
      {filtered.length === 0 ? (
        <EmptyState icon={<Search className="w-8 h-8" />} title={t('techniques.empty_none')} />
      ) : (
        Array.from(grouped.entries()).map(([cat, techniques]) => (
          <div key={cat}>
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 px-1">
              {cat.replace('-', ' ')} ({techniques.length})
            </p>
            <div className="space-y-1.5">
              {techniques.map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => onSelect(tech)}
                  className={cn(
                    'w-full text-left px-3.5 py-3 rounded-xl border transition-all',
                    selected?.id === tech.id
                      ? 'bg-amber-500/15 border-amber-500/40'
                      : 'bg-bg-secondary border-bg-border hover:bg-bg-elevated hover:border-amber-500/30',
                  )}
                >
                  <p className="text-sm font-medium text-white">{tech.name}</p>
                  <div className="flex gap-1.5 mt-1.5">
                    <Badge variant={pressureColors[tech.pressure] ?? 'gray'} size="sm">
                      {tech.pressure}
                    </Badge>
                    <Badge variant="blue" size="sm">{tech.rhythm}</Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )

  const CategoryFilter = () => (
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
          {c === 'all' ? t('techniques.all') : c.replace('-', ' ')}
        </button>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      <SectionHeader
        title={t('techniques.title')}
        subtitle={t('techniques.subtitle')}
        icon={<Hand className="w-5 h-5" />}
      />

      {/* Desktop layout */}
      <div className="hidden lg:flex gap-4 flex-1 overflow-hidden">
        <div className="flex flex-col gap-3 w-80 overflow-hidden">
          <SearchBar value={search} onChange={setSearch} placeholder={t('techniques.search')} />
          <CategoryFilter />
          <TechniqueList onSelect={(tech) => setSelected(selected?.id === tech.id ? null : tech)} />
        </div>

        <div className="flex-1 overflow-hidden rounded-xl border border-bg-border">
          {selected ? (
            <TechniqueDetail technique={selected} onClose={() => setSelected(null)} />
          ) : (
            <EmptyState
              icon={<Hand className="w-10 h-10" />}
              title={t('techniques.empty_select')}
              description={t('techniques.empty_desc')}
            />
          )}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden flex-1 flex flex-col overflow-hidden">
        <div className="flex gap-1 mb-3 bg-bg-secondary rounded-xl p-1 border border-bg-border">
          {(['list', 'detail'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setMobileView(v)}
              className={cn(
                'flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-colors',
                mobileView === v ? 'bg-amber-500/20 text-amber-400' : 'text-gray-500 hover:text-gray-300',
              )}
            >
              {v === 'list' ? t('common.list') : t('common.detail')}
            </button>
          ))}
        </div>

        {mobileView === 'list' && (
          <div className="flex flex-col gap-3 flex-1 overflow-hidden">
            <SearchBar value={search} onChange={setSearch} placeholder={t('techniques.search')} />
            <CategoryFilter />
            <TechniqueList
              onSelect={(tech) => {
                setSelected(selected?.id === tech.id ? null : tech)
                setMobileView('detail')
              }}
            />
          </div>
        )}

        {mobileView === 'detail' && (
          <div className="flex-1 overflow-hidden rounded-xl border border-bg-border flex flex-col">
            {selected ? (
              <TechniqueDetail technique={selected} onClose={() => { setSelected(null); setMobileView('list') }} />
            ) : (
              <EmptyState
                icon={<Hand className="w-10 h-10" />}
                title={t('techniques.empty_select')}
                description={t('techniques.empty_desc_mobile')}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
