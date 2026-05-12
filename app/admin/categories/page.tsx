import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TablePagination } from "@/components/admin/TablePagination";
import { DeleteAction } from "@/components/admin/DeleteAction";
import { SubmitToastButton } from "@/components/admin/SubmitToastButton";

const mockCategories = [
  { id: "1", name: "Cinematic", slug: "cinematic", promptsCount: 145 },
  { id: "2", name: "Portrait", slug: "portrait", promptsCount: 89 },
  { id: "3", name: "Cyberpunk", slug: "cyberpunk", promptsCount: 210 },
  { id: "4", name: "Anime", slug: "anime", promptsCount: 304 },
  { id: "5", name: "Architecture", slug: "architecture", promptsCount: 67 },
];

export default function AdminCategoriesPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-admin-text">Categories</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="bg-admin-surface border-admin-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-admin-text">Add Category</CardTitle>
              <CardDescription className="text-admin-text-muted">
                Create a new category to organize prompts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-admin-text">Name</label>
                <Input id="name" placeholder="e.g. Fantasy" className="bg-admin-bg border-admin-border text-admin-text" />
              </div>
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium text-admin-text">Slug</label>
                <Input id="slug" placeholder="e.g. fantasy" className="bg-admin-bg border-admin-border text-admin-text" />
                <p className="text-xs text-admin-text-muted">URL friendly name</p>
              </div>
              <SubmitToastButton className="w-full bg-admin-primary hover:bg-admin-primary-hover text-white" message="Categoria criada com sucesso!">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </SubmitToastButton>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <div className="border border-admin-border rounded-md bg-admin-surface shadow-sm">
            <div className="w-full overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="border-b border-admin-border bg-admin-muted/50 text-admin-text-secondary">
                  <tr>
                    <th className="h-12 px-4 align-middle font-medium">Name</th>
                    <th className="h-12 px-4 align-middle font-medium">Slug</th>
                    <th className="h-12 px-4 align-middle font-medium text-right">Prompts</th>
                    <th className="h-12 px-4 align-middle font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-admin-text">
                  {mockCategories.map((category) => (
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
                        {category.promptsCount}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="hover:text-admin-primary hover:bg-admin-primary-soft">
                            <Edit className="w-4 h-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <DeleteAction id={category.id} entityName="Categoria" />
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
      </div>
    </div>
  );
}
