import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, ShieldAlert } from "lucide-react";
import { DeleteAction } from "@/components/admin/DeleteAction";
import { UserActionButtons } from "@/components/admin/UserActionButtons";
import { UserSearchInput } from "@/components/admin/UserSearchInput";
import { cn } from "@/lib/utils";
import { requireAdmin, isAdmin, isPro } from "@/lib/supabase/auth";
import { getUsers } from "@/lib/supabase/queries";
import { deleteUserAction } from "@/app/admin/actions";

import { AppPagination } from "@/components/AppPagination";

export default async function AdminUsersPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ page?: string; q?: string }> 
}) {
  await requireAdmin();
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.q || "";
  const limit = 10;
  
  const { data: users, count } = await getUsers(limit, currentPage, searchQuery);
  const totalPages = Math.ceil(count / limit);

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-admin-text">Usuários</h2>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <UserSearchInput />
      </div>

      <div className="border border-admin-border rounded-md bg-admin-surface shadow-sm">
        <div className="w-full overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-admin-border bg-admin-muted/50 text-admin-text-secondary">
              <tr>
                <th className="h-12 px-4 align-middle font-medium">Usuário</th>
                <th className="h-12 px-4 align-middle font-medium">Papel</th>
                <th className="h-12 px-4 align-middle font-medium">Assinatura</th>
                <th className="h-12 px-4 align-middle font-medium">Status</th>
                <th className="h-12 px-4 align-middle font-medium">Criado em</th>
                <th className="h-12 px-4 align-middle font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const name = user.user_metadata?.full_name || user.email?.split('@')[0] || "Sem Nome";
                const role = isAdmin(user) ? "ADMIN" : (user.user_metadata?.role?.toUpperCase() || "USUÁRIO");
                
                const userIsPro = isPro(user);
                const subStatus = userIsPro ? "PRO" : "FREE";
                
                const isBanned = !!user.banned_until && new Date(user.banned_until) > new Date();
                
                const joinedAt = user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : "-";
                
                return (
                  <tr
                    key={user.id}
                    className={cn(
                      "border-b border-admin-border transition-all duration-200 hover:bg-admin-muted/50 even:bg-admin-bg/50",
                      isBanned && "opacity-60 grayscale-[0.5]"
                    )}
                  >
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-admin-muted flex items-center justify-center font-bold text-xs text-admin-text">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium leading-none text-admin-text">
                            {name}
                            {isBanned && <span className="ml-2 text-[10px] bg-admin-danger/20 text-admin-danger px-1 rounded font-bold uppercase">Banido</span>}
                          </p>
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
                        variant={userIsPro ? 'default' : 'secondary'}
                        className={cn(
                          userIsPro ? 'bg-admin-primary hover:bg-admin-primary/90 text-white font-bold' : 'bg-admin-muted text-admin-text-secondary'
                        )}
                      >
                        {subStatus}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">
                      {isBanned ? (
                        <div className="flex items-center gap-1 text-admin-danger font-medium">
                          <ShieldAlert className="h-3 w-3" />
                          <span>Bloqueado</span>
                        </div>
                      ) : (
                        <span className="text-admin-success font-medium">Ativo</span>
                      )}
                    </td>
                    <td className="p-4 align-middle text-admin-text-muted">
                      {joinedAt}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <UserActionButtons 
                          userId={user.id} 
                          isPro={userIsPro} 
                          isBanned={isBanned} 
                        />
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
                  <td colSpan={6} className="p-4 text-center text-admin-text-muted">Nenhum usuário encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-admin-border bg-admin-muted/30">
          <AppPagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            baseUrl={searchQuery ? `/admin/users?q=${encodeURIComponent(searchQuery)}` : "/admin/users"} 
            variant="admin"
          />
        </div>
      </div>
    </div>
  );
}
