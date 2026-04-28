import type { PressureLevel } from './app.types'

export type TechniqueCategory =
  | 'effleurage'
  | 'petrissage'
  | 'friction'
  | 'tapotement'
  | 'vibration'
  | 'compression'
  | 'range-of-motion'
  | 'stretching'

export type TargetTissue =
  | 'superficial-fascia'
  | 'deep-fascia'
  | 'muscle-belly'
  | 'musculotendinous-junction'
  | 'tendon'
  | 'periosteum'
  | 'joint-capsule'
  | 'skin'
  | 'lymphatic'
  | 'circulatory'

export type HandShape =
  | 'flat-palm'
  | 'fist'
  | 'fingertips'
  | 'thumb'
  | 'knuckles'
  | 'forearm'
  | 'cupped'
  | 'pincer'
  | 'braced-thumb'

export interface HandPosition {
  description: string
  descriptionEs?: string
  handShape: HandShape
  contactSurface: string
  contactSurfaceEs?: string
  bodyWeight: boolean
}

export interface TechniqueEffect {
  physiological: string[]
  physiologicalEs?: string[]
  psychological: string[]
  psychologicalEs?: string[]
  circulatory: string[]
  circulatoryEs?: string[]
  nervous: string[]
  nervousEs?: string[]
  musculoskeletal: string[]
  musculoskeletalEs?: string[]
}

export interface Technique {
  id: string
  name: string
  nameEs?: string
  category: TechniqueCategory
  subcategory: string
  subcategoryEs?: string
  description: string
  descriptionEs?: string
  detailedInstructions: string[]
  detailedInstructionsEs?: string[]
  pressure: PressureLevel
  rhythm: 'slow' | 'moderate' | 'fast' | 'variable'
  direction: string
  directionEs?: string
  duration: string
  durationEs?: string
  effects: TechniqueEffect
  indications: string[]
  indicationsEs?: string[]
  contraindications: string[]
  contraindicationsEs?: string[]
  handPositions: HandPosition[]
  targetTissue: TargetTissue[]
  variations: string[]
  variationsEs?: string[]
  applicableRegions: string[]
  mosbyChapter: number
  mosbyPageRef: string
  animationKey: string
}
