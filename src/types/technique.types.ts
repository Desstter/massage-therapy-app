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
  handShape: HandShape
  contactSurface: string
  bodyWeight: boolean
}

export interface TechniqueEffect {
  physiological: string[]
  psychological: string[]
  circulatory: string[]
  nervous: string[]
  musculoskeletal: string[]
}

export interface Technique {
  id: string
  name: string
  category: TechniqueCategory
  subcategory: string
  description: string
  detailedInstructions: string[]
  pressure: PressureLevel
  rhythm: 'slow' | 'moderate' | 'fast' | 'variable'
  direction: string
  duration: string
  effects: TechniqueEffect
  indications: string[]
  contraindications: string[]
  handPositions: HandPosition[]
  targetTissue: TargetTissue[]
  variations: string[]
  applicableRegions: string[]
  mosbyChapter: number
  mosbyPageRef: string
  animationKey: string
}
