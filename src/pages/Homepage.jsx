import { Link } from "react-router-dom"
import styles from "./Homepage.module.css"

const initiatives = [
  {
    title: "Community Outreach",
    description:
      "We’re building bridges between people and the organizations that serve them. Whether it’s food, shelter, legal aid, or support groups, our outreach efforts aim to connect individuals with services that make a real difference in their lives.",
    bgColor: styles.greenCard,
  },
  {
    title: "Youth Education",
    description:
      "We’re working on updating our map to make it easier for young people to find volunteer opportunities. By connecting youth with mentorship programs, community service initiatives, and organizations in need of support, we’re helping them build confidence, leadership skills, and a stronger sense of purpose.",
    bgColor: styles.yellowCard,
  },
  {
    title: "Health & Wellness",
    description:
      "Everyone deserves access to care. We spotlight organizations focused on mental health, substance recovery, and overall well-being to ensure people can find healing, hope, and support — when and where they need it most.",
    bgColor: styles.purpleCard,
  },
  {
    title: "Elder Care",
    description:
      "From housing support to wellness checks, we help our seniors stay connected and cared for by highlighting trusted resources that understand the unique needs of older adults in our communities.",
    bgColor: styles.greenCard,
  },
]

export default function HomePage() {
  return (
    <>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.navbarInner}>
          <div className={styles.navLeft}>City Cares Locator</div>
          <Link to="/app/enterprises">
            <button className={styles.navButton}>Explore Map</button>
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Supporting Our Community Together
          </h1>
          <p className={styles.heroSubtext}>
            A map showcasing all <em>organizations</em> dedicated to supporting
            people facing unstable housing in New York.
          </p>
          <Link to="/app/enterprises">
            <button className={styles.exploreButton}>
              Click To Explore Map
            </button>
          </Link>
        </div>
        {/* <div className={styles.imageWrapper}>
          <img
            src="/hero.jpg"
            alt="Community support"
            className={styles.heroImage}
          />
        </div> */}
      </section>

      {/* INITIATIVES SECTION */}
      <section className={styles.initiativesSection}>
        <div className={styles.leftPanel}>
          <h2 className={styles.heading}>Our Core Initiatives</h2>
          <p className={styles.description}>
            Driving meaningful change by meeting real needs, right here in our
            city.
          </p>
        </div>

        <div className={styles.cardsPanel}>
          {initiatives.map((item, index) => (
            <div key={index} className={`${styles.card} ${item.bgColor}`}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* UPCOMING FEATURES SECTION */}
      <section className={styles.featuresSection}>
        <h2 className={styles.featuresHeading}>Upcoming Features</h2>
        <p className={styles.featuresIntro}>
          We’re constantly building to make CityCares more powerful, accessible,
          and community-driven. Here’s what’s coming soon:
        </p>

        <div className={styles.featuresGrid}>
          <div className={styles.featureItem}>
            <span className={styles.icon}>🔐</span>
            <div>
              <h3 className={styles.featureTitle}>Secure Admin Portal</h3>
              <p className={styles.featureDescription}>
                Verified admins will be able to log in and safely add or update
                organizations.
              </p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.icon}>🏠</span>
            <div>
              <h3 className={styles.featureTitle}>Expanded Listings</h3>
              <p className={styles.featureDescription}>
                We’re adding all NYC shelters, food banks, and community orgs to
                make sure no one is left out.
              </p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.icon}>💬</span>
            <div>
              <h3 className={styles.featureTitle}>Community Chat</h3>
              <p className={styles.featureDescription}>
                A safe space for people to talk, share tips, and support each
                other — especially those experiencing homelessness.
              </p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.icon}>🧑‍🤝‍🧑</span>
            <div>
              <h3 className={styles.featureTitle}>Volunteer Matching</h3>
              <p className={styles.featureDescription}>
                A system to connect volunteers directly with people in need for
                real, human support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className={styles.contactSection}>
        <h2 className={styles.contactHeading}>Get in Touch</h2>
        <p className={styles.contactSubheading}>
          Reach Out or Volunteer With Us
        </p>

        <form
          className={styles.contactForm}
          onSubmit={(e) => e.preventDefault()}
        >
          <div className={styles.row}>
            <input type="text" placeholder="First name *" required />
            <input type="text" placeholder="Last name *" required />
          </div>
          <div className={styles.row}>
            <input type="email" placeholder="Email *" required />
            <input type="text" placeholder="Interested in" />
          </div>
          <textarea rows="5" placeholder="Message" />
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
      </section>

      {/* ABOUT SECTION */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutText}>
          <h2 className={styles.aboutHeading}>
            Connecting Hearts and Helping Hands
          </h2>
          <p className={styles.aboutSubheading}>
            Together, we’re creating a stronger, more compassionate New York
            City.
          </p>
          <p className={styles.aboutParagraph}>
            CityCares was built to make support simple to find — especially for
            those facing housing insecurity. We partner with organizations,
            verify services, and use intuitive tools like map-based search and
            personalized filters to help people get the help they need, fast.
            <br />
            <br />
            This isn’t just a project — it’s a mission. One based on trust,
            care, and community. Because when people are supported,
            neighborhoods thrive.
          </p>
        </div>
        <div className={styles.aboutImageWrapper}>
          <img
            src="/about.jpg"
            alt="Volunteers helping"
            className={styles.aboutImage}
          />
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <h2 className={styles.footerBrand}>City Cares Locator</h2>
          <div className={styles.footerInfo}>
            <p>sultanmalik.dev@gmail.com</p>
          </div>
          <p className={styles.footerAddress}>New York City</p>
        </div>
      </footer>
    </>
  )
}
