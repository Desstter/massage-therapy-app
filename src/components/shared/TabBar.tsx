import { cn } from '../../utils/cn'

interface Tab<T extends string> {
  id: T
  label: string
  icon?: React.ReactNode
  count?: number
}

interface TabBarProps<T extends string> {
  tabs: Tab<T>[]
  active: T
  onChange: (id: T) => void
  className?: string
}

export function TabBar<T extends string>({ tabs, active, onChange, className }: TabBarProps<T>) {
  return (
    <div className={cn('flex gap-1 border-b border-bg-border overflow-x-auto', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
            active === tab.id
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-gray-400 hover:text-gray-200',
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={cn(
                'text-xs rounded-full px-1.5 py-0.5',
                active === tab.id ? 'bg-amber-500/20 text-amber-400' : 'bg-bg-border text-gray-500',
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
