import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit } from "lucide-react";
import { getPrompts } from "@/lib/supabase/queries";
import { requireAdmin } from "@/lib/supabase/auth";
import { TablePagination } from "@/components/admin/TablePagination";
import { DeleteAction } from "@/components/admin/DeleteAction";
import { deletePromptAction } from "../actions";

import { AppPagination } from "@/components/AppPagination";

export default async function AdminPromptsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ page?: string }> 
}) {
  await requireAdmin();
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { data: prompts, count } = await getPrompts({ limit, offset });
  const totalPages = Math.ceil(count / limit);

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-admin-text">Prompts</h2>
        <Link href="/admin/prompts/new">
          <Button className="bg-admin-primary hover:bg-admin-primary-hover text-white">
            <Plus className="w-4 h-4 mr-2" />
            Novo Prompt
          </Button>
        </Link>
      </div>

      <div className="border border-admin-border rounded-md bg-admin-surface shadow-sm">
        <div className="w-full overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-admin-border bg-admin-muted/50 text-admin-text-secondary">
              <tr>
                <th className="h-12 px-4 align-middle font-medium">Imagem</th>
                <th className="h-12 px-4 align-middle font-medium">Título</th>
                <th className="h-12 px-4 align-middle font-medium">Status</th>
                <th className="h-12 px-4 align-middle font-medium">Visualizações</th>
                <th className="h-12 px-4 align-middle font-medium">Curtidas</th>
                <th className="h-12 px-4 align-middle font-medium text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="text-admin-text">
              {prompts.map((prompt) => (
                <tr
                  key={prompt.id}
                  className="border-b border-admin-border transition-all duration-200 hover:bg-admin-muted/50 even:bg-admin-bg/30"
                >
                  <td className="p-4 align-middle">
                    <img
                      src={prompt.image}
                      alt={prompt.title || prompt.tag}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-4 align-middle font-medium">
                    {prompt.title || prompt.tag}
                  </td>
                  <td className="p-4 align-middle">
                    {prompt.is_premium ? (
                      <Badge variant="default" className="bg-admin-success hover:bg-admin-success text-white">
                        Premium
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-admin-muted text-admin-text-secondary hover:bg-admin-muted border-none">Grátis</Badge>
                    )}
                  </td>
                  <td className="p-4 align-middle text-admin-text-secondary">{prompt.views}</td>
                  <td className="p-4 align-middle text-admin-text-secondary">{prompt.likes}</td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/prompts/edit/${prompt.id}`}>
                        <Button variant="ghost" size="icon" className="hover:text-admin-primary hover:bg-admin-primary-soft">
                          <Edit className="w-4 h-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                      </Link>
                      <DeleteAction id={prompt.id} entityName="Prompt" action={deletePromptAction} />
                    </div>
                  </td>
                </tr>
              ))}
              {prompts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-admin-text-muted">
                    Nenhum prompt encontrado. Clique em &quot;Novo Prompt&quot; para adicionar um.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-admin-border bg-admin-muted/30">
          <AppPagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            baseUrl="/admin/prompts" 
            variant="admin"
          />
        </div>
      </div>
    </div>
  );
}
