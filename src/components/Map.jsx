import styles from "./Map.module.css"
import { useEnterprises } from "../contexts/EnterprisesContext"
import { useFilter } from "../contexts/FilterContext"
import { useShelterFilter } from "../contexts/ShelterFilterContext"
import { useSelection } from "../contexts/SelectionContext"
import L from "leaflet"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

const defaultOrgMarkerIcon = L.divIcon({
  className: "",
  html: '<span class="org-marker"></span>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

const selectedOrgMarkerIcon = L.divIcon({
  className: "",
  html: '<span class="org-marker org-marker--selected"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

const defaultShelterMarkerIcon = L.divIcon({
  className: "",
  html: '<span class="shelter-marker"></span>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

const selectedShelterMarkerIcon = L.divIcon({
  className: "",
  html: '<span class="shelter-marker shelter-marker--selected"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

const NYC_CENTER = [40.77206305312022, -73.9627399862185]

function parseCoord(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function getOrgCoords(organization) {
  if (!organization?.position) return null
  const lat = parseCoord(organization.position.lat)
  const lng = parseCoord(organization.position.lng)
  if (lat === null || lng === null) return null
  return { lat, lng }
}

function getShelterCoords(shelter) {
  const lat = parseCoord(shelter?.latitude)
  const lng = parseCoord(shelter?.longitude)
  if (lat === null || lng === null) return null
  return { lat, lng }
}

function Map({ layoutKey = 0 }) {
  const { isLoading } = useEnterprises()

  if (isLoading) {
    return (
      <div className={styles.mapContainer}>
        <p className={styles.mapLoading}>Loading map…</p>
      </div>
    )
  }

  return <MapView layoutKey={layoutKey} />
}

function MapView({ layoutKey }) {
  const location = useLocation()
  const isSheltersView = location.pathname.includes("/shelters")
  const { filteredOrganizations } = useFilter()
  const { filteredShelters } = useShelterFilter()
  const {
    selectedOrganizationId,
    selectedShelterId,
    selectOrganization,
    selectShelter,
  } = useSelection()

  const organizations = useMemo(
    () => (Array.isArray(filteredOrganizations) ? filteredOrganizations : []),
    [filteredOrganizations],
  )

  const shelters = useMemo(
    () => (Array.isArray(filteredShelters) ? filteredShelters : []),
    [filteredShelters],
  )

  const [flyTarget, setFlyTarget] = useState(null)

  const selectedCoords = useMemo(() => {
    if (isSheltersView) {
      const shelter = shelters.find(
        (item) => String(item.id) === String(selectedShelterId),
      )
      return getShelterCoords(shelter)
    }

    const org = organizations.find(
      (item) => String(item.id) === String(selectedOrganizationId),
    )
    return getOrgCoords(org)
  }, [
    isSheltersView,
    shelters,
    selectedShelterId,
    organizations,
    selectedOrganizationId,
  ])

  const selectedLat = selectedCoords?.lat
  const selectedLng = selectedCoords?.lng
  const selectedId = isSheltersView ? selectedShelterId : selectedOrganizationId

  useEffect(() => {
    if (!selectedId || selectedLat == null || selectedLng == null) {
      return
    }

    const prefix = isSheltersView ? "shelter" : "org"
    const next = {
      lat: selectedLat,
      lng: selectedLng,
      zoom: 14,
      key: `${prefix}-${selectedId}`,
    }
    setFlyTarget((prev) => (prev?.key === next.key ? prev : next))
  }, [isSheltersView, selectedId, selectedLat, selectedLng])

  const handleOrgMarkerClick = useCallback(
    (id) => {
      selectOrganization(id)
    },
    [selectOrganization],
  )

  const handleShelterMarkerClick = useCallback(
    (id) => {
      selectShelter(id)
    },
    [selectShelter],
  )

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={NYC_CENTER}
        zoom={12}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {!isSheltersView &&
          organizations.map((organization) => {
            const coords = getOrgCoords(organization)
            if (!coords) return null

            const isSelected =
              String(organization.id) === String(selectedOrganizationId)

            return (
              <Marker
                key={`org-${organization.id}`}
                position={[coords.lat, coords.lng]}
                icon={isSelected ? selectedOrgMarkerIcon : defaultOrgMarkerIcon}
                eventHandlers={{
                  click: () => handleOrgMarkerClick(organization.id),
                }}
              />
            )
          })}

        {isSheltersView &&
          shelters.map((shelter) => {
            const coords = getShelterCoords(shelter)
            if (!coords) return null

            const isSelected =
              String(shelter.id) === String(selectedShelterId)

            return (
              <Marker
                key={`shelter-${shelter.id}`}
                position={[coords.lat, coords.lng]}
                icon={
                  isSelected ? selectedShelterMarkerIcon : defaultShelterMarkerIcon
                }
                eventHandlers={{
                  click: () => handleShelterMarkerClick(shelter.id),
                }}
              />
            )
          })}

        <MapEffects flyTarget={flyTarget} layoutKey={layoutKey} />
      </MapContainer>
    </div>
  )
}

function MapEffects({ flyTarget, layoutKey }) {
  const map = useMap()
  const sizeFixed = useRef(false)
  const lastFlyKey = useRef(null)

  useEffect(() => {
    if (sizeFixed.current) return
    sizeFixed.current = true

    const timer = window.setTimeout(() => map.invalidateSize(), 250)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 50)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutKey])

  useEffect(() => {
    if (!flyTarget?.key || lastFlyKey.current === flyTarget.key) return
    lastFlyKey.current = flyTarget.key
    map.flyTo([flyTarget.lat, flyTarget.lng], flyTarget.zoom, { duration: 0.6 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyTarget?.key, flyTarget?.lat, flyTarget?.lng, flyTarget?.zoom])

  return null
}

export default Map
