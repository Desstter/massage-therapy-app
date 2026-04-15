import { useMemo } from 'react'
import { MUSCLES } from '../../../data/muscles'
import { useAnatomyStore } from '../../../store/anatomyStore'
import { filterMuscles } from '../../../utils/filterHelpers'
import { SearchBar } from '../../shared/SearchBar'
import { Badge } from '../../shared/Badge'
import { EmptyState } from '../../shared/EmptyState'
import { Search } from 'lucide-react'
import { cn } from '../../../utils/cn'

const regionOptions = [
  'all', 'back', 'shoulder', 'chest', 'neck', 'arm', 'forearm', 'hip-glutes', 'thigh', 'leg',
] as const

export function MuscleList() {
  const { filters, setFilters, selectedMuscleId, selectMuscle } = useAnatomyStore()

  const filtered = useMemo(
    () => filterMuscles(MUSCLES, filters),
    [filters],
  )

  return (
    <div className="flex flex-col gap-3 h-full">
      <SearchBar
        value={filters.search}
        onChange={(v) => setFilters({ search: v })}
        placeholder="Search muscles…"
      />

      {/* Region filter pills */}
      <div className="flex flex-wrap gap-1.5">
        {regionOptions.map((r) => (
          <button
            key={r}
            onClick={() => setFilters({ region: r })}
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
              filters.region === r
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'border-bg-border text-gray-500 hover:text-gray-300',
            )}
          >
            {r === 'all' ? 'All regions' : r.replace('-', ' ')}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500">{filtered.length} muscles</p>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Search className="w-8 h-8" />}
            title="No muscles found"
            description="Try adjusting your search or filter"
          />
        ) : (
          filtered.map((m) => (
            <button
              key={m.id}
              onClick={() => selectMuscle(selectedMuscleId === m.id ? null : m.id)}
              className={cn(
                'w-full text-left px-3.5 py-3.5 rounded-xl border transition-all',
                selectedMuscleId === m.id
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                  : 'bg-bg-secondary border-bg-border text-gray-300 hover:bg-bg-elevated hover:border-amber-500/30',
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-base font-medium leading-snug">{m.name}</p>
                  {m.latinName && (
                    <p className="text-sm text-gray-500 italic mt-0.5">{m.latinName}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 justify-end shrink-0">
                  <Badge variant="gray" size="sm">{m.region.replace('-', ' ')}</Badge>
                  <Badge variant="blue" size="sm">{m.layer}</Badge>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
