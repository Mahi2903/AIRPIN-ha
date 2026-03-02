"use client"

import { useApp } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Toaster, toast } from "sonner"
import { neighborhoods } from "@/lib/mock-data"
import {
  Sun,
  Moon,
  Zap,
  Download,
  Search,
  Menu,
  MapPin,
} from "lucide-react"

export function DashboardHeader() {
  const { selectedCity, setSelectedCity, darkMode, toggleDarkMode, simulateSpike, sidebarOpen, setSidebarOpen } = useApp()

  const handleSimulateSpike = () => {
    simulateSpike()
    toast.error("AQI Spike Detected!", {
      description: "Home AQI has surged to 300+. Stay indoors and wear a mask!",
      duration: 5000,
    })
  }

  const handleExport = () => {
    toast.success("Report Downloaded", {
      description: "Your daily AQI report PDF has been saved.",
      duration: 3000,
    })
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground text-balance">
              Your Air Quality Today
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="h-7 w-auto border-0 bg-transparent p-0 text-sm text-muted-foreground font-medium shadow-none focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Delhi">Delhi, India</SelectItem>
                  <SelectItem value="Mumbai">Mumbai, India</SelectItem>
                  <SelectItem value="Bangalore">Bangalore, India</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search location..."
              className="h-8 pl-8 text-xs w-full lg:w-48"
            />
          </div>

          <Select>
            <SelectTrigger className="h-8 w-auto text-xs">
              <SelectValue placeholder="Compare area" />
            </SelectTrigger>
            <SelectContent>
              {neighborhoods.map((n) => (
                <SelectItem key={n} value={n}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="destructive"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={handleSimulateSpike}
          >
            <Zap className="h-3.5 w-3.5" />
            Simulate Spike
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={handleExport}
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export Report</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </header>
    </>
  )
}
