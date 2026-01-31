import { Card, CardContent, CardHeader, CardTitle } from "@/components/custom-components"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DailySalesChartProps {
  data: Array<{ name: string; sales: number; revenue: number }>
  formatCurrency: (amount: number) => string
}

export function DailySalesChart({ data, formatCurrency }: DailySalesChartProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-slate-800">
          Weekly Sales Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(value) => `GH₵${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value, name) => {
                if (value === undefined) return ''
                return [
                  name === 'sales' ? value : formatCurrency(Number(value)),
                  name === 'sales' ? 'Transactions' : 'Revenue'
                ]
              }}
            />
            <Bar
              dataKey="revenue"
              fill="url(#barGradient)"
              radius={[4, 4, 0, 0]}
              className="fill-emerald-500"
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
