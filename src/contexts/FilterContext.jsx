import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useEnterprises } from "./EnterprisesContext"
import { useSelection } from "./SelectionContext"
import { filterOrganizations } from "../utils/filterOrganizations"

const FilterContext = createContext(undefined)

function FilterProvider({ children }) {
  const { enterprises } = useEnterprises()
  const { selectedOrganizationId, clearSelection } = useSelection()
  const [search, setSearch] = useState("")
  const [selectedNeeds, setSelectedNeeds] = useState([])

  const filteredOrganizations = useMemo(
    () =>
      filterOrganizations(enterprises, {
        search,
        needs: selectedNeeds,
      }),
    [enterprises, search, selectedNeeds]
  )

  const toggleNeed = useCallback((needId) => {
    setSelectedNeeds((current) =>
      current.includes(needId)
        ? current.filter((id) => id !== needId)
        : [...current, needId]
    )
  }, [])

  const clearFilters = useCallback(() => {
    setSearch("")
    setSelectedNeeds([])
  }, [])

  const hasActiveFilters =
    search.trim().length > 0 || selectedNeeds.length > 0

  useEffect(() => {
    if (!selectedOrganizationId) return

    const stillVisible = filteredOrganizations.some(
      (org) => String(org.id) === String(selectedOrganizationId)
    )
    if (!stillVisible) clearSelection()
  }, [filteredOrganizations, selectedOrganizationId, clearSelection])

  const value = useMemo(
    () => ({
      search,
      setSearch,
      selectedNeeds,
      toggleNeed,
      clearFilters,
      hasActiveFilters,
      filteredOrganizations,
    }),
    [
      search,
      selectedNeeds,
      toggleNeed,
      clearFilters,
      hasActiveFilters,
      filteredOrganizations,
    ]
  )

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  )
}

function useFilter() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilter must be used within FilterProvider")
  }
  return context
}

export { FilterProvider, useFilter }
