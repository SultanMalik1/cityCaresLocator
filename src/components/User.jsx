import { Link } from "react-router-dom"
import styles from "./User.module.css"
import { useAuth } from "../contexts/AuthContext"

function User() {
  const { user, isAdmin, logout } = useAuth()

  if (!user) return null

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User"

  const avatar =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    null

  async function handleLogout() {
    try {
      await logout()
    } catch (err) {
      console.error(err.message)
    }
  }

  return (
    <div className={styles.user}>
      {avatar ? (
        <img src={avatar} alt="" className={styles.avatar} />
      ) : (
        <span className={styles.avatarPlaceholder} aria-hidden>
          {displayName.charAt(0).toUpperCase()}
        </span>
      )}
      <div className={styles.info}>
        <span className={styles.name}>{displayName}</span>
        {isAdmin && <span className={styles.badge}>Admin</span>}
      </div>
      <Link to="/app/submit" className={styles.addLink}>
        Add
      </Link>
      <button type="button" onClick={handleLogout} className={styles.logout}>
        Sign out
      </button>
    </div>
  )
}

export default User
