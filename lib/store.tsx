"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Location, UserProfile, AlertItem, HealthProfile } from "@/lib/types"
import { mockLocations, mockAlerts } from "@/lib/mock-data"
import { getAQICategory } from "@/lib/types"

interface AppState {
  user: UserProfile
  locations: Location[]
  alerts: AlertItem[]
  selectedCity: string
  sidebarOpen: boolean
  darkMode: boolean
  thresholdAqi: number
  spikePercent: number
  predictionAlerts: boolean
  humidityAlerts: boolean
}

interface AppContextValue extends AppState {
  setUser: (u: UserProfile) => void
  setSelectedCity: (c: string) => void
  setSidebarOpen: (o: boolean) => void
  toggleDarkMode: () => void
  addLocation: (loc: Location) => void
  removeLocation: (id: string) => void
  updateLocation: (id: string, loc: Partial<Location>) => void
  setThresholdAqi: (v: number) => void
  setSpikePercent: (v: number) => void
  setPredictionAlerts: (v: boolean) => void
  setHumidityAlerts: (v: boolean) => void
  simulateSpike: () => void
  addAlert: (alert: AlertItem) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>({ name: "Alex", healthProfile: "Normal" })
  const [locations, setLocations] = useState<Location[]>(mockLocations)
  const [alerts, setAlerts] = useState<AlertItem[]>(mockAlerts)
  const [selectedCity, setSelectedCity] = useState("Delhi")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [thresholdAqi, setThresholdAqi] = useState(150)
  const [spikePercent, setSpikePercent] = useState(25)
  const [predictionAlerts, setPredictionAlerts] = useState(true)
  const [humidityAlerts, setHumidityAlerts] = useState(true)

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev
      if (next) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
      return next
    })
  }, [])

  const addLocation = useCallback((loc: Location) => {
    setLocations((prev) => [...prev, loc])
  }, [])

  const removeLocation = useCallback((id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const updateLocation = useCallback((id: string, update: Partial<Location>) => {
    setLocations((prev) => prev.map((l) => (l.id === id ? { ...l, ...update } : l)))
  }, [])

  const addAlert = useCallback((alert: AlertItem) => {
    setAlerts((prev) => [alert, ...prev])
  }, [])

  const simulateSpike = useCallback(() => {
    setLocations((prev) =>
      prev.map((l) => {
        if (l.label === "Home") {
          const newAqi = Math.min(500, l.aqi + 120)
          return { ...l, aqi: newAqi, category: getAQICategory(newAqi) }
        }
        return l
      })
    )
    const spikeAlert: AlertItem = {
      id: `spike-${Date.now()}`,
      type: "danger",
      message: "SPIKE ALERT: Home AQI surged to 300+ in the last hour!",
      tip: "Close all windows. Turn on air purifier. Wear N95 mask if going out.",
      time: "Just now",
    }
    setAlerts((prev) => [spikeAlert, ...prev])
  }, [])

  return (
    <AppContext.Provider
      value={{
        user, setUser,
        locations, addLocation, removeLocation, updateLocation,
        alerts, addAlert,
        selectedCity, setSelectedCity,
        sidebarOpen, setSidebarOpen,
        darkMode, toggleDarkMode,
        thresholdAqi, setThresholdAqi,
        spikePercent, setSpikePercent,
        predictionAlerts, setPredictionAlerts,
        humidityAlerts, setHumidityAlerts,
        simulateSpike,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
