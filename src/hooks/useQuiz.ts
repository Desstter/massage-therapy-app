import { useState, useCallback, useMemo } from 'react'
import type { QuizQuestion, QuizResult, QuizSession } from '../types/study.types'
import { useStudyStore } from '../store/studyStore'
import { todayISO } from '../utils/dateHelpers'

type QuizState = 'idle' | 'active' | 'reviewing' | 'complete'

export function useQuiz(questions: QuizQuestion[]) {
  const addQuizSession = useStudyStore((s) => s.addQuizSession)
  const [state, setState] = useState<QuizState>('idle')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<QuizResult[]>([])
  const [startTime, setStartTime] = useState<number>(0)
  const [questionStartTime, setQuestionStartTime] = useState<number>(0)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const currentQuestion = questions[currentIndex] ?? null

  const start = useCallback(() => {
    setCurrentIndex(0)
    setResults([])
    setSelectedOptionId(null)
    setShowExplanation(false)
    const now = Date.now()
    setStartTime(now)
    setQuestionStartTime(now)
    setState('active')
  }, [])

  const selectOption = useCallback(
    (optionId: string) => {
      if (selectedOptionId !== null) return // already answered
      setSelectedOptionId(optionId)
      setShowExplanation(true)

      const question = questions[currentIndex]
      const correct = question.options.find((o) => o.id === optionId)?.isCorrect ?? false
      const timeSpent = Math.round((Date.now() - questionStartTime) / 1000)

      setResults((prev) => [
        ...prev,
        { questionId: question.id, selectedOptionId: optionId, isCorrect: correct, timeSpentSeconds: timeSpent },
      ])
    },
    [selectedOptionId, currentIndex, questions, questionStartTime],
  )

  const next = useCallback(() => {
    setSelectedOptionId(null)
    setShowExplanation(false)
    setQuestionStartTime(Date.now())

    if (currentIndex + 1 >= questions.length) {
      // Save session
      const totalSeconds = Math.round((Date.now() - startTime) / 1000)
      const correct = results.filter((r) => r.isCorrect).length
      const session: QuizSession = {
        id: `quiz-${Date.now()}`,
        date: todayISO(),
        module: questions[0]?.category ?? 'General',
        questions,
        results: [...results],
        score: Math.round((correct / questions.length) * 100),
        totalQuestions: questions.length,
        durationSeconds: totalSeconds,
      }
      addQuizSession(session)
      setState('complete')
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }, [currentIndex, questions, results, startTime, addQuizSession])

  const reset = useCallback(() => {
    setCurrentIndex(0)
    setResults([])
    setSelectedOptionId(null)
    setShowExplanation(false)
    setState('idle')
  }, [])

  const score = useMemo(() => {
    if (results.length === 0) return 0
    return Math.round((results.filter((r) => r.isCorrect).length / questions.length) * 100)
  }, [results, questions.length])

  return {
    state,
    currentQuestion,
    currentIndex,
    results,
    selectedOptionId,
    showExplanation,
    score,
    totalQuestions: questions.length,
    start,
    selectOption,
    next,
    reset,
  }
}
