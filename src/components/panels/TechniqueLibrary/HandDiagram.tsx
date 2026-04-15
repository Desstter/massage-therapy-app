import { cn } from '../../../utils/cn'

interface HandDiagramProps {
  animationKey: string
  className?: string
}

// Each animation key maps to a CSS animation class defined in tailwind config
const ANIMATION_CLASSES: Record<string, string> = {
  effleurage: 'animate-effleurage',
  petrissage: 'animate-petrissage',
  friction: 'animate-friction',
  tapotement: 'animate-tapotement',
  vibration: 'animate-vibration',
  compression: 'animate-compression',
  stretching: 'animate-stretching',
  rom: 'animate-stretching',
}

export function HandDiagram({ animationKey, className }: HandDiagramProps) {
  const animClass = ANIMATION_CLASSES[animationKey] ?? 'animate-effleurage'

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="relative w-40 h-32 bg-bg-secondary rounded-xl border border-bg-border overflow-hidden flex items-center justify-center">
        {/* Surface being massaged */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-amber-900/20 to-transparent rounded-b-xl" />
        <div className="absolute bottom-8 left-0 right-0 h-0.5 bg-amber-800/30" />

        {/* Hand SVG */}
        <div className={cn('text-amber-400', animClass)}>
          <svg viewBox="0 0 80 60" width="80" height="60">
            {/* Palm */}
            <rect x="15" y="20" width="50" height="28" rx="8" fill="currentColor" fillOpacity="0.7" />
            {/* Fingers */}
            <rect x="18" y="8" width="8" height="18" rx="4" fill="currentColor" fillOpacity="0.65" />
            <rect x="30" y="4" width="8" height="20" rx="4" fill="currentColor" fillOpacity="0.65" />
            <rect x="42" y="6" width="8" height="18" rx="4" fill="currentColor" fillOpacity="0.65" />
            <rect x="54" y="10" width="8" height="16" rx="4" fill="currentColor" fillOpacity="0.65" />
            {/* Thumb */}
            <ellipse cx="12" cy="32" rx="6" ry="9" fill="currentColor" fillOpacity="0.65" transform="rotate(-15 12 32)" />
            {/* Direction arrow */}
            <path d="M 15 50 L 65 50" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="4 3" />
          </svg>
        </div>
      </div>
      <p className="text-xs text-gray-500 capitalize">{animationKey} motion</p>
    </div>
  )
}
