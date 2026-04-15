export type FlashcardType = 'anatomy' | 'technique' | 'clinical' | 'image-based'
export type Difficulty = 1 | 2 | 3 | 4 | 5
export type SM2Rating = 0 | 1 | 2 | 3 | 4 | 5

export interface Flashcard {
  id: string
  type: FlashcardType
  front: string
  back: string
  hint?: string
  imageRef?: string
  category: string
  tags: string[]
  difficulty: Difficulty
  repetitions: number
  easeFactor: number
  interval: number
  lastReviewed: string | null
  nextReview: string
  totalReviews: number
  correctStreak: number
}

export interface StudySession {
  id: string
  date: string
  durationMinutes: number
  cardsReviewed: number
  correct: number
  incorrect: number
  modulesFocused: string[]
  cardIds: string[]
}

export type QuestionType = 'multiple-choice' | 'image-identify' | 'fill-blank'

export interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface QuizQuestion {
  id: string
  type: QuestionType
  question: string
  explanation: string
  options: QuizOption[]
  imageRef?: string
  category: string
  difficulty: Difficulty
  relatedMuscleId?: string
  relatedTechniqueId?: string
  mosbyChapter?: number
}

export interface QuizResult {
  questionId: string
  selectedOptionId: string
  isCorrect: boolean
  timeSpentSeconds: number
}

export interface QuizSession {
  id: string
  date: string
  module: string
  questions: QuizQuestion[]
  results: QuizResult[]
  score: number
  totalQuestions: number
  durationSeconds: number
}
