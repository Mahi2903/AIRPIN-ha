"use client"

import { useEffect, useRef, useState } from "react"
import { useApp } from "@/lib/store"
import { DELHI_CENTER, heatmapPoints } from "@/lib/mock-data"
import { getAQICategory } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

function getHeatColor(intensity: number): string {
  if (intensity < 0.25) return "#22c55e"
  if (intensity < 0.5) return "#eab308"
  if (intensity < 0.75) return "#f97316"
  return "#ef4444"
}

export function LiveMap() {
  const { locations } = useApp()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [popoverData, setPopoverData] = useState<{
    label: string; aqi: number; temp: number; humidity: number; prediction: number; x: number; y: number
  } | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const loadMap = async () => {
      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")

      const map = L.map(mapRef.current!, {
        center: DELHI_CENTER,
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      })

      L.control.zoom({ position: "bottomright" }).addTo(map)
      L.control.attribution({ position: "bottomleft" }).addTo(map)

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }).addTo(map)

      // Heatmap circles
      heatmapPoints.forEach((pt) => {
        L.circle([pt.lat, pt.lng], {
          radius: 500 + pt.intensity * 800,
          fillColor: getHeatColor(pt.intensity),
          fillOpacity: 0.25,
          stroke: false,
        }).addTo(map)
      })

      // Location markers
      locations.forEach((loc) => {
        const cat = getAQICategory(loc.aqi)
        const color =
          cat === "Good" ? "#22c55e" :
          cat === "Moderate" ? "#eab308" :
          cat === "Poor" ? "#f97316" :
          cat === "Unhealthy" ? "#ef4444" :
          "#a855f7"

        const icon = L.divIcon({
          className: "custom-marker",
          html: `
            <div style="position:relative;display:flex;align-items:center;justify-content:center;">
              <div style="position:absolute;width:32px;height:32px;border-radius:50%;background:${color};opacity:0.3;animation:pulse-pin 2s ease-in-out infinite;"></div>
              <div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);z-index:1;"></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        })

        const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(map)

        marker.on("click", (e: L.LeafletMouseEvent) => {
          const point = map.latLngToContainerPoint(e.latlng)
          setPopoverData({
            label: loc.label,
            aqi: loc.aqi,
            temp: loc.temp,
            humidity: loc.humidity,
            prediction: loc.prediction,
            x: point.x,
            y: point.y,
          })
        })
      })

      map.on("click", () => setPopoverData(null))

      mapInstance.current = map
      setLoaded(true)
    }

    loadMap()

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card className="relative overflow-hidden border border-border">
      {!loaded && (
        <Skeleton className="absolute inset-0 z-10 rounded-lg" />
      )}
      <div ref={mapRef} className="h-[380px] lg:h-[420px] w-full rounded-lg" />

      {/* Map popover */}
      {popoverData && (
        <div
          className="absolute z-20 bg-popover border border-border rounded-xl shadow-xl p-4 min-w-[200px] pointer-events-auto"
          style={{
            left: Math.min(popoverData.x, (mapRef.current?.clientWidth || 400) - 220),
            top: Math.max(popoverData.y - 160, 10),
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-sm text-popover-foreground">{popoverData.label}</span>
            <Badge
              variant="outline"
              className={`text-xs ${
                getAQICategory(popoverData.aqi) === "Good" ? "text-aqi-good border-aqi-good" :
                getAQICategory(popoverData.aqi) === "Moderate" ? "text-aqi-moderate border-aqi-moderate" :
                getAQICategory(popoverData.aqi) === "Poor" ? "text-aqi-poor border-aqi-poor" :
                getAQICategory(popoverData.aqi) === "Unhealthy" ? "text-aqi-unhealthy border-aqi-unhealthy" :
                "text-aqi-hazardous border-aqi-hazardous"
              }`}
            >
              AQI {popoverData.aqi}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>Temp: <span className="text-popover-foreground font-medium">{popoverData.temp}&deg;C</span></div>
            <div>Humidity: <span className="text-popover-foreground font-medium">{popoverData.humidity}%</span></div>
            <div className="col-span-2">
              Prediction: <span className="text-popover-foreground font-medium">
                {popoverData.prediction} ({getAQICategory(popoverData.prediction)})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-popover/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-aqi-good" />
          <span className="text-[10px] text-popover-foreground">Good</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-aqi-moderate" />
          <span className="text-[10px] text-popover-foreground">Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-aqi-poor" />
          <span className="text-[10px] text-popover-foreground">Poor</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-aqi-unhealthy" />
          <span className="text-[10px] text-popover-foreground">Hazardous</span>
        </div>
      </div>
    </Card>
  )
}
