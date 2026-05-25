import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
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
  const { isAuthenticated, isAdmin, isLoading, loginWithGoogle, loginWithEmail } =
    useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(isAdmin ? "/app/admin" : "/app", { replace: true })
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate])

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
          Contributors use Google. Admins use a magic link sent to their email.
        </p>

        {error && <p className={styles.error}>{error}</p>}
        {emailSent && (
          <p className={styles.success}>
            Check your email for the sign-in link.
          </p>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contributor</h2>
          <button
            type="button"
            className={styles.googleBtn}
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
          >
            Continue with Google
          </button>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Admin</h2>
          <form onSubmit={handleEmailLogin} className={styles.emailForm}>
            <label htmlFor="email" className={styles.label}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={isSubmitting}
            >
              Send magic link
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
