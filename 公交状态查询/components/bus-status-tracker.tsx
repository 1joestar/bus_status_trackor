"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Bus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BusRouteMap from "@/components/bus-route-map"
import BusStatusList from "@/components/bus-status-list"
import NearbyBusStops from "@/components/nearby-bus-stops"

// 区域名称映射
const districtNames: Record<string, string> = {
  furong: "芙蓉区",
  yuelu: "岳麓区",
  yuhua: "雨花区",
  tianxin: "天心区",
  wangcheng: "望城区",
  kaifu: "开福区",
}

// 各区域的公交站点
const busStationsByDistrict: Record<string, string[]> = {
  furong: ["五一广场公交站", "芙蓉广场公交站", "袁家岭公交站", "火车站公交站", "文艺路公交站"],
  yuelu: ["岳麓山公交站", "橘子洲公交站", "湖南大学公交站", "麓山公交站", "望月湖公交站"],
  yuhua: ["雨花亭公交站", "红星公交站", "韶山南路公交站", "树木岭公交站", "高桥公交站"],
  tianxin: ["南门口公交站", "南湖路公交站", "贺龙体育场公交站", "白沙路公交站", "桂花坪公交站"],
  wangcheng: ["望城区政府公交站", "望城大道公交站", "月亮岛公交站", "铜官公交站", "乔口公交站"],
  kaifu: ["开福寺公交站", "湘江中路公交站", "烈士公园公交站", "德雅路公交站", "湘雅医院公交站"],
}

export default function BusStatusTracker() {
  const [startDistrict, setStartDistrict] = useState("")
  const [endDistrict, setEndDistrict] = useState("")
  const [startAddress, setStartAddress] = useState("")
  const [endAddress, setEndAddress] = useState("")
  const [startStations, setStartStations] = useState<string[]>([])
  const [endStations, setEndStations] = useState<string[]>([])
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [mapInstance, setMapInstance] = useState<any>(null)

  // 当起始区域变化时，更新站点列表
  useEffect(() => {
    if (startDistrict && busStationsByDistrict[startDistrict]) {
      setStartStations(busStationsByDistrict[startDistrict])
    } else {
      setStartStations([])
    }
  }, [startDistrict])

  // 当目的区域变化时，更新站点列表
  useEffect(() => {
    if (endDistrict && busStationsByDistrict[endDistrict]) {
      setEndStations(busStationsByDistrict[endDistrict])
    } else {
      setEndStations([])
    }
  }, [endDistrict])

  const handleSearch = () => {
    setIsSearching(true)

    // 模拟API调用
    setTimeout(() => {
      setSearchPerformed(true)
      setIsSearching(false)
    }, 1000)
  }

  const handleMapInstance = (instance: any) => {
    setMapInstance(instance)
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>查询公交状态</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 起始地点区域选择 */}
            <div>
              <label className="text-sm font-medium mb-1 block">起始地点区域</label>
              <Select onValueChange={setStartDistrict} value={startDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder="选择起始区域" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="furong">芙蓉区</SelectItem>
                  <SelectItem value="yuelu">岳麓区</SelectItem>
                  <SelectItem value="yuhua">雨花区</SelectItem>
                  <SelectItem value="tianxin">天心区</SelectItem>
                  <SelectItem value="wangcheng">望城区</SelectItem>
                  <SelectItem value="kaifu">开福区</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 起始地址输入 */}
            <div>
              <label className="text-sm font-medium mb-1 block">起始地址</label>
              <div className="flex gap-2">
                <Select disabled={!startDistrict} onValueChange={setStartAddress} value={startAddress}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder={startDistrict ? "选择公交站点或输入地址" : "请先选择区域"} />
                  </SelectTrigger>
                  <SelectContent>
                    {startStations.map((station) => (
                      <SelectItem key={station} value={station}>
                        {station}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">自定义地址...</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" title="在地图上选择">
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
              {startAddress === "custom" && (
                <Input
                  placeholder="输入自定义起始地址"
                  className="mt-2"
                  onChange={(e) => setStartAddress(e.target.value)}
                />
              )}
              {startDistrict && startAddress && startAddress !== "custom" && (
                <p className="text-xs text-muted-foreground mt-1">
                  {districtNames[startDistrict]} {startAddress}
                </p>
              )}
            </div>

            {/* 目的地点区域选择 */}
            <div>
              <label className="text-sm font-medium mb-1 block">目的地点区域</label>
              <Select onValueChange={setEndDistrict} value={endDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder="选择目的区域" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="furong">芙蓉区</SelectItem>
                  <SelectItem value="yuelu">岳麓区</SelectItem>
                  <SelectItem value="yuhua">雨花区</SelectItem>
                  <SelectItem value="tianxin">天心区</SelectItem>
                  <SelectItem value="wangcheng">望城区</SelectItem>
                  <SelectItem value="kaifu">开福区</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 目的地址输入 */}
            <div>
              <label className="text-sm font-medium mb-1 block">目的地址</label>
              <div className="flex gap-2">
                <Select disabled={!endDistrict} onValueChange={setEndAddress} value={endAddress}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder={endDistrict ? "选择公交站点或输入地址" : "请先选择区域"} />
                  </SelectTrigger>
                  <SelectContent>
                    {endStations.map((station) => (
                      <SelectItem key={station} value={station}>
                        {station}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">自定义地址...</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" title="在地图上选择">
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
              {endAddress === "custom" && (
                <Input
                  placeholder="输入自定义目的地址"
                  className="mt-2"
                  onChange={(e) => setEndAddress(e.target.value)}
                />
              )}
              {endDistrict && endAddress && endAddress !== "custom" && (
                <p className="text-xs text-muted-foreground mt-1">
                  {districtNames[endDistrict]} {endAddress}
                </p>
              )}
            </div>

            <Button
              className="w-full"
              onClick={handleSearch}
              disabled={
                !startDistrict ||
                !endDistrict ||
                !startAddress ||
                !endAddress ||
                isSearching ||
                (startAddress === "custom" && !startAddress) ||
                (endAddress === "custom" && !endAddress)
              }
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 查询中...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" /> 查询公交
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-2">
        {searchPerformed ? (
          <Tabs defaultValue="map">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="map">路线地图</TabsTrigger>
              <TabsTrigger value="list">公交状态</TabsTrigger>
            </TabsList>
            <TabsContent value="map" className="mt-4">
              <BusRouteMap
                startAddress={startAddress === "custom" ? startAddress : startAddress}
                endAddress={endAddress === "custom" ? endAddress : endAddress}
                startDistrict={startDistrict}
                endDistrict={endDistrict}
                onMapInstance={handleMapInstance}
              />
            </TabsContent>
            <TabsContent value="list" className="mt-4">
              <BusStatusList
                startAddress={startAddress === "custom" ? startAddress : startAddress}
                endAddress={endAddress === "custom" ? endAddress : endAddress}
                startDistrict={startDistrict}
                endDistrict={endDistrict}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[400px] bg-muted/30 rounded-lg border border-dashed">
            <div className="text-center p-8">
              <Bus className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">查询公交路线</h3>
              <p className="mt-2 text-sm text-muted-foreground">请选择起始和目的地区域及地址，然后点击查询按钮</p>
            </div>
          </div>
        )}
        {searchPerformed && (
          <div className="mt-6">
            <NearbyBusStops district={startDistrict} mapInstance={mapInstance} />
          </div>
        )}
      </div>
    </div>
  )
}

