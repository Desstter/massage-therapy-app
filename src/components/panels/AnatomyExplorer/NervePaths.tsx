import { useState } from 'react'
import { AlertTriangle, BookOpen, ChevronRight, Info, Radio } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NERVE_PATHS } from '../../../data/nervePaths'
import { NERVE_PATHWAY_MODELS } from '../../../data/pathwayModels'
import { Badge } from '../../shared/Badge'
import { loc } from '../../../utils/localize'
import { cn } from '../../../utils/cn'
import { ClinicalPathway3D } from './ClinicalPathway3D'

const COLORS = new Map(NERVE_PATHS.map((nerve) => [nerve.id, nerve.color]))

export function NervePaths() {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const [selected, setSelected] = useState(NERVE_PATHS[0]?.id ?? '')
  const [hovered, setHovered] = useState<string | null>(null)
  const selectedNerve = NERVE_PATHS.find((nerve) => nerve.id === selected) ?? NERVE_PATHS[0]
  const activeId = hovered ?? selected

  return (
    <div className="grid min-h-full gap-4 overflow-y-auto lg:h-full lg:grid-cols-[minmax(0,1fr)_380px] lg:overflow-hidden">
      <ClinicalPathway3D
        pathways={NERVE_PATHWAY_MODELS}
        colors={COLORS}
        activeId={activeId}
        selectedId={selected}
        onHover={setHovered}
        onSelect={setSelected}
        kind="nerve"
        lang={lang}
      />

      <aside className="flex min-h-[500px] flex-col overflow-hidden rounded-2xl border border-bg-border bg-bg-secondary">
        <div className="border-b border-bg-border p-4">
          <div className="mb-1 flex items-center gap-2">
            <Radio className="h-4 w-4 text-violet-300" />
            <h3 className="text-sm font-semibold text-white">{lang === 'es' ? 'Neuroanatomía periférica' : 'Peripheral neuroanatomy'}</h3>
            <span className="ml-auto rounded-full bg-violet-400/10 px-2 py-0.5 font-mono text-[10px] text-violet-300">{NERVE_PATHS.length}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-gray-500">
            {lang === 'es' ? 'Trayectos, raíces espinales y zonas frecuentes de compresión.' : 'Courses, spinal roots, and common compression zones.'}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {NERVE_PATHS.map((nerve) => (
              <button
                key={nerve.id}
                onClick={() => setSelected(nerve.id)}
                onMouseEnter={() => setHovered(nerve.id)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  'w-full rounded-xl border p-3 text-left transition',
                  selected === nerve.id ? 'border-violet-400/35 bg-violet-400/10' : 'border-transparent hover:border-bg-border hover:bg-bg-elevated/60',
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-black/20">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: nerve.color, boxShadow: selected === nerve.id ? `0 0 12px ${nerve.color}` : undefined }} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{loc(nerve, 'name', lang)}</p>
                    <p className="mt-0.5 truncate text-[10px] text-gray-500">{loc(nerve, 'origin', lang)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {nerve.spinalLevels.slice(0, 3).map((level) => <span key={level} className="font-mono text-[9px] text-violet-300/70">{level}</span>)}
                    <ChevronRight className={cn('ml-1 h-4 w-4', selected === nerve.id ? 'text-violet-300' : 'text-gray-700')} />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {selectedNerve && (
            <div className="m-1 mt-3 rounded-xl border border-violet-400/20 bg-[#101321] p-4">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: selectedNerve.color, boxShadow: `0 0 12px ${selectedNerve.color}` }} />
                <div>
                  <h4 className="text-base font-semibold text-white">{loc(selectedNerve, 'name', lang)}</h4>
                  <p className="text-xs text-gray-500">{loc(selectedNerve, 'origin', lang)}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-white/5 bg-white/[.02] p-3">
                  <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-violet-300">{lang === 'es' ? 'Raíces' : 'Roots'}</p>
                  <div className="flex flex-wrap gap-1">{selectedNerve.spinalLevels.map((level) => <Badge key={level} variant="purple" size="sm">{level}</Badge>)}</div>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/[.02] p-3">
                  <p className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-violet-300">{lang === 'es' ? 'Distribución' : 'Distribution'}</p>
                  <p className="line-clamp-3 text-[10px] leading-relaxed text-gray-400">{loc(selectedNerve, 'distribution', lang).join(' · ')}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-rose-300"><AlertTriangle className="h-3 w-3" />{lang === 'es' ? 'Zonas de posible compresión' : 'Possible compression zones'}</p>
                <div className="space-y-1.5">
                  {loc(selectedNerve, 'commonEntrapmentSites', lang).map((site) => (
                    <div key={site} className="flex gap-2 rounded-lg border border-rose-400/10 bg-rose-400/5 px-2.5 py-2 text-[11px] leading-snug text-gray-300">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />{site}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-amber-400/15 bg-amber-400/5 p-3">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300">{lang === 'es' ? 'Seguridad manual' : 'Manual safety'}</p>
                <p className="text-xs leading-relaxed text-gray-300">{loc(selectedNerve, 'massageConsiderations', lang)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-bg-border p-3">
          <div className="flex gap-2 text-[10px] leading-relaxed text-gray-500">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400" />
            <p>{lang === 'es' ? 'Las rutas son esquemáticas y educativas. Dolor irradiado, debilidad, pérdida sensitiva o pie caído requieren evaluación sanitaria.' : 'Routes are schematic and educational. Radiating pain, weakness, sensory loss, or foot drop require clinical evaluation.'}</p>
          </div>
          <a className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-violet-300" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3483739/" target="_blank" rel="noreferrer"><BookOpen className="h-3 w-3" />{lang === 'es' ? 'Referencia anatómica revisada' : 'Reviewed anatomy reference'}</a>
        </div>
      </aside>
    </div>
  )
}
