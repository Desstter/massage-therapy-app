import type { Muscle } from '../types/anatomy.types'
import type { Technique } from '../types/technique.types'
import type { Flashcard } from '../types/study.types'
import type { MuscleRegion, BodyLayer, FilterState } from '../types/app.types'
import type { TechniqueCategory } from '../types/technique.types'

export function filterMuscles(muscles: Muscle[], filter: FilterState): Muscle[] {
  return muscles.filter(m => {
    if (filter.search && !m.name.toLowerCase().includes(filter.search.toLowerCase()) &&
        !m.latinName.toLowerCase().includes(filter.search.toLowerCase())) return false
    if (filter.region !== 'all' && m.region !== filter.region) return false
    if (filter.layer !== 'all' && m.layer !== filter.layer) return false
    return true
  })
}

export function filterMusclesByRegion(muscles: Muscle[], region: MuscleRegion): Muscle[] {
  return muscles.filter(m => m.region === region)
}

export function filterMusclesByLayer(muscles: Muscle[], layer: BodyLayer): Muscle[] {
  return muscles.filter(m => m.layer === layer)
}

export function filterTechniques(techniques: Technique[], search: string, category: string | 'all'): Technique[] {
  return techniques.filter(t => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) &&
        !t.description.toLowerCase().includes(search.toLowerCase())) return false
    if (category !== 'all' && t.category !== category) return false
    return true
  })
}

export function filterTechniquesByCategory(techniques: Technique[], category: TechniqueCategory): Technique[] {
  return techniques.filter(t => t.category === category)
}

export function filterFlashcardsByCategory(cards: Flashcard[], category: string): Flashcard[] {
  if (category === 'all') return cards
  return cards.filter(c => c.category === category || c.tags.includes(category))
}

export function getMuscleById(muscles: Muscle[], id: string): Muscle | undefined {
  return muscles.find(m => m.id === id)
}

export function getTechniqueById(techniques: Technique[], id: string): Technique | undefined {
  return techniques.find(t => t.id === id)
}

export function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const k = String(item[key])
    if (!acc[k]) acc[k] = []
    acc[k].push(item)
    return acc
  }, {} as Record<string, T[]>)
}
