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
  getShelterSites,
  findShelterById,
} from "../hooks/apiResources"
import { isSupabaseConfigured } from "../hooks/supabase"

const EnterprisesContext = createContext()

function OrganizationsProvider({ children }) {
  const [organizations, setOrganizations] = useState([])
  const [shelterSites, setShelterSites] = useState([])
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

  const refetchShelterSites = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getShelterSites()
      setShelterSites(data)
    } catch (err) {
      console.error("Error fetching shelter sites:", err.message)
      setError(err.message || "Could not load shelter sites")
      setShelterSites([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refetchAll = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [orgs, shelters] = await Promise.all([
        getOrganizations(),
        getShelterSites(),
      ])
      setOrganizations(orgs)
      setShelterSites(shelters)
    } catch (err) {
      console.error("Error fetching resources:", err.message)
      setError(err.message || "Could not load resources")
      setOrganizations([])
      setShelterSites([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refetchAll()
  }, [refetchAll])

  const getOrganization = useCallback(
    async (id) => {
      const cached = findOrganizationById(organizations, id)
      if (cached) return cached
      return getOrganizationById(id)
    },
    [organizations]
  )

  const getShelter = useCallback(
    (id) => findShelterById(shelterSites, id),
    [shelterSites],
  )

  const value = useMemo(
    () => ({
      organizations,
      shelterSites,
      /** @deprecated Use organizations */
      enterprises: organizations,
      isLoading,
      error,
      isSupabaseConfigured,
      getOrganization,
      getShelter,
      /** @deprecated Use getOrganization */
      getEnterprise: getOrganization,
      refetchOrganizations,
      refetchShelterSites,
      refetchAll,
    }),
    [
      organizations,
      shelterSites,
      isLoading,
      error,
      getOrganization,
      getShelter,
      refetchOrganizations,
      refetchShelterSites,
      refetchAll,
    ],
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
