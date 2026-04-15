import { cn } from '../../utils/cn'

export type BadgeVariant = 'amber' | 'green' | 'red' | 'blue' | 'purple' | 'gray' | 'orange'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  green: 'bg-green-500/15 text-green-400 border-green-500/30',
  red: 'bg-red-500/15 text-red-400 border-red-500/30',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  gray: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  orange: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
}

export function Badge({ children, variant = 'amber', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
