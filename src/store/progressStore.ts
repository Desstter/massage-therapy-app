import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ModuleProgress {
  moduleId: string
  completedObjectives: string[]
  weekStatus: Record<number, 'locked' | 'available' | 'in-progress' | 'completed'>
  lastVisited: string | null
}

interface ProgressState {
  modules: Record<string, ModuleProgress>
  studyStreak: number
  lastStudyDate: string | null
  totalStudyMinutes: number

  completeObjective: (weekNumber: number, objectiveId: string) => void
  setWeekStatus: (weekNumber: number, status: ModuleProgress['weekStatus'][number]) => void
  addStudyMinutes: (minutes: number) => void
  updateStreak: (date: string) => void
  getWeekProgress: (weekNumber: number) => number
  isObjectiveComplete: (weekNumber: number, objectiveId: string) => boolean
  getStoredWeekStatus: (weekNumber: number) => ModuleProgress['weekStatus'][number] | undefined
}

const moduleKey = (weekNumber: number) => `week-${weekNumber}`

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      modules: {},
      studyStreak: 0,
      lastStudyDate: null,
      totalStudyMinutes: 0,

      completeObjective: (weekNumber, objectiveId) =>
        set((s) => {
          const key = moduleKey(weekNumber)
          const existing = s.modules[key] ?? {
            moduleId: key,
            completedObjectives: [],
            weekStatus: {},
            lastVisited: null,
          }
          if (existing.completedObjectives.includes(objectiveId)) return s
          return {
            modules: {
              ...s.modules,
              [key]: {
                ...existing,
                completedObjectives: [...existing.completedObjectives, objectiveId],
                lastVisited: new Date().toISOString().slice(0, 10),
              },
            },
          }
        }),

      setWeekStatus: (weekNumber, status) =>
        set((s) => {
          const key = moduleKey(weekNumber)
          const existing = s.modules[key] ?? {
            moduleId: key,
            completedObjectives: [],
            weekStatus: {},
            lastVisited: null,
          }
          return {
            modules: {
              ...s.modules,
              [key]: {
                ...existing,
                weekStatus: { ...existing.weekStatus, [weekNumber]: status },
              },
            },
          }
        }),

      addStudyMinutes: (minutes) =>
        set((s) => ({ totalStudyMinutes: s.totalStudyMinutes + minutes })),

      updateStreak: (date) =>
        set((s) => {
          if (s.lastStudyDate === date) return s
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().slice(0, 10)
          const newStreak =
            s.lastStudyDate === yesterdayStr ? s.studyStreak + 1 : 1
          return { studyStreak: newStreak, lastStudyDate: date }
        }),

      getWeekProgress: (weekNumber) => {
        const key = moduleKey(weekNumber)
        const mod = get().modules[key]
        if (!mod) return 0
        return mod.completedObjectives.length
      },

      isObjectiveComplete: (weekNumber, objectiveId) => {
        const key = moduleKey(weekNumber)
        const mod = get().modules[key]
        return mod?.completedObjectives.includes(objectiveId) ?? false
      },

      getStoredWeekStatus: (weekNumber) => {
        const key = moduleKey(weekNumber)
        const mod = get().modules[key]
        return mod?.weekStatus[weekNumber]
      },
    }),
    {
      name: 'massage-app-progress',
    },
  ),
)
