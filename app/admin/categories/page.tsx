import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TablePagination } from "@/components/admin/TablePagination";
import { DeleteAction } from "@/components/admin/DeleteAction";
import { SubmitToastButton } from "@/components/admin/SubmitToastButton";

import { getCategories } from "@/lib/supabase/queries";
import { requireAdmin } from "@/lib/supabase/auth";
import { addCategoryAction, deleteCategoryAction } from "../actions";

import { AppPagination } from "@/components/AppPagination";

export default async function AdminCategoriesPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ page?: string }> 
}) {
  await requireAdmin();
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { data: categories, count } = await getCategories(limit, offset);
  const totalPages = Math.ceil(count / limit);

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-admin-text">Categorias</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="bg-admin-surface border-admin-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-admin-text">Adicionar Categoria</CardTitle>
              <CardDescription className="text-admin-text-muted">
                Crie uma nova categoria para organizar os prompts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={addCategoryAction as unknown as (payload: FormData) => void} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-admin-text">Nome</label>
                  <Input id="name" name="name" placeholder="ex: Fantasia" required className="bg-admin-bg border-admin-border text-admin-text" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="slug" className="text-sm font-medium text-admin-text">Slug</label>
                  <Input id="slug" name="slug" placeholder="ex: fantasia" required className="bg-admin-bg border-admin-border text-admin-text" />
                  <p className="text-xs text-admin-text-muted">Nome amigável para URL</p>
                </div>
                <SubmitToastButton className="w-full bg-admin-primary hover:bg-admin-primary-hover text-white" message="Categoria adicionada.">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Categoria
                </SubmitToastButton>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <div className="border border-admin-border rounded-md bg-admin-surface shadow-sm">
            <div className="w-full overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="border-b border-admin-border bg-admin-muted/50 text-admin-text-secondary">
                  <tr>
                    <th className="h-12 px-4 align-middle font-medium">Nome</th>
                    <th className="h-12 px-4 align-middle font-medium">Slug</th>
                    <th className="h-12 px-4 align-middle font-medium text-right">Prompts</th>
                    <th className="h-12 px-4 align-middle font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-admin-text">
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b border-admin-border transition-all duration-200 hover:bg-admin-muted/50 even:bg-admin-bg/30"
                    >
                      <td className="p-4 align-middle font-medium">
                        {category.name}
                      </td>
                      <td className="p-4 align-middle text-admin-text-secondary">
                        /{category.slug}
                      </td>
                      <td className="p-4 align-middle text-right">
                        -
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="hover:text-admin-primary hover:bg-admin-primary-soft">
                            <Edit className="w-4 h-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <DeleteAction id={category.id} entityName="Categoria" action={deleteCategoryAction} />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-admin-text-muted">Nenhuma categoria cadastrada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-admin-border bg-admin-muted/30">
              <AppPagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                baseUrl="/admin/categories" 
                variant="admin"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
