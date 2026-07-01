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
import { filterShelters } from "../utils/filterShelters"
import {
  SHELTER_POPULATION_FILTERS,
  SHELTER_SERVICE_FILTERS,
  SHELTER_TYPE_FILTERS,
} from "../constants/shelters"

const ShelterFilterContext = createContext(undefined)

function ShelterFilterProvider({ children }) {
  const { shelterSites } = useEnterprises()
  const { selectedShelterId, clearSelection } = useSelection()
  const [search, setSearch] = useState("")
  const [selectedPopulations, setSelectedPopulations] = useState([])
  const [selectedServices, setSelectedServices] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [only24_7, setOnly24_7] = useState(false)

  const filteredShelters = useMemo(
    () =>
      filterShelters(shelterSites, {
        search,
        populations: selectedPopulations,
        services: selectedServices,
        types: selectedTypes,
        only24_7,
      }),
    [
      shelterSites,
      search,
      selectedPopulations,
      selectedServices,
      selectedTypes,
      only24_7,
    ],
  )

  const togglePopulation = useCallback((id) => {
    setSelectedPopulations((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    )
  }, [])

  const toggleService = useCallback((id) => {
    setSelectedServices((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    )
  }, [])

  const toggleType = useCallback((id) => {
    setSelectedTypes((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    )
  }, [])

  const toggle24_7 = useCallback(() => {
    setOnly24_7((current) => !current)
  }, [])

  const clearFilters = useCallback(() => {
    setSearch("")
    setSelectedPopulations([])
    setSelectedServices([])
    setSelectedTypes([])
    setOnly24_7(false)
  }, [])

  const hasActiveFilters =
    search.trim().length > 0 ||
    selectedPopulations.length > 0 ||
    selectedServices.length > 0 ||
    selectedTypes.length > 0 ||
    only24_7

  useEffect(() => {
    if (!selectedShelterId) return

    const stillVisible = filteredShelters.some(
      (shelter) => String(shelter.id) === String(selectedShelterId),
    )
    if (!stillVisible) clearSelection()
  }, [filteredShelters, selectedShelterId, clearSelection])

  const value = useMemo(
    () => ({
      search,
      setSearch,
      selectedPopulations,
      selectedServices,
      selectedTypes,
      only24_7,
      togglePopulation,
      toggleService,
      toggleType,
      toggle24_7,
      clearFilters,
      hasActiveFilters,
      filteredShelters,
      populationFilters: SHELTER_POPULATION_FILTERS,
      serviceFilters: SHELTER_SERVICE_FILTERS,
      typeFilters: SHELTER_TYPE_FILTERS,
    }),
    [
      search,
      selectedPopulations,
      selectedServices,
      selectedTypes,
      only24_7,
      togglePopulation,
      toggleService,
      toggleType,
      toggle24_7,
      clearFilters,
      hasActiveFilters,
      filteredShelters,
    ],
  )

  return (
    <ShelterFilterContext.Provider value={value}>
      {children}
    </ShelterFilterContext.Provider>
  )
}

function useShelterFilter() {
  const context = useContext(ShelterFilterContext)
  if (context === undefined) {
    throw new Error("useShelterFilter must be used within ShelterFilterProvider")
  }
  return context
}

export { ShelterFilterProvider, useShelterFilter }
