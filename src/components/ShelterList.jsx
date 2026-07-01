import { useEffect, useRef, useCallback } from "react"
import ShelterItem from "./ShelterItem"
import styles from "./EnterpriseList.module.css"
import Spinner from "./Spinner"
import Message from "./Message"
import { useEnterprises } from "../contexts/EnterprisesContext"
import { useSelection } from "../contexts/SelectionContext"
import { useShelterFilter } from "../contexts/ShelterFilterContext"

function FilterGroup({ label, children }) {
  return (
    <div className={styles.chips} role="group" aria-label={label}>
      {children}
    </div>
  )
}

function ShelterList() {
  const { isLoading, error, isSupabaseConfigured, shelterSites } =
    useEnterprises()
  const {
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
    populationFilters,
    serviceFilters,
    typeFilters,
  } = useShelterFilter()
  const { selectedShelterId } = useSelection()
  const itemRefs = useRef({})

  const list = Array.isArray(shelterSites) ? shelterSites : []

  const setItemRef = useCallback((id) => {
    return (el) => {
      if (el) itemRefs.current[id] = el
      else delete itemRefs.current[id]
    }
  }, [])

  useEffect(() => {
    if (!selectedShelterId) return

    const frame = requestAnimationFrame(() => {
      const el = itemRefs.current[selectedShelterId]
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    })

    return () => cancelAnimationFrame(frame)
  }, [selectedShelterId])

  if (isLoading) return <Spinner />

  if (!isSupabaseConfigured) {
    return (
      <Message message="Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to a .env file, then restart the dev server." />
    )
  }

  if (error) {
    return <Message message={error} />
  }

  if (!list.length) {
    return (
      <Message message="No active shelter sites found. In Supabase, check that shelter_sites.is_active is true and coordinates are set." />
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <FilterGroup label="Filter by population">
          {populationFilters.map((filter) => {
            const isActive = selectedPopulations.includes(filter.id)
            return (
              <button
                key={filter.id}
                type="button"
                className={`${styles.chip} ${isActive ? styles.chipActive : ""}`}
                onClick={() => togglePopulation(filter.id)}
                aria-pressed={isActive}
              >
                {filter.label}
              </button>
            )
          })}
        </FilterGroup>

        <FilterGroup label="Filter by service">
          {serviceFilters.map((filter) => {
            const isActive = selectedServices.includes(filter.id)
            return (
              <button
                key={filter.id}
                type="button"
                className={`${styles.chip} ${isActive ? styles.chipActive : ""}`}
                onClick={() => toggleService(filter.id)}
                aria-pressed={isActive}
              >
                {filter.label}
              </button>
            )
          })}
        </FilterGroup>

        <FilterGroup label="Filter by shelter type">
          {typeFilters.map((filter) => {
            const isActive = selectedTypes.includes(filter.id)
            return (
              <button
                key={filter.id}
                type="button"
                className={`${styles.chip} ${isActive ? styles.chipActive : ""}`}
                onClick={() => toggleType(filter.id)}
                aria-pressed={isActive}
              >
                {filter.label}
              </button>
            )
          })}
        </FilterGroup>

        <FilterGroup label="Filter by hours">
          <button
            type="button"
            className={`${styles.chip} ${only24_7 ? styles.chipActive : ""}`}
            onClick={toggle24_7}
            aria-pressed={only24_7}
          >
            Open 24/7
          </button>
        </FilterGroup>

        <input
          type="search"
          placeholder="Search shelters by name or keyword"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
          aria-label="Search shelters"
        />

        {hasActiveFilters && (
          <button
            type="button"
            className={styles.clearFilters}
            onClick={clearFilters}
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredShelters.length === 0 ? (
        <Message message="No shelters match these filters." />
      ) : (
        <ul className={styles.CityList}>
          {filteredShelters.map((shelter) => (
            <ShelterItem
              shelter={shelter}
              key={shelter.id}
              ref={setItemRef(shelter.id)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default ShelterList
