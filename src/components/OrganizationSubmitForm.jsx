import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./OrganizationSubmitForm.module.css"
import Button from "./Button"
import Message from "./Message"
import { NEEDS } from "../constants/needs"
import { createOrganization } from "../hooks/apiResources"
import { useUrlPosition } from "../hooks/useUrlPosition"

function OrganizationSubmitForm() {
  const navigate = useNavigate()
  const [lat, lng] = useUrlPosition()

  const [name, setName] = useState("")
  const [oneliner, setOneliner] = useState("")
  const [fivebasics, setFivebasics] = useState("")
  const [notes, setNotes] = useState("")
  const [address, setAddress] = useState("")
  const [website, setWebsite] = useState("")
  const [manualLat, setManualLat] = useState(lat ?? "")
  const [manualLng, setManualLng] = useState(lng ?? "")

  useEffect(() => {
    if (lat) setManualLat(lat)
    if (lng) setManualLng(lng)
  }, [lat, lng])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError("Organization name is required.")
      return
    }

    const latNum = Number(manualLat)
    const lngNum = Number(manualLng)
    const hasCoords = Number.isFinite(latNum) && Number.isFinite(lngNum)

    try {
      setError("")
      setIsSubmitting(true)

      await createOrganization({
        name: name.trim(),
        cityname: "New York",
        oneliner: oneliner.trim() || null,
        fivebasics: fivebasics || null,
        notes: notes.trim() || null,
        address: address.trim() || null,
        website: website.trim() || null,
        position: hasCoords
          ? { lat: String(latNum), lng: String(lngNum) }
          : null,
      })

      setSuccess(true)
      setTimeout(() => navigate("/app"), 2000)
    } catch (err) {
      setError(err.message || "Could not submit organization")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Message message="Submitted for review. It will appear on the map after an admin approves it." />
    )
  }

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>Add an organization</h2>
      <p className={styles.hint}>
        Submissions stay hidden until an admin approves them. Add map coordinates
        from the URL (?lat=&amp;lng=) or enter them below.
      </p>

      {error && <p className={styles.error}>{error}</p>}

      <form
        className={`${styles.form} ${isSubmitting ? styles.loading : ""}`}
        onSubmit={handleSubmit}
      >
        <div className={styles.row}>
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="oneliner">Short description</label>
          <input
            id="oneliner"
            value={oneliner}
            onChange={(e) => setOneliner(e.target.value)}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="fivebasics">Primary need</label>
          <select
            id="fivebasics"
            value={fivebasics}
            onChange={(e) => setFivebasics(e.target.value)}
          >
            <option value="">Select…</option>
            {NEEDS.map((need) => (
              <option key={need.id} value={need.id}>
                {need.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.row}>
          <label htmlFor="address">Address</label>
          <input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className={styles.rowPair}>
          <div className={styles.row}>
            <label htmlFor="lat">Latitude</label>
            <input
              id="lat"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              placeholder="40.77"
            />
          </div>
          <div className={styles.row}>
            <label htmlFor="lng">Longitude</label>
            <input
              id="lng"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              placeholder="-73.96"
            />
          </div>
        </div>

        <div className={styles.row}>
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://"
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <Button type="primary">Submit for review</Button>
          <button
            type="button"
            className={styles.cancel}
            onClick={() => navigate("/app")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default OrganizationSubmitForm
