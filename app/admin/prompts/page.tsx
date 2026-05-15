import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit } from "lucide-react";
import { fetchPrompts } from "@/lib/data/mockPrompts";
import { TablePagination } from "@/components/admin/TablePagination";
import { DeleteAction } from "@/components/admin/DeleteAction";

export default async function AdminPromptsPage() {
  const prompts = await fetchPrompts(10);

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-admin-text">Prompts</h2>
        <Link href="/admin/prompts/new">
          <Button className="bg-admin-primary hover:bg-admin-primary-hover text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Prompt
          </Button>
        </Link>
      </div>

      <div className="border border-admin-border rounded-md bg-admin-surface shadow-sm">
        <div className="w-full overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-admin-border bg-admin-muted/50 text-admin-text-secondary">
              <tr>
                <th className="h-12 px-4 align-middle font-medium">Image</th>
                <th className="h-12 px-4 align-middle font-medium">Title/Tag</th>
                <th className="h-12 px-4 align-middle font-medium">Status</th>
                <th className="h-12 px-4 align-middle font-medium">Views</th>
                <th className="h-12 px-4 align-middle font-medium">Likes</th>
                <th className="h-12 px-4 align-middle font-medium text-right">
                  Actions
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
                      alt={prompt.tag}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-4 align-middle font-medium">
                    {prompt.tag} Concept
                  </td>
                  <td className="p-4 align-middle">
                    {/* Mocking random premium status */}
                    {parseInt(prompt.id.split("-")[1]) % 3 === 0 ? (
                      <Badge variant="default" className="bg-admin-success hover:bg-admin-success text-white">
                        Premium
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-admin-muted text-admin-text-secondary hover:bg-admin-muted border-none">Free</Badge>
                    )}
                  </td>
                  <td className="p-4 align-middle text-admin-text-secondary">{prompt.views}</td>
                  <td className="p-4 align-middle text-admin-text-secondary">{prompt.likes}</td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="hover:text-admin-primary hover:bg-admin-primary-soft">
                        <Edit className="w-4 h-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <DeleteAction id={prompt.id} entityName="Prompt" />
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
