interface ProgressRingProps {
  percent: number
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
  label?: string
}

export function ProgressRing({
  percent,
  size = 64,
  strokeWidth = 6,
  color = '#f59e0b',
  trackColor = '#1e2028',
  label,
}: ProgressRingProps) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (percent / 100) * circ

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
      </svg>
      {label !== undefined && (
        <span className="absolute text-xs font-bold text-white">{label}</span>
      )}
    </div>
  )
}
