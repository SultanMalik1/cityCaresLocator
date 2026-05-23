import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react"
import { getData } from "../hooks/apiResources"
import { isSupabaseConfigured } from "../hooks/supabase"

const EnterprisesContext = createContext()

function CitiesProvider({ children }) {
  const [enterprises, setEnterprises] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchEnterprises() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getData()
        setEnterprises(data)
      } catch (err) {
        console.error("Error fetching data:", err.message)
        setError(err.message || "Could not load organizations")
        setEnterprises([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchEnterprises()
  }, [])

  const filterEnterprises = useCallback(
    (searchInput) => {
      const list = Array.isArray(enterprises) ? enterprises : []
      const query = searchInput.trim().toLowerCase()
      if (!query) return list

      return list.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          item.oneliner?.toLowerCase().includes(query) ||
          (item.notes && item.notes.toLowerCase().includes(query))
      )
    },
    [enterprises]
  )

  const value = useMemo(
    () => ({
      enterprises,
      isLoading,
      error,
      isSupabaseConfigured,
      filterEnterprises,
    }),
    [enterprises, isLoading, error, filterEnterprises]
  )

  return (
    <EnterprisesContext.Provider value={value}>
      {children}
    </EnterprisesContext.Provider>
  )
}

function useEnterprises() {
  const context = useContext(EnterprisesContext)
  if (context === undefined) {
    throw new Error("useEnterprises must be used within CitiesProvider")
  }
  return context
}

export { CitiesProvider, useEnterprises }
