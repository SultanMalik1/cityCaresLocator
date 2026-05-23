import { Link } from "react-router-dom"
import styles from "./Homepage.module.css"

export default function HomePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>CityCares Locator</span>
        <Link to="/app" className={styles.navLink}>
          Map
        </Link>
      </header>

      <main className={styles.main}>
        <p className={styles.eyebrow}>New York City</p>
        <h1 className={styles.title}>
          Find housing and community support near you
        </h1>
        <p className={styles.lead}>
          A minimal map of nonprofits, shelters, food banks, and services for
          people facing unstable housing. Search by need and explore what is
          around you.
        </p>
        <Link to="/app" className={styles.cta}>
          Explore the map
        </Link>
      </main>

      <footer className={styles.footer}>
        <a href="mailto:sultanmalik.dev@gmail.com" className={styles.footerLink}>
          sultanmalik.dev@gmail.com
        </a>
        <span className={styles.footerDot}>·</span>
        <span>New York City</span>
      </footer>
    </div>
  )
}
