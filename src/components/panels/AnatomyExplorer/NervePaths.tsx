import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NERVE_PATHS } from '../../../data/nervePaths'
import { Badge } from '../../shared/Badge'
import { loc } from '../../../utils/localize'

export function NervePaths() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [selected, setSelected] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  const selectedNerve = NERVE_PATHS.find((n) => n.id === selected)
  const activeId = selected ?? hovered

  return (
    <div className="flex gap-4 h-full">
      {/* SVG */}
      <div className="flex-1 flex items-center justify-center bg-bg-secondary rounded-xl border border-bg-border p-4">
        <svg viewBox="0 0 400 800" className="w-auto h-full" style={{ maxHeight: '640px' }}>
          <g opacity="0.06" fill="#94a3b8">
            <ellipse cx="200" cy="115" rx="40" ry="50" />
            <rect x="187" y="155" width="26" height="30" rx="6" />
            <path d="M 155 182 Q 140 200 138 280 Q 140 330 145 380 Q 155 400 175 405 L 225 405 Q 245 400 255 380 Q 260 330 262 280 Q 260 200 245 182 Z" />
            <rect x="118" y="190" width="32" height="175" rx="14" />
            <rect x="250" y="190" width="32" height="175" rx="14" />
            <rect x="114" y="370" width="28" height="145" rx="12" />
            <rect x="258" y="370" width="28" height="145" rx="12" />
            <path d="M 160 405 Q 145 415 148 440 L 252 440 Q 255 415 240 405 Z" />
            <rect x="160" y="430" width="40" height="160" rx="18" />
            <rect x="200" y="430" width="40" height="160" rx="18" />
            <rect x="163" y="595" width="34" height="150" rx="14" />
            <rect x="203" y="595" width="34" height="150" rx="14" />
          </g>

          {NERVE_PATHS.map((nerve) => {
            const isActive = nerve.id === activeId
            return (
              <path
                key={nerve.id}
                d={nerve.svgPathData}
                fill="none"
                stroke={nerve.color}
                strokeWidth={isActive ? 4 : 2}
                strokeOpacity={isActive ? 1 : 0.22}
                strokeLinecap="round"
                strokeDasharray={isActive ? 'none' : '6 4'}
                className="cursor-pointer transition-all duration-150"
                onClick={() => setSelected(nerve.id === selected ? null : nerve.id)}
                onMouseEnter={() => setHovered(nerve.id)}
                onMouseLeave={() => setHovered(null)}
              />
            )
          })}
        </svg>
      </div>

      {/* Nerve list */}
      <div className="w-72 flex flex-col gap-2 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-300">{t('anatomy.peripheral_nerves')}</h3>
        {NERVE_PATHS.map((nerve) => (
          <button
            key={nerve.id}
            onClick={() => setSelected(nerve.id === selected ? null : nerve.id)}
            onMouseEnter={() => setHovered(nerve.id)}
            onMouseLeave={() => setHovered(null)}
            className={`text-left p-3 rounded-xl border transition-all ${
              selected === nerve.id
                ? 'border-amber-500/50 bg-amber-500/10'
                : 'border-bg-border bg-bg-secondary hover:bg-bg-elevated'
            }`}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: nerve.color }} />
              <span className="text-sm font-medium text-white">{loc(nerve, 'name', lang)}</span>
            </div>
            <p className="text-xs text-gray-500">
              {nerve.spinalLevels.join(', ')} · {loc(nerve, 'origin', lang)}
            </p>
          </button>
        ))}

        {selectedNerve && (
          <div className="mt-2 p-4 bg-bg-secondary rounded-xl border border-amber-500/30">
            <h4 className="text-sm font-bold text-amber-400 mb-1">{loc(selectedNerve, 'name', lang)}</h4>
            <p className="text-xs text-gray-400 mb-3">{loc(selectedNerve, 'origin', lang)}</p>

            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t('anatomy.spinal_levels')}</p>
              <div className="flex flex-wrap gap-1">
                {selectedNerve.spinalLevels.map((l) => (
                  <Badge key={l} variant="blue" size="sm">{l}</Badge>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t('anatomy.entrapment_sites')}</p>
              <ul className="space-y-1">
                {loc(selectedNerve, 'commonEntrapmentSites', lang).map((s) => (
                  <li key={s} className="text-xs text-gray-300 flex gap-1.5">
                    <span className="text-red-400 mt-0.5 shrink-0">⚠</span>{s}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t('anatomy.massage_notes')}</p>
              <p className="text-xs text-gray-300 leading-snug">{loc(selectedNerve, 'massageConsiderations', lang)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
