import {
  Bone,
  Hand,
  MapPin,
  AlertTriangle,
  BookOpen,
  Map,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import type { Section } from '../../types/app.types'
import { cn } from '../../utils/cn'
import { Tooltip } from '../shared/Tooltip'

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: 'anatomy',
    label: 'Anatomy',
    icon: <Bone className="w-5 h-5" />,
    description: 'Muscles, nerves & fascial lines',
  },
  {
    id: 'techniques',
    label: 'Techniques',
    icon: <Hand className="w-5 h-5" />,
    description: 'All 8 technique categories',
  },
  {
    id: 'regions',
    label: 'Body Regions',
    icon: <MapPin className="w-5 h-5" />,
    description: 'Region-specific protocols',
  },
  {
    id: 'clinical',
    label: 'Clinical',
    icon: <AlertTriangle className="w-5 h-5" />,
    description: 'Contraindications & populations',
  },
  {
    id: 'study',
    label: 'Study Tools',
    icon: <BookOpen className="w-5 h-5" />,
    description: 'Flashcards, quiz & progress',
  },
  {
    id: 'roadmap',
    label: 'Roadmap',
    icon: <Map className="w-5 h-5" />,
    description: '16-week learning plan',
  },
]

export function Sidebar() {
  const { activeSection, sidebarCollapsed, mobileMenuOpen, setSection, toggleSidebar, toggleMobileMenu } = useAppStore()

  const handleNavClick = (id: Section) => {
    setSection(id)
    if (mobileMenuOpen) toggleMobileMenu()
  }

  return (
    <aside
      className={cn(
        // Desktop: relative, collapsible
        'lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:h-full lg:bg-bg-secondary lg:border-r lg:border-bg-border lg:transition-all lg:duration-200',
        sidebarCollapsed ? 'lg:w-20' : 'lg:w-64',
        // Mobile: fixed overlay drawer
        'fixed inset-y-0 left-0 z-50 flex flex-col h-full bg-bg-secondary border-r border-bg-border w-[280px] max-w-[85vw] transition-transform duration-300 ease-out',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )}
    >
      {/* Logo / Brand */}
      <div className={cn(
        'flex items-center border-b border-bg-border min-h-[68px] shrink-0',
        sidebarCollapsed ? 'justify-center px-4 py-4' : 'gap-3 px-5 py-4',
      )}>
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
          <Hand className="w-4.5 h-4.5 text-amber-400" />
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden flex-1">
            <p className="font-display text-base font-semibold text-white leading-tight tracking-wide">Massage</p>
            <p className="text-xs text-amber-400 leading-tight font-sans tracking-widest uppercase">Clinical Study</p>
          </div>
        )}
        {/* Mobile close button */}
        {!sidebarCollapsed && (
          <button
            onClick={toggleMobileMenu}
            className="p-2.5 rounded-lg text-gray-500 hover:text-white hover:bg-bg-elevated transition-colors lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = activeSection === item.id
          const btn = (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                'w-full flex items-center rounded-xl transition-all duration-150 group',
                sidebarCollapsed
                  ? 'justify-center p-3'
                  : 'gap-3 px-3.5 py-3',
                active
                  ? 'bg-amber-500/12 text-amber-400 border border-amber-500/25 shadow-amber-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-bg-elevated border border-transparent',
              )}
            >
              <span className={cn('shrink-0 transition-colors', active ? 'text-amber-400' : 'text-gray-500 group-hover:text-gray-300')}>
                {item.icon}
              </span>
              {!sidebarCollapsed && (
                <div className="text-left overflow-hidden">
                  <p className={cn('text-sm font-medium leading-tight', active ? 'text-amber-400' : '')}>
                    {item.label}
                  </p>
                  <p className={cn('text-xs leading-tight mt-0.5 truncate', active ? 'text-amber-400/60' : 'text-gray-600')}>
                    {item.description}
                  </p>
                </div>
              )}
            </button>
          )

          return sidebarCollapsed ? (
            <Tooltip key={item.id} content={item.label} position="right">
              {btn}
            </Tooltip>
          ) : (
            <div key={item.id}>{btn}</div>
          )
        })}
      </nav>

      {/* Desktop collapse toggle */}
      <div className="px-3 py-4 border-t border-bg-border hidden lg:block">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-xs text-gray-500 hover:text-gray-300 hover:bg-bg-elevated rounded-lg transition-all"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
