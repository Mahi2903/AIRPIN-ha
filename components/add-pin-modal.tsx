"use client"

import { useState } from "react"
import { useApp } from "@/lib/store"
import { getAQICategory } from "@/lib/types"
import type { Location } from "@/lib/types"
import { DELHI_CENTER } from "@/lib/mock-data"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, MapPin, LocateFixed } from "lucide-react"

export function AddPinModal() {
  const { addLocation, locations } = useApp()
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState("")
  const [lat, setLat] = useState(DELHI_CENTER[0].toString())
  const [lng, setLng] = useState(DELHI_CENTER[1].toString())

  const handleDetectLocation = () => {
    // Mock GPS - slightly offset from center
    const offset = () => (Math.random() - 0.5) * 0.05
    setLat((DELHI_CENTER[0] + offset()).toFixed(4))
    setLng((DELHI_CENTER[1] + offset()).toFixed(4))
  }

  const handleAdd = () => {
    if (!label.trim()) return

    const mockAqi = Math.floor(Math.random() * 300) + 20
    const newLoc: Location = {
      id: `loc-${Date.now()}`,
      label: label.trim(),
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      aqi: mockAqi,
      temp: Math.floor(Math.random() * 10) + 25,
      humidity: Math.floor(Math.random() * 30) + 45,
      prediction: Math.floor(mockAqi * (0.8 + Math.random() * 0.6)),
      category: getAQICategory(mockAqi),
    }

    addLocation(newLoc)
    setLabel("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 text-xs gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Add Pin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Add New Location Pin
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          <div>
            <Label className="text-sm mb-1.5 block">Label</Label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. School, Park, Market..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm mb-1.5 block">Latitude</Label>
              <Input
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                type="number"
                step="0.0001"
              />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Longitude</Label>
              <Input
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                type="number"
                step="0.0001"
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDetectLocation}
            className="gap-1.5"
          >
            <LocateFixed className="h-3.5 w-3.5" />
            Detect Current Location (Mock)
          </Button>
          <Button onClick={handleAdd} disabled={!label.trim()} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
