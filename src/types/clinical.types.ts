export type ContraindicationType = 'absolute' | 'relative'
export type RiskLevel = 'high' | 'moderate' | 'low'

export interface Contraindication {
  id: string
  condition: string
  type: ContraindicationType
  riskLevel: RiskLevel
  reasoning: string
  exceptionsOrModifications: string[]
  affectedTechniques: string[]
  affectedRegions: string[]
  mosbyChapter: number
}

export interface SpecialPopulation {
  id: string
  name: string
  description: string
  considerations: string[]
  recommendedTechniques: string[]
  techniquesToAvoid: string[]
  positioningNotes: string[]
  pressureGuidelines: string
  communicationTips: string[]
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
