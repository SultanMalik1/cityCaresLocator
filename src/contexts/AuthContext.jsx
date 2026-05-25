import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import supabase, { isSupabaseConfigured } from "../hooks/supabase"

const AuthContext = createContext(undefined)

async function fetchProfile(userId) {
  if (!supabase || !userId) return null

  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, created_at")
    .eq("id", userId)
    .maybeSingle()

  if (error) {
    console.error("Profile fetch error:", error.message)
    return null
  }

  return data
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) {
      setProfile(null)
      return null
    }
    const data = await fetchProfile(authUser.id)
    setProfile(data)
    return data
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false)
      return
    }

    let active = true

    async function initSession() {
      const { data, error } = await supabase.auth.getSession()
      if (!active) return

      if (error) console.error("Session error:", error.message)

      const sessionUser = data.session?.user ?? null
      setUser(sessionUser)
      await loadProfile(sessionUser)
      setIsLoading(false)
    }

    initSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user ?? null
      setUser(sessionUser)
      await loadProfile(sessionUser)
      setIsLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [loadProfile])

  const loginWithGoogle = useCallback(async () => {
    if (!supabase) throw new Error("Supabase is not configured")

    const redirectTo = `${window.location.origin}/app`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    })

    if (error) throw error
  }, [])

  const loginWithEmail = useCallback(async (email) => {
    if (!supabase) throw new Error("Supabase is not configured")

    const redirectTo = `${window.location.origin}/app`
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    })

    if (error) throw error
  }, [])

  const logout = useCallback(async () => {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  const value = useMemo(
    () => ({
      user,
      profile,
      isLoading,
      isAuthenticated: Boolean(user),
      isAdmin: profile?.role === "admin",
      loginWithGoogle,
      loginWithEmail,
      logout,
      refreshProfile: () => loadProfile(user),
    }),
    [user, profile, isLoading, loginWithGoogle, loginWithEmail, logout, loadProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export { AuthProvider, useAuth }
