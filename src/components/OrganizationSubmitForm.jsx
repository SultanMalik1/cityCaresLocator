import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./OrganizationSubmitForm.module.css"
import Button from "./Button"
import Message from "./Message"
import {
  MAX_ONELINER_WORDS,
  MAX_PRIMARY_NEEDS,
  NEEDS,
} from "../constants/needs"
import { createOrganization } from "../hooks/apiResources"
import { useUrlPosition } from "../hooks/useUrlPosition"

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function OrganizationSubmitForm() {
  const navigate = useNavigate()
  const [lat, lng] = useUrlPosition()

  const [name, setName] = useState("")
  const [oneliner, setOneliner] = useState("")
  const [selectedNeeds, setSelectedNeeds] = useState([])
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

  const onelinerWordCount = countWords(oneliner)

  function toggleNeed(needId) {
    setSelectedNeeds((current) => {
      if (current.includes(needId)) {
        return current.filter((id) => id !== needId)
      }
      if (current.length >= MAX_PRIMARY_NEEDS) return current
      return [...current, needId]
    })
  }

  function handleOnelinerChange(e) {
    const next = e.target.value
    if (countWords(next) <= MAX_ONELINER_WORDS) {
      setOneliner(next)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError("Organization name is required.")
      return
    }

    if (oneliner.trim() && onelinerWordCount > MAX_ONELINER_WORDS) {
      setError(`Short description must be ${MAX_ONELINER_WORDS} words or fewer.`)
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
        fivebasics: selectedNeeds.length > 0 ? selectedNeeds.join(",") : null,
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
        noValidate
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
          <label htmlFor="oneliner">
            Short description ({MAX_ONELINER_WORDS} words max)
          </label>
          <input
            id="oneliner"
            value={oneliner}
            onChange={handleOnelinerChange}
            placeholder="Brief tagline for this organization"
          />
          <span className={styles.wordCount}>
            {onelinerWordCount}/{MAX_ONELINER_WORDS} words
          </span>
        </div>

        <div className={styles.row}>
          <span className={styles.fieldLabel}>
            Primary needs (select up to {MAX_PRIMARY_NEEDS})
          </span>
          <div
            className={styles.needChips}
            role="group"
            aria-label="Primary needs"
          >
            {NEEDS.map((need) => {
              const isSelected = selectedNeeds.includes(need.id)
              const atLimit =
                !isSelected && selectedNeeds.length >= MAX_PRIMARY_NEEDS

              return (
                <button
                  key={need.id}
                  type="button"
                  className={`${styles.needChip} ${
                    isSelected ? styles.needChipActive : ""
                  }`}
                  aria-pressed={isSelected}
                  disabled={atLimit}
                  onClick={() => toggleNeed(need.id)}
                >
                  {need.label}
                </button>
              )
            })}
          </div>
          <span className={styles.wordCount}>
            {selectedNeeds.length}/{MAX_PRIMARY_NEEDS} selected
          </span>
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
            type="text"
            inputMode="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.org"
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
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            Submit for review
          </Button>
          <button
            type="button"
            className={styles.cancel}
            onClick={() => navigate("/app")}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default OrganizationSubmitForm
