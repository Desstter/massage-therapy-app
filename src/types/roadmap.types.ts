export type WeekStatus = 'locked' | 'available' | 'in-progress' | 'completed'

export type BloomLevel = 'remember' | 'understand' | 'apply' | 'analyze'

export interface LearningObjective {
  id: string
  text: string
  completed: boolean
  bloomLevel: BloomLevel
}

export interface RoadmapWeek {
  week: number
  title: string
  subtitle: string
  status: WeekStatus
  topics: string[]
  objectives: LearningObjective[]
  relatedMuscles: string[]
  relatedTechniques: string[]
  mosbyChapters: number[]
  keyTerms: string[]
  practiceActivities: string[]
  estimatedHours: number
}
