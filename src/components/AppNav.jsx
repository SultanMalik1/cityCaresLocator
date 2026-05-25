import { NavLink, Link } from "react-router-dom"
import styles from "./AppNav.module.css"
import { useAuth } from "../contexts/AuthContext"
import { useIsMobile } from "../hooks/useIsMobile"

function AppNav() {
  const { isAuthenticated, isAdmin } = useAuth()
  const isMobile = useIsMobile()

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        <li>
          <NavLink to="." end>
            Organizations
          </NavLink>
        </li>

        {isAuthenticated && !isMobile && (
          <li>
            <NavLink to="submit">Add organization</NavLink>
          </li>
        )}

        {isAuthenticated && isAdmin && (
          <li>
            <NavLink to="admin">Admin</NavLink>
          </li>
        )}

        <li className={styles.spacer} />

        {!isAuthenticated ? (
          <li>
            <Link to="/login" className={styles.signIn}>
              Sign in
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  )
}

export default AppNav
