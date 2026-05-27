import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./OrganizationSubmitForm.module.css"
import Button from "./Button"
import Message from "./Message"
import {
  MAX_ONELINER_WORDS,
  MAX_PRIMARY_NEEDS,
  MIN_NOTES_WORDS,
  NEEDS,
} from "../constants/needs"
import { createOrganization } from "../hooks/apiResources"
import { useUrlPosition } from "../hooks/useUrlPosition"

const LAT_LONG_HELP_URL =
  "https://www.latlong.net/convert-address-to-lat-long.html"

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function parseCoordinate(value) {
  const trimmed = String(value).trim()
  if (!trimmed) return null
  const num = Number(trimmed)
  return Number.isFinite(num) ? num : null
}

function isValidLatitude(lat) {
  return lat >= -90 && lat <= 90
}

function isValidLongitude(lng) {
  return lng >= -180 && lng <= 180
}

function isValidWebsite(value) {
  const trimmed = value.trim()
  if (!trimmed) return false

  try {
    const url = new URL(
      /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`,
    )
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
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
  const notesWordCount = countWords(notes)

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

  function validateForm() {
    if (!name.trim()) {
      return "Organization name is required."
    }

    if (!oneliner.trim()) {
      return "Short description is required."
    }

    if (onelinerWordCount > MAX_ONELINER_WORDS) {
      return `Short description must be ${MAX_ONELINER_WORDS} words or fewer.`
    }

    if (selectedNeeds.length === 0) {
      return "Select at least one primary need."
    }

    if (!address.trim()) {
      return "Address is required."
    }

    const latNum = parseCoordinate(manualLat)
    const lngNum = parseCoordinate(manualLng)

    if (latNum === null) {
      return "Latitude is required and must be a valid number."
    }

    if (!isValidLatitude(latNum)) {
      return "Latitude must be between -90 and 90."
    }

    if (lngNum === null) {
      return "Longitude is required and must be a valid number."
    }

    if (!isValidLongitude(lngNum)) {
      return "Longitude must be between -180 and 180."
    }

    if (!website.trim()) {
      return "Website is required."
    }

    if (!isValidWebsite(website)) {
      return "Enter a valid website URL (e.g. https://example.org)."
    }

    if (!notes.trim()) {
      return "Notes are required."
    }

    if (notesWordCount < MIN_NOTES_WORDS) {
      return `Notes must be at least ${MIN_NOTES_WORDS} words (currently ${notesWordCount}).`
    }

    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    const latNum = parseCoordinate(manualLat)
    const lngNum = parseCoordinate(manualLng)

    try {
      setError("")
      setIsSubmitting(true)

      await createOrganization({
        name: name.trim(),
        cityname: "New York",
        oneliner: oneliner.trim(),
        fivebasics: selectedNeeds.join(","),
        notes: notes.trim(),
        address: address.trim(),
        website: website.trim(),
        position: { lat: String(latNum), lng: String(lngNum) },
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
        All fields are required. Submissions stay hidden until an admin approves
        them. Map coordinates can be filled from the URL (?lat=&amp;lng=) or
        entered below —{" "}
        <a
          href={LAT_LONG_HELP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.hintLink}
        >
          look up latitude and longitude from an address
        </a>
        .
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
            Short description * ({MAX_ONELINER_WORDS} words max)
          </label>
          <input
            id="oneliner"
            value={oneliner}
            onChange={handleOnelinerChange}
            placeholder="Brief tagline for this organization"
            required
          />
          <span className={styles.wordCount}>
            {onelinerWordCount}/{MAX_ONELINER_WORDS} words
          </span>
        </div>

        <div className={styles.row}>
          <span className={styles.fieldLabel}>
            Primary needs * (select 1–{MAX_PRIMARY_NEEDS})
          </span>
          <div
            className={styles.needChips}
            role="group"
            aria-label="Primary needs"
            aria-required="true"
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
          <label htmlFor="address">Address *</label>
          <input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className={styles.rowPair}>
          <div className={styles.row}>
            <label htmlFor="lat">Latitude *</label>
            <input
              id="lat"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              placeholder="40.77"
              inputMode="decimal"
              required
            />
          </div>
          <div className={styles.row}>
            <label htmlFor="lng">Longitude *</label>
            <input
              id="lng"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              placeholder="-73.96"
              inputMode="decimal"
              required
            />
          </div>
        </div>
        <p className={styles.coordHelp}>
          Need coordinates?{" "}
          <a
            href={LAT_LONG_HELP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.hintLink}
          >
            Convert an address to latitude and longitude
          </a>
          .
        </p>

        <div className={styles.row}>
          <label htmlFor="website">Website *</label>
          <input
            id="website"
            type="url"
            inputMode="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.org"
            required
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="notes">Notes * (at least {MIN_NOTES_WORDS} words)</label>
          <textarea
            id="notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />
          <span className={styles.wordCount}>
            {notesWordCount}/{MIN_NOTES_WORDS} words minimum
          </span>
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
