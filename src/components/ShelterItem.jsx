import { forwardRef } from "react"
import styles from "./EnterpriseItem.module.css"
import { useSelection } from "../contexts/SelectionContext"
import {
  formatAccessMethod,
  formatList,
  formatPopulation,
  formatService,
  formatShelterAddress,
  formatShelterSubtitle,
} from "../constants/shelters"

const ShelterItem = forwardRef(function ShelterItem({ shelter }, ref) {
  const { selectedShelterId, selectShelter } = useSelection()
  const {
    id,
    name,
    populations_served,
    services_offered,
    access_method,
    intake_notes,
    hours_text,
    is_24_7,
    phone,
    email,
    website_url,
    notes,
    source_url,
  } = shelter

  const isSelected = String(id) === String(selectedShelterId)
  const subtitle = formatShelterSubtitle(shelter)
  const address = formatShelterAddress(shelter)

  function handleSelect() {
    selectShelter(id)
  }

  function stopLinkClick(e) {
    e.stopPropagation()
  }

  return (
    <li ref={ref}>
      <div
        className={`${styles.organizationItem} ${
          isSelected ? styles["organizationItem--active"] : ""
        }`}
        onClick={handleSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleSelect()
          }
        }}
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
      >
        <h3 className={styles.name}>{name}</h3>

        {subtitle && <p className={styles.oneliner}>{subtitle}</p>}

        {isSelected && (
          <div className={styles.detail}>
            {populations_served?.length > 0 && (
              <p className={styles.meta}>
                <span className={styles.metaLabel}>Who it&apos;s for</span>
                {formatList(populations_served, formatPopulation)}
              </p>
            )}

            {services_offered?.length > 0 && (
              <p className={styles.meta}>
                <span className={styles.metaLabel}>Services</span>
                {formatList(services_offered, formatService)}
              </p>
            )}

            {(hours_text || is_24_7) && (
              <p className={styles.meta}>
                <span className={styles.metaLabel}>Hours</span>
                {is_24_7 ? "Open 24 hours" : hours_text}
              </p>
            )}

            {access_method && (
              <p className={styles.meta}>
                <span className={styles.metaLabel}>How to access</span>
                {formatAccessMethod(access_method)}
              </p>
            )}

            {intake_notes && (
              <p className={styles.summary}>{intake_notes}</p>
            )}

            {address && (
              <p className={styles.meta}>
                <span className={styles.metaLabel}>Address</span>
                {address}
              </p>
            )}

            {notes && <p className={styles.summary}>{notes}</p>}

            {phone && (
              <p className={styles.meta}>
                <span className={styles.metaLabel}>Phone</span>
                <a href={`tel:${phone}`} onClick={stopLinkClick}>
                  {phone}
                </a>
              </p>
            )}

            {email && (
              <p className={styles.meta}>
                <span className={styles.metaLabel}>Email</span>
                <a href={`mailto:${email}`} onClick={stopLinkClick}>
                  {email}
                </a>
              </p>
            )}

            {website_url && (
              <a
                href={website_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.websiteLink}
                onClick={stopLinkClick}
              >
                Visit website →
              </a>
            )}

            {source_url && (
              <div className={styles.extraLinks}>
                <a
                  href={source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={stopLinkClick}
                >
                  Official source
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  )
})

export default ShelterItem
