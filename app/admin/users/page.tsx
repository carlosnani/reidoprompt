import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, UserX, UserCheck, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TablePagination } from "@/components/admin/TablePagination";
import { DeleteAction } from "@/components/admin/DeleteAction";
import { cn } from "@/lib/utils";

const mockUsers = [
  { id: "1", name: "Alice Smith", email: "alice@example.com", role: "USER", subStatus: "ACTIVE", joinedAt: "2026-04-10" },
  { id: "2", name: "Bob Jones", email: "bob@example.com", role: "CREATOR", subStatus: "ACTIVE", joinedAt: "2026-03-22" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", role: "USER", subStatus: "INACTIVE", joinedAt: "2026-05-01" },
  { id: "4", name: "Diana Prince", email: "diana@example.com", role: "ADMIN", subStatus: "ACTIVE", joinedAt: "2026-01-15" },
  { id: "5", name: "Evan Wright", email: "evan@example.com", role: "USER", subStatus: "CANCELED", joinedAt: "2026-02-28" },
];

export default function AdminUsersPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-admin-text">Users</h2>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full max-sm:max-w-none max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-admin-text-muted" />
          <Input
            type="search"
            placeholder="Search users by name or email..."
            className="pl-8 bg-admin-surface border-admin-border text-admin-text"
          />
        </div>
      </div>

      <div className="border border-admin-border rounded-md bg-admin-surface shadow-sm">
        <div className="w-full overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-admin-border bg-admin-muted/50 text-admin-text-secondary">
              <tr>
                <th className="h-12 px-4 align-middle font-medium">User</th>
                <th className="h-12 px-4 align-middle font-medium">Role</th>
                <th className="h-12 px-4 align-middle font-medium">Subscription</th>
                <th className="h-12 px-4 align-middle font-medium">Joined</th>
                <th className="h-12 px-4 align-middle font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-admin-border transition-all duration-200 hover:bg-admin-muted/50 even:bg-admin-bg/50"
                >
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-admin-muted flex items-center justify-center font-bold text-xs text-admin-text">
                        {user.name.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium leading-none text-admin-text">{user.name}</p>
                        <p className="text-xs text-admin-text-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge variant="outline" className={cn("border-admin-border text-admin-text-secondary", user.role === 'ADMIN' ? 'border-admin-primary/50 text-admin-primary bg-admin-primary-soft' : '')}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge 
                      variant={user.subStatus === 'ACTIVE' ? 'default' : 'secondary'}
                      className={cn(
                        user.subStatus === 'ACTIVE' ? 'bg-admin-success hover:bg-admin-success-hover text-white' : 'bg-admin-muted text-admin-text-secondary'
                      )}
                    >
                      {user.subStatus}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle text-admin-text-muted">
                    {user.joinedAt}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Toggle Access" className="text-admin-text-muted hover:bg-admin-muted">
                        {user.subStatus === 'ACTIVE' ? (
                          <UserX className="h-4 w-4 hover:text-admin-danger" />
                        ) : (
                          <UserCheck className="h-4 w-4 hover:text-admin-success" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" className="text-admin-text-muted hover:text-admin-primary hover:bg-admin-muted">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <DeleteAction id={user.id} entityName="Usuário" action={async (id) => { "use server"; return { success: true }; }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination />
      </div>
    </div>
  );
}
