import { X, BookOpen, AlertTriangle, Target } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { loc } from '../../../utils/localize'
import { getMuscleById } from '../../../utils/filterHelpers'
import { MUSCLES } from '../../../data/muscles'
import { useAnatomyStore } from '../../../store/anatomyStore'
import { Badge } from '../../shared/Badge'

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-1.5 mb-2">
        {icon && <span className="text-amber-400">{icon}</span>}
        <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-gray-300">
          <span className="text-amber-500 mt-1 shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function MuscleDetail() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { selectedMuscleId, closeDetailPanel } = useAnatomyStore()
  const muscle = selectedMuscleId ? getMuscleById(MUSCLES, selectedMuscleId) : null

  if (!muscle) return null

  return (
    <div className="flex flex-col h-full bg-bg-secondary border-l border-bg-border">
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b border-bg-border">
        <div>
          <h2 className="font-display text-2xl font-semibold text-white leading-tight">{loc(muscle, 'name', lang)}</h2>
          {muscle.latinName && (
            <p className="font-display text-base italic text-gray-400 mt-1">{muscle.latinName}</p>
          )}
          <div className="flex gap-2 mt-3">
            <Badge variant="amber">{muscle.region.replace('-', ' ')}</Badge>
            <Badge variant="blue">{muscle.layer}</Badge>
          </div>
        </div>
        <button
          onClick={closeDetailPanel}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-bg-elevated transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Section title={t('anatomy.origin')}>
          <List items={loc(muscle, 'origin', lang)} />
        </Section>

        <Section title={t('anatomy.insertion')}>
          <List items={loc(muscle, 'insertion', lang)} />
        </Section>

        <Section title={t('anatomy.actions')}>
          <List items={loc(muscle, 'action', lang)} />
        </Section>

        <Section title={t('anatomy.innervation')}>
          <p className="text-sm text-gray-300">{loc(muscle, 'innervation', lang)}</p>
        </Section>

        <Section title={t('anatomy.blood_supply')}>
          <p className="text-sm text-gray-300">{loc(muscle, 'bloodSupply', lang)}</p>
        </Section>

        <Section title={t('anatomy.palpation_tips')} icon={<Target className="w-3.5 h-3.5" />}>
          <List items={loc(muscle, 'palpationTips', lang)} />
        </Section>

        <Section title={t('anatomy.massage_considerations')} icon={<BookOpen className="w-3.5 h-3.5" />}>
          <List items={loc(muscle, 'massageConsiderations', lang)} />
        </Section>

        {loc(muscle, 'contraindications', lang).length > 0 && (
          <Section title={t('anatomy.contraindications')} icon={<AlertTriangle className="w-3.5 h-3.5" />}>
            <List items={loc(muscle, 'contraindications', lang)} />
          </Section>
        )}

        <Section title={t('anatomy.common_conditions')}>
          <div className="flex flex-wrap gap-1.5">
            {loc(muscle, 'commonConditions', lang).map((c) => (
              <Badge key={c} variant="purple">{c}</Badge>
            ))}
          </div>
        </Section>

        <div className="mt-4 pt-4 border-t border-bg-border">
          <p className="text-xs text-gray-500">
            {t('anatomy.mosby_ref')} {muscle.mosbyCrossRef[0]} — p.{muscle.mosbyCrossRef[1]}
          </p>
        </div>
      </div>
    </div>
  )
}
