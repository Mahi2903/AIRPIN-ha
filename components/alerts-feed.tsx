"use client"

import { useApp } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, ShieldAlert, Info, CheckCircle2, AlertTriangle } from "lucide-react"

function AlertIcon({ type }: { type: string }) {
  switch (type) {
    case "danger":
      return <ShieldAlert className="h-4 w-4 text-destructive shrink-0" />
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-aqi-moderate shrink-0" />
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-aqi-good shrink-0" />
    default:
      return <Info className="h-4 w-4 text-primary shrink-0" />
  }
}

function alertBg(type: string) {
  switch (type) {
    case "danger": return "bg-destructive/10 border-destructive/20"
    case "warning": return "bg-aqi-moderate/10 border-aqi-moderate/20"
    case "success": return "bg-aqi-good/10 border-aqi-good/20"
    default: return "bg-primary/10 border-primary/20"
  }
}

export function AlertsFeed() {
  const { alerts } = useApp()

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2 text-card-foreground">
            <Bell className="h-4 w-4" />
            Alerts Feed
          </span>
          <Badge variant="secondary" className="text-xs">{alerts.length} alerts</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[280px] px-4 pb-4">
          <div className="flex flex-col gap-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-lg border p-3 transition-all hover:scale-[1.01] ${alertBg(alert.type)}`}
              >
                <div className="flex items-start gap-2.5">
                  <AlertIcon type={alert.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug text-card-foreground">{alert.message}</p>
                    {alert.tip && (
                      <p className="text-xs text-muted-foreground mt-1">{alert.tip}</p>
                    )}
                    <span className="text-[10px] text-muted-foreground mt-1.5 block">{alert.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
