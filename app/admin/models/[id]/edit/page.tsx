import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { getAiModelById } from "@/lib/supabase/queries";
import { requireAdmin } from "@/lib/supabase/auth";
import { editAiModelAction } from "../../../actions";

export default async function EditModelPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const { id } = params;
  const model = await getAiModelById(id);

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-admin-text">Editar Modelo</h2>
        <Link href="/admin/models" className="text-admin-text-muted underline">Voltar</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="bg-admin-surface border-admin-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-admin-text">Edit AI Model</CardTitle>
              <CardDescription className="text-admin-text-muted">
                Atualize os dados do modelo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={editAiModelAction.bind(null, id) as unknown as (formData: FormData) => void} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-admin-text">Model Name</label>
                  <Input id="name" name="name" defaultValue={model.name} placeholder="e.g. Midjourney v6" required className="bg-admin-bg border-admin-border text-admin-text" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="provider" className="text-sm font-medium text-admin-text">Provider</label>
                  <Input id="provider" name="provider" defaultValue={model.provider || ''} placeholder="e.g. Midjourney" className="bg-admin-bg border-admin-border text-admin-text" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="slug" className="text-sm font-medium text-admin-text">Slug</label>
                  <Input id="slug" name="slug" defaultValue={model.slug} placeholder="e.g. midjourney-v6" required className="bg-admin-bg border-admin-border text-admin-text" />
                </div>
                <Button type="submit" className="w-full bg-admin-primary hover:bg-admin-primary-hover text-white">Salvar</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
