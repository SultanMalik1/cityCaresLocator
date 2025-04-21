import { useNavigate } from "react-router-dom"
import styles from "./Map.module.css"
import { useEnterprises } from "../contexts/EnterprisesContext"
import Button from "./Button"

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet"
import { useEffect, useState } from "react"
import { useGeolocation } from "../hooks/useGeolocation"
import { useUrlPosition } from "../hooks/useUrlPosition"

function Map({ isSidebarCollapsed }) {
  // Fetch all organizations from supabase
  const { enterprises } = useEnterprises()
  // The organization selected by user (for displaying in modal)
  const [selectedEnterprise, setSelectedEnterprise] = useState(null)

  // Default location is centered on Manhattan
  const [mapPosition, setMapPosition] = useState([
    40.77206305312022, -73.9627399862185,
  ])
  // Custom hook for geolocation
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation()

  // Get the location from url parameters
  const [mapLat, mapLng] = useUrlPosition()

  // Update the map if the lat/lng changes
  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng])
  }, [mapLat, mapLng])

  useEffect(() => {
    if (geolocationPosition)
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng])
  }, [geolocationPosition])

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )}

      <MapContainer
        center={mapPosition}
        zoom={12}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        {enterprises.map((enterprise) => (
          <Marker
            key={enterprise.id}
            position={[enterprise.position.lat, enterprise.position.lng]}
            eventHandlers={{
              click: () => setSelectedEnterprise(enterprise),
            }}
          />
        ))}

        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>

      {/*Modal*/}
      {selectedEnterprise && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{selectedEnterprise.name}</h2>
            <p>{selectedEnterprise.notes}</p>
            <div className={styles.buttonContainer}>
              {selectedEnterprise.website && (
                <a
                  href={selectedEnterprise.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className={styles.websiteButton}>Visite Site</button>
                </a>
              )}
              <button
                onClick={() => setSelectedEnterprise(null)}
                className={styles.closeButton}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ChangeCenter({ position }) {
  const map = useMap()
  map.setView(position)
  return null
}

function DetectClick() {
  const navigate = useNavigate()
  useMapEvents({
    // click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  })
}

export default Map
