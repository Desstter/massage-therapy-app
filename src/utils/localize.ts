/**
 * Returns the Spanish variant of a field when lang === 'es' and one exists,
 * otherwise falls back to the base English field.
 *
 * Usage:
 *   loc(muscle, 'name', lang)          → string
 *   loc(muscle, 'origin', lang)        → string[]
 */
export function loc<T extends object, K extends keyof T>(
  obj: T,
  field: K,
  lang: string,
): T[K] {
  if (lang === 'es') {
    const esKey = `${String(field)}Es` as keyof T
    if (obj[esKey] !== undefined) return obj[esKey] as T[K]
  }
  return obj[field]
}
