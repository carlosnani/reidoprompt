import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TablePagination } from "@/components/admin/TablePagination";
import { DeleteAction } from "@/components/admin/DeleteAction";
import { SubmitToastButton } from "@/components/admin/SubmitToastButton";

const mockModels = [
  { id: "1", name: "Midjourney v6", slug: "midjourney-v6", provider: "Midjourney", promptsCount: 845 },
  { id: "2", name: "DALL-E 3", slug: "dalle-3", provider: "OpenAI", promptsCount: 423 },
  { id: "3", name: "Stable Diffusion XL", slug: "sdxl", provider: "Stability AI", promptsCount: 215 },
  { id: "4", name: "Claude 3 Opus", slug: "claude-3-opus", provider: "Anthropic", promptsCount: 156 },
];

export default function AdminModelsPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-admin-text">AI Models</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="bg-admin-surface border-admin-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-admin-text">Add AI Model</CardTitle>
              <CardDescription className="text-admin-text-muted">
                Register a new AI model for prompts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-admin-text">Model Name</label>
                <Input id="name" placeholder="e.g. Midjourney v6" className="bg-admin-bg border-admin-border text-admin-text" />
              </div>
              <div className="space-y-2">
                <label htmlFor="provider" className="text-sm font-medium text-admin-text">Provider</label>
                <Input id="provider" placeholder="e.g. Midjourney" className="bg-admin-bg border-admin-border text-admin-text" />
              </div>
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium text-admin-text">Slug</label>
                <Input id="slug" placeholder="e.g. midjourney-v6" className="bg-admin-bg border-admin-border text-admin-text" />
              </div>
              <SubmitToastButton className="w-full bg-admin-primary hover:bg-admin-primary-hover text-white" message="Modelo de IA criado com sucesso!">
                <Plus className="w-4 h-4 mr-2" />
                Add Model
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
                    <th className="h-12 px-4 align-middle font-medium">Provider</th>
                    <th className="h-12 px-4 align-middle font-medium text-right">Prompts</th>
                    <th className="h-12 px-4 align-middle font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-admin-text">
                  {mockModels.map((model) => (
                    <tr
                      key={model.id}
                      className="border-b border-admin-border transition-all duration-200 hover:bg-admin-muted/50 even:bg-admin-bg/30"
                    >
                      <td className="p-4 align-middle font-medium">
                        {model.name}
                      </td>
                      <td className="p-4 align-middle text-admin-text-secondary">
                        {model.provider}
                      </td>
                      <td className="p-4 align-middle text-right">
                        {model.promptsCount}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="hover:text-admin-primary hover:bg-admin-primary-soft">
                            <Edit className="w-4 h-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <DeleteAction id={model.id} entityName="Modelo" />
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
