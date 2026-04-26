import { useState } from 'react'
import { AlertTriangle, Users, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CONTRAINDICATIONS } from '../../../data/contraindications'
import { SPECIAL_POPULATIONS } from '../../../data/specialPopulations'
import { SectionHeader } from '../../shared/SectionHeader'
import { TabBar } from '../../shared/TabBar'
import { Badge } from '../../shared/Badge'
import type { BadgeVariant } from '../../shared/Badge'
import { cn } from '../../../utils/cn'

type ClinicalTab = 'contraindications' | 'populations' | 'soap'

function ContraindicationTable() {
  const { t } = useTranslation()
  const absolute = CONTRAINDICATIONS.filter((c) => c.type === 'absolute')
  const relative = CONTRAINDICATIONS.filter((c) => c.type === 'relative')
  const [expanded, setExpanded] = useState<string | null>(null)

  function ContraindicationRow({ c }: { c: typeof CONTRAINDICATIONS[0] }) {
    const isOpen = expanded === c.id
    const riskColors: Record<string, BadgeVariant> = { high: 'red', moderate: 'amber', low: 'green' }
    return (
      <div className={cn('border rounded-xl overflow-hidden transition-all', c.type === 'absolute' ? 'border-red-500/30' : 'border-amber-500/25')}>
        <button
          onClick={() => setExpanded(isOpen ? null : c.id)}
          className={cn('w-full flex items-center gap-3 px-4 py-3 text-left transition-colors', c.type === 'absolute' ? 'bg-red-950/30 hover:bg-red-950/50' : 'bg-amber-950/20 hover:bg-amber-950/40')}
        >
          <span className={cn('w-2 h-2 rounded-full shrink-0', c.type === 'absolute' ? 'bg-red-500' : 'bg-amber-500')} />
          <span className="flex-1 text-sm font-medium text-white">{c.condition}</span>
          <Badge variant={riskColors[c.riskLevel]} size="sm">{c.riskLevel} {t('clinical.risk')}</Badge>
          <span className="text-gray-500 text-xs">{isOpen ? '▲' : '▼'}</span>
        </button>
        {isOpen && (
          <div className="px-4 py-3 border-t border-bg-border bg-bg-secondary space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t('clinical.reasoning')}</p>
              <p className="text-sm text-gray-300">{c.reasoning}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t('clinical.exceptions')}</p>
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
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t('clinical.affected_techniques')}</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.affectedTechniques.map((tech) => <Badge key={tech} variant="red" size="sm">{tech}</Badge>)}
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
          <h3 className="text-sm font-bold text-red-400">{t('clinical.absolute', { count: absolute.length })}</h3>
          <span className="text-xs text-gray-500">— {t('clinical.do_not_massage')}</span>
        </div>
        <div className="space-y-2">{absolute.map((c) => <ContraindicationRow key={c.id} c={c} />)}</div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <h3 className="text-sm font-bold text-amber-400">{t('clinical.relative', { count: relative.length })}</h3>
          <span className="text-xs text-gray-500">— {t('clinical.modify_session')}</span>
        </div>
        <div className="space-y-2">{relative.map((c) => <ContraindicationRow key={c.id} c={c} />)}</div>
      </div>
    </div>
  )
}

function SpecialPopulations() {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(SPECIAL_POPULATIONS[0].id)
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list')
  const pop = SPECIAL_POPULATIONS.find((p) => p.id === selected)
  if (!pop) return null

  const SectionBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-5">
      <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">{title}</h3>
      {children}
    </div>
  )

  const BulletList = ({ items }: { items: string[] }) => (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-gray-300 flex gap-2">
          <span className="text-amber-500 shrink-0 mt-0.5">•</span>{item}
        </li>
      ))}
    </ul>
  )

  const detailContent = (
    <div className="flex-1 bg-bg-secondary rounded-xl border border-bg-border overflow-y-auto p-5">
      <h2 className="text-lg font-bold text-white mb-1">{pop.name}</h2>
      <p className="text-sm text-gray-400 mb-5">{pop.description}</p>
      <SectionBlock title={t('clinical.considerations')}><BulletList items={pop.considerations} /></SectionBlock>
      <SectionBlock title={t('clinical.pressure_guidelines')}>
        <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl">
          <p className="text-sm text-amber-200">{pop.pressureGuidelines}</p>
        </div>
      </SectionBlock>
      <SectionBlock title={t('clinical.recommended')}>
        <div className="flex flex-wrap gap-1.5">
          {pop.recommendedTechniques.map((tech) => <Badge key={tech} variant="green" size="sm">{tech}</Badge>)}
        </div>
      </SectionBlock>
      <SectionBlock title={t('clinical.avoid')}>
        <div className="flex flex-wrap gap-1.5">
          {pop.techniquesToAvoid.map((tech) => <Badge key={tech} variant="red" size="sm">{tech}</Badge>)}
        </div>
      </SectionBlock>
      <SectionBlock title={t('clinical.positioning')}><BulletList items={pop.positioningNotes} /></SectionBlock>
      <SectionBlock title={t('clinical.communication')}><BulletList items={pop.communicationTips} /></SectionBlock>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      <div className="hidden lg:flex gap-4 h-full">
        <div className="w-48 space-y-1.5">
          {SPECIAL_POPULATIONS.map((p) => (
            <button key={p.id} onClick={() => setSelected(p.id)} className={cn('w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all', selected === p.id ? 'bg-amber-500/15 border-amber-500/40 text-amber-400' : 'bg-bg-secondary border-bg-border text-gray-300 hover:bg-bg-elevated')}>
              {p.name}
            </button>
          ))}
        </div>
        {detailContent}
      </div>

      <div className="lg:hidden flex-1 flex flex-col overflow-hidden">
        <div className="flex gap-1 mb-3 bg-bg-secondary rounded-xl p-1 border border-bg-border">
          {(['list', 'detail'] as const).map((v) => (
            <button key={v} onClick={() => setMobileView(v)} className={cn('flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-colors', mobileView === v ? 'bg-amber-500/20 text-amber-400' : 'text-gray-500 hover:text-gray-300')}>
              {v === 'list' ? t('common.list') : t('common.detail')}
            </button>
          ))}
        </div>
        {mobileView === 'list' && (
          <div className="flex-1 overflow-y-auto space-y-1.5">
            {SPECIAL_POPULATIONS.map((p) => (
              <button key={p.id} onClick={() => { setSelected(p.id); setMobileView('detail') }} className={cn('w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all', selected === p.id ? 'bg-amber-500/15 border-amber-500/40 text-amber-400' : 'bg-bg-secondary border-bg-border text-gray-300 hover:bg-bg-elevated')}>
                {p.name}
              </button>
            ))}
          </div>
        )}
        {mobileView === 'detail' && detailContent}
      </div>
    </div>
  )
}

