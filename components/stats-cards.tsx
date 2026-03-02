"use client"

import { useApp } from "@/lib/store"
import { getAQICategory, getAQIColor, getAQIBgLight } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Droplets, Thermometer, Wind } from "lucide-react"

export function StatsCards() {
  const { locations } = useApp()
  const home = locations.find((l) => l.label === "Home") || locations[0]
  if (!home) return null

  const category = getAQICategory(home.aqi)
  const predCategory = getAQICategory(home.prediction)
  const trendUp = home.prediction > home.aqi

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Current AQI */}
      <Card className={`border-0 ${getAQIBgLight(category)} relative overflow-hidden`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wind className={`h-4 w-4 ${getAQIColor(category)}`} />
            <span className="text-xs font-medium text-muted-foreground">Current AQI</span>
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-3xl font-bold tabular-nums animate-number-count ${getAQIColor(category)}`}>
              {home.aqi}
            </span>
            <span className={`text-xs font-medium mb-1 ${getAQIColor(category)}`}>
              {category}
            </span>
          </div>
          {/* Color ring decoration */}
          <div
            className={`absolute -right-3 -top-3 h-16 w-16 rounded-full border-4 opacity-20 ${
              category === "Good" ? "border-aqi-good" :
              category === "Moderate" ? "border-aqi-moderate" :
              category === "Poor" ? "border-aqi-poor" :
              category === "Unhealthy" ? "border-aqi-unhealthy" :
              "border-aqi-hazardous"
            }`}
          />
        </CardContent>
      </Card>

      {/* Temperature */}
      <Card className="border border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="h-4 w-4 text-chart-3" />
            <span className="text-xs font-medium text-muted-foreground">Temperature</span>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold tabular-nums text-card-foreground">{home.temp}</span>
            <span className="text-sm text-muted-foreground mb-1">&deg;C</span>
          </div>
        </CardContent>
      </Card>

      {/* Humidity */}
      <Card className="border border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Humidity</span>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold tabular-nums text-card-foreground">{home.humidity}</span>
            <span className="text-sm text-muted-foreground mb-1">%</span>
          </div>
        </CardContent>
      </Card>

      {/* 24hr Prediction */}
      <Card className={`border-0 ${getAQIBgLight(predCategory)} relative overflow-hidden`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {trendUp ? (
              <TrendingUp className="h-4 w-4 text-destructive" />
            ) : (
              <TrendingDown className="h-4 w-4 text-aqi-good" />
            )}
            <span className="text-xs font-medium text-muted-foreground">24hr Prediction</span>
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-3xl font-bold tabular-nums ${getAQIColor(predCategory)}`}>
              {home.prediction}
            </span>
            <span className={`text-xs font-medium mb-1 ${getAQIColor(predCategory)}`}>
              {predCategory}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
