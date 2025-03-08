"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bus, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NearbyBusStopsProps {
  district: string
  mapInstance?: any
}

export default function NearbyBusStops({ district, mapInstance }: NearbyBusStopsProps) {
  const [busStops, setBusStops] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Mock data for nearby bus stops in different districts
  const mockBusStops: Record<string, any[]> = {
    furong: [
      { name: "五一广场公交站", distance: "300米", lines: ["地铁2号线", "901", "旅2"] },
      { name: "芙蓉广场公交站", distance: "500米", lines: ["地铁2号线", "123", "234"] },
      { name: "袁家岭公交站", distance: "800米", lines: ["地铁2号线", "901", "W112"] },
    ],
    yuelu: [
      { name: "岳麓山公交站", distance: "200米", lines: ["W112", "118", "旅3"] },
      { name: "橘子洲公交站", distance: "600米", lines: ["W112", "901", "123"] },
      { name: "湖南大学公交站", distance: "900米", lines: ["118", "123", "234"] },
    ],
    yuhua: [
      { name: "雨花亭公交站", distance: "400米", lines: ["地铁2号线", "123", "234"] },
      { name: "红星公交站", distance: "700米", lines: ["901", "123", "W112"] },
      { name: "韶山南路公交站", distance: "1000米", lines: ["旅2", "123", "234"] },
    ],
    tianxin: [
      { name: "南门口公交站", distance: "300米", lines: ["901", "123", "234"] },
      { name: "南湖路公交站", distance: "600米", lines: ["旅2", "123", "234"] },
      { name: "贺龙体育场公交站", distance: "900米", lines: ["118", "123", "234"] },
    ],
    wangcheng: [
      { name: "望城区政府公交站", distance: "400米", lines: ["118", "123", "234"] },
      { name: "望城大道公交站", distance: "700米", lines: ["118", "123", "234"] },
      { name: "月亮岛公交站", distance: "1000米", lines: ["118", "123", "234"] },
    ],
    kaifu: [
      { name: "开福寺公交站", distance: "350米", lines: ["地铁1号线", "112", "234"] },
      { name: "湘江中路公交站", distance: "550米", lines: ["901", "112", "234"] },
      { name: "烈士公园公交站", distance: "850米", lines: ["地铁1号线", "112", "234"] },
    ],
  }

  const findNearbyBusStops = () => {
    setLoading(true)

    // Simulate API call with timeout
    setTimeout(() => {
      if (district && mockBusStops[district]) {
        setBusStops(mockBusStops[district])
      } else {
        setBusStops([])
      }
      setLoading(false)
    }, 1000)
  }

  const showOnMap = (busStop: any) => {
    if (mapInstance) {
      // In a real app, you would use actual coordinates
      // This is just a placeholder
      console.log(`Showing ${busStop.name} on map`)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>附近公交站</span>
          <Button variant="outline" size="sm" onClick={findNearbyBusStops} disabled={loading || !district}>
            {loading ? "加载中..." : "查找附近站点"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {busStops.length > 0 ? (
          <div className="space-y-3">
            {busStops.map((stop, index) => (
              <div key={index} className="flex justify-between items-start border-b pb-2 last:border-0">
                <div>
                  <div className="font-medium flex items-center">
                    <Bus className="h-4 w-4 mr-1 text-primary" />
                    {stop.name}
                    <span className="ml-2 text-xs text-muted-foreground">{stop.distance}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">线路: {stop.lines.join(", ")}</div>
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => showOnMap(stop)}>
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="text-xs">查看</span>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            {district ? '点击"查找附近站点"按钮查看附近公交站' : "请先选择区域"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

