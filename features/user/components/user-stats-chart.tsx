"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts"

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface UserStatsChartProps {
  breakdown: {
    CUSTOMER: number
    MANAGER: number
    ADMIN: number
  }
  activePercentage: number
}

const chartConfig = {
  value: {
    label: "Utilisateurs",
  },
  CUSTOMER: {
    label: "Client",
    color: "var(--chart-1)",
  },
  MANAGER: {
    label: "Manager",
    color: "var(--chart-2)",
  },
  ADMIN: {
    label: "Admin",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function UserStatsChart({ breakdown, activePercentage }: UserStatsChartProps) {
  const chartData = [
    {
      role: "CUSTOMER",
      value: breakdown.CUSTOMER,
      fill: "var(--color-CUSTOMER)"
    },
    {
      role: "MANAGER",
      value: breakdown.MANAGER,
      fill: "var(--color-MANAGER)"
    },
    {
      role: "ADMIN",
      value: breakdown.ADMIN,
      fill: "var(--color-ADMIN)"
    },
  ]

  // Trouver l'index du rôle avec le plus d'utilisateurs pour l'active bar
  const maxValueIndex = chartData.reduce((maxIndex, item, index, array) =>
    item.value > array[maxIndex].value ? index : maxIndex, 0
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition par Rôle</CardTitle>
        <CardDescription>Distribution des utilisateurs par type de rôle</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="role"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="value"
              strokeWidth={2}
              radius={8}
              activeIndex={maxValueIndex}
              activeBar={({ ...props }) => {
                return (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    stroke={props.payload.fill}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                )
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {activePercentage > 50 ? (
            <>
              Taux d'activité élevé <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Potentiel d'amélioration de l'activité <TrendingUp className="h-4 w-4" />
            </>
          )}
        </div>
        <div className="text-muted-foreground leading-none">
          {activePercentage.toFixed(1)}% des utilisateurs sont actuellement actifs
        </div>
      </CardFooter>
    </Card>
  )
}