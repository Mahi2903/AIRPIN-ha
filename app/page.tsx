"use client"

import { AppProvider, useApp } from "@/lib/store"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCards } from "@/components/stats-cards"
import { LiveMap } from "@/components/live-map"
import { AlertsFeed } from "@/components/alerts-feed"
import { DailyReport } from "@/components/daily-report"
import { AddPinModal } from "@/components/add-pin-modal"

function DashboardContent() {
  const { sidebarOpen } = useApp()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />

      {/* Main content */}
      <main className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? "lg:ml-72" : "lg:ml-14"}`}>
        <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 lg:py-8">
          {/* Header */}
          <DashboardHeader />

          {/* Add pin action */}
          <div className="flex items-center justify-end mt-4">
            <AddPinModal />
          </div>

          {/* Stats cards */}
          <section className="mt-4" aria-label="Air quality statistics">
            <StatsCards />
          </section>

          {/* Map + Alerts */}
          <section className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-4" aria-label="Map and alerts">
            <div className="lg:col-span-3">
              <LiveMap />
            </div>
            <div className="lg:col-span-2">
              <AlertsFeed />
            </div>
          </section>

          {/* Daily Report */}
          <section className="mt-6 mb-8" aria-label="Daily report">
            <DailyReport />
          </section>
        </div>
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  )
}
