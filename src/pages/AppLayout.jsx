import { useCallback, useEffect, useRef, useState } from "react"
import Sidebar from "../components/Sidebar"
import Map from "../components/Map"
import ErrorBoundary from "../components/ErrorBoundary"
import { SelectionProvider } from "../contexts/SelectionContext"
import { useIsMobile } from "../hooks/useIsMobile"
import styles from "./AppLayout.module.css"

const MIN_SIDEBAR_VH = 22
const MAX_SIDEBAR_VH = 72
const DEFAULT_SIDEBAR_VH = 42

function AppLayout() {
  const isMobile = useIsMobile()
  const appRef = useRef(null)
  const [sidebarVh, setSidebarVh] = useState(DEFAULT_SIDEBAR_VH)
  const [isDragging, setIsDragging] = useState(false)
  const [mapLayoutKey, setMapLayoutKey] = useState(0)

  const bumpMapLayout = useCallback(() => {
    setMapLayoutKey((k) => k + 1)
  }, [])

  const handleResizeStart = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  useEffect(() => {
    if (!isDragging || !isMobile) return

    const onMove = (e) => {
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
      const rect = appRef.current?.getBoundingClientRect()
      if (!rect?.height) return

      const pct = ((clientY - rect.top) / rect.height) * 100
      setSidebarVh(Math.min(MAX_SIDEBAR_VH, Math.max(MIN_SIDEBAR_VH, pct)))
    }

    const onEnd = () => {
      setIsDragging(false)
      bumpMapLayout()
    }

    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onEnd)
    window.addEventListener("pointercancel", onEnd)

    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onEnd)
      window.removeEventListener("pointercancel", onEnd)
    }
  }, [isDragging, isMobile, bumpMapLayout])

  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = "none"
      document.body.style.touchAction = "none"
    } else {
      document.body.style.userSelect = ""
      document.body.style.touchAction = ""
    }
    return () => {
      document.body.style.userSelect = ""
      document.body.style.touchAction = ""
    }
  }, [isDragging])

  const sidebarStyle =
    isMobile ? { height: `${sidebarVh}dvh`, maxHeight: "none", flex: "none" } : undefined

  return (
    <SelectionProvider>
      <div
        ref={appRef}
        className={`${styles.app} ${isDragging ? styles.appDragging : ""}`}
      >
        <div className={styles.sidebarPanel} style={sidebarStyle}>
          <ErrorBoundary>
            <Sidebar />
          </ErrorBoundary>
        </div>

        {isMobile && (
          <div
            className={styles.resizeHandle}
            onPointerDown={handleResizeStart}
            role="separator"
            aria-orientation="horizontal"
            aria-label="Drag to resize map and list"
            aria-valuenow={Math.round(sidebarVh)}
            aria-valuemin={MIN_SIDEBAR_VH}
            aria-valuemax={MAX_SIDEBAR_VH}
          >
            <span className={styles.resizeBar} />
          </div>
        )}

        <div className={styles.mapPanel}>
          <ErrorBoundary>
            <Map layoutKey={mapLayoutKey} />
          </ErrorBoundary>
        </div>
      </div>
    </SelectionProvider>
  )
}

export default AppLayout
