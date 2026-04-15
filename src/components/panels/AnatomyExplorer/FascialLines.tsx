import { useState } from 'react'
import { FASCIAL_LINES } from '../../../data/fascialLines'
import { Badge } from '../../shared/Badge'

export function FascialLines() {
  const [selected, setSelected] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  const selectedLine = FASCIAL_LINES.find((l) => l.id === selected)
  const activeId = selected ?? hovered

  return (
    <div className="flex gap-4 h-full">
      {/* SVG visualization */}
      <div className="flex-1 flex items-center justify-center bg-bg-secondary rounded-xl border border-bg-border p-4">
        <svg viewBox="0 0 400 800" className="w-auto h-full" style={{ maxHeight: '640px' }}>
          {/* Body silhouette */}
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
            <ellipse cx="182" cy="758" rx="22" ry="12" />
            <ellipse cx="218" cy="758" rx="22" ry="12" />
          </g>

          {/* All lines, dimmed */}
          {FASCIAL_LINES.map((line) => {
            const isActive = line.id === activeId
            return (
              <path
                key={line.id}
                d={line.svgPathData}
                fill="none"
                stroke={line.color}
                strokeWidth={isActive ? 4 : 1.5}
                strokeOpacity={isActive ? 0.95 : 0.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="cursor-pointer transition-all duration-150"
                onClick={() => setSelected(line.id === selected ? null : line.id)}
                onMouseEnter={() => setHovered(line.id)}
                onMouseLeave={() => setHovered(null)}
              />
            )
          })}
        </svg>
      </div>

      {/* Line list + detail */}
      <div className="w-72 flex flex-col gap-3 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-300">Fascial Lines</h3>
        {FASCIAL_LINES.map((line) => (
          <button
            key={line.id}
            onClick={() => setSelected(line.id === selected ? null : line.id)}
            onMouseEnter={() => setHovered(line.id)}
            onMouseLeave={() => setHovered(null)}
            className={`text-left p-3 rounded-xl border transition-all ${
              selected === line.id
                ? 'border-amber-500/50 bg-amber-500/10'
                : 'border-bg-border bg-bg-secondary hover:bg-bg-elevated'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: line.color }}
              />
              <span className="text-sm font-medium text-white">{line.alternateName}</span>
            </div>
            <p className="text-xs text-gray-400 leading-snug">{line.name}</p>
          </button>
        ))}

        {selectedLine && (
          <div className="mt-2 p-4 bg-bg-secondary rounded-xl border border-amber-500/30">
            <h4 className="text-sm font-bold text-amber-400 mb-2">{selectedLine.name}</h4>
            <p className="text-xs text-gray-300 mb-3">{selectedLine.description}</p>
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1.5">Path</p>
              <div className="flex flex-wrap gap-1">
                {selectedLine.path.map((p) => (
                  <Badge key={p} variant="gray" size="sm">{p}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1.5">Clinical Relevance</p>
              <p className="text-xs text-gray-300 leading-snug">{selectedLine.massageRelevance}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
