import { create } from 'zustand'
import type { Section } from '../types/app.types'

interface AppState {
  activeSection: Section
  sidebarCollapsed: boolean
  mobileMenuOpen: boolean
  setSection: (section: Section) => void
  toggleSidebar: () => void
  toggleMobileMenu: () => void
}

export const useAppStore = create<AppState>((set) => ({
  activeSection: 'anatomy',
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  setSection: (section) => set({ activeSection: section }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
}))
