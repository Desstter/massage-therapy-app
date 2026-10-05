import { useState } from 'react'
import { Activity, BookOpen, ChevronRight, Info, Route } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FASCIAL_LINES } from '../../../data/fascialLines'
import { FASCIA_PATHWAY_MODELS } from '../../../data/pathwayModels'
import { Badge } from '../../shared/Badge'
import { loc } from '../../../utils/localize'
import { cn } from '../../../utils/cn'
import { ClinicalPathway3D } from './ClinicalPathway3D'

const COLORS = new Map(FASCIAL_LINES.map((line) => [line.id, line.color]))

const EVIDENCE: Record<string, 'strong' | 'partial' | 'conceptual'> = {
  sbl: 'strong', ffl: 'strong', bfl: 'strong', ll: 'partial', spal: 'partial',
  sfl: 'conceptual', afl: 'conceptual', dfl: 'conceptual', sbal: 'conceptual',
  dbal: 'conceptual', ipfl: 'conceptual', dfal: 'conceptual',
}

const evidenceStyle = {
  strong: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
  partial: 'border-amber-400/25 bg-amber-400/10 text-amber-300',
  conceptual: 'border-slate-400/20 bg-slate-400/10 text-slate-300',
}

export function FascialLines() {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const [selected, setSelected] = useState(FASCIAL_LINES[0]?.id ?? '')
  const [hovered, setHovered] = useState<string | null>(null)
  const selectedLine = FASCIAL_LINES.find((line) => line.id === selected) ?? FASCIAL_LINES[0]
  const activeId = hovered ?? selected

  const evidenceLabel = (level: keyof typeof evidenceStyle) => {
    if (lang !== 'es') return level === 'strong' ? 'Strong continuity' : level === 'partial' ? 'Partial continuity' : 'Conceptual model'
    return level === 'strong' ? 'Continuidad sólida' : level === 'partial' ? 'Continuidad parcial' : 'Modelo conceptual'
  }

  return (
    <div className="grid min-h-full gap-4 overflow-y-auto lg:h-full lg:grid-cols-[minmax(0,1fr)_360px] lg:overflow-hidden">
      <ClinicalPathway3D
        pathways={FASCIA_PATHWAY_MODELS}
        colors={COLORS}
        activeId={activeId}
        selectedId={selected}
        onHover={setHovered}
        onSelect={setSelected}
        kind="fascia"
        lang={lang}
      />

      <aside className="flex min-h-[500px] flex-col overflow-hidden rounded-2xl border border-bg-border bg-bg-secondary">
        <div className="border-b border-bg-border p-4">
          <div className="mb-1 flex items-center gap-2">
            <Route className="h-4 w-4 text-cyan-300" />
            <h3 className="text-sm font-semibold text-white">{lang === 'es' ? 'Continuidades miofasciales' : 'Myofascial continuities'}</h3>
            <span className="ml-auto rounded-full bg-cyan-400/10 px-2 py-0.5 font-mono text-[10px] text-cyan-300">{FASCIAL_LINES.length}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-gray-500">
            {lang === 'es' ? 'Atlas educativo tridimensional con nivel de evidencia anatómica.' : 'Three-dimensional educational atlas with anatomical evidence level.'}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {FASCIAL_LINES.map((line) => {
              const evidence = EVIDENCE[line.id] ?? 'conceptual'
              return (
                <button
                  key={line.id}
                  onClick={() => setSelected(line.id)}
                  onMouseEnter={() => setHovered(line.id)}
                  onMouseLeave={() => setHovered(null)}
                  className={cn(
                    'w-full rounded-xl border p-3 text-left transition',
                    selected === line.id ? 'border-cyan-400/35 bg-cyan-400/10' : 'border-transparent hover:border-bg-border hover:bg-bg-elevated/60',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-8 w-1 rounded-full" style={{ backgroundColor: line.color, boxShadow: selected === line.id ? `0 0 12px ${line.color}` : undefined }} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-white">{loc(line, 'name', lang)}</span>
                        <span className="font-mono text-[9px] text-gray-600">{line.alternateName}</span>
                      </div>
                      <span className={cn('mt-1 inline-flex rounded-full border px-1.5 py-0.5 text-[9px]', evidenceStyle[evidence])}>{evidenceLabel(evidence)}</span>
                    </div>
                    <ChevronRight className={cn('h-4 w-4 shrink-0', selected === line.id ? 'text-cyan-300' : 'text-gray-700')} />
                  </div>
                </button>
              )
            })}
          </div>

          {selectedLine && (
            <div className="m-1 mt-3 rounded-xl border border-cyan-400/20 bg-[#0b151f] p-4">
              <h4 className="text-base font-semibold text-white">{loc(selectedLine, 'name', lang)}</h4>
              <p className="mt-1 text-xs leading-relaxed text-gray-400">{loc(selectedLine, 'description', lang)}</p>

              <div className="mt-4">
                <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300"><Activity className="h-3 w-3" />{lang === 'es' ? 'Recorrido anatómico' : 'Anatomical course'}</p>
                <div className="flex flex-wrap gap-1.5">
                  {loc(selectedLine, 'path', lang).map((part) => <Badge key={part} variant="gray" size="sm">{part}</Badge>)}
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-amber-400/15 bg-amber-400/5 p-3">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300">{lang === 'es' ? 'Aplicación clínica' : 'Clinical application'}</p>
                <p className="text-xs leading-relaxed text-gray-300">{loc(selectedLine, 'massageRelevance', lang)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-bg-border p-3">
          <div className="flex gap-2 text-[10px] leading-relaxed text-gray-500">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
            <p>{lang === 'es' ? 'Las “líneas” son un modelo de continuidad fascial, no estructuras aisladas ni diagnósticos. La evidencia varía según la cadena.' : '“Lines” are a model of fascial continuity, not isolated structures or diagnoses. Evidence varies by chain.'}</p>
          </div>
          <a className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-cyan-300" href="https://doi.org/10.1016/j.apmr.2015.07.023" target="_blank" rel="noreferrer"><BookOpen className="h-3 w-3" />{lang === 'es' ? 'Revisión anatómica de la evidencia' : 'Anatomical evidence review'}</a>
        </div>
      </aside>
    </div>
  )
}
