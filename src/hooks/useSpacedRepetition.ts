import { useCallback, useMemo } from 'react'
import { useStudyStore } from '../store/studyStore'
import { FLASHCARDS } from '../data/flashcards'
import type { SM2Rating } from '../types/study.types'
import { isDue } from '../utils/sm2'

export function useSpacedRepetition() {
  const { cards, initCards, rateCard, startSession, endSession, getDueCards } =
    useStudyStore()

  // Sync cards from data: adds new cards, drops removed ones, preserves SM-2 state
  const ensureCards = useCallback(() => {
    initCards(FLASHCARDS)
  }, [initCards])

  const dueCards = useMemo(() => getDueCards(), [cards])

  const startDueSession = useCallback(() => {
    ensureCards()
    const due = getDueCards()
    if (due.length === 0) return
    // Shuffle due cards
    const shuffled = [...due].sort(() => Math.random() - 0.5)
    startSession(shuffled.map((c) => c.id))
  }, [ensureCards, getDueCards, startSession])

  const startCategorySession = useCallback(
    (category: string) => {
      ensureCards()
      const categoryCards = cards.filter(
        (c) => c.category === category || c.tags.includes(category),
      )
      const shuffled = [...categoryCards].sort(() => Math.random() - 0.5)
      startSession(shuffled.map((c) => c.id))
    },
    [ensureCards, cards, startSession],
  )

  const rate = useCallback(
    (cardId: string, rating: SM2Rating) => {
      rateCard(cardId, rating)
    },
    [rateCard],
  )

  const stats = useMemo(() => {
    const total = cards.length
    const due = dueCards.length
    const reviewed = cards.filter((c) => c.totalReviews > 0).length
    const mature = cards.filter((c) => c.interval >= 21).length
    const avgEaseFactor =
      reviewed > 0
        ? cards
            .filter((c) => c.totalReviews > 0)
            .reduce((sum, c) => sum + c.easeFactor, 0) / reviewed
        : 2.5
    return { total, due, reviewed, mature, avgEaseFactor }
  }, [cards, dueCards])

  return {
    cards,
    dueCards,
    stats,
    ensureCards,
    startDueSession,
    startCategorySession,
    rate,
    endSession,
    isDue,
  }
}
