import { useState } from 'react'
import { Bone, Network, Zap } from 'lucide-react'
import { useAnatomyStore } from '../../../store/anatomyStore'
import { SectionHeader } from '../../shared/SectionHeader'
import { TabBar } from '../../shared/TabBar'
import { MuscleList } from './MuscleList'
import { MuscleDetail } from './MuscleDetail'
import { BodyMapSVG } from './BodyMapSVG'
import { FascialLines } from './FascialLines'
import { NervePaths } from './NervePaths'
import { cn } from '../../../utils/cn'
import type { AnatomyView } from '../../../types/app.types'

const TABS = [
  { id: 'muscles' as AnatomyView, label: 'Muscles', icon: <Bone className="w-4 h-4" /> },
  { id: 'fascia' as AnatomyView, label: 'Fascia', icon: <Network className="w-4 h-4" /> },
  { id: 'nerves' as AnatomyView, label: 'Nerves', icon: <Zap className="w-4 h-4" /> },
]

type MobileView = 'map' | 'list' | 'detail'

export function AnatomyExplorer() {
  const { activeView, bodySide, detailPanelOpen, setView, setBodySide } = useAnatomyStore()
  const [mobileView, setMobileView] = useState<MobileView>('map')

  return (
    <div className="flex flex-col h-full">
      <SectionHeader
        title="Anatomy Explorer"
        subtitle="Interactive muscle, fascial, and nerve maps"
        icon={<Bone className="w-5 h-5" />}
        actions={
          activeView === 'muscles' ? (
            <div className="flex items-center gap-1 bg-bg-secondary border border-bg-border rounded-lg p-1">
              <button
                onClick={() => setBodySide('anterior')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  bodySide === 'anterior'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Anterior
              </button>
              <button
                onClick={() => setBodySide('posterior')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  bodySide === 'posterior'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Posterior
              </button>
            </div>
          ) : undefined
        }
      />

      <TabBar tabs={TABS} active={activeView} onChange={setView} className="mb-4" />

      <div className="flex-1 overflow-hidden min-h-0">
        {activeView === 'muscles' && (
          <>
            {/* Mobile view switcher */}
            <div className="flex gap-1 mb-3 lg:hidden bg-bg-secondary rounded-xl p-1 border border-bg-border">
              {(['map', 'list', 'detail'] as MobileView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setMobileView(v)}
                  className={cn(
                    'flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors',
                    mobileView === v
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'text-gray-500 hover:text-gray-300',
                  )}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Desktop 3-column layout */}
            <div className="hidden lg:flex gap-4 h-full">
              {/* Muscle list */}
              <div className="w-72 overflow-hidden flex flex-col">
                <MuscleList />
              </div>

              {/* Body map — takes remaining space */}
              <div className="flex-1 bg-bg-secondary rounded-2xl border border-bg-border flex items-center justify-center p-4 overflow-hidden min-w-0">
                <BodyMapSVG side={bodySide} />
              </div>

              {/* Detail panel */}
              {detailPanelOpen && (
                <div className="w-96 overflow-hidden rounded-2xl border border-bg-border flex flex-col">
                  <MuscleDetail />
                </div>
              )}
            </div>

            {/* Mobile single-pane layout */}
            <div className="lg:hidden h-full">
              {mobileView === 'map' && (
                <div className="h-full bg-bg-secondary rounded-2xl border border-bg-border flex items-center justify-center p-3">
                  <BodyMapSVG side={bodySide} />
                </div>
              )}
              {mobileView === 'list' && (
                <div className="h-full overflow-hidden">
                  <MuscleList />
                </div>
              )}
              {mobileView === 'detail' && (
                <div className="h-full overflow-hidden rounded-2xl border border-bg-border">
                  {detailPanelOpen ? (
                    <MuscleDetail />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
                      <Bone className="w-10 h-10 text-gray-600" />
                      <p className="text-base font-display text-gray-400">Select a muscle</p>
                      <p className="text-sm text-gray-600">Tap a muscle on the Map or choose from the List</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {activeView === 'fascia' && (
          <div className="h-full">
            <FascialLines />
          </div>
        )}

        {activeView === 'nerves' && (
          <div className="h-full">
            <NervePaths />
          </div>
        )}
      </div>
    </div>
  )
}
