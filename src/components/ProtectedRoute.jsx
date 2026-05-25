import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Spinner from "./Spinner"
import Message from "./Message"
import { isSupabaseConfigured } from "../hooks/supabase"

function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const location = useLocation()

  if (!isSupabaseConfigured) {
    return (
      <Message message="Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to a .env file, then restart the dev server." />
    )
  }

  if (isLoading) return <Spinner />

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          reason:
            location.pathname === "/app/submit"
              ? "add-organization"
              : undefined,
        }}
      />
    )
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/app" replace />
  }

  return children
}

export default ProtectedRoute
