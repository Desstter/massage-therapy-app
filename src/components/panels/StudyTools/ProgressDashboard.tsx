import { useStudyStore } from '../../../store/studyStore'
import { useProgressStore } from '../../../store/progressStore'
import { ProgressRing } from '../../shared/ProgressRing'
import { getRetentionRate } from '../../../utils/sm2'

export function ProgressDashboard() {
  const { cards, sessions } = useStudyStore()
  const { studyStreak } = useProgressStore()

  const totalCards = cards.length
  const reviewedCards = cards.filter((c) => c.totalReviews > 0).length
  const matureCards = cards.filter((c) => c.interval >= 21).length
  const retentionRate = getRetentionRate(cards)


  return (
    <div className="max-w-3xl">
      {/* Top stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Study Streak', value: `${studyStreak}d`, color: '#f59e0b', sub: 'days in a row' },
          { label: 'Cards Reviewed', value: reviewedCards, color: '#22c55e', sub: `of ${totalCards}` },
          { label: 'Mature Cards', value: matureCards, color: '#3b82f6', sub: 'interval ≥ 21 days' },
          { label: 'Retention Rate', value: `${retentionRate}%`, color: '#a855f7', sub: 'of reviewed cards' },
        ].map((s) => (
          <div key={s.label} className="p-4 bg-bg-secondary rounded-xl border border-bg-border text-center">
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs font-semibold text-gray-300 mt-0.5">{s.label}</p>
            <p className="text-xs text-gray-500">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Study sessions */}
      {sessions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Recent Sessions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 uppercase border-b border-bg-border">
                  <th className="text-left pb-2">Date</th>
                  <th className="text-right pb-2">Cards</th>
                  <th className="text-right pb-2">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-border">
                {sessions.slice(-10).reverse().map((s) => (
                  <tr key={s.id} className="text-gray-300">
                    <td className="py-2">{s.date}</td>
                    <td className="py-2 text-right">{s.cardsReviewed}</td>
                    <td className="py-2 text-right">{s.durationMinutes}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ease factor distribution */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Card Maturity</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'New', count: cards.filter((c) => c.totalReviews === 0).length, color: '#6b7280' },
            { label: 'Learning', count: cards.filter((c) => c.totalReviews > 0 && c.interval < 21).length, color: '#f59e0b' },
            { label: 'Mature', count: matureCards, color: '#22c55e' },
          ].map((s) => (
            <div key={s.label} className="p-4 bg-bg-secondary rounded-xl border border-bg-border flex items-center gap-3">
              <ProgressRing
                percent={totalCards > 0 ? Math.round((s.count / totalCards) * 100) : 0}
                size={48}
                strokeWidth={5}
                color={s.color}
                label={`${totalCards > 0 ? Math.round((s.count / totalCards) * 100) : 0}%`}
              />
              <div>
                <p className="text-sm font-semibold text-white">{s.count}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
