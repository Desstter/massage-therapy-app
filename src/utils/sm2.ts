import type { Flashcard, SM2Rating } from '../types/study.types'

export interface SM2Update {
  repetitions: number
  easeFactor: number
  interval: number
  nextReview: string
  lastReviewed: string
  totalReviews: number
  correctStreak: number
}

export function calculateNextReview(card: Flashcard, rating: SM2Rating): SM2Update {
  const now = new Date()
  const today = now.toISOString().split('T')[0]

  let { repetitions, easeFactor, interval, totalReviews, correctStreak } = card

  totalReviews += 1

  if (rating < 3) {
    // Failed — reset repetitions, schedule for soon
    repetitions = 0
    interval = 1
    correctStreak = 0
  } else {
    // Passed
    correctStreak += 1
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
    repetitions += 1

    // Update ease factor using SM-2 formula
    easeFactor = Math.max(
      1.3,
      easeFactor + 0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02)
    )
  }

  const nextDate = new Date(now)
  nextDate.setDate(nextDate.getDate() + interval)

  return {
    repetitions,
    easeFactor,
    interval,
    nextReview: nextDate.toISOString().split('T')[0],
    lastReviewed: today,
    totalReviews,
    correctStreak,
  }
}

export function isDue(card: Flashcard): boolean {
  const today = new Date().toISOString().split('T')[0]
  return card.nextReview <= today
}

export function daysUntilReview(card: Flashcard): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  // Append T00:00:00 to force local-time parsing (bare ISO dates parse as UTC)
  const reviewDate = new Date(card.nextReview + 'T00:00:00')
  reviewDate.setHours(0, 0, 0, 0)
  return Math.round((reviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function getRetentionRate(cards: Flashcard[]): number {
  const reviewed = cards.filter(c => c.totalReviews > 0)
  if (reviewed.length === 0) return 0
  const mature = reviewed.filter(c => c.interval >= 21)
  return Math.round((mature.length / reviewed.length) * 100)
}
