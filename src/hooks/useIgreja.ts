import { useIgreja } from '@/contexts/IgrejaContext'

/**
 * Hook to get the current igreja ID (tenant context)
 * Returns null if no igreja is selected or user has no access
 */
export function useCurrentIgrejaId(): string | null {
  const { currentIgrejaId } = useIgreja()
  return currentIgrejaId
}

/**
 * Hook to get the current igreja object
 * Returns null if loading or no igreja selected
 */
export function useCurrentIgreja() {
  const { currentIgreja, isLoading } = useIgreja()
  return { currentIgreja, isLoading }
}

/**
 * Hook to check if user can switch churches (admin only)
 */
export function useCanSwitchIgreja(): boolean {
  const { isAdmin } = useIgreja()
  return isAdmin
}

/**
 * Hook to get available igrejas for switching (admin only)
 */
export function useAvailableIgrejas() {
  const { availableIgrejas, isLoading } = useIgreja()
  return { availableIgrejas, isLoading }
}

/**
 * Hook to switch to a different igreja (admin only)
 * Throws error if user doesn't have permission
 */
export function useSetCurrentIgreja() {
  const { setCurrentIgreja } = useIgreja()
  return setCurrentIgreja
}