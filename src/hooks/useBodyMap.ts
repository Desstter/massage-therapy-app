import { useCallback } from 'react'
import { useAnatomyStore } from '../store/anatomyStore'

export function useBodyMap() {
  const {
    selectedMuscleId,
    hoveredMuscleId,
    bodySide,
    setBodySide,
    selectMuscle,
    setHoveredMuscle,
    closeDetailPanel,
  } = useAnatomyStore()

  const handleMuscleClick = useCallback(
    (muscleId: string) => {
      if (selectedMuscleId === muscleId) {
        selectMuscle(null)
      } else {
        selectMuscle(muscleId)
      }
    },
    [selectedMuscleId, selectMuscle],
  )

  const handleMuscleEnter = useCallback(
    (muscleId: string) => setHoveredMuscle(muscleId),
    [setHoveredMuscle],
  )

  const handleMuscleLeave = useCallback(
    () => setHoveredMuscle(null),
    [setHoveredMuscle],
  )

  const getMuscleState = useCallback(
    (muscleId: string): 'default' | 'hovered' | 'selected' => {
      if (selectedMuscleId === muscleId) return 'selected'
      if (hoveredMuscleId === muscleId) return 'hovered'
      return 'default'
    },
    [selectedMuscleId, hoveredMuscleId],
  )

  const toggleSide = useCallback(() => {
    setBodySide(bodySide === 'anterior' ? 'posterior' : 'anterior')
  }, [bodySide, setBodySide])

  return {
    selectedMuscleId,
    hoveredMuscleId,
    bodySide,
    handleMuscleClick,
    handleMuscleEnter,
    handleMuscleLeave,
    getMuscleState,
    toggleSide,
    closeDetailPanel,
  }
}
