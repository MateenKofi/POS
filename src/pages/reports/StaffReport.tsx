import { Card, CardContent, CardHeader, CardTitle } from "@/components/custom-components"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/custom-components"

interface StaffPerformanceData {
  id: number
  name: string
  role: string
  totalSalesAmount: number
  transactions: number
  avgTransaction: number
  totalProfit: number
}

interface StaffReportProps {
  staffPerformance: StaffPerformanceData[]
  formatCurrency: (amount: number) => string
}

export function StaffReport({ staffPerformance, formatCurrency }: StaffReportProps) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">Staff Performance</CardTitle>
      </CardHeader>
      <CardContent>
        {staffPerformance.length === 0 ? (
          <p className="text-center text-slate-500 py-4">No staff data available</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                  <TableHead className="text-right">Transactions</TableHead>
                  <TableHead className="text-right">Avg Transaction</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffPerformance.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.name}</TableCell>
                    <TableCell>
                      <span className="capitalize">{staff.role}</span>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(staff.totalSalesAmount)}
                    </TableCell>
                    <TableCell className="text-right">{staff.transactions}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(staff.avgTransaction)}
                    </TableCell>
                    <TableCell className="text-right text-green-600 font-medium">
                      {formatCurrency(staff.totalProfit)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
