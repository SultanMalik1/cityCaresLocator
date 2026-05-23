import {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react"
import {
  getOrganizations,
  getOrganizationById,
  findOrganizationById,
} from "../hooks/apiResources"
import { isSupabaseConfigured } from "../hooks/supabase"

const EnterprisesContext = createContext()

function OrganizationsProvider({ children }) {
  const [organizations, setOrganizations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetchOrganizations = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getOrganizations()
      setOrganizations(data)
    } catch (err) {
      console.error("Error fetching organizations:", err.message)
      setError(err.message || "Could not load organizations")
      setOrganizations([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refetchOrganizations()
  }, [refetchOrganizations])

  const getOrganization = useCallback(
    async (id) => {
      const cached = findOrganizationById(organizations, id)
      if (cached) return cached
      return getOrganizationById(id)
    },
    [organizations]
  )

  const value = useMemo(
    () => ({
      organizations,
      /** @deprecated Use organizations */
      enterprises: organizations,
      isLoading,
      error,
      isSupabaseConfigured,
      getOrganization,
      /** @deprecated Use getOrganization */
      getEnterprise: getOrganization,
      refetchOrganizations,
    }),
    [organizations, isLoading, error, getOrganization, refetchOrganizations]
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
    throw new Error(
      "useEnterprises must be used within OrganizationsProvider (CitiesProvider)"
    )
  }
  return context
}

const useOrganizations = useEnterprises

export {
  OrganizationsProvider,
  OrganizationsProvider as CitiesProvider,
  useEnterprises,
  useOrganizations,
}
