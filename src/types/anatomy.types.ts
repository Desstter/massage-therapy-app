import type { MuscleRegion, BodyLayer } from './app.types'

export interface Muscle {
  id: string
  name: string
  nameEs?: string
  latinName: string
  region: MuscleRegion
  layer: BodyLayer
  origin: string[]
  originEs?: string[]
  insertion: string[]
  insertionEs?: string[]
  action: string[]
  actionEs?: string[]
  innervation: string
  innervationEs?: string
  bloodSupply: string
  bloodSupplyEs?: string
  palpationTips: string[]
  palpationTipsEs?: string[]
  massageConsiderations: string[]
  massageConsiderationsEs?: string[]
  contraindications: string[]
  contraindicationsEs?: string[]
  commonConditions: string[]
  commonConditionsEs?: string[]
  svgIdAnterior: string | null
  svgIdPosterior: string | null
  mosbyCrossRef: string[]
}

export interface BodyRegion {
  id: string
  name: string
  nameEs?: string
  description: string
  descriptionEs?: string
  muscles: string[]
  techniques: string[]
  drapingNotes: string[]
  drapingNotesEs?: string[]
  commonConditions: string[]
  commonConditionsEs?: string[]
  clientPositions: string[]
  svgRegionId: string
}

export interface FascialLine {
  id: string
  name: string
  nameEs?: string
  alternateName: string
  color: string
  description: string
  descriptionEs?: string
  path: string[]
  pathEs?: string[]
  massageRelevance: string
  massageRelevanceEs?: string
  svgPathData: string
}

export interface NervePath {
  id: string
  name: string
  nameEs?: string
  origin: string
  originEs?: string
  spinalLevels: string[]
  distribution: string[]
  distributionEs?: string[]
  commonEntrapmentSites: string[]
  commonEntrapmentSitesEs?: string[]
  massageConsiderations: string
  massageConsiderationsEs?: string
  svgPathData: string
  color: string
}
