import { create } from 'zustand'
import type { AnatomyView, BodySide, FilterState } from '../types/app.types'

interface AnatomyState {
  activeView: AnatomyView
  bodySide: BodySide
  selectedMuscleId: string | null
  selectedFasciaId: string | null
  selectedNerveId: string | null
  hoveredMuscleId: string | null
  filters: FilterState
  detailPanelOpen: boolean

  setView: (view: AnatomyView) => void
  setBodySide: (side: BodySide) => void
  selectMuscle: (id: string | null) => void
  selectFascia: (id: string | null) => void
  selectNerve: (id: string | null) => void
  setHoveredMuscle: (id: string | null) => void
  setFilters: (filters: Partial<FilterState>) => void
  closeDetailPanel: () => void
}

const defaultFilters: FilterState = {
  search: '',
  region: 'all',
  layer: 'all',
  category: 'all',
}

export const useAnatomyStore = create<AnatomyState>((set) => ({
  activeView: 'muscles',
  bodySide: 'anterior',
  selectedMuscleId: null,
  selectedFasciaId: null,
  selectedNerveId: null,
  hoveredMuscleId: null,
  filters: defaultFilters,
  detailPanelOpen: false,

  setView: (view) =>
    set({
      activeView: view,
      selectedMuscleId: null,
      selectedFasciaId: null,
      selectedNerveId: null,
      detailPanelOpen: false,
    }),
  setBodySide: (side) => set({ bodySide: side }),
  selectMuscle: (id) => set({ selectedMuscleId: id, detailPanelOpen: id !== null }),
  selectFascia: (id) => set({ selectedFasciaId: id, detailPanelOpen: id !== null }),
  selectNerve: (id) => set({ selectedNerveId: id, detailPanelOpen: id !== null }),
  setHoveredMuscle: (id) => set({ hoveredMuscleId: id }),
  setFilters: (partial) =>
    set((s) => ({ filters: { ...s.filters, ...partial } })),
  closeDetailPanel: () =>
    set({
      detailPanelOpen: false,
      selectedMuscleId: null,
      selectedFasciaId: null,
      selectedNerveId: null,
    }),
}))
