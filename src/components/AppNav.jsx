import { NavLink, Link } from "react-router-dom"
import styles from "./AppNav.module.css"
import { useAuth } from "../contexts/AuthContext"

function AppNav() {
  const { isAuthenticated, isAdmin } = useAuth()

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        <li>
          <NavLink to="." end>
            Organizations
          </NavLink>
        </li>

        {isAuthenticated ? (
          <li>
            <NavLink to="submit">Add organization</NavLink>
          </li>
        ) : (
          <li>
            <Link
              to="/login"
              state={{ from: "/app/submit", reason: "add-organization" }}
              className={styles.signIn}
            >
              Add organization (sign in)
            </Link>
          </li>
        )}

        {isAuthenticated && isAdmin && (
          <li>
            <NavLink to="admin">Admin</NavLink>
          </li>
        )}

        <li className={styles.spacer} />
      </ul>
    </nav>
  )
}

export default AppNav
