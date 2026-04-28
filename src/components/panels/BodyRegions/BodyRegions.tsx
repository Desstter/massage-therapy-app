import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { loc } from '../../../utils/localize'
import { BODY_REGIONS } from '../../../data/bodyRegions'
import { MUSCLES } from '../../../data/muscles'
import { TECHNIQUES } from '../../../data/techniques'
import { SectionHeader } from '../../shared/SectionHeader'
import { Badge } from '../../shared/Badge'
import { getMuscleById, getTechniqueById } from '../../../utils/filterHelpers'
import type { BodyRegion, Muscle } from '../../../types/anatomy.types'
import type { Technique } from '../../../types/technique.types'
import { cn } from '../../../utils/cn'

function RegionDetail({ region }: { region: BodyRegion }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const muscles = region.muscles
    .map((id) => getMuscleById(MUSCLES, id))
    .filter((m): m is Muscle => m !== undefined)
  const techniques = region.techniques
    .map((id) => getTechniqueById(TECHNIQUES, id))
    .filter((tech): tech is Technique => tech !== undefined)

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="text-xl font-bold text-white mb-1">{loc(region, 'name', lang)}</h2>
      <p className="text-sm text-gray-400 mb-6">{loc(region, 'description', lang)}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Muscles */}
        <div>
          <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">
            {t('regions.muscles')} ({muscles.length})
          </h3>
          <div className="space-y-2">
            {muscles.map((m) => (
              <div key={m.id} className="p-3 bg-bg-secondary rounded-xl border border-bg-border">
                <p className="text-sm font-medium text-white">{loc(m, 'name', lang)}</p>
                <div className="flex gap-1.5 mt-1">
                  <Badge variant="gray" size="sm">{m.layer}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Techniques */}
        <div>
          <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">
            {t('regions.applicable_techniques')} ({techniques.length})
          </h3>
          <div className="space-y-2">
            {techniques.map((tech) => (
              <div key={tech.id} className="p-3 bg-bg-secondary rounded-xl border border-bg-border">
                <p className="text-sm font-medium text-white">{loc(tech, 'name', lang)}</p>
                <Badge variant="blue" size="sm">{tech.pressure} {t('techniques.pressure')}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Draping notes */}
      <div className="mt-6">
        <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">
          {t('regions.draping')}
        </h3>
        <ul className="space-y-2">
          {loc(region, 'drapingNotes', lang).map((note, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-300">
              <span className="text-amber-500 shrink-0 mt-0.5">•</span>{note}
            </li>
          ))}
        </ul>
      </div>

      {/* Common conditions */}
      <div className="mt-6">
        <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">
          {t('regions.conditions')}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {loc(region, 'commonConditions', lang).map((c) => (
            <Badge key={c} variant="purple">{c}</Badge>
          ))}
        </div>
      </div>

      {/* Client positions */}
      <div className="mt-6">
        <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
          {t('regions.positions')}
        </h3>
        <div className="flex gap-2">
          {region.clientPositions.map((p) => (
            <Badge key={p} variant="blue">{p}</Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

export function BodyRegions() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [selected, setSelected] = useState<string>(BODY_REGIONS[0].id)
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list')
  const activeRegion = BODY_REGIONS.find((r) => r.id === selected)
  if (!activeRegion) return null

  return (
    <div className="flex flex-col h-full">
      <SectionHeader
        title={t('regions.title')}
        subtitle={t('regions.subtitle')}
        icon={<MapPin className="w-5 h-5" />}
      />

      {/* Desktop layout */}
      <div className="hidden lg:flex gap-4 flex-1 overflow-hidden">
        <div className="w-52 space-y-1.5 overflow-y-auto">
          {BODY_REGIONS.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelected(region.id)}
              className={cn(
                'w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all',
                selected === region.id
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                  : 'bg-bg-secondary border-bg-border text-gray-300 hover:bg-bg-elevated',
              )}
            >
              {loc(region, 'name', lang)}
              <div className="text-xs text-gray-500 font-normal mt-0.5">
                {region.muscles.length} {t('common.muscles_count')}
              </div>
            </button>
          ))}
        </div>

        <div className="flex-1 bg-bg-secondary rounded-xl border border-bg-border overflow-hidden">
          <RegionDetail region={activeRegion} />
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
          <div className="flex-1 overflow-y-auto space-y-1.5">
            {BODY_REGIONS.map((region) => (
              <button
                key={region.id}
                onClick={() => { setSelected(region.id); setMobileView('detail') }}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all',
                  selected === region.id
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                    : 'bg-bg-secondary border-bg-border text-gray-300 hover:bg-bg-elevated',
                )}
              >
                {loc(region, 'name', lang)}
                <div className="text-xs text-gray-500 font-normal mt-0.5">
                  {region.muscles.length} {t('common.muscles_count')}
                </div>
              </button>
            ))}
          </div>
        )}

        {mobileView === 'detail' && (
          <div className="flex-1 bg-bg-secondary rounded-xl border border-bg-border overflow-hidden">
            <RegionDetail region={activeRegion} />
          </div>
        )}
      </div>
    </div>
  )
}
