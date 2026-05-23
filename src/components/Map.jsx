import styles from "./Map.module.css"
import { useEnterprises } from "../contexts/EnterprisesContext"
import { useSelection } from "../contexts/SelectionContext"
import L from "leaflet"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

const defaultMarkerIcon = L.divIcon({
  className: "",
  html: '<span class="org-marker"></span>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

const selectedMarkerIcon = L.divIcon({
  className: "",
  html: '<span class="org-marker org-marker--selected"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

// Manhattan — all organizations are in this area
const NYC_CENTER = [40.77206305312022, -73.9627399862185]

function parseCoord(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function getCoords(enterprise) {
  if (!enterprise?.position) return null
  const lat = parseCoord(enterprise.position.lat)
  const lng = parseCoord(enterprise.position.lng)
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
  const { enterprises } = useEnterprises()
  const organizations = useMemo(
    () => (Array.isArray(enterprises) ? enterprises : []),
    [enterprises]
  )
  const { selectedOrganizationId, selectOrganization } = useSelection()

  const [flyTarget, setFlyTarget] = useState(null)

  const selectedCoords = useMemo(() => {
    const org = organizations.find(
      (e) => String(e.id) === String(selectedOrganizationId)
    )
    return getCoords(org)
  }, [organizations, selectedOrganizationId])

  const selectedLat = selectedCoords?.lat
  const selectedLng = selectedCoords?.lng

  useEffect(() => {
    if (!selectedOrganizationId || selectedLat == null || selectedLng == null) {
      return
    }

    const next = {
      lat: selectedLat,
      lng: selectedLng,
      zoom: 14,
      key: `org-${selectedOrganizationId}`,
    }
    setFlyTarget((prev) => (prev?.key === next.key ? prev : next))
  }, [selectedOrganizationId, selectedLat, selectedLng])

  const handleMarkerClick = useCallback(
    (id) => {
      selectOrganization(id)
    },
    [selectOrganization]
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

        {organizations.map((enterprise) => {
          const coords = getCoords(enterprise)
          if (!coords) return null

          const isSelected =
            String(enterprise.id) === String(selectedOrganizationId)

          return (
            <Marker
              key={enterprise.id}
              position={[coords.lat, coords.lng]}
              icon={isSelected ? selectedMarkerIcon : defaultMarkerIcon}
              eventHandlers={{
                click: () => handleMarkerClick(enterprise.id),
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
