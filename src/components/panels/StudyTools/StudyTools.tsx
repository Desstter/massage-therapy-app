import { useState } from 'react'
import { BookOpen, HelpCircle, BarChart2 } from 'lucide-react'
import { SectionHeader } from '../../shared/SectionHeader'
import { TabBar } from '../../shared/TabBar'
import { FlashcardSession } from './FlashcardSession'
import { QuizLauncher } from './QuizLauncher'
import { ProgressDashboard } from './ProgressDashboard'

type StudyTab = 'flashcards' | 'quiz' | 'progress'

const TABS = [
  { id: 'flashcards' as StudyTab, label: 'Flashcards', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'quiz' as StudyTab, label: 'Quiz', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 'progress' as StudyTab, label: 'Progress', icon: <BarChart2 className="w-4 h-4" /> },
]

export function StudyTools() {
  const [tab, setTab] = useState<StudyTab>('flashcards')

  return (
    <div className="flex flex-col h-full">
      <SectionHeader
        title="Study Tools"
        subtitle="Spaced repetition flashcards, quizzes & progress tracking"
        icon={<BookOpen className="w-5 h-5" />}
      />

      <TabBar tabs={TABS} active={tab} onChange={setTab} className="mb-5" />

      <div className="flex-1 overflow-y-auto">
        {tab === 'flashcards' && <FlashcardSession />}
        {tab === 'quiz' && <QuizLauncher />}
        {tab === 'progress' && <ProgressDashboard />}
      </div>
    </div>
  )
}
