import { useCallback, useEffect, useState } from "react"
import styles from "./AdminPanel.module.css"
import Spinner from "./Spinner"
import Message from "./Message"
import {
  getPendingOrganizations,
  updateOrganizationStatus,
} from "../hooks/apiResources"
import { ORGANIZATION_STATUS } from "../constants/organizationStatus"
import { useEnterprises } from "../contexts/EnterprisesContext"
import { NEEDS } from "../constants/needs"

function needLabel(id) {
  return NEEDS.find((n) => n.id === id)?.label ?? id
}

function AdminPanel() {
  const { refetchOrganizations } = useEnterprises()
  const [pending, setPending] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [actingId, setActingId] = useState(null)

  const loadPending = useCallback(async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await getPendingOrganizations()
      setPending(data)
    } catch (err) {
      setError(err.message || "Could not load pending submissions")
      setPending([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPending()
  }, [loadPending])

  async function handleDecision(id, status) {
    try {
      setActingId(id)
      setError("")
      await updateOrganizationStatus(id, status)
      await loadPending()
      await refetchOrganizations()
    } catch (err) {
      setError(err.message || "Could not update organization")
    } finally {
      setActingId(null)
    }
  }

  if (isLoading) return <Spinner />

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Pending submissions</h2>
      <p className={styles.hint}>
        Approved organizations appear on the public map. Rejected submissions
        stay hidden.
      </p>

      {error && <p className={styles.error}>{error}</p>}

      {pending.length === 0 ? (
        <Message message="No pending organizations right now." />
      ) : (
        <ul className={styles.list}>
          {pending.map((org) => (
            <li key={org.id} className={styles.card}>
              <div className={styles.cardBody}>
                <h3 className={styles.name}>{org.name}</h3>
                {org.oneliner && <p className={styles.oneliner}>{org.oneliner}</p>}
                <dl className={styles.meta}>
                  {org.fivebasics && (
                    <>
                      <dt>Need</dt>
                      <dd>{needLabel(org.fivebasics)}</dd>
                    </>
                  )}
                  {org.address && (
                    <>
                      <dt>Address</dt>
                      <dd>{org.address}</dd>
                    </>
                  )}
                  {org.website && (
                    <>
                      <dt>Website</dt>
                      <dd>
                        <a
                          href={org.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {org.website}
                        </a>
                      </dd>
                    </>
                  )}
                </dl>
                {org.notes && <p className={styles.notes}>{org.notes}</p>}
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.approve}
                  disabled={actingId === org.id}
                  onClick={() =>
                    handleDecision(org.id, ORGANIZATION_STATUS.APPROVED)
                  }
                >
                  Approve
                </button>
                <button
                  type="button"
                  className={styles.reject}
                  disabled={actingId === org.id}
                  onClick={() =>
                    handleDecision(org.id, ORGANIZATION_STATUS.REJECTED)
                  }
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AdminPanel
