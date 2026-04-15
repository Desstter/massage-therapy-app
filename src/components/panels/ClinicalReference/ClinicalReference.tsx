import { useState } from 'react'
import { AlertTriangle, Users, FileText } from 'lucide-react'
import { CONTRAINDICATIONS } from '../../../data/contraindications'
import { SPECIAL_POPULATIONS } from '../../../data/specialPopulations'
import { SectionHeader } from '../../shared/SectionHeader'
import { TabBar } from '../../shared/TabBar'
import { Badge } from '../../shared/Badge'
import type { BadgeVariant } from '../../shared/Badge'
import { cn } from '../../../utils/cn'

type ClinicalTab = 'contraindications' | 'populations' | 'soap'

const TABS = [
  { id: 'contraindications' as ClinicalTab, label: 'Contraindications', icon: <AlertTriangle className="w-4 h-4" /> },
  { id: 'populations' as ClinicalTab, label: 'Special Populations', icon: <Users className="w-4 h-4" /> },
  { id: 'soap' as ClinicalTab, label: 'SOAP Note Guide', icon: <FileText className="w-4 h-4" /> },
]

function ContraindicationTable() {
  const absolute = CONTRAINDICATIONS.filter((c) => c.type === 'absolute')
  const relative = CONTRAINDICATIONS.filter((c) => c.type === 'relative')
  const [expanded, setExpanded] = useState<string | null>(null)

  function ContraindicationRow({ c }: { c: typeof CONTRAINDICATIONS[0] }) {
    const isOpen = expanded === c.id
    const riskColors: Record<string, BadgeVariant> = {
      high: 'red',
      moderate: 'amber',
      low: 'green',
    }
    return (
      <div
        className={cn(
          'border rounded-xl overflow-hidden transition-all',
          c.type === 'absolute' ? 'border-red-500/30' : 'border-amber-500/25',
        )}
      >
        <button
          onClick={() => setExpanded(isOpen ? null : c.id)}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
            c.type === 'absolute' ? 'bg-red-950/30 hover:bg-red-950/50' : 'bg-amber-950/20 hover:bg-amber-950/40',
          )}
        >
          <span className={cn('w-2 h-2 rounded-full shrink-0', c.type === 'absolute' ? 'bg-red-500' : 'bg-amber-500')} />
          <span className="flex-1 text-sm font-medium text-white">{c.condition}</span>
          <Badge variant={riskColors[c.riskLevel]} size="sm">{c.riskLevel} risk</Badge>
          <span className="text-gray-500 text-xs">{isOpen ? '▲' : '▼'}</span>
        </button>
        {isOpen && (
          <div className="px-4 py-3 border-t border-bg-border bg-bg-secondary space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Reasoning</p>
              <p className="text-sm text-gray-300">{c.reasoning}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Exceptions / Modifications</p>
              <ul className="space-y-1">
                {c.exceptionsOrModifications.map((e, i) => (
                  <li key={i} className="text-sm text-gray-300 flex gap-2">
                    <span className="text-amber-400 shrink-0">→</span>{e}
                  </li>
                ))}
              </ul>
            </div>
            {c.affectedTechniques.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Affected Techniques</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.affectedTechniques.map((t) => <Badge key={t} variant="red" size="sm">{t}</Badge>)}
                </div>
              </div>
            )}
            <p className="text-xs text-gray-500">Mosby's Ch.{c.mosbyChapter}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <h3 className="text-sm font-bold text-red-400">Absolute Contraindications ({absolute.length})</h3>
          <span className="text-xs text-gray-500">— DO NOT massage</span>
        </div>
        <div className="space-y-2">
          {absolute.map((c) => <ContraindicationRow key={c.id} c={c} />)}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <h3 className="text-sm font-bold text-amber-400">Relative Contraindications ({relative.length})</h3>
          <span className="text-xs text-gray-500">— Modify session</span>
        </div>
        <div className="space-y-2">
          {relative.map((c) => <ContraindicationRow key={c.id} c={c} />)}
        </div>
      </div>
    </div>
  )
}

function SpecialPopulations() {
  const [selected, setSelected] = useState(SPECIAL_POPULATIONS[0].id)
  const pop = SPECIAL_POPULATIONS.find((p) => p.id === selected)
  if (!pop) return null

  return (
    <div className="flex gap-4 h-full">
      <div className="w-48 space-y-1.5">
        {SPECIAL_POPULATIONS.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p.id)}
            className={cn(
              'w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all',
              selected === p.id
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                : 'bg-bg-secondary border-bg-border text-gray-300 hover:bg-bg-elevated',
            )}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-bg-secondary rounded-xl border border-bg-border overflow-y-auto p-5">
        <h2 className="text-lg font-bold text-white mb-1">{pop.name}</h2>
        <p className="text-sm text-gray-400 mb-5">{pop.description}</p>

        <Section title="Key Considerations">
          <BulletList items={pop.considerations} />
        </Section>

        <Section title="Pressure Guidelines">
          <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl">
            <p className="text-sm text-amber-200">{pop.pressureGuidelines}</p>
          </div>
        </Section>

        <Section title="Recommended Techniques">
          <div className="flex flex-wrap gap-1.5">
            {pop.recommendedTechniques.map((t) => (
              <Badge key={t} variant="green" size="sm">{t}</Badge>
            ))}
          </div>
        </Section>

        <Section title="Techniques to Avoid">
          <div className="flex flex-wrap gap-1.5">
            {pop.techniquesToAvoid.map((t) => (
              <Badge key={t} variant="red" size="sm">{t}</Badge>
            ))}
          </div>
        </Section>

        <Section title="Positioning Notes">
          <BulletList items={pop.positioningNotes} />
        </Section>

        <Section title="Communication Tips">
          <BulletList items={pop.communicationTips} />
        </Section>
      </div>
    </div>
  )
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
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-gray-300 flex gap-2">
          <span className="text-amber-500 shrink-0 mt-0.5">•</span>{item}
        </li>
      ))}
    </ul>
  )
}

