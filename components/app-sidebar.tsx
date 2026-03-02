"use client"

import { useState } from "react"
import { useApp } from "@/lib/store"
import { getAQIColor, getAQIBgLight } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  User,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wind,
} from "lucide-react"
import type { HealthProfile } from "@/lib/types"

export function AppSidebar() {
  const {
    user, setUser,
    locations, removeLocation,
    sidebarOpen, setSidebarOpen,
    thresholdAqi, setThresholdAqi,
    spikePercent, setSpikePercent,
    predictionAlerts, setPredictionAlerts,
    humidityAlerts, setHumidityAlerts,
  } = useApp()

  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(user.name)

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full bg-sidebar border-r border-sidebar-border
          transition-all duration-300 ease-in-out flex flex-col
          ${sidebarOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full lg:w-14 lg:translate-x-0"}
        `}
      >
        {/* Toggle button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-10 top-4 z-50 rounded-lg bg-card border border-border shadow-md h-8 w-8"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>

        {/* Collapsed state icons */}
        {!sidebarOpen && (
          <div className="hidden lg:flex flex-col items-center gap-4 pt-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
              aria-label="Open sidebar"
            >
              <Wind className="h-5 w-5 text-sidebar-primary" />
            </button>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
              aria-label="View profile"
            >
              <User className="h-5 w-5 text-sidebar-foreground" />
            </button>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
              aria-label="View locations"
            >
              <MapPin className="h-5 w-5 text-sidebar-foreground" />
            </button>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5 text-sidebar-foreground" />
            </button>
          </div>
        )}

        {sidebarOpen && (
          <ScrollArea className="flex-1 px-4 py-6">
            {/* Brand */}
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Wind className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-sidebar-foreground">AirPin</span>
            </div>

            {/* Profile Section */}
            <Card className="mb-4 border-sidebar-border bg-sidebar-accent/50">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-sidebar-foreground">
                  <User className="h-4 w-4" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    {editingName ? (
                      <Input
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onBlur={() => {
                          setUser({ ...user, name: nameInput })
                          setEditingName(false)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setUser({ ...user, name: nameInput })
                            setEditingName(false)
                          }
                        }}
                        className="h-7 text-sm"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => setEditingName(true)}
                        className="text-sm font-medium text-sidebar-foreground hover:text-primary transition-colors flex items-center gap-1"
                      >
                        {user.name}
                        <Pencil className="h-3 w-3 opacity-50" />
                      </button>
                    )}
                  </div>
                </div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Health Profile</Label>
                <Select
                  value={user.healthProfile}
                  onValueChange={(v) => setUser({ ...user, healthProfile: v as HealthProfile })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Asthma">Asthma</SelectItem>
                    <SelectItem value="Child">Child</SelectItem>
                    <SelectItem value="Elderly">Elderly</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Pinned Locations */}
            <Card className="mb-4 border-sidebar-border bg-sidebar-accent/50">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium flex items-center justify-between text-sidebar-foreground">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Pinned Locations
                  </span>
                  <Badge variant="secondary" className="text-xs">{locations.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex flex-col gap-2">
                  {locations.map((loc) => (
                    <div
                      key={loc.id}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 ${getAQIBgLight(loc.category)} transition-colors`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`h-2.5 w-2.5 rounded-full animate-pulse-pin ${
                          loc.category === "Good" ? "bg-aqi-good" :
                          loc.category === "Moderate" ? "bg-aqi-moderate" :
                          loc.category === "Poor" ? "bg-aqi-poor" :
                          loc.category === "Unhealthy" ? "bg-aqi-unhealthy" :
                          "bg-aqi-hazardous"
                        }`} />
                        <span className="text-xs font-medium truncate text-sidebar-foreground">{loc.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 ${getAQIColor(loc.category)} border-current`}
                        >
                          {loc.aqi}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeLocation(loc.id)}
                          aria-label={`Remove ${loc.label}`}
                        >
                          <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alert Settings */}
            <Card className="border-sidebar-border bg-sidebar-accent/50">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-sidebar-foreground">
                  <Settings className="h-4 w-4" />
                  Alert Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 flex flex-col gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 flex items-center justify-between">
                    <span>AQI Threshold</span>
                    <span className="font-mono text-sidebar-foreground">{thresholdAqi}</span>
                  </Label>
                  <Slider
                    value={[thresholdAqi]}
                    onValueChange={([v]) => setThresholdAqi(v)}
                    min={0}
                    max={500}
                    step={10}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 flex items-center justify-between">
                    <span>Spike % (1hr)</span>
                    <span className="font-mono text-sidebar-foreground">{spikePercent}%</span>
                  </Label>
                  <Slider
                    value={[spikePercent]}
                    onValueChange={([v]) => setSpikePercent(v)}
                    min={1}
                    max={100}
                    step={1}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Prediction Alerts</Label>
                  <Switch checked={predictionAlerts} onCheckedChange={setPredictionAlerts} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Humidity Combo</Label>
                  <Switch checked={humidityAlerts} onCheckedChange={setHumidityAlerts} />
                </div>
              </CardContent>
            </Card>
          </ScrollArea>
        )}
      </aside>
    </>
  )
}
