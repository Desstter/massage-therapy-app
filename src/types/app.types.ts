export type Section =
  | 'anatomy'
  | 'techniques'
  | 'regions'
  | 'clinical'
  | 'study'
  | 'roadmap'

export type AnatomyView = 'muscles' | 'fascia' | 'nerves'
export type BodySide = 'anterior' | 'posterior'
export type PressureLevel = 'superficial' | 'light' | 'moderate' | 'deep' | 'variable'
export type BodyLayer = 'superficial' | 'intermediate' | 'deep'

export type MuscleRegion =
  | 'back'
  | 'shoulder'
  | 'chest'
  | 'neck'
  | 'arm'
  | 'forearm'
  | 'hip-glutes'
  | 'thigh'
  | 'leg'
  | 'head'
  | 'abdomen'

export interface FilterState {
  search: string
  region: MuscleRegion | 'all'
  layer: BodyLayer | 'all'
  category: string | 'all'
}

export interface SectionMeta {
  id: Section
  label: string
  description: string
  icon: string
}
