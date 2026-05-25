import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import styles from "./Login.module.css"
import { useAuth } from "../contexts/AuthContext"
import { isSupabaseConfigured } from "../hooks/supabase"
import Message from "../components/Message"
import Spinner from "../components/Spinner"

function authErrorMessage(err, fallback) {
  const msg = err?.message || ""
  if (
    msg.includes("provider is not enabled") ||
    msg.includes("Unsupported provider")
  ) {
    return "Google sign-in is not enabled for this Supabase project. In the Supabase Dashboard, open Authentication → Providers, enable Google, and add your OAuth client ID and secret."
  }
  return msg || fallback
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isAdmin, isLoading, loginWithGoogle, loginWithEmail } =
    useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const returnTo = location.state?.from
  const wantsToAdd =
    returnTo === "/app/submit" || location.state?.reason === "add-organization"

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const destination =
        returnTo && returnTo !== "/login" ? returnTo : isAdmin ? "/app/admin" : "/app"
      navigate(destination, { replace: true })
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate, returnTo])

  if (!isSupabaseConfigured) {
    return (
      <main className={styles.page}>
        <Message message="Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to a .env file, then restart the dev server." />
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className={styles.page}>
        <Spinner />
      </main>
    )
  }

  async function handleGoogleLogin() {
    try {
      setError("")
      setIsSubmitting(true)
      await loginWithGoogle()
    } catch (err) {
      setError(authErrorMessage(err, "Google sign-in failed"))
      setIsSubmitting(false)
    }
  }

  async function handleEmailLogin(e) {
    e.preventDefault()
    if (!email.trim()) return

    try {
      setError("")
      setIsSubmitting(true)
      await loginWithEmail(email)
      setEmailSent(true)
    } catch (err) {
      setError(authErrorMessage(err, "Could not send magic link"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          CityCares
        </Link>
        <Link to="/app" className={styles.backLink}>
          Back to map
        </Link>
      </header>

      <div className={styles.card}>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.lead}>
          {wantsToAdd
            ? "You need to sign in before you can add an organization."
            : "Sign in to add organizations to the map. Submissions are reviewed before they go live."}
        </p>

        {error && <p className={styles.error}>{error}</p>}
        {emailSent && (
          <p className={styles.success}>
            Check your email for the sign-in link.
          </p>
        )}

        <button
          type="button"
          className={styles.googleBtn}
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
        >
          Continue with Google
        </button>

        <details className={styles.adminDetails}>
          <summary className={styles.adminSummary}>Admin sign-in</summary>
          <form onSubmit={handleEmailLogin} className={styles.adminForm}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.adminInput}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className={styles.adminBtn}
              disabled={isSubmitting}
            >
              Send magic link
            </button>
          </form>
        </details>
      </div>
    </main>
  )
}
