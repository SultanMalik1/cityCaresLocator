import { Link } from "react-router-dom"
import styles from "./Homepage.module.css"

export default function Homepage() {
  return (
    <main className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.textContent}>
          <a
            href="https://www.coalitionforthehomeless.org/get-help/"
            className={styles.learnMore}
            target="_blank"
            rel="noopener noreferrer"
          >
            Urgent Help Resources
          </a>
          <h2>
            Discover all{" "}
            <span className={styles.highlight}>Support Networks</span>
          </h2>
          <p>
            All resources for people in unstable housing situations in one
            place.
          </p>
          <Link to="/app/enterprises">
            <button className={styles.joinMovement}>
              Search for organizations →
            </button>
          </Link>
          <p className={styles.note}>
            Explore this map for details on organizations aiding those in
            unstable housing. Easily find phone numbers, websites, descriptions,
            and locations. Search based on your specific needs to locate the
            right organization for assistance.
          </p>
        </div>
        <div className={styles.imageContent}>
          <img
            src="https://www.freep.com/gcdn/-mm-/846e691ab0c496abb7bf584deaa1b99c7a07f88f/c=0-225-2029-1371/local/-/media/2018/01/05/DetroitFreeP/DetroitFreePress/636507722325916901-ruck-homeless-CP.jpg?width=2029&height=1146&fit=crop&format=pjpg&auto=webp"
            alt="Support networks"
          />
        </div>
      </div>
    </main>
  )
}