function SOAPGuide() {
  const { t } = useTranslation()

  const SOAP_SECTIONS = [
    {
      letter: 'S',
      labelKey: 'clinical.soap_s_label',
      color: 'text-blue-400',
      bg: 'bg-blue-950/30 border-blue-500/30',
      descKey: 'clinical.soap_s_desc',
      examplesKey: 'clinical.soap_s_examples',
      avoidKey: 'clinical.soap_s_avoid',
    },
    {
      letter: 'O',
      labelKey: 'clinical.soap_o_label',
      color: 'text-green-400',
      bg: 'bg-green-950/30 border-green-500/30',
      descKey: 'clinical.soap_o_desc',
      examplesKey: 'clinical.soap_o_examples',
      avoidKey: 'clinical.soap_o_avoid',
    },
    {
      letter: 'A',
      labelKey: 'clinical.soap_a_label',
      color: 'text-amber-400',
      bg: 'bg-amber-950/30 border-amber-500/30',
      descKey: 'clinical.soap_a_desc',
      examplesKey: 'clinical.soap_a_examples',
      avoidKey: 'clinical.soap_a_avoid',
    },
    {
      letter: 'P',
      labelKey: 'clinical.soap_p_label',
      color: 'text-purple-400',
      bg: 'bg-purple-950/30 border-purple-500/30',
      descKey: 'clinical.soap_p_desc',
      examplesKey: 'clinical.soap_p_examples',
      avoidKey: 'clinical.soap_p_avoid',
    },
  ]

  return (
    <div className="space-y-4 max-w-3xl">
      <p className="text-sm text-gray-400 mb-6">{t('clinical.soap_intro')}</p>
      {SOAP_SECTIONS.map((section) => {
        const examples = t(section.examplesKey, { returnObjects: true }) as string[]
        const avoid = t(section.avoidKey, { returnObjects: true }) as string[]
        return (
          <div key={section.letter} className={cn('rounded-xl border p-5', section.bg)}>
            <div className="flex items-center gap-3 mb-3">
              <div className={cn('text-3xl font-black', section.color)}>{section.letter}</div>
              <div>
                <p className={cn('text-lg font-bold', section.color)}>{t(section.labelKey)}</p>
                <p className="text-xs text-gray-400">{t(section.descKey)}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{t('clinical.soap_include')}</p>
                <ul className="space-y-1">
                  {examples.map((e, i) => (
                    <li key={i} className="text-sm text-gray-300 flex gap-2">
                      <span className="text-green-400 shrink-0">✓</span>{e}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{t('clinical.soap_avoid')}</p>
                <ul className="space-y-1">
                  {avoid.map((e, i) => (
                    <li key={i} className="text-sm text-gray-300 flex gap-2">
                      <span className="text-red-400 shrink-0">✗</span>{e}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function ClinicalReference() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<ClinicalTab>('contraindications')

  const TABS = [
    { id: 'contraindications' as ClinicalTab, label: t('clinical.tab_contraindications'), icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'populations' as ClinicalTab, label: t('clinical.tab_populations'), icon: <Users className="w-4 h-4" /> },
    { id: 'soap' as ClinicalTab, label: t('clinical.tab_soap'), icon: <FileText className="w-4 h-4" /> },
  ]

  return (
    <div className="flex flex-col h-full">
      <SectionHeader
        title={t('clinical.title')}
        subtitle={t('clinical.subtitle')}
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
