import { Badge } from "@/components/ui/badge"
import { Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/custom-components"
import { Edit, Trash2 } from "lucide-react"
import type { Transaction } from "@/lib/api"

interface TransactionListProps {
  transactions: Transaction[]
  transactionTypeLabels: Record<string, string>
  transactionStatusColors: Record<string, string>
  onEdit: (transaction: Transaction) => void
  onDelete: (id: number) => void
}

export function TransactionList({
  transactions,
  transactionTypeLabels,
  transactionStatusColors,
  onEdit,
  onDelete,
}: TransactionListProps) {
  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t: Transaction) => (
            <TableRow key={t.transaction_id}>
              <TableCell className="text-xs text-slate-600">
                {new Date(t.transaction_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span className="text-xs font-mono text-slate-600">{t.reference_number || `TXN-${t.transaction_id}`}</span>
              </TableCell>
              <TableCell>
                <p className="text-sm text-slate-800 truncate max-w-[200px]">{t.description}</p>
                {t.cashier_name && <p className="text-xs text-slate-500">{t.cashier_name}</p>}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={transactionStatusColors[t.status]}>
                  {transactionTypeLabels[t.transaction_type]}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <span className={`text-sm font-semibold ${parseFloat(t.amount) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  GH₵{parseFloat(t.amount).toFixed(2)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onEdit(t)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-600" onClick={() => onDelete(t.transaction_id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
