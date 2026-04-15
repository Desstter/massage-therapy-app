import { useProgressStore } from '../store/progressStore'
import { ROADMAP } from '../data/roadmap'
import { todayISO } from '../utils/dateHelpers'
import type { WeekStatus } from '../types/roadmap.types'

export function useProgress() {
  const store = useProgressStore()

  function getWeekStatus(weekNumber: number): WeekStatus {
    const staticWeek = ROADMAP.find((w) => w.week === weekNumber)
    const stored = store.getStoredWeekStatus(weekNumber)
    return stored ?? staticWeek?.status ?? 'locked'
  }

  function getWeekCompletionPercent(weekNumber: number): number {
    const week = ROADMAP.find((w) => w.week === weekNumber)
    if (!week || week.objectives.length === 0) return 0
    const completed = store.getWeekProgress(weekNumber)
    return Math.round((completed / week.objectives.length) * 100)
  }

  function completeObjective(weekNumber: number, objectiveId: string) {
    store.completeObjective(weekNumber, objectiveId)
    store.updateStreak(todayISO())

    // Auto-unlock next week if this week reaches 100%
    const week = ROADMAP.find((w) => w.week === weekNumber)
    if (!week) return
    const completedCount = store.getWeekProgress(weekNumber)
    if (completedCount >= week.objectives.length) {
      store.setWeekStatus(weekNumber, 'completed')
      const nextWeek = weekNumber + 1
      if (nextWeek <= 16) {
        store.setWeekStatus(nextWeek, 'available')
      }
    } else {
      store.setWeekStatus(weekNumber, 'in-progress')
    }
  }

  function overallProgress(): number {
    const allObjectives = ROADMAP.flatMap((w) => w.objectives)
    if (allObjectives.length === 0) return 0
    const completed = ROADMAP.reduce(
      (sum, w) => sum + store.getWeekProgress(w.week),
      0,
    )
    return Math.round((completed / allObjectives.length) * 100)
  }

  return {
    completeObjective,
    isObjectiveComplete: store.isObjectiveComplete,
    getWeekCompletionPercent,
    getWeekStatus,
    overallProgress,
    studyStreak: store.studyStreak,
    totalStudyMinutes: store.totalStudyMinutes,
    addStudyMinutes: store.addStudyMinutes,
    setWeekStatus: store.setWeekStatus,
  }
}
