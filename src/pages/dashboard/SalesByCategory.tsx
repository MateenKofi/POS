import { Card, CardContent, CardHeader, CardTitle } from "@/components/custom-components"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface SalesByCategoryProps {
  data: Array<{ name: string; value: number; color: string }>
  formatCurrency: (amount: number) => string
}

export const SalesByCategory = ({ data, formatCurrency }: SalesByCategoryProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-slate-800">
          Sales by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value) => value ? [formatCurrency(Number(value)), ''] : ''}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {data.map((item) => {
            const percentage = ((item.value / total) * 100).toFixed(1)
            return (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-800 font-medium">{percentage}%</span>
                  <span className="text-slate-500">{formatCurrency(item.value)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
