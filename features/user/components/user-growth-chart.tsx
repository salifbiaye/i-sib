"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface UserGrowthChartProps {
  weeklyGrowth: {
    [key: string]: number
  }
  monthlyTrend: {
    [key: string]: number
  }
  growthRate: number
}

const chartConfig = {
  weekly: {
    label: "Hebdomadaire",
    color: "var(--chart-1)",
  },
  monthly: {
    label: "Mensuel",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function UserGrowthChart({ weeklyGrowth, monthlyTrend, growthRate }: UserGrowthChartProps) {
  // Utiliser directement toutes les données du JSON
  const weeklyData = Object.entries(weeklyGrowth).map(([date, count]) => ({
    period: date,
    weekly: count,
    type: 'weekly'
  }))

  const monthlyData = Object.entries(monthlyTrend).map(([date, count]) => ({
    period: date,
    monthly: count,
    type: 'monthly'
  }))

  // Utiliser directement les données du JSON
  const chartData = weeklyData.slice(-7).map(item => {
    const currentMonth = "09/2025"
    const monthValue = monthlyData.find(m => m.period === currentMonth)?.monthly || 0

    return {
      period: item.period,
      weekly: item.weekly,
      monthly: monthValue
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Croissance des Utilisateurs</CardTitle>
        <CardDescription>
          Évolution hebdomadaire et tendance mensuelle
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="monthly"
              type="natural"
              fill="var(--color-monthly)"
              fillOpacity={0.4}
              stroke="var(--color-monthly)"
              stackId="a"
            />
            <Area
              dataKey="weekly"
              type="natural"
              fill="var(--color-weekly)"
              fillOpacity={0.4}
              stroke="var(--color-weekly)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              {growthRate > 0 ? (
                <>
                  Croissance de {growthRate.toFixed(1)}% <TrendingUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Taux de croissance stable <TrendingUp className="h-4 w-4" />
                </>
              )}
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Hebdomadaire vs tendance mensuelle
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}