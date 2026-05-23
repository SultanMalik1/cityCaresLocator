import { useEffect, useRef, useCallback } from "react"
import EnterpriseItem from "./EnterpriseItem"
import styles from "./EnterpriseList.module.css"
import Spinner from "./Spinner"
import Message from "./Message"
import { useEnterprises } from "../contexts/EnterprisesContext"
import { useSelection } from "../contexts/SelectionContext"
import { useState } from "react"

function EnterpriseList() {
  const {
    enterprises,
    isLoading,
    error,
    isSupabaseConfigured,
    filterEnterprises,
  } = useEnterprises()
  const { selectedOrganizationId } = useSelection()
  const [searchInput, setSearchInput] = useState("")
  const itemRefs = useRef({})

  const list = Array.isArray(enterprises) ? enterprises : []
  const filteredCities = filterEnterprises(searchInput)

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
      <Message message="No organizations found yet. Check your Supabase organizations table." />
    )
  }

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Search for food, shelter, or jobs"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className={styles.searchInput}
      />

      {filteredCities.length === 0 ? (
        <Message message="No organizations match your search." />
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
