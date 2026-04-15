import { describe, it, expect } from 'vitest'
import { calculateNextReview, isDue, daysUntilReview, getRetentionRate } from './sm2'
import type { Flashcard } from '../types/study.types'

function makeCard(overrides: Partial<Flashcard> = {}): Flashcard {
  return {
    id: 'test-1',
    type: 'anatomy',
    front: 'Q',
    back: 'A',
    category: 'Anatomy',
    tags: [],
    difficulty: 3,
    repetitions: 0,
    easeFactor: 2.5,
    interval: 0,
    lastReviewed: null,
    nextReview: '2020-01-01',
    totalReviews: 0,
    correctStreak: 0,
    ...overrides,
  }
}

describe('calculateNextReview', () => {
  it('increments totalReviews on every call', () => {
    const card = makeCard({ totalReviews: 3 })
    const result = calculateNextReview(card, 4)
    expect(result.totalReviews).toBe(4)
  })

  describe('failed ratings (< 3)', () => {
    it('resets repetitions and correctStreak on rating 0', () => {
      const card = makeCard({ repetitions: 5, correctStreak: 3, easeFactor: 2.8 })
      const result = calculateNextReview(card, 0)
      expect(result.repetitions).toBe(0)
      expect(result.correctStreak).toBe(0)
      expect(result.interval).toBe(1)
    })

    it('resets repetitions and correctStreak on rating 2', () => {
      const card = makeCard({ repetitions: 5, correctStreak: 3 })
      const result = calculateNextReview(card, 2)
      expect(result.repetitions).toBe(0)
      expect(result.correctStreak).toBe(0)
      expect(result.interval).toBe(1)
    })

    it('schedules next review for tomorrow on failure', () => {
      const card = makeCard()
      const result = calculateNextReview(card, 0)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      expect(result.nextReview).toBe(tomorrow.toISOString().split('T')[0])
    })
  })

  describe('passing ratings (>= 3)', () => {
    it('first pass (rep 0→1) sets interval to 1', () => {
      const card = makeCard({ repetitions: 0 })
      const result = calculateNextReview(card, 4)
      expect(result.repetitions).toBe(1)
      expect(result.interval).toBe(1)
    })

    it('second pass (rep 1→2) sets interval to 6', () => {
      const card = makeCard({ repetitions: 1, interval: 1 })
      const result = calculateNextReview(card, 4)
      expect(result.repetitions).toBe(2)
      expect(result.interval).toBe(6)
    })

    it('third pass uses interval * easeFactor', () => {
      const card = makeCard({ repetitions: 2, interval: 6, easeFactor: 2.5 })
      const result = calculateNextReview(card, 4)
      expect(result.repetitions).toBe(3)
      expect(result.interval).toBe(Math.round(6 * 2.5)) // 15
    })

    it('increments correctStreak on pass', () => {
      const card = makeCard({ correctStreak: 2 })
      const result = calculateNextReview(card, 4)
      expect(result.correctStreak).toBe(3)
    })

    it('increases easeFactor on rating 5', () => {
      const card = makeCard({ easeFactor: 2.5 })
      const result = calculateNextReview(card, 5)
      expect(result.easeFactor).toBeGreaterThan(2.5)
    })

    it('decreases easeFactor on rating 3', () => {
      const card = makeCard({ easeFactor: 2.5 })
      const result = calculateNextReview(card, 3)
      expect(result.easeFactor).toBeLessThan(2.5)
    })

    it('never drops easeFactor below 1.3', () => {
      const card = makeCard({ easeFactor: 1.3 })
      const result = calculateNextReview(card, 3)
      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3)
    })

    it('sets lastReviewed to today', () => {
      const card = makeCard()
      const result = calculateNextReview(card, 4)
      expect(result.lastReviewed).toBe(new Date().toISOString().split('T')[0])
    })
  })
})

describe('isDue', () => {
  it('returns true when nextReview is today', () => {
    const today = new Date().toISOString().split('T')[0]
    expect(isDue(makeCard({ nextReview: today }))).toBe(true)
  })

  it('returns true when nextReview is in the past', () => {
    expect(isDue(makeCard({ nextReview: '2020-01-01' }))).toBe(true)
  })

  it('returns false when nextReview is in the future', () => {
    const future = new Date()
    future.setDate(future.getDate() + 5)
    expect(isDue(makeCard({ nextReview: future.toISOString().split('T')[0] }))).toBe(false)
  })
})

describe('daysUntilReview', () => {
  it('returns 0 for today', () => {
    const today = new Date().toISOString().split('T')[0]
    expect(daysUntilReview(makeCard({ nextReview: today }))).toBe(0)
  })

  it('returns negative number for overdue cards', () => {
    expect(daysUntilReview(makeCard({ nextReview: '2020-01-01' }))).toBeLessThan(0)
  })

  it('returns positive number for future cards', () => {
    const future = new Date()
    future.setDate(future.getDate() + 7)
    expect(daysUntilReview(makeCard({ nextReview: future.toISOString().split('T')[0] }))).toBe(7)
  })
})

describe('getRetentionRate', () => {
  it('returns 0 when no cards reviewed', () => {
    const cards = [makeCard({ totalReviews: 0 }), makeCard({ totalReviews: 0 })]
    expect(getRetentionRate(cards)).toBe(0)
  })

  it('returns 0 when no cards have reached mature interval', () => {
    const cards = [makeCard({ totalReviews: 5, interval: 10 })]
    expect(getRetentionRate(cards)).toBe(0)
  })

  it('returns 100 when all reviewed cards are mature', () => {
    const cards = [
      makeCard({ totalReviews: 10, interval: 21 }),
      makeCard({ totalReviews: 8, interval: 30 }),
    ]
    expect(getRetentionRate(cards)).toBe(100)
  })

  it('returns 50 when half of reviewed cards are mature', () => {
    const cards = [
      makeCard({ totalReviews: 10, interval: 21 }),
      makeCard({ totalReviews: 5, interval: 7 }),
    ]
    expect(getRetentionRate(cards)).toBe(50)
  })

  it('ignores unreviewed cards in calculation', () => {
    const cards = [
      makeCard({ totalReviews: 10, interval: 21 }),  // mature
      makeCard({ totalReviews: 0, interval: 0 }),    // new — excluded
    ]
    expect(getRetentionRate(cards)).toBe(100)
  })
})
