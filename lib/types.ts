export interface Location {
  id: string
  label: string
  lat: number
  lng: number
  aqi: number
  temp: number
  humidity: number
  prediction: number
  category: AQICategory
}

export type AQICategory = "Good" | "Moderate" | "Poor" | "Unhealthy" | "Hazardous"

export type HealthProfile = "Normal" | "Asthma" | "Child" | "Elderly"

export interface UserProfile {
  name: string
  healthProfile: HealthProfile
}

export interface AlertItem {
  id: string
  type: "warning" | "info" | "danger" | "success"
  message: string
  tip?: string
  time: string
}

export interface HourlyData {
  hour: string
  aqi: number
  temp: number
  humidity: number
}

export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return "Good"
  if (aqi <= 100) return "Moderate"
  if (aqi <= 200) return "Poor"
  if (aqi <= 300) return "Unhealthy"
  return "Hazardous"
}

export function getAQIColor(category: AQICategory): string {
  switch (category) {
    case "Good": return "text-aqi-good"
    case "Moderate": return "text-aqi-moderate"
    case "Poor": return "text-aqi-poor"
    case "Unhealthy": return "text-aqi-unhealthy"
    case "Hazardous": return "text-aqi-hazardous"
  }
}

export function getAQIBg(category: AQICategory): string {
  switch (category) {
    case "Good": return "bg-aqi-good"
    case "Moderate": return "bg-aqi-moderate"
    case "Poor": return "bg-aqi-poor"
    case "Unhealthy": return "bg-aqi-unhealthy"
    case "Hazardous": return "bg-aqi-hazardous"
  }
}

export function getAQIBgLight(category: AQICategory): string {
  switch (category) {
    case "Good": return "bg-aqi-good/15"
    case "Moderate": return "bg-aqi-moderate/15"
    case "Poor": return "bg-aqi-poor/15"
    case "Unhealthy": return "bg-aqi-unhealthy/15"
    case "Hazardous": return "bg-aqi-hazardous/15"
  }
}
