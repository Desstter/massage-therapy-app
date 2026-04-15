import { cn } from '../../utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  variant?: 'default' | 'amber' | 'elevated' | 'danger'
  interactive?: boolean
}

export function Card({ children, className, onClick, variant = 'default', interactive }: CardProps) {
  const base = 'rounded-xl border transition-colors duration-150'
  const variants = {
    default: 'bg-bg-secondary border-bg-border',
    amber: 'bg-bg-secondary border-amber-500/40',
    elevated: 'bg-bg-elevated border-bg-border',
    danger: 'bg-red-950/30 border-red-500/40',
  }
  const hover =
    interactive || onClick
      ? 'cursor-pointer hover:border-amber-500/60 hover:bg-bg-elevated'
      : ''

  return (
    <div
      className={cn(base, variants[variant], hover, className)}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
