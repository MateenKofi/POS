import { Button, TableCell, TableRow } from "@/components/custom-components"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, Key } from "lucide-react"
import type { Staff } from "@/lib/api"

interface StaffRowProps {
  staff: Staff
  onEdit: (staff: Staff) => void
  onDelete: (id: number) => void
  onChangePassword?: (staff: Staff) => void
}

export function StaffRow({ staff, onEdit, onDelete, onChangePassword }: StaffRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-semibold text-sm">
              {staff.first_name.charAt(0)}{staff.last_name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium">{staff.first_name} {staff.last_name}</p>
            <p className="text-sm text-gray-500">{staff.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          {staff.role}
        </Badge>
      </TableCell>
      <TableCell className="hidden lg:table-cell text-sm text-gray-600">
        {staff.contact_info || 'N/A'}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onEdit(staff)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          {onChangePassword && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
              onClick={() => onChangePassword(staff)}
              title="Change Password"
            >
              <Key className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            onClick={() => onDelete(staff.salesperson_id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
