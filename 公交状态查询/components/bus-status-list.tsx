"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bus, Clock, ArrowRight, Users } from "lucide-react"

interface BusStatusListProps {
  startAddress: string
  endAddress: string
  startDistrict: string
  endDistrict: string
}

// District names in Chinese
const districtNames: Record<string, string> = {
  furong: "芙蓉区",
  yuelu: "岳麓区",
  yuhua: "雨花区",
  tianxin: "天心区",
  wangcheng: "望城区",
  kaifu: "开福区",
}

export default function BusStatusList({ startAddress, endAddress, startDistrict, endDistrict }: BusStatusListProps) {
  // Mock data - in a real app, this would come from an API
  const busRoutes = [
    {
      id: "1",
      routeNumber: "地铁2号线",
      departureTime: "3分钟后",
      arrivalTime: "20分钟",
      crowdLevel: "中",
      status: "正常",
      stops: "五一广场 → 芙蓉广场 → 袁家岭",
    },
    {
      id: "2",
      routeNumber: "901",
      departureTime: "5分钟后",
      arrivalTime: "35分钟",
      crowdLevel: "低",
      status: "正常",
      stops: "长沙火车站 → 五一广场 → 南门口",
    },
    {
      id: "3",
      routeNumber: "旅2",
      departureTime: "2分钟后",
      arrivalTime: "30分钟",
      crowdLevel: "中",
      status: "正常",
      stops: "长沙火车南站 → 韶山南路 → 南湖路",
    },
    {
      id: "4",
      routeNumber: "W112",
      departureTime: "10分钟后",
      arrivalTime: "40分钟",
      crowdLevel: "高",
      status: "延迟",
      stops: "岳麓山 → 橘子洲 → 五一广场",
    },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">可用公交路线</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            从{" "}
            <span className="font-medium text-foreground">
              {districtNames[startDistrict]} {startAddress}
            </span>{" "}
            到{" "}
            <span className="font-medium text-foreground">
              {districtNames[endDistrict]} {endAddress}
            </span>
          </div>

          <div className="space-y-3">
            {busRoutes.map((route) => (
              <div key={route.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="bg-primary/10 text-primary font-bold rounded p-1 w-14 text-center">
                      {route.routeNumber}
                    </div>
                    <ArrowRight className="mx-2 h-4 w-4 text-muted-foreground" />
                    <div>
                      <Badge variant={route.status === "正常" ? "outline" : "destructive"}>{route.status}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">
                      {route.crowdLevel === "低" && "人少"}
                      {route.crowdLevel === "中" && "适中"}
                      {route.crowdLevel === "高" && "拥挤"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <Bus className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>发车: {route.departureTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>预计用时: {route.arrivalTime}</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  <span>途经: {route.stops}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

