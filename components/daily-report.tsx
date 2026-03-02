"use client"

import { mockHourlyData } from "@/lib/mock-data"
import { useApp } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { FileText, TrendingUp, BarChart3, ShieldCheck, Wind as WindIcon } from "lucide-react"

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-popover border border-border rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-medium text-popover-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

export function DailyReport() {
  const { user } = useApp()

  const tips =
    user.healthProfile === "Asthma"
      ? [
          "Avoid outdoor exercise until AQI drops below 100",
          "Keep rescue inhaler accessible at all times",
          "Use air purifier on high setting indoors",
          "Close all windows and seal gaps",
          "Wear N95 mask if stepping outside",
        ]
      : user.healthProfile === "Child"
      ? [
          "Keep children indoors during peak pollution hours (11AM-3PM)",
          "Ensure school has indoor air filtration",
          "Avoid playgrounds near main roads",
          "Use child-safe N95 masks for outdoor exposure",
        ]
      : user.healthProfile === "Elderly"
      ? [
          "Limit outdoor activities, especially in the morning",
          "Monitor blood pressure - pollution can elevate it",
          "Stay hydrated, use air purifier indoors",
          "Consult doctor if experiencing breathing issues",
        ]
      : [
          "Consider wearing a mask outdoors when AQI > 150",
          "Exercise indoors today, gym area has clean air",
          "Close windows during peak hours (11AM-3PM)",
          "Stay hydrated and include antioxidant-rich foods",
        ]

  return (
    <Accordion type="single" collapsible defaultValue="report">
      <AccordionItem value="report" className="border-0">
        <Card className="border border-border">
          <AccordionTrigger className="px-4 py-3 hover:no-underline [&[data-state=open]>svg]:rotate-180">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-card-foreground">
              <FileText className="h-4 w-4" />
              Daily Report Card
              <Badge variant="secondary" className="text-[10px]">Today</Badge>
            </CardTitle>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent className="px-4 pb-4 flex flex-col gap-6">
              {/* AQI Trend Line */}
              <div>
                <h4 className="text-xs font-medium flex items-center gap-1.5 mb-3 text-card-foreground">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  AQI Trend (24hr)
                </h4>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={mockHourlyData}>
                    <defs>
                      <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="hour"
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 300]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="aqi"
                      name="AQI"
                      stroke="var(--chart-1)"
                      fill="url(#aqiGradient)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Pollution Breakdown Bar Chart */}
              <div>
                <h4 className="text-xs font-medium flex items-center gap-1.5 mb-3 text-card-foreground">
                  <BarChart3 className="h-3.5 w-3.5 text-chart-3" />
                  Pollution Breakdown
                </h4>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart
                    data={[
                      { name: "PM2.5", value: 145, fill: "var(--chart-5)" },
                      { name: "PM10", value: 210, fill: "var(--chart-3)" },
                      { name: "NO2", value: 65, fill: "var(--chart-4)" },
                      { name: "SO2", value: 28, fill: "var(--chart-2)" },
                      { name: "CO", value: 42, fill: "var(--chart-1)" },
                      { name: "O3", value: 55, fill: "var(--accent)" },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Level" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Personalized Tips */}
              <div>
                <h4 className="text-xs font-medium flex items-center gap-1.5 mb-3 text-card-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-aqi-good" />
                  Personalized Tips
                  <Badge variant="outline" className="text-[10px] ml-auto">{user.healthProfile}</Badge>
                </h4>
                <ul className="flex flex-col gap-2">
                  {tips.map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2.5"
                    >
                      <WindIcon className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </AccordionContent>
        </Card>
      </AccordionItem>
    </Accordion>
  )
}
