export type ContraindicationType = 'absolute' | 'relative'
export type RiskLevel = 'high' | 'moderate' | 'low'

export interface Contraindication {
  id: string
  condition: string
  conditionEs?: string
  type: ContraindicationType
  riskLevel: RiskLevel
  reasoning: string
  reasoningEs?: string
  exceptionsOrModifications: string[]
  exceptionsOrModificationsEs?: string[]
  affectedTechniques: string[]
  affectedRegions: string[]
  mosbyChapter: number
}

export interface SpecialPopulation {
  id: string
  name: string
  nameEs?: string
  description: string
  descriptionEs?: string
  considerations: string[]
  considerationsEs?: string[]
  recommendedTechniques: string[]
  techniquesToAvoid: string[]
  positioningNotes: string[]
  positioningNotesEs?: string[]
  pressureGuidelines: string
  pressureGuidelinesEs?: string
  communicationTips: string[]
  communicationTipsEs?: string[]
}

export interface SOAPSection {
  label: string
  acronymExpansion: string
  description: string
  exampleContent: string[]
  promptQuestions: string[]
}

export interface TherapeuticEffect {
  id: string
  bodySystem: string
  effects: string[]
  mechanisms: string[]
  relevantTechniques: string[]
  mosbyCrossRef: string
}
