"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface BusRouteMapProps {
  startAddress: string
  endAddress: string
  startDistrict: string
  endDistrict: string
  onMapInstance?: (instance: any) => void
}

// District center coordinates for Changsha districts
const districtCoordinates: Record<string, [number, number]> = {
  furong: [113.032067, 28.193106], // 芙蓉区中心坐标
  yuelu: [112.944052, 28.201073], // 岳麓区中心坐标
  yuhua: [113.038398, 28.137358], // 雨花区中心坐标
  tianxin: [112.990047, 28.119566], // 天心区中心坐标
  wangcheng: [112.817749, 28.357033], // 望城区中心坐标
  kaifu: [113.015288, 28.219719], // 开福区中心坐标
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

export default function BusRouteMap({
  startAddress,
  endAddress,
  startDistrict,
  endDistrict,
  onMapInstance,
}: BusRouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize map when component mounts
  useEffect(() => {
    // Check if AMap is available (Gaode Maps API)
    if (typeof window !== "undefined" && window.AMap && mapRef.current && !mapInstance) {
      try {
        // Create map instance
        const map = new window.AMap.Map(mapRef.current, {
          zoom: 12,
          center: [112.982279, 28.19409], // Changsha city center
          resizeEnable: true,
        })

        // Add map controls
        map.plugin(["AMap.ToolBar", "AMap.Scale"], () => {
          map.addControl(new window.AMap.ToolBar())
          map.addControl(new window.AMap.Scale())
        })

        setMapInstance(map)
        if (onMapInstance) {
          onMapInstance(map)
        }
        setupMapClickHandler(map)
        setIsLoading(false)
      } catch (err) {
        console.error("Error initializing map:", err)
        setError("地图加载失败，请刷新页面重试")
        setIsLoading(false)
      }
    }

    // Clean up function
    return () => {
      if (mapInstance) {
        mapInstance.destroy()
      }
    }
  }, [mapInstance, onMapInstance])

  // Add markers for start and end addresses
  useEffect(() => {
    if (mapInstance && startAddress && endAddress) {
      // Clear existing route and markers
      mapInstance.clearMap()

      // Geocode start and end addresses
      window.AMap.plugin("AMap.Geocoder", () => {
        const geocoder = new window.AMap.Geocoder({
          city: "长沙市", // Limit search to Changsha
        })

        // Geocode start address
        geocoder.getLocation(
          `长沙市 ${districtNames[startDistrict] || ""} ${startAddress}`,
          (status: string, result: any) => {
            if (status === "complete" && result.geocodes.length) {
              const startLocation = result.geocodes[0].location

              // Add marker for start location
              const startMarker = new window.AMap.Marker({
                position: startLocation,
                title: startAddress,
                icon: new window.AMap.Icon({
                  size: new window.AMap.Size(25, 34),
                  imageSize: new window.AMap.Size(25, 34),
                  image: "https://webapi.amap.com/theme/v1.3/markers/n/start.png",
                }),
              })
              mapInstance.add(startMarker)

              // Geocode end address
              geocoder.getLocation(
                `长沙市 ${districtNames[endDistrict] || ""} ${endAddress}`,
                (status: string, result: any) => {
                  if (status === "complete" && result.geocodes.length) {
                    const endLocation = result.geocodes[0].location

                    // Add marker for end location
                    const endMarker = new window.AMap.Marker({
                      position: endLocation,
                      title: endAddress,
                      icon: new window.AMap.Icon({
                        size: new window.AMap.Size(25, 34),
                        imageSize: new window.AMap.Size(25, 34),
                        image: "https://webapi.amap.com/theme/v1.3/markers/n/end.png",
                      }),
                    })
                    mapInstance.add(endMarker)

                    // Calculate route between start and end using public transportation
                    window.AMap.plugin("AMap.Transfer", () => {
                      const transfer = new window.AMap.Transfer({
                        map: mapInstance,
                        policy: window.AMap.TransferPolicy.LEAST_TIME,
                        city: "长沙市",
                        panel: false,
                        nightflag: true,
                      })

                      transfer.search(startLocation, endLocation, (status: string, result: any) => {
                        // Fit the map to show the entire route
                        if (status === "complete") {
                          // Add custom markers for bus stops if needed
                          if (result.plans && result.plans.length > 0) {
                            const plan = result.plans[0]
                            // You could add additional markers for bus stops here if needed
                          }
                          mapInstance.setFitView()
                        }
                      })
                    })
                  }
                },
              )
            }
          },
        )
      })
    }
  }, [startAddress, endAddress, startDistrict, endDistrict, mapInstance])

  // Add this function after the useEffect hooks
  const setupMapClickHandler = (map: any) => {
    if (map) {
      map.on("click", (e: any) => {
        // Get clicked location
        const lnglat = e.lnglat

        // Reverse geocode to get address
        window.AMap.plugin("AMap.Geocoder", () => {
          const geocoder = new window.AMap.Geocoder({
            city: "长沙市",
          })

          geocoder.getAddress(lnglat, (status: string, result: any) => {
            if (status === "complete" && result.regeocode) {
              const address = result.regeocode.formattedAddress
              // You could emit an event or use a callback to update the address in the parent component
              console.log("Clicked location address:", address)
            }
          })
        })
      })
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-muted">
        {/* Map container */}
        <div ref={mapRef} className="w-full h-full" />

        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium">加载地图中...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="bg-destructive/10 text-destructive p-4 rounded-md max-w-xs text-center">
              <p className="font-medium">{error}</p>
              <p className="text-sm mt-1">请检查网络连接或刷新页面</p>
            </div>
          </div>
        )}

        {/* Route information overlay */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-sm max-w-xs">
            <div className="text-sm font-medium mb-2">长沙市公交路线</div>
            <div className="flex items-center gap-2 text-xs">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="font-medium truncate">
                {districtNames[startDistrict] || ""} {startAddress || "起点未设置"}
              </span>
            </div>
            <div className="my-1 ml-1 border-l border-dashed border-muted-foreground/50 h-4" />
            <div className="flex items-center gap-2 text-xs">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="font-medium truncate">
                {districtNames[endDistrict] || ""} {endAddress || "终点未设置"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

