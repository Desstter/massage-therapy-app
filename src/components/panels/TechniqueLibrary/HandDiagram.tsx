import { useState } from 'react'
import { Gauge, Pause, Play, Repeat2 } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { loc } from '../../../utils/localize'
import type { HandShape, Technique } from '../../../types/technique.types'

interface HandDiagramProps {
  technique: Technique
  lang: string
  className?: string
}

const ANIMATION_CLASSES: Record<string, string> = {
  effleurage: 'animate-hand-effleurage',
  petrissage: 'animate-hand-petrissage',
  friction: 'animate-hand-friction',
  tapotement: 'animate-hand-tapotement',
  vibration: 'animate-hand-vibration',
  compression: 'animate-hand-compression',
  stretching: 'animate-hand-stretching',
  rom: 'animate-hand-stretching',
}

const PRESSURE_DEPTH: Record<string, number> = {
  superficial: 18,
  light: 32,
  moderate: 58,
  deep: 84,
  variable: 50,
}

function HandContact({ shape }: { shape: HandShape }) {
  if (shape === 'forearm') {
    return <g><rect x="82" y="18" width="96" height="30" rx="15" fill="url(#skinGradient)" /><ellipse cx="80" cy="34" rx="20" ry="17" fill="#d99a78" /></g>
  }
  if (shape === 'fist' || shape === 'knuckles') {
    return <g><rect x="94" y="12" width="74" height="45" rx="20" fill="url(#skinGradient)" /><path d="M102 48h56" stroke="#a96550" strokeWidth="3" strokeLinecap="round" /><path d="M112 17v25M128 14v28M144 15v27" stroke="#b8735d" strokeWidth="2" /></g>
  }
  if (shape === 'thumb' || shape === 'braced-thumb') {
    return <g><path d="M112 7c22 0 40 13 42 31l-3 18h-54l-8-15 11-15z" fill="url(#skinGradient)" /><rect x="119" y="43" width="18" height="31" rx="9" fill="#e8aa84" />{shape === 'braced-thumb' && <path d="M82 24q36 4 48 28" fill="none" stroke="#efb08d" strokeWidth="16" strokeLinecap="round" />}</g>
  }
  if (shape === 'fingertips' || shape === 'pincer') {
    return <g><path d="M90 8q40-12 80 4l-8 31H98z" fill="url(#skinGradient)" />{[104, 122, 140, 158].map((x, index) => <rect key={x} x={x} y={34 + Math.abs(index - 1.5) * 2} width="12" height={shape === 'pincer' ? 34 : 26} rx="6" fill="#e5a17d" />)}{shape === 'pincer' && <path d="M91 37q-20 18 6 34" fill="none" stroke="#dc9877" strokeWidth="12" strokeLinecap="round" />}</g>
  }
  if (shape === 'cupped') {
    return <g><path d="M78 45q48-55 104 0l-14 11q-40-28-77 0z" fill="url(#skinGradient)" /><path d="M95 48q35-25 70 0" fill="none" stroke="#7f4b3f" strokeWidth="3" strokeDasharray="4 4" /></g>
  }
  return <g><path d="M73 24q45-24 99-2l14 24q-47 19-107 5z" fill="url(#skinGradient)" /><path d="M85 25l-8-17M104 20l-4-18M124 18l2-18M144 19l8-16M163 23l12-13" stroke="#e8aa84" strokeWidth="10" strokeLinecap="round" /><path d="M82 47q45 10 96-2" fill="none" stroke="#a96550" strokeWidth="2" opacity=".55" /></g>
}

function MotionGuide({ keyName }: { keyName: string }) {
  if (keyName === 'friction' || keyName === 'petrissage') return <path d="M214 34a23 23 0 1 1-8-17" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrow)" />
  if (keyName === 'tapotement' || keyName === 'compression') return <path d="M222 12v48" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrow)" />
  if (keyName === 'vibration') return <path d="M196 33h42m-36-10-8 10 8 10m30-20 8 10-8 10" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  if (keyName === 'stretching' || keyName === 'rom') return <path d="M198 34h40m-32-9-9 9 9 9m24-18 9 9-9 9" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  return <path d="M194 34h46" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrow)" />
}

