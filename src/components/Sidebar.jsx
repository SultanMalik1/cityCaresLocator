import { Outlet, Link } from "react-router-dom"
import styles from "./Sidebar.module.css"
import AppNav from "./AppNav"

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          CityCares
        </Link>
        <Link to="/" className={styles.homeLink}>
          Home
        </Link>
      </header>

      <AppNav />

      <div className={styles.content}>
        <Outlet />
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerText}>NYC housing resources</span>
      </footer>
    </aside>
  )
}

export default Sidebar
