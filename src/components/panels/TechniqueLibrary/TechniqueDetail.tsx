import { X, AlertTriangle, BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { loc } from '../../../utils/localize'
import type { Technique } from '../../../types/technique.types'
import { Badge } from '../../shared/Badge'
import { HandDiagram } from './HandDiagram'

interface TechniqueDetailProps {
  technique: Technique
  onClose: () => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">{title}</h3>
      {children}
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-gray-300 flex gap-2">
          <span className="text-amber-500 shrink-0 mt-1">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

const pressureColors: Record<string, 'green' | 'amber' | 'orange' | 'red' | 'gray'> = {
  superficial: 'green',
  light: 'green',
  moderate: 'amber',
  deep: 'red',
  variable: 'gray',
}

export function TechniqueDetail({ technique, onClose }: TechniqueDetailProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  return (
    <div className="flex flex-col h-full bg-bg-secondary border-l border-bg-border overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-bg-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="amber">{technique.category}</Badge>
            {technique.subcategory && <Badge variant="gray">{loc(technique, 'subcategory', lang)}</Badge>}
          </div>
          <h2 className="text-lg font-bold text-white mt-1">{loc(technique, 'name', lang)}</h2>
          <div className="flex gap-2 mt-2">
            <Badge variant={pressureColors[technique.pressure] ?? 'gray'}>
              {technique.pressure} {t('techniques.pressure')}
            </Badge>
            <Badge variant="blue">{technique.rhythm}</Badge>
            <Badge variant="purple">{loc(technique, 'duration', lang)}</Badge>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-bg-elevated"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex justify-center mb-5">
          <HandDiagram animationKey={technique.animationKey} />
        </div>

        <Section title={t('techniques.description')}>
          <p className="text-sm text-gray-300 leading-relaxed">{loc(technique, 'description', lang)}</p>
        </Section>

        <Section title={t('techniques.instructions')}>
          <ol className="space-y-2">
            {loc(technique, 'detailedInstructions', lang).map((step, i) => (
              <li key={i} className="text-sm text-gray-300 flex gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section title={t('techniques.direction')}>
          <p className="text-sm text-gray-300">{loc(technique, 'direction', lang)}</p>
        </Section>

        <Section title={t('techniques.physiological_effects')}>
          <div className="grid grid-cols-1 gap-3">
            {loc(technique.effects, 'physiological', lang).length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1">{t('techniques.physiological_effects')}</p>
                <BulletList items={loc(technique.effects, 'physiological', lang)} />
              </div>
            )}
            {loc(technique.effects, 'circulatory', lang).length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1">{t('techniques.circulatory')}</p>
                <BulletList items={loc(technique.effects, 'circulatory', lang)} />
              </div>
            )}
            {loc(technique.effects, 'nervous', lang).length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1">{t('techniques.nervous')}</p>
                <BulletList items={loc(technique.effects, 'nervous', lang)} />
              </div>
            )}
            {loc(technique.effects, 'psychological', lang).length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1">{t('techniques.psychological')}</p>
                <BulletList items={loc(technique.effects, 'psychological', lang)} />
              </div>
            )}
          </div>
        </Section>

        <Section title={t('techniques.indications')}>
          <BulletList items={loc(technique, 'indications', lang)} />
        </Section>

        <Section title={t('techniques.contraindications')}>
          <ul className="space-y-1">
            {loc(technique, 'contraindications', lang).map((c, i) => (
              <li key={i} className="text-sm text-red-300 flex gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </ul>
        </Section>

        {loc(technique, 'variations', lang).length > 0 && (
          <Section title={t('techniques.variations')}>
            <div className="flex flex-wrap gap-1.5">
              {loc(technique, 'variations', lang).map((v) => (
                <Badge key={v} variant="purple">{v}</Badge>
              ))}
            </div>
          </Section>
        )}

        <Section title={t('techniques.target_tissue')}>
          <div className="flex flex-wrap gap-1.5">
            {technique.targetTissue.map((tis) => (
              <Badge key={tis} variant="blue">{tis.replace('-', ' ')}</Badge>
            ))}
          </div>
        </Section>

        <div className="mt-4 pt-4 border-t border-bg-border">
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {t('techniques.mosby')}{technique.mosbyChapter}
            {technique.mosbyPageRef && ` · p.${technique.mosbyPageRef}`}
          </p>
        </div>
      </div>
    </div>
  )
}
