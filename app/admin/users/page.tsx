import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, UserX, UserCheck, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TablePagination } from "@/components/admin/TablePagination";
import { DeleteAction } from "@/components/admin/DeleteAction";
import { cn } from "@/lib/utils";
import { requireAdmin, isAdmin } from "@/lib/supabase/auth";
import { getUsers } from "@/lib/supabase/queries";
import { deleteUserAction } from "@/app/admin/actions";

import { AppPagination } from "@/components/AppPagination";

export default async function AdminUsersPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ page?: string }> 
}) {
  await requireAdmin();
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const limit = 10;
  
  const { data: users, count } = await getUsers(limit, currentPage);
  const totalPages = Math.ceil(count / limit);

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-admin-text">Usuários</h2>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full max-sm:max-w-none max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-admin-text-muted" />
          <Input
            type="search"
            placeholder="Buscar usuários por nome ou e-mail..."
            className="pl-8 bg-admin-surface border-admin-border text-admin-text"
          />
        </div>
      </div>

      <div className="border border-admin-border rounded-md bg-admin-surface shadow-sm">
        <div className="w-full overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-admin-border bg-admin-muted/50 text-admin-text-secondary">
              <tr>
                <th className="h-12 px-4 align-middle font-medium">Usuário</th>
                <th className="h-12 px-4 align-middle font-medium">Papel</th>
                <th className="h-12 px-4 align-middle font-medium">Assinatura</th>
                <th className="h-12 px-4 align-middle font-medium">Criado em</th>
                <th className="h-12 px-4 align-middle font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const name = user.user_metadata?.full_name || user.email?.split('@')[0] || "Sem Nome";
                const role = isAdmin(user) ? "ADMIN" : (user.user_metadata?.role?.toUpperCase() || "USUÁRIO");
                const subStatus = user.user_metadata?.subscription === 'ACTIVE' ? "ATIVA" : "INATIVA";
                const joinedAt = user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : "-";
                
                return (
                  <tr
                    key={user.id}
                    className="border-b border-admin-border transition-all duration-200 hover:bg-admin-muted/50 even:bg-admin-bg/50"
                  >
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-admin-muted flex items-center justify-center font-bold text-xs text-admin-text">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium leading-none text-admin-text">{name}</p>
                          <p className="text-xs text-admin-text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge variant="outline" className={cn("border-admin-border text-admin-text-secondary", role === 'ADMIN' ? 'border-admin-primary/50 text-admin-primary bg-admin-primary-soft' : '')}>
                        {role}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge 
                        variant={subStatus === 'ATIVA' ? 'default' : 'secondary'}
                        className={cn(
                          subStatus === 'ATIVA' ? 'bg-admin-success hover:bg-admin-success-hover text-white' : 'bg-admin-muted text-admin-text-secondary'
                        )}
                      >
                        {subStatus}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-admin-text-muted">
                      {joinedAt}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Alternar Acesso" className="text-admin-text-muted hover:bg-admin-muted">
                          {subStatus === 'ATIVA' ? (
                            <UserX className="h-4 w-4 hover:text-admin-danger" />
                          ) : (
                            <UserCheck className="h-4 w-4 hover:text-admin-success" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" className="text-admin-text-muted hover:text-admin-primary hover:bg-admin-muted">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <DeleteAction id={user.id} entityName="Usuário" action={deleteUserAction} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-admin-text-muted">Nenhum usuário encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-admin-border bg-admin-muted/30">
          <AppPagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            baseUrl="/admin/users" 
            variant="admin"
          />
        </div>
      </div>
    </div>
  );
}