const SOAP_SECTIONS = [
  {
    letter: 'S',
    label: 'Subjective',
    color: 'text-blue-400',
    bg: 'bg-blue-950/30 border-blue-500/30',
    description: 'What the client tells you — their words, not yours',
    examples: [
      'Chief complaint: "My neck has been tight for 3 days"',
      'Pain location, quality, intensity (VAS 0–10)',
      'Aggravating and relieving factors',
      'Onset, duration, frequency of symptoms',
      'Medical history, medications, past treatments',
      'Goals for the session',
    ],
    avoid: [
      'Therapist\'s observations (those go in O)',
      'Interpretation or diagnosis',
    ],
  },
  {
    letter: 'O',
    label: 'Objective',
    color: 'text-green-400',
    bg: 'bg-green-950/30 border-green-500/30',
    description: 'What you observe and measure — objective, reproducible findings',
    examples: [
      'Postural deviations (e.g., elevated right shoulder)',
      'ROM measurements (e.g., cervical R rotation 45°)',
      'Tissue texture: hypertonic, fibrotic, atrophied',
      'Temperature: warm/cool areas',
      'Tenderness locations (e.g., TrP left upper trap)',
      'Edema assessment, skin color changes',
    ],
    avoid: [
      'Client\'s reported symptoms (those go in S)',
      'Interpretations (those go in A)',
    ],
  },
  {
    letter: 'A',
    label: 'Assessment',
    color: 'text-amber-400',
    bg: 'bg-amber-950/30 border-amber-500/30',
    description: 'Your clinical interpretation — analysis of S and O findings',
    examples: [
      'Working hypothesis: "Tension headache pattern consistent with TrP in upper trap and suboccipitals"',
      'Tissue response to treatment: "Tissue softened 50% with sustained compression"',
      'Session outcomes vs goals',
      'Changes since last session',
      'Safety considerations identified',
    ],
    avoid: [
      'Medical diagnosis (outside scope of practice)',
      'Repeating S or O verbatim',
    ],
  },
  {
    letter: 'P',
    label: 'Plan',
    color: 'text-purple-400',
    bg: 'bg-purple-950/30 border-purple-500/30',
    description: 'What you will do — treatment plan and recommendations',
    examples: [
      'Techniques used: effleurage, suboccipital release, MET',
      'Regions treated: cervical, upper trap, suboccipitals',
      'Next session focus and timing',
      'Home care recommendations',
      'Referral recommendations if applicable',
      'Reassessment criteria',
    ],
    avoid: [
      'Vague language: "massage neck again next time"',
      'Omitting home care recommendations',
    ],
  },
]

function SOAPGuide() {
  return (
    <div className="space-y-4 max-w-3xl">
      <p className="text-sm text-gray-400 mb-6">
        SOAP notes provide a structured format for documenting client assessments and treatment plans.
        Consistent documentation is essential for clinical tracking, communication with other healthcare providers, and legal protection.
      </p>
      {SOAP_SECTIONS.map((section) => (
        <div key={section.letter} className={cn('rounded-xl border p-5', section.bg)}>
          <div className="flex items-center gap-3 mb-3">
            <div className={cn('text-3xl font-black', section.color)}>{section.letter}</div>
            <div>
              <p className={cn('text-lg font-bold', section.color)}>{section.label}</p>
              <p className="text-xs text-gray-400">{section.description}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Include</p>
              <ul className="space-y-1">
                {section.examples.map((e, i) => (
                  <li key={i} className="text-sm text-gray-300 flex gap-2">
                    <span className="text-green-400 shrink-0">✓</span>{e}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Avoid</p>
              <ul className="space-y-1">
                {section.avoid.map((e, i) => (
                  <li key={i} className="text-sm text-gray-300 flex gap-2">
                    <span className="text-red-400 shrink-0">✗</span>{e}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ClinicalReference() {
  const [tab, setTab] = useState<ClinicalTab>('contraindications')

  return (
    <div className="flex flex-col h-full">
      <SectionHeader
        title="Clinical Reference"
        subtitle="Contraindications, special populations & documentation"
        icon={<AlertTriangle className="w-5 h-5" />}
      />

      <TabBar tabs={TABS} active={tab} onChange={setTab} className="mb-5" />

      <div className="flex-1 overflow-y-auto">
        {tab === 'contraindications' && <ContraindicationTable />}
        {tab === 'populations' && <SpecialPopulations />}
        {tab === 'soap' && <SOAPGuide />}
      </div>
    </div>
  )
}
