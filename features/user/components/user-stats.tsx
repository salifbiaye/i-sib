import { Users, UserCheck, UserX, Calendar } from "lucide-react"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { serverGet } from "@/lib/server-api"
import { UserStatsChart } from "./user-stats-chart"
import { UserGrowthChart } from "./user-growth-chart"

interface UserStatsResponse {
  total: number
  active: number
  inactive: number
  activePercentage: number
  today: number
  thisWeek: number
  thisMonth: number
  breakdown: {
    CUSTOMER: number
    MANAGER: number
    ADMIN: number
  }
  weeklyGrowth: {
    [key: string]: number
  }
  monthlyTrend: {
    [key: string]: number
  }
  growthRate: number
}


export async function UserStats() {
  const stats = await serverGet<UserStatsResponse>('/api/users/stats')
    .catch(() => ({
      total: 0,
      active: 0,
      inactive: 0,
      activePercentage: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      breakdown: {
        CUSTOMER: 0,
        MANAGER: 0,
        ADMIN: 0
      },
      weeklyGrowth: {},
      monthlyTrend: {},
      growthRate: 0
    }))

  return (
    <div className=" gap-6  mb-6">
      {/* Left Column - Stats Cards */}
      <div className="grid gap-4 mb-5 grid-cols-4">
        {/* Total Users */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pb-3 flex-1">
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
          <CardFooter className="pt-3 border-t mt-auto px-0">
            <div className="flex justify-between w-full text-xs px-6">
              <span className="text-emerald-600">Actifs: {stats.active}</span>
              <span className="text-orange-600">Inactifs: {stats.inactive}</span>
            </div>
          </CardFooter>
        </Card>

        {/* Active Users */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Utilisateurs Actifs</CardTitle>
              <UserCheck className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent className="pb-3 flex-1">
            <div className="text-3xl font-bold text-emerald-600">{stats.active}</div>
          </CardContent>
          <CardFooter className="pt-3 border-t mt-auto px-0">
            <div className="text-xs text-muted-foreground px-6">
              {stats.activePercentage.toFixed(1)}% du total
            </div>
          </CardFooter>
        </Card>

        {/* Inactive Users */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Utilisateurs Inactifs</CardTitle>
              <UserX className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent className="pb-3 flex-1">
            <div className="text-3xl font-bold text-orange-600">{stats.inactive}</div>
          </CardContent>
          <CardFooter className="pt-3 border-t mt-auto px-0">
            <div className="text-xs text-muted-foreground px-6">
              {(100 - stats.activePercentage).toFixed(1)}% du total
            </div>
          </CardFooter>
        </Card>

        {/* This Month */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ce Mois</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="pb-3 flex-1">
            <div className="text-3xl font-bold text-blue-600">{stats.thisMonth}</div>
          </CardContent>
          <CardFooter className="pt-3 border-t mt-auto px-0">
            <div className="flex justify-between w-full text-xs text-muted-foreground px-6">
              <span>Semaine: {stats.thisWeek}</span>
              <span>Aujourd'hui: {stats.today}</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Right Column - Charts */}
      <div className="grid gap-4 grid-cols-2">
        <UserStatsChart breakdown={stats.breakdown} activePercentage={stats.activePercentage} />
        <UserGrowthChart
          weeklyGrowth={stats.weeklyGrowth}
          monthlyTrend={stats.monthlyTrend}
          growthRate={stats.growthRate}
        />
      </div>
    </div>
  )
}