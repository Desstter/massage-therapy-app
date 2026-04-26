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
  Globe,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../store/appStore'
import { useLanguageStore } from '../../store/languageStore'
import type { Section } from '../../types/app.types'
import { cn } from '../../utils/cn'
import { Tooltip } from '../shared/Tooltip'

export function Sidebar() {
  const { t } = useTranslation()
  const { activeSection, sidebarCollapsed, mobileMenuOpen, setSection, toggleSidebar, toggleMobileMenu } = useAppStore()
  const { language, setLanguage } = useLanguageStore()

  const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode; description: string }[] = [
    { id: 'anatomy', label: t('nav.anatomy'), icon: <Bone className="w-5 h-5" />, description: t('nav.anatomy_desc') },
    { id: 'techniques', label: t('nav.techniques'), icon: <Hand className="w-5 h-5" />, description: t('nav.techniques_desc') },
    { id: 'regions', label: t('nav.regions'), icon: <MapPin className="w-5 h-5" />, description: t('nav.regions_desc') },
    { id: 'clinical', label: t('nav.clinical'), icon: <AlertTriangle className="w-5 h-5" />, description: t('nav.clinical_desc') },
    { id: 'study', label: t('nav.study'), icon: <BookOpen className="w-5 h-5" />, description: t('nav.study_desc') },
    { id: 'roadmap', label: t('nav.roadmap'), icon: <Map className="w-5 h-5" />, description: t('nav.roadmap_desc') },
  ]

  const handleNavClick = (id: Section) => {
    setSection(id)
    if (mobileMenuOpen) toggleMobileMenu()
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en')
  }

  return (
    <aside
      className={cn(
        'lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:h-full lg:bg-bg-secondary lg:border-r lg:border-bg-border lg:transition-all lg:duration-200',
        sidebarCollapsed ? 'lg:w-20' : 'lg:w-64',
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
            <p className="font-display text-base font-semibold text-white leading-tight tracking-wide">{t('brand.name')}</p>
            <p className="text-xs text-amber-400 leading-tight font-sans tracking-widest uppercase">{t('brand.sub')}</p>
          </div>
        )}
        {!sidebarCollapsed && (
          <button
            onClick={toggleMobileMenu}
            className="p-2.5 rounded-lg text-gray-500 hover:text-white hover:bg-bg-elevated transition-colors lg:hidden"
            aria-label={t('nav.close')}
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
                sidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-3.5 py-3',
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

      {/* Language toggle */}
      <div className={cn('px-3 pb-2 border-t border-bg-border pt-3', sidebarCollapsed ? 'flex justify-center' : '')}>
        {sidebarCollapsed ? (
          <Tooltip content={t('nav.lang_toggle')} position="right">
            <button
              onClick={toggleLanguage}
              className="p-3 rounded-xl text-gray-400 hover:text-amber-400 hover:bg-bg-elevated transition-all border border-transparent hover:border-amber-500/20"
            >
              <Globe className="w-5 h-5" />
            </button>
          </Tooltip>
        ) : (
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-bg-border text-gray-400 hover:text-amber-400 hover:bg-bg-elevated hover:border-amber-500/20 transition-all text-sm font-medium"
          >
            <Globe className="w-4 h-4 shrink-0" />
            <span>{t('nav.lang_toggle')}</span>
            <span className="ml-auto text-xs text-gray-600 uppercase">{language}</span>
          </button>
        )}
      </div>

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
              <span>{t('nav.collapse')}</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
