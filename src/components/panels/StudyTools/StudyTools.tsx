import { useState } from 'react'
import { BookOpen, HelpCircle, BarChart2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SectionHeader } from '../../shared/SectionHeader'
import { TabBar } from '../../shared/TabBar'
import { FlashcardSession } from './FlashcardSession'
import { QuizLauncher } from './QuizLauncher'
import { ProgressDashboard } from './ProgressDashboard'

type StudyTab = 'flashcards' | 'quiz' | 'progress'

export function StudyTools() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<StudyTab>('flashcards')

  const TABS = [
    { id: 'flashcards' as StudyTab, label: t('study.tab_flashcards'), icon: <BookOpen className="w-4 h-4" /> },
    { id: 'quiz' as StudyTab, label: t('study.tab_quiz'), icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'progress' as StudyTab, label: t('study.tab_progress'), icon: <BarChart2 className="w-4 h-4" /> },
  ]

  return (
    <div className="flex flex-col h-full">
      <SectionHeader
        title={t('study.title')}
        subtitle={t('study.subtitle')}
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
