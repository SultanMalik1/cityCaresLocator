import { Link } from "react-router-dom"
import styles from "./Homepage.module.css"

export default function HomePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>City Cares Locator</span>
        <Link to="/app/enterprises" className={styles.navLink}>
          Map
        </Link>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Housing support resources in New York City
        </h1>
        <p className={styles.lead}>
          A map of organizations helping people facing unstable housing.
          Find shelters, food banks, legal aid, and community services near you.
        </p>
        <Link to="/app/enterprises" className={styles.cta}>
          Open map →
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
