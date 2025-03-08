import BusStatusTracker from "@/components/bus-status-tracker"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold">长沙市公交状态查询</h1>
          <h2 className="text-xl text-primary mt-1">ChangSha BUS Status Tracker</h2>
          <p className="text-muted-foreground mt-2 text-center">查询长沙市各区域公交运行状态、路线规划及附近站点信息</p>
        </div>
        <BusStatusTracker />
      </div>
    </main>
  )
}

