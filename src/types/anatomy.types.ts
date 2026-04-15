import type { MuscleRegion, BodyLayer } from './app.types'

export interface Muscle {
  id: string
  name: string
  latinName: string
  region: MuscleRegion
  layer: BodyLayer
  origin: string[]
  insertion: string[]
  action: string[]
  innervation: string
  bloodSupply: string
  palpationTips: string[]
  massageConsiderations: string[]
  contraindications: string[]
  commonConditions: string[]
  svgIdAnterior: string | null
  svgIdPosterior: string | null
  mosbyCrossRef: string[]
}

export interface BodyRegion {
  id: string
  name: string
  description: string
  muscles: string[]
  techniques: string[]
  drapingNotes: string[]
  commonConditions: string[]
  clientPositions: string[]
  svgRegionId: string
}

export interface FascialLine {
  id: string
  name: string
  alternateName: string
  color: string
  description: string
  path: string[]
  massageRelevance: string
  svgPathData: string
}

export interface NervePath {
  id: string
  name: string
  origin: string
  spinalLevels: string[]
  distribution: string[]
  commonEntrapmentSites: string[]
  massageConsiderations: string
  svgPathData: string
  color: string
}
