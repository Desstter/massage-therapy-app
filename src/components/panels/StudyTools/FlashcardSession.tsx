import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSpacedRepetition } from '../../../hooks/useSpacedRepetition'
import { useStudyStore } from '../../../store/studyStore'
import { Badge } from '../../shared/Badge'
import type { BadgeVariant } from '../../shared/Badge'
import type { SM2Rating } from '../../../types/study.types'
import { cn } from '../../../utils/cn'

const difficultyColors: Record<number, BadgeVariant> = { 1: 'green', 2: 'green', 3: 'amber', 4: 'orange', 5: 'red' }

export function FlashcardSession() {
  const { t } = useTranslation()
  const { stats, ensureCards, startDueSession, startCategorySession, rate, endSession } =
    useSpacedRepetition()
  const { activeSessionCardIds, currentCardIndex, getCardById } = useStudyStore()

  const [flipped, setFlipped] = useState(false)

  useEffect(() => { ensureCards() }, [ensureCards])

  const inSession = activeSessionCardIds.length > 0 && currentCardIndex < activeSessionCardIds.length
  const currentCard = inSession ? getCardById(activeSessionCardIds[currentCardIndex]) : null
  const sessionDone = activeSessionCardIds.length > 0 && currentCardIndex >= activeSessionCardIds.length

  function handleRate(rating: SM2Rating) {
    if (!currentCard) return
    rate(currentCard.id, rating)
    setFlipped(false)
  }

  function handleCardKeyDown(e: React.KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      if (!flipped) setFlipped(true)
    }
    if (flipped) {
      const keyMap: Record<string, SM2Rating> = { '1': 0, '2': 2, '3': 4, '4': 5 }
      const rating = keyMap[e.key]
      if (rating !== undefined) handleRate(rating)
    }
  }

  if (sessionDone) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-5">
        <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
          <Check className="w-8 h-8 text-green-400" />
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-white">{t('study.session_complete')}</p>
          <p className="text-sm text-gray-400 mt-1">{t('study.cards_reviewed', { count: activeSessionCardIds.length })}</p>
        </div>
        <button
          onClick={() => { endSession(); setFlipped(false) }}
          className="px-5 py-2.5 bg-amber-500 text-black text-sm font-bold rounded-xl hover:bg-amber-400 transition-colors"
        >
          {t('study.back_dashboard')}
        </button>
      </div>
    )
  }

  if (!inSession) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: t('study.total_cards'), value: stats.total, color: '#6b7280' },
            { label: t('study.due_now'), value: stats.due, color: '#f59e0b' },
            { label: t('study.reviewed'), value: stats.reviewed, color: '#22c55e' },
            { label: t('study.mature'), value: stats.mature, color: '#3b82f6' },
          ].map((s) => (
            <div key={s.label} className="p-5 bg-bg-secondary rounded-2xl border border-bg-border text-center">
              <p className="font-display text-4xl font-semibold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Start buttons */}
        <div className="space-y-3">
          <button
            disabled={stats.due === 0}
            onClick={startDueSession}
            className={cn(
              'w-full py-5 rounded-2xl text-base font-bold transition-all',
              stats.due > 0
                ? 'bg-amber-500 text-black hover:bg-amber-400'
                : 'bg-bg-secondary text-gray-600 border border-bg-border cursor-not-allowed',
            )}
          >
            {stats.due > 0 ? t('study.study_due', { count: stats.due }) : t('study.no_cards_due')}
          </button>

          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'Anatomy', label: t('study.anatomy_cat') },
              { key: 'Techniques', label: t('study.techniques_cat') },
              { key: 'Clinical', label: t('study.clinical_cat') },
              { key: 'Integration', label: t('study.integration_cat') },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => startCategorySession(cat.key)}
                className="py-3.5 rounded-xl text-sm font-medium border border-bg-border bg-bg-secondary text-gray-300 hover:bg-bg-elevated hover:text-white transition-colors"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* SM-2 key */}
        <div className="mt-8 p-5 bg-bg-secondary rounded-2xl border border-bg-border">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">{t('study.rating_scale')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: t('study.again_label'), desc: t('study.again_desc'), color: 'text-red-400' },
              { label: t('study.hard_label'), desc: t('study.hard_desc'), color: 'text-orange-400' },
              { label: t('study.good_label'), desc: t('study.good_desc'), color: 'text-amber-400' },
              { label: t('study.easy_label'), desc: t('study.easy_desc'), color: 'text-green-400' },
            ].map((r) => (
              <div key={r.label} className="text-center">
                <p className={cn('text-sm font-bold', r.color)}>{r.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const progress = (currentCardIndex / activeSessionCardIds.length) * 100

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs text-gray-500">{currentCardIndex}/{activeSessionCardIds.length}</span>
      </div>

      {/* Card */}
      {currentCard && (
        <div
          role="button"
          tabIndex={0}
          aria-label={flipped ? `Answer: ${currentCard.back}` : `Question: ${currentCard.front}. Press Space to reveal answer.`}
          className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-2xl"
          onClick={() => setFlipped((f) => !f)}
          onKeyDown={handleCardKeyDown}
          style={{ perspective: '1200px' }}
        >
          <motion.div
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="relative min-h-72"
          >
            {/* Front */}
            <div
              style={{ backfaceVisibility: 'hidden' }}
              className="absolute inset-0 bg-bg-secondary border border-bg-border rounded-2xl p-6 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <Badge variant={difficultyColors[currentCard.difficulty]} size="sm">
                  {t('study.difficulty')} {currentCard.difficulty}
                </Badge>
                <Badge variant="gray" size="sm">{currentCard.category}</Badge>
              </div>
              <p className="font-display text-2xl font-medium text-white text-center flex-1 flex items-center justify-center px-4 leading-snug">
                {currentCard.front}
              </p>
              {currentCard.hint && (
                <p className="text-xs text-gray-500 text-center mt-3 italic">{currentCard.hint}</p>
              )}
              <p className="text-xs text-gray-600 text-center mt-3">{t('study.reveal_hint')}</p>
            </div>

            {/* Back */}
            <div
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              className="absolute inset-0 bg-amber-950/20 border border-amber-500/40 rounded-2xl p-6 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="amber" size="sm">{currentCard.type}</Badge>
              </div>
              <p className="text-lg text-gray-200 leading-relaxed flex-1 flex items-center px-2">
                {currentCard.back}
              </p>
              <p className="text-xs text-gray-500 text-center mt-2">{t('study.rate_recall')}</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Rating buttons */}
      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="grid grid-cols-4 gap-2"
          >
            {[
              { rating: 0 as SM2Rating, label: t('study.again_btn'), key: '1', color: 'bg-red-500/15 border-red-500/40 text-red-400 hover:bg-red-500/25' },
              { rating: 2 as SM2Rating, label: t('study.hard_btn'), key: '2', color: 'bg-orange-500/15 border-orange-500/40 text-orange-400 hover:bg-orange-500/25' },
              { rating: 4 as SM2Rating, label: t('study.good_btn'), key: '3', color: 'bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500/25' },
              { rating: 5 as SM2Rating, label: t('study.easy_btn'), key: '4', color: 'bg-green-500/15 border-green-500/40 text-green-400 hover:bg-green-500/25' },
            ].map(({ rating, label, key, color }) => (
              <button
                key={rating}
                onClick={() => handleRate(rating)}
                className={cn('py-4 rounded-xl border text-sm font-bold transition-colors flex flex-col items-center gap-0.5', color)}
              >
                <span>{label}</span>
                <span className="text-xs opacity-50 font-normal">[{key}]</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