export function HandDiagram({ technique, lang, className }: HandDiagramProps) {
  const [playing, setPlaying] = useState(true)
  const position = technique.handPositions[0]
  const handShape = position?.handShape ?? 'flat-palm'
  const animationClass = ANIMATION_CLASSES[technique.animationKey] ?? ANIMATION_CLASSES.effleurage
  const pressureDepth = PRESSURE_DEPTH[technique.pressure] ?? 50

  return (
    <div className={cn('w-full overflow-hidden rounded-2xl border border-amber-400/15 bg-[#0a111b]', className)}>
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div>
          <p className="text-xs font-semibold text-white">{lang === 'es' ? 'Laboratorio de contacto' : 'Contact laboratory'}</p>
          <p className="mt-0.5 text-[10px] text-gray-500">{lang === 'es' ? 'Movimiento, superficie y profundidad' : 'Motion, contact surface, and depth'}</p>
        </div>
        <button onClick={() => setPlaying((value) => !value)} className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-amber-300 hover:bg-amber-400/10" aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div className="grid gap-0 xl:grid-cols-[minmax(260px,1fr)_170px]">
        <div className="relative min-h-[220px] border-b border-white/5 p-3 xl:border-b-0 xl:border-r">
          <svg viewBox="0 0 280 190" className="h-[210px] w-full" role="img" aria-label={lang === 'es' ? 'Simulación animada de la técnica' : 'Animated technique simulation'}>
            <defs>
              <linearGradient id="skinGradient" x1="0" x2="1"><stop stopColor="#f4c2a1" /><stop offset="1" stopColor="#c97e66" /></linearGradient>
              <linearGradient id="muscleGradient" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#b64b4d" /><stop offset="1" stopColor="#6f2837" /></linearGradient>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0l10 5-10 5z" fill="#fbbf24" /></marker>
              <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <rect x="18" y="86" width="244" height="18" rx="9" fill="#d79a78" />
            <rect x="18" y="104" width="244" height="19" fill="#d9b04c" opacity=".55" />
            <path d="M18 124q28-13 55 0t55 0t55 0t79 0v17H18z" fill="#d7dbe2" opacity=".68" />
            <path d="M18 143q34-17 68 0t68 0t68 0t40 0v35H18z" fill="url(#muscleGradient)" />
            <path d="M28 160q35-18 70 0t70 0t70 0" fill="none" stroke="#e47a72" strokeWidth="4" opacity=".55" />
            <g className={animationClass} style={{ transformBox: 'fill-box', transformOrigin: 'center', animationPlayState: playing ? 'running' : 'paused' }}>
              <HandContact shape={handShape} />
            </g>
            <g filter="url(#glow)" opacity=".9"><MotionGuide keyName={technique.animationKey} /></g>
            <line x1="34" y1="91" x2={34 + pressureDepth * .72} y2="91" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
            <text x="20" y="187" fill="#64748b" fontSize="8">SKIN</text><text x="70" y="187" fill="#64748b" fontSize="8">FASCIA</text><text x="130" y="187" fill="#64748b" fontSize="8">MUSCLE</text>
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-px bg-white/5 xl:grid-cols-1">
          <div className="bg-[#0a111b] p-3">
            <p className="mb-1 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-amber-300"><Gauge className="h-3 w-3" />{lang === 'es' ? 'Presión' : 'Pressure'}</p>
            <p className="text-xs font-medium capitalize text-white">{technique.pressure}</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500" style={{ width: `${pressureDepth}%` }} /></div>
          </div>
          <div className="bg-[#0a111b] p-3">
            <p className="mb-1 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-amber-300"><Repeat2 className="h-3 w-3" />{lang === 'es' ? 'Ritmo' : 'Rhythm'}</p>
            <p className="text-xs font-medium capitalize text-white">{technique.rhythm}</p>
            <div className="mt-2 flex gap-1">{[0, 1, 2, 3].map((value) => <span key={value} className={cn('h-1.5 flex-1 rounded-full', value < (technique.rhythm === 'slow' ? 1 : technique.rhythm === 'moderate' ? 2 : 4) ? 'bg-cyan-400' : 'bg-white/5')} />)}</div>
          </div>
          <div className="col-span-2 bg-[#0a111b] p-3 xl:col-span-1">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-amber-300">{lang === 'es' ? 'Contacto principal' : 'Primary contact'}</p>
            <p className="mt-1 text-[11px] font-medium text-white">{position ? loc(position, 'description', lang) : handShape.replace('-', ' ')}</p>
            <p className="mt-1 text-[10px] leading-snug text-gray-500">{position ? loc(position, 'contactSurface', lang) : ''}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
