import { Menu, Hand } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { Sidebar } from './Sidebar'
import { AnatomyExplorer } from '../panels/AnatomyExplorer/AnatomyExplorer'
import { TechniqueLibrary } from '../panels/TechniqueLibrary/TechniqueLibrary'
import { BodyRegions } from '../panels/BodyRegions/BodyRegions'
import { ClinicalReference } from '../panels/ClinicalReference/ClinicalReference'
import { StudyTools } from '../panels/StudyTools/StudyTools'
import { LearningRoadmap } from '../panels/LearningRoadmap/LearningRoadmap'
import { ErrorBoundary } from '../shared/ErrorBoundary'

export function AppShell() {
  const { activeSection, mobileMenuOpen, toggleMobileMenu } = useAppStore()

  const panels = {
    anatomy: <AnatomyExplorer />,
    techniques: <TechniqueLibrary />,
    regions: <BodyRegions />,
    clinical: <ClinicalReference />,
    study: <StudyTools />,
    roadmap: <LearningRoadmap />,
  }

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile-only top header */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-bg-border bg-bg-secondary lg:hidden shrink-0">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-bg-elevated transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Hand className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="font-display text-base font-semibold text-white tracking-wide">
              MassageStudy
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <ErrorBoundary key={activeSection}>
              {panels[activeSection]}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  )
}
