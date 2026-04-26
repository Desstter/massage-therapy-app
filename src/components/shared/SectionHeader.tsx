import { cn } from '../../utils/cn'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function SectionHeader({ title, subtitle, icon, actions, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-6', className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-semibold text-white leading-tight">{title}</h1>
          {subtitle && <p className="text-sm sm:text-base text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
