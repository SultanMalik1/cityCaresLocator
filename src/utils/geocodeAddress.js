/**
 * Forward geocode a street address using Photon (Komoot / OpenStreetMap).
 * Free, no API key, usable from the browser.
 * @see https://photon.komoot.io/
 */

const PHOTON_URL = "https://photon.komoot.io/api/"

/** Bias results toward NYC (app default city). */
const NYC_LAT = 40.7128
const NYC_LON = -74.006

function buildSearchQuery(address) {
  const trimmed = address.trim()
  if (!/\b(new york|nyc|ny)\b/i.test(trimmed)) {
    return `${trimmed}, New York, NY`
  }
  return trimmed
}

/**
 * @param {string} address
 * @returns {Promise<{ lat: number, lng: number, displayName: string }>}
 */
export async function geocodeAddress(address) {
  const query = buildSearchQuery(address)
  if (!query) {
    throw new Error("Address is required.")
  }

  const params = new URLSearchParams({
    q: query,
    limit: "1",
    lang: "en",
    lat: String(NYC_LAT),
    lon: String(NYC_LON),
  })

  const response = await fetch(`${PHOTON_URL}?${params}`)

  if (!response.ok) {
    throw new Error("Could not look up that address. Try again in a moment.")
  }

  const data = await response.json()
  const feature = data?.features?.[0]

  if (!feature?.geometry?.coordinates) {
    throw new Error(
      "We could not find that address. Include street, city, and state (e.g. 350 5th Ave, New York, NY).",
    )
  }

  const [lng, lat] = feature.geometry.coordinates
  const props = feature.properties ?? {}
  const displayName =
    props.name && props.city
      ? `${props.name}, ${props.city}${props.state ? `, ${props.state}` : ""}`
      : props.name || query

  return {
    lat: Number(lat),
    lng: Number(lng),
    displayName,
  }
}
