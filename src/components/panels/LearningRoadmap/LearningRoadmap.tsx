import { useState } from 'react'
import { Map, Lock, CheckCircle, Circle, ChevronDown, ChevronRight } from 'lucide-react'
import { ROADMAP } from '../../../data/roadmap'
import { useProgress } from '../../../hooks/useProgress'
import { SectionHeader } from '../../shared/SectionHeader'
import { ProgressRing } from '../../shared/ProgressRing'
import { Badge } from '../../shared/Badge'
import type { BadgeVariant } from '../../shared/Badge'
import { cn } from '../../../utils/cn'
import type { RoadmapWeek } from '../../../types/roadmap.types'

function WeekCard({ week, onSelect, isSelected }: { week: RoadmapWeek; onSelect: () => void; isSelected: boolean }) {
  const { getWeekCompletionPercent, getWeekStatus } = useProgress()
  const progress = getWeekCompletionPercent(week.week)
  const status = getWeekStatus(week.week)

  return (
    <button
      onClick={onSelect}
      disabled={status === 'locked'}
      className={cn(
        'w-full text-left p-4 rounded-xl border transition-all',
        isSelected && status !== 'locked'
          ? 'border-amber-500/50 bg-amber-500/10'
          : status === 'locked'
          ? 'border-bg-border bg-bg-secondary opacity-50 cursor-not-allowed'
          : 'border-bg-border bg-bg-secondary hover:bg-bg-elevated hover:border-amber-500/30',
      )}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          {status === 'locked' ? (
            <Lock className="w-4 h-4 text-gray-600" />
          ) : status === 'completed' ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <ProgressRing percent={progress} size={28} strokeWidth={3} label={`${progress}%`} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-amber-500">Week {week.week}</span>
            <Badge
              variant={status === 'completed' ? 'green' : status === 'in-progress' ? 'amber' : status === 'available' ? 'blue' : 'gray'}
              size="sm"
            >
              {status}
            </Badge>
          </div>
          <p className="text-sm font-semibold text-white mt-0.5 truncate">{week.title}</p>
          <p className="text-xs text-gray-500 truncate">{week.subtitle}</p>
        </div>
        {isSelected ? <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />}
      </div>
    </button>
  )
}

function WeekDetail({ week }: { week: RoadmapWeek }) {
  const { completeObjective, isObjectiveComplete, getWeekStatus } = useProgress()
  const weekStatus = getWeekStatus(week.week)
  const bloomColors: Record<string, BadgeVariant> = {
    remember: 'gray', understand: 'blue', apply: 'amber', analyze: 'purple',
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-bg-secondary rounded-xl border border-bg-border">
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="amber">Week {week.week}</Badge>
          <Badge variant="blue">{week.estimatedHours}h estimated</Badge>
          {week.mosbyChapters.map((c) => (
            <Badge key={c} variant="gray">Ch.{c}</Badge>
          ))}
        </div>
        <h2 className="text-xl font-bold text-white">{week.title}</h2>
        <p className="text-sm text-gray-400 mt-0.5">{week.subtitle}</p>
      </div>

      {/* Topics */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Topics</h3>
        <ul className="space-y-1.5">
          {week.topics.map((t, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-300">
              <span className="text-amber-500 shrink-0 mt-0.5">•</span>{t}
            </li>
          ))}
        </ul>
      </div>

      {/* Learning objectives */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
          Learning Objectives
        </h3>
        <div className="space-y-2">
          {week.objectives.map((obj) => {
            const done = isObjectiveComplete(week.week, obj.id)
            return (
              <div
                key={obj.id}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-xl border transition-colors',
                  done ? 'bg-green-950/20 border-green-500/30' : 'bg-bg-elevated border-bg-border',
                )}
              >
                <button
                  onClick={() => !done && completeObjective(week.week, obj.id)}
                  disabled={done || weekStatus === 'locked'}
                  className="shrink-0 mt-0.5"
                >
                  {done ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-600 hover:text-amber-400 transition-colors" />
                  )}
                </button>
                <div className="flex-1">
                  <p className={cn('text-sm', done ? 'text-gray-400 line-through' : 'text-gray-200')}>
                    {obj.text}
                  </p>
                  <Badge variant={bloomColors[obj.bloomLevel]} size="sm" className="mt-1">
                    {obj.bloomLevel}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Key terms */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
          Key Terms
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {week.keyTerms.map((t) => (
            <Badge key={t} variant="gray">{t}</Badge>
          ))}
        </div>
      </div>

      {/* Practice activities */}
      <div>
        <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
          Practice Activities
        </h3>
        <ul className="space-y-2">
          {week.practiceActivities.map((a, i) => (
            <li key={i} className="flex gap-2.5 p-3 bg-bg-elevated rounded-xl text-sm text-gray-300">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function LearningRoadmap() {
  const [selected, setSelected] = useState<number>(1)
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list')
  const { overallProgress, studyStreak, getWeekStatus } = useProgress()
  const selectedWeek = ROADMAP.find((w) => w.week === selected)!

  return (
    <div className="flex flex-col h-full">
      <SectionHeader
        title="Learning Roadmap"
        subtitle="16-week structured course aligned to Mosby's Fundamentals"
        icon={<Map className="w-5 h-5" />}
        actions={
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-lg font-black text-amber-400">{overallProgress()}%</p>
              <p className="text-xs text-gray-500">Overall</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-black text-green-400">{studyStreak}</p>
              <p className="text-xs text-gray-500">Streak</p>
            </div>
          </div>
        }
      />

      {/* ── Desktop layout (lg+): two-column ── */}
      <div className="hidden lg:flex gap-4 flex-1 overflow-hidden">
        {/* Week list */}
        <div className="w-80 overflow-y-auto space-y-1.5 pr-1">
          {ROADMAP.map((week) => (
            <WeekCard
              key={week.week}
              week={week}
              isSelected={selected === week.week}
              onSelect={() => setSelected(week.week)}
            />
          ))}
        </div>

        {/* Detail */}
        <div className="flex-1 overflow-hidden">
          {getWeekStatus(selectedWeek.week) === 'locked' ? (
            <div className="flex flex-col items-center justify-center h-full text-center bg-bg-secondary rounded-xl border border-bg-border">
              <Lock className="w-12 h-12 text-gray-600 mb-4" />
              <p className="text-lg font-bold text-gray-400">Week {selectedWeek.week} Locked</p>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                Complete previous week's objectives to unlock this week.
              </p>
            </div>
          ) : (
            <WeekDetail week={selectedWeek} />
          )}
        </div>
      </div>

      {/* ── Mobile layout (<lg): single-pane with view switcher ── */}
      <div className="lg:hidden flex-1 flex flex-col overflow-hidden">
        {/* View switcher */}
        <div className="flex gap-1 mb-3 bg-bg-secondary rounded-xl p-1 border border-bg-border">
          {(['list', 'detail'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setMobileView(v)}
              className={cn(
                'flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-colors',
                mobileView === v
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'text-gray-500 hover:text-gray-300',
              )}
            >
              {v}
            </button>
          ))}
        </div>

        {/* List pane */}
        {mobileView === 'list' && (
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {ROADMAP.map((week) => (
              <WeekCard
                key={week.week}
                week={week}
                isSelected={selected === week.week}
                onSelect={() => { setSelected(week.week); setMobileView('detail') }}
              />
            ))}
          </div>
        )}

        {/* Detail pane */}
        {mobileView === 'detail' && (
          <div className="flex-1 overflow-hidden">
            {getWeekStatus(selectedWeek.week) === 'locked' ? (
              <div className="flex flex-col items-center justify-center h-full text-center bg-bg-secondary rounded-xl border border-bg-border">
                <Lock className="w-12 h-12 text-gray-600 mb-4" />
                <p className="text-lg font-bold text-gray-400">Week {selectedWeek.week} Locked</p>
                <p className="text-sm text-gray-500 mt-1 max-w-xs">
                  Complete previous week's objectives to unlock this week.
                </p>
              </div>
            ) : (
              <WeekDetail week={selectedWeek} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
