import { forwardRef } from "react"
import styles from "./EnterpriseItem.module.css"
import { useSelection } from "../contexts/SelectionContext"
import { formatNeeds } from "../constants/needs"

const EnterpriseItem = forwardRef(function EnterpriseItem({ city }, ref) {
  const { selectedOrganizationId, selectOrganization } = useSelection()
  const {
    name,
    id,
    fivebasics,
    oneliner,
    notes,
    address,
    website,
    propublica_url,
    guidestar_url,
  } = city

  const isSelected = String(id) === String(selectedOrganizationId)

  function handleSelect() {
    selectOrganization(id)
  }

  function stopLinkClick(e) {
    e.stopPropagation()
  }

  return (
    <li ref={ref}>
      <div
        className={`${styles.cityItem} ${
          isSelected ? styles["cityItem--active"] : ""
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

        {oneliner && <p className={styles.oneliner}>{oneliner}</p>}

        {isSelected && (
          <div className={styles.detail}>
            {fivebasics && (
              <p className={styles.meta}>
                <span className={styles.metaLabel}>Focus</span>
                {formatNeeds(fivebasics)}
              </p>
            )}

            {notes && <p className={styles.summary}>{notes}</p>}

            {address && (
              <p className={styles.meta}>
                <span className={styles.metaLabel}>Address</span>
                {address}
              </p>
            )}

            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.websiteLink}
                onClick={stopLinkClick}
              >
                Visit website →
              </a>
            )}

            {(guidestar_url || propublica_url) && (
              <div className={styles.extraLinks}>
                {guidestar_url && (
                  <a
                    href={guidestar_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={stopLinkClick}
                  >
                    GuideStar
                  </a>
                )}
                {propublica_url && (
                  <a
                    href={propublica_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={stopLinkClick}
                  >
                    ProPublica
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  )
})

export default EnterpriseItem
