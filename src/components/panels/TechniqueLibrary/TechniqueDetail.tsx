import { X, AlertTriangle, BookOpen } from 'lucide-react'
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
  return (
    <div className="flex flex-col h-full bg-bg-secondary border-l border-bg-border overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-bg-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="amber">{technique.category}</Badge>
            {technique.subcategory && (
              <Badge variant="gray">{technique.subcategory}</Badge>
            )}
          </div>
          <h2 className="text-lg font-bold text-white mt-1">{technique.name}</h2>
          <div className="flex gap-2 mt-2">
            <Badge variant={pressureColors[technique.pressure] ?? 'gray'}>
              {technique.pressure} pressure
            </Badge>
            <Badge variant="blue">{technique.rhythm}</Badge>
            <Badge variant="purple">{technique.duration}</Badge>
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
        {/* Hand diagram */}
        <div className="flex justify-center mb-5">
          <HandDiagram animationKey={technique.animationKey} />
        </div>

        <Section title="Description">
          <p className="text-sm text-gray-300 leading-relaxed">{technique.description}</p>
        </Section>

        <Section title="Application Instructions">
          <ol className="space-y-2">
            {technique.detailedInstructions.map((step, i) => (
              <li key={i} className="text-sm text-gray-300 flex gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Direction">
          <p className="text-sm text-gray-300">{technique.direction}</p>
        </Section>

        <Section title="Physiological Effects">
          <div className="grid grid-cols-1 gap-3">
            {technique.effects.physiological.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Physiological</p>
                <BulletList items={technique.effects.physiological} />
              </div>
            )}
            {technique.effects.circulatory.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Circulatory</p>
                <BulletList items={technique.effects.circulatory} />
              </div>
            )}
            {technique.effects.nervous.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Nervous System</p>
                <BulletList items={technique.effects.nervous} />
              </div>
            )}
            {technique.effects.psychological.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Psychological</p>
                <BulletList items={technique.effects.psychological} />
              </div>
            )}
          </div>
        </Section>

        <Section title="Indications">
          <BulletList items={technique.indications} />
        </Section>

        <Section title="Contraindications">
          <ul className="space-y-1">
            {technique.contraindications.map((c, i) => (
              <li key={i} className="text-sm text-red-300 flex gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </ul>
        </Section>

        {technique.variations.length > 0 && (
          <Section title="Variations">
            <div className="flex flex-wrap gap-1.5">
              {technique.variations.map((v) => (
                <Badge key={v} variant="purple">{v}</Badge>
              ))}
            </div>
          </Section>
        )}

        <Section title="Target Tissue">
          <div className="flex flex-wrap gap-1.5">
            {technique.targetTissue.map((t) => (
              <Badge key={t} variant="blue">{t.replace('-', ' ')}</Badge>
            ))}
          </div>
        </Section>

        <div className="mt-4 pt-4 border-t border-bg-border">
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Mosby's Ch.{technique.mosbyChapter}
            {technique.mosbyPageRef && ` · p.${technique.mosbyPageRef}`}
          </p>
        </div>
      </div>
    </div>
  )
}
