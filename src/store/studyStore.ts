import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Flashcard, StudySession, SM2Rating, QuizSession } from '../types/study.types'
import { calculateNextReview } from '../utils/sm2'
import { todayISO } from '../utils/dateHelpers'
import { useProgressStore } from './progressStore'

interface StudyState {
  cards: Flashcard[]
  sessions: StudySession[]
  quizSessions: QuizSession[]

  // Active session state (not persisted)
  activeSessionCardIds: string[]
  currentCardIndex: number
  sessionStartTime: number | null
  sessionRatings: SM2Rating[]

  initCards: (cards: Flashcard[]) => void
  rateCard: (cardId: string, rating: SM2Rating) => void
  startSession: (cardIds: string[]) => void
  endSession: () => void
  addQuizSession: (session: QuizSession) => void
  resetCard: (cardId: string) => void
  getDueCards: () => Flashcard[]
  getCardById: (id: string) => Flashcard | undefined
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      cards: [],
      sessions: [],
      quizSessions: [],
      activeSessionCardIds: [],
      currentCardIndex: 0,
      sessionStartTime: null,
      sessionRatings: [],

      initCards: (cards) =>
        set((s) => {
          // Merge: preserve existing SM-2 data for known IDs
          const existing = new Map(s.cards.map((c) => [c.id, c]))
          const merged = cards.map((c) => existing.get(c.id) ?? c)
          return { cards: merged }
        }),

      rateCard: (cardId, rating) =>
        set((s) => {
          const card = s.cards.find((c) => c.id === cardId)
          if (!card) return s
          const update = calculateNextReview(card, rating)
          return {
            cards: s.cards.map((c) =>
              c.id === cardId ? { ...c, ...update } : c,
            ),
            currentCardIndex: s.currentCardIndex + 1,
            sessionRatings: [...s.sessionRatings, rating],
          }
        }),

      startSession: (cardIds) =>
        set({
          activeSessionCardIds: cardIds,
          currentCardIndex: 0,
          sessionStartTime: Date.now(),
          sessionRatings: [],
        }),

      endSession: () =>
        set((s) => {
          if (!s.sessionStartTime || s.activeSessionCardIds.length === 0) {
            return { activeSessionCardIds: [], currentCardIndex: 0, sessionStartTime: null, sessionRatings: [] }
          }
          const reviewed = Math.min(s.currentCardIndex, s.activeSessionCardIds.length)
          const durationMinutes = Math.round((Date.now() - s.sessionStartTime) / 60000)
          const session: StudySession = {
            id: `session-${Date.now()}`,
            date: todayISO(),
            durationMinutes,
            cardsReviewed: reviewed,
            correct: s.sessionRatings.filter((r) => r >= 3).length,
            incorrect: s.sessionRatings.filter((r) => r < 3).length,
            modulesFocused: [],
            cardIds: s.activeSessionCardIds.slice(0, reviewed),
          }
          // Sync study minutes to progressStore
          useProgressStore.getState().addStudyMinutes(durationMinutes)
          return {
            sessions: [...s.sessions, session],
            activeSessionCardIds: [],
            currentCardIndex: 0,
            sessionStartTime: null,
            sessionRatings: [],
          }
        }),

      addQuizSession: (session) =>
        set((s) => ({ quizSessions: [...s.quizSessions, session] })),

      resetCard: (cardId) =>
        set((s) => ({
          cards: s.cards.map((c) =>
            c.id === cardId
              ? {
                  ...c,
                  repetitions: 0,
                  easeFactor: 2.5,
                  interval: 0,
                  lastReviewed: null,
                  nextReview: todayISO(),
                  totalReviews: 0,
                  correctStreak: 0,
                }
              : c,
          ),
        })),

      getDueCards: () => {
        const today = todayISO()
        return get().cards.filter((c) => c.nextReview <= today)
      },

      getCardById: (id) => get().cards.find((c) => c.id === id),
    }),
    {
      name: 'massage-app-study',
      partialize: (s) => ({
        cards: s.cards,
        sessions: s.sessions,
        quizSessions: s.quizSessions,
      }),
    },
  ),
)
