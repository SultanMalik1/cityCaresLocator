import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react"

const SelectionContext = createContext(undefined)

// Shared map ↔ sidebar selection (Phase 3)
function SelectionProvider({ children }) {
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null)

  const selectOrganization = useCallback((id) => {
    setSelectedOrganizationId((current) => (current === id ? null : id))
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedOrganizationId(null)
  }, [])

  const value = useMemo(
    () => ({
      selectedOrganizationId,
      selectOrganization,
      clearSelection,
    }),
    [selectedOrganizationId, selectOrganization, clearSelection]
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
