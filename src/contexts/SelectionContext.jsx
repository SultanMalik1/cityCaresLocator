import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react"

const SelectionContext = createContext(undefined)

// Shared map ↔ sidebar selection
function SelectionProvider({ children }) {
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null)
  const [selectedShelterId, setSelectedShelterId] = useState(null)

  const selectOrganization = useCallback((id) => {
    setSelectedShelterId(null)
    setSelectedOrganizationId((current) =>
      String(current) === String(id) ? null : id,
    )
  }, [])

  const selectShelter = useCallback((id) => {
    setSelectedOrganizationId(null)
    setSelectedShelterId((current) =>
      String(current) === String(id) ? null : id,
    )
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedOrganizationId(null)
    setSelectedShelterId(null)
  }, [])

  const value = useMemo(
    () => ({
      selectedOrganizationId,
      selectedShelterId,
      selectOrganization,
      selectShelter,
      clearSelection,
    }),
    [
      selectedOrganizationId,
      selectedShelterId,
      selectOrganization,
      selectShelter,
      clearSelection,
    ],
  )

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  )
}

function useSelection() {
  const context = useContext(SelectionContext)
  if (context === undefined) {
    throw new Error("useSelection must be used within SelectionProvider")
  }
  return context
}

export { SelectionProvider, useSelection }
