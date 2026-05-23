import { useEffect, useRef, useCallback } from "react"
import EnterpriseItem from "./EnterpriseItem"
import styles from "./EnterpriseList.module.css"
import Spinner from "./Spinner"
import Message from "./Message"
import { useEnterprises } from "../contexts/EnterprisesContext"
import { useSelection } from "../contexts/SelectionContext"
import { useFilter } from "../contexts/FilterContext"
import { NEEDS } from "../constants/needs"

function EnterpriseList() {
  const { isLoading, error, isSupabaseConfigured, organizations } =
    useEnterprises()
  const {
    search,
    setSearch,
    selectedNeeds,
    toggleNeed,
    clearFilters,
    hasActiveFilters,
    filteredOrganizations,
  } = useFilter()
  const { selectedOrganizationId } = useSelection()
  const itemRefs = useRef({})

  const list = Array.isArray(organizations) ? organizations : []
  const filteredCities = Array.isArray(filteredOrganizations)
    ? filteredOrganizations
    : []

  const setItemRef = useCallback((id) => {
    return (el) => {
      if (el) itemRefs.current[id] = el
      else delete itemRefs.current[id]
    }
  }, [])

  useEffect(() => {
    if (!selectedOrganizationId) return

    const frame = requestAnimationFrame(() => {
      const el = itemRefs.current[selectedOrganizationId]
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    })

    return () => cancelAnimationFrame(frame)
  }, [selectedOrganizationId])

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
      <Message message="No approved organizations found. In Supabase, check that organizations.status is 'approved' for rows you expect on the map." />
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <div className={styles.chips} role="group" aria-label="Filter by need">
          {NEEDS.map((need) => {
            const isActive = selectedNeeds.includes(need.id)
            return (
              <button
                key={need.id}
                type="button"
                className={`${styles.chip} ${isActive ? styles.chipActive : ""}`}
                onClick={() => toggleNeed(need.id)}
                aria-pressed={isActive}
              >
                {need.label}
              </button>
            )
          })}
        </div>

        <input
          type="search"
          placeholder="Search by name or keyword"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
          aria-label="Search organizations"
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

      {filteredCities.length === 0 ? (
        <Message message="No organizations match these filters." />
      ) : (
        <ul className={styles.CityList}>
          {filteredCities.map((city) => (
            <EnterpriseItem
              city={city}
              key={city.id}
              ref={setItemRef(city.id)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default EnterpriseList
