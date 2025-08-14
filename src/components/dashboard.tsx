import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react"

export function Dashboard() {
  const stats = [
    {
      title: "Today's Sales",
      value: "$2,847.50",
      icon: DollarSign,
      change: "+12.5%",
      changeType: "positive" as const,
    },
    {
      title: "Products in Stock",
      value: "1,247",
      icon: Package,
      change: "-3.2%",
      changeType: "negative" as const,
    },
    {
      title: "Transactions",
      value: "89",
      icon: ShoppingCart,
      change: "+8.1%",
      changeType: "positive" as const,
    },
    {
      title: "Average Sale",
      value: "$32.00",
      icon: TrendingUp,
      change: "+5.4%",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Your Sales at a Glance</h1>
        <p className="text-slate-600">Monitor your business performance in real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                <p className={`text-xs ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                  {stat.change} from yesterday
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="font-medium text-slate-800">Transaction #{1000 + i}</p>
                    <p className="text-sm text-slate-600">2 items • 2 min ago</p>
                  </div>
                  <p className="font-semibold text-slate-800">${(Math.random() * 100 + 10).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Coffee Beans", "Milk Cartons", "Sugar Packets", "Paper Cups"].map((item, i) => (
                <div
                  key={item}
                  className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-slate-800">{item}</p>
                    <p className="text-sm text-red-600">Only {Math.floor(Math.random() * 10 + 1)} left</p>
                  </div>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
