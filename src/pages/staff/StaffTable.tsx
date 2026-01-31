import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TextInput } from "@/components/custom-components"
import { Search, Loader2 } from "lucide-react"
import type { Staff } from "@/lib/api"
import { StaffRow } from "./StaffRow"

interface StaffTableProps {
  filteredStaff: Staff[]
  isLoading: boolean
  searchTerm: string
  onSearchChange: (value: string) => void
  onEdit: (staff: Staff) => void
  onDelete: (id: number) => void
  onChangePassword?: (staff: Staff) => void
}

export const StaffTable = ({ filteredStaff, isLoading, searchTerm, onSearchChange, onEdit, onDelete, onChangePassword }: StaffTableProps) => {
  return (
    <>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <TextInput
            placeholder="Search staff by name, email, or role..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 text-sm sm:text-base"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            Staff Members
            {isLoading ? (
              <span className="text-sm font-normal text-gray-500 ml-2">Loading...</span>
            ) : (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredStaff?.length || 0} staff members)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <span className="ml-2 text-gray-600">Loading staff members...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Name</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Role</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Contact</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff?.map((staff: Staff) => (
                    <StaffRow
                      key={staff.salesperson_id}
                      staff={staff}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onChangePassword={onChangePassword}
                    />
                  ))}
                  {filteredStaff?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500 text-sm sm:text-base">
                        {searchTerm ? "No staff members found matching your search." : "No staff members available."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
