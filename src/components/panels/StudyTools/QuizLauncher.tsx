import { useState } from 'react'
import { HelpCircle, CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FLASHCARDS } from '../../../data/flashcards'
import { useQuiz } from '../../../hooks/useQuiz'
import { Badge } from '../../shared/Badge'
import { cn } from '../../../utils/cn'
import type { QuizQuestion } from '../../../types/study.types'

function makeQuestions(count = 20): QuizQuestion[] {
  const cards = [...FLASHCARDS].sort(() => Math.random() - 0.5).slice(0, count)
  return cards.map((card) => {
    const distractors = FLASHCARDS.filter((c) => c.id !== card.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((c) => c.back)

    const options = [
      { id: 'correct', text: card.back, isCorrect: true },
      ...distractors.map((d, i) => ({ id: `d${i}`, text: d, isCorrect: false })),
    ].sort(() => Math.random() - 0.5)

    return {
      id: card.id,
      type: 'multiple-choice' as const,
      question: card.front,
      explanation: card.back,
      options,
      category: card.category,
      difficulty: card.difficulty,
    }
  })
}

export function QuizLauncher() {
  const { t } = useTranslation()
  const [questions] = useState(() => makeQuestions(20))
  const quiz = useQuiz(questions)

  if (quiz.state === 'idle') {
    return (
      <div className="max-w-lg mx-auto py-8 flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
          <HelpCircle className="w-8 h-8 text-amber-400" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">{t('study.quiz_title')}</h2>
          <p className="text-sm text-gray-400 mt-1">{t('study.quiz_desc')}</p>
        </div>
        <div className="w-full p-4 bg-bg-secondary rounded-xl border border-bg-border space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase">{t('study.quiz_format_title')}</p>
          <p className="text-sm text-gray-300">{t('study.quiz_format1')}</p>
          <p className="text-sm text-gray-300">{t('study.quiz_format2')}</p>
          <p className="text-sm text-gray-300">{t('study.quiz_format3')}</p>
        </div>
        <button
          onClick={quiz.start}
          className="w-full py-3.5 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-colors"
        >
          {t('study.quiz_start')}
        </button>
      </div>
    )
  }

  if (quiz.state === 'complete') {
    const correct = quiz.results.filter((r) => r.isCorrect).length
    return (
      <div className="max-w-lg mx-auto py-8 flex flex-col gap-6">
        <div className="text-center">
          <p className="text-4xl font-black text-amber-400">{quiz.score}%</p>
          <p className="text-lg font-bold text-white mt-1">{t('study.quiz_complete')}</p>
          <p className="text-sm text-gray-400">{t('study.quiz_correct', { correct, total: quiz.totalQuestions })}</p>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {quiz.results.map((result) => {
            const q = questions.find((q) => q.id === result.questionId)!
            const selectedOpt = q.options.find((o) => o.id === result.selectedOptionId)
            const correctOpt = q.options.find((o) => o.isCorrect)
            return (
              <div
                key={result.questionId}
                className={cn('p-3 rounded-xl border text-sm', result.isCorrect ? 'bg-green-950/30 border-green-500/30' : 'bg-red-950/30 border-red-500/30')}
              >
                <div className="flex gap-2 items-start mb-1">
                  {result.isCorrect
                    ? <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    : <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                  <p className="text-gray-200 font-medium">{q.question}</p>
                </div>
                {!result.isCorrect && (
                  <div className="ml-6 mt-1 space-y-0.5">
                    <p className="text-xs text-red-300">{t('study.quiz_your_answer')} {selectedOpt?.text}</p>
                    <p className="text-xs text-green-300">{t('study.quiz_correct_answer')} {correctOpt?.text}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <button
          onClick={quiz.reset}
          className="flex items-center justify-center gap-2 w-full py-3 border border-bg-border rounded-xl text-gray-300 hover:text-white hover:bg-bg-elevated transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> {t('study.quiz_try_again')}
        </button>
      </div>
    )
  }

  const q = quiz.currentQuestion!

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${((quiz.currentIndex) / quiz.totalQuestions) * 100}%` }} />
        </div>
        <span className="text-xs text-gray-500">{quiz.currentIndex + 1}/{quiz.totalQuestions}</span>
      </div>

      {/* Question */}
      <div className="p-5 bg-bg-secondary border border-bg-border rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="gray" size="sm">{q.category}</Badge>
          <Badge variant="amber" size="sm">{t('study.difficulty')} {q.difficulty}</Badge>
        </div>
        <p className="text-base font-semibold text-white">{q.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {q.options.map((option) => {
          const selected = quiz.selectedOptionId === option.id
          const revealed = quiz.showExplanation
          let style = 'border-bg-border bg-bg-secondary hover:bg-bg-elevated text-gray-300 cursor-pointer'
          if (revealed && option.isCorrect) style = 'border-green-500/60 bg-green-950/30 text-green-300 cursor-default'
          else if (revealed && selected && !option.isCorrect) style = 'border-red-500/60 bg-red-950/30 text-red-300 cursor-default'
          else if (selected && !revealed) style = 'border-amber-500/60 bg-amber-950/20 text-amber-300 cursor-pointer'

          return (
            <button
              key={option.id}
              onClick={() => quiz.selectOption(option.id)}
              disabled={quiz.showExplanation}
              className={cn('w-full text-left p-4 rounded-xl border text-sm font-medium transition-colors', style)}
            >
              {option.text}
            </button>
          )
        })}
      </div>

      {quiz.showExplanation && (
        <button
          onClick={quiz.next}
          className="py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-colors"
        >
          {quiz.currentIndex + 1 < quiz.totalQuestions ? t('study.quiz_next') : t('study.quiz_results')}
        </button>
      )}
    </div>
  )
}
