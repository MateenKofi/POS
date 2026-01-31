import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/custom-components"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/custom-components"
import type { Product } from "@/lib/api"

interface ExpiringProduct extends Product {
  daysUntilExpiry: number
  status: 'expired' | 'expiring_soon' | 'ok'
}

interface ExpiryReportProps {
  expiringProducts: ExpiringProduct[]
}

export const ExpiryReport = ({ expiringProducts }: ExpiryReportProps) => {
  const getStatusBadge = (status: 'expired' | 'expiring_soon' | 'ok') => {
    if (status === 'expired') {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expired</Badge>
    }
    if (status === 'ok') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">OK</Badge>
    }
    return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Expiring Soon</Badge>
  }

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">Expiring Stock Report</CardTitle>
      </CardHeader>
      <CardContent>
        {expiringProducts.length === 0 ? (
          <p className="text-center text-slate-500 py-4">No products expiring soon</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringProducts.map((product) => (
                  <TableRow key={product.product_id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category || '-'}</TableCell>
                    <TableCell>{new Date(product.expiry_date!).toLocaleDateString()}</TableCell>
                    <TableCell>{product.daysUntilExpiry}</TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
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
