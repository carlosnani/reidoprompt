import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Upload, Save, Info, FileText } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SubmitToastButton } from "@/components/admin/SubmitToastButton";
import { getCategories, getAiModels, getPromptById } from "@/lib/supabase/queries";
import { requireAdmin } from "@/lib/supabase/auth";
import { editPromptAction } from "../../../actions";
import { notFound } from "next/navigation";

export default async function EditPromptPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { data: categories } = await getCategories();
  const { data: models } = await getAiModels();
  const { id } = await params;
  
  let prompt;
  try {
    prompt = await getPromptById(id);
  } catch (error) {
    notFound();
  }

  if (!prompt) {
    notFound();
  }

  const updateAction = editPromptAction.bind(null, prompt.id);
  const selectedCategoryIds = prompt.prompt_categories?.map((pc) => pc.category.id) || [];

  return (
    <div className="flex-1 space-y-8 max-w-4xl mx-auto w-full pb-10">
      <div className="flex items-center gap-4">
        <Link href="/admin/prompts">
          <Button variant="ghost" size="icon" className="hover:bg-admin-muted rounded-full">
            <ArrowLeft className="w-5 h-5 text-admin-text-secondary" />
          </Button>
        </Link>
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight text-admin-text">Editar Prompt</h2>
          <p className="text-admin-text-secondary">Atualize os detalhes deste prompt na galeria</p>
        </div>
      </div>

      <form action={updateAction as unknown as (payload: FormData) => void} className="space-y-8">
        <Card className="bg-admin-surface border-admin-border shadow-sm overflow-hidden">
          <CardHeader className="border-b border-admin-border-light bg-admin-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-admin-primary-soft text-admin-primary">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl text-admin-text">Informações Básicas</CardTitle>
                <CardDescription className="text-admin-text-muted">Detalhes sobre o prompt que serão exibidos na galeria.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-semibold text-admin-text">Título</label>
              <Input 
                id="title" 
                name="title"
                defaultValue={prompt.title}
                placeholder="Ex: Cinematic Sci-Fi Cityscape" 
                required
                className="bg-admin-bg border-admin-border-strong text-admin-text focus-visible:ring-admin-primary"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-admin-text flex items-center gap-2">
                  Categorias
                  <span className="text-[10px] bg-admin-muted px-2 py-0.5 rounded text-admin-text-secondary">Múltiplas</span>
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto p-3 rounded-md border border-admin-border-strong bg-admin-bg">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 text-xs text-admin-text-secondary hover:text-admin-text cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        name="categories" 
                        value={cat.id} 
                        defaultChecked={selectedCategoryIds.includes(cat.id)}
                        className="w-4 h-4 rounded border-admin-border-strong text-admin-primary focus:ring-admin-primary"
                      />
                      {cat.name}
                    </label>
                  ))}
                  {categories.length === 0 && <p className="text-xs text-admin-text-muted col-span-2">Nenhuma categoria cadastrada.</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="ai_model_id" className="text-sm font-semibold text-admin-text">Modelo de IA</label>
                <select 
                  id="ai_model_id" 
                  name="ai_model_id"
                  defaultValue={prompt.ai_model_id || ""}
                  required
                  className="flex h-10 w-full rounded-md border border-admin-border-strong bg-admin-bg px-3 py-2 text-sm text-admin-text ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary focus-visible:ring-offset-2 transition-all"
                >
                  <option value="">Selecione um modelo</option>
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>{model.name} {model.provider ? `(${model.provider})` : ''}</option>
                  ))}
                </select>
                {models.length === 0 && <p className="text-xs text-admin-text-muted mt-1">Nenhum modelo cadastrado.</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-semibold text-admin-text">Descrição (Opcional)</label>
              <textarea 
                id="description" 
                name="description"
                defaultValue={prompt.description || ""}
                rows={3}
                className="flex w-full rounded-md border border-admin-border-strong bg-admin-bg px-3 py-2 text-sm text-admin-text ring-offset-background placeholder:text-admin-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary focus-visible:ring-offset-2 transition-all"
                placeholder="Breve descrição do que este prompt alcança..."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-admin-surface border-admin-border shadow-sm overflow-hidden">
          <CardHeader className="border-b border-admin-border-light bg-admin-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-admin-primary-soft text-admin-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl text-admin-text">Conteúdo do Prompt</CardTitle>
                <CardDescription className="text-admin-text-muted">O texto real do prompt que será revelado aos assinantes.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-admin-muted/30 border border-admin-border-light">
                <div className="space-y-0.5">
                  <label htmlFor="is_premium" className="text-sm font-semibold text-admin-text">Conteúdo Premium</label>
                  <p className="text-xs text-admin-text-muted">Torne este prompt exclusivo para assinantes Pro.</p>
                </div>
                <input 
                  type="checkbox" 
                  id="is_premium" 
                  name="is_premium"
                  value="true"
                  defaultChecked={prompt.is_premium}
                  className="w-5 h-5 rounded border-admin-border-strong text-admin-primary focus:ring-admin-primary transition-all cursor-pointer" 
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="prompt_text" className="text-sm font-semibold text-admin-text">Texto do Prompt</label>
                <textarea 
                  id="prompt_text" 
                  name="prompt_text"
                  defaultValue={prompt.prompt_text || ""}
                  required
                  rows={6}
                  className="flex w-full rounded-md border border-admin-border-strong bg-admin-bg px-3 py-2 text-sm text-admin-text ring-offset-background placeholder:text-admin-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary focus-visible:ring-offset-2 font-mono transition-all"
                  placeholder="/imagine prompt: highly detailed, cinematic lighting..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-admin-surface border-admin-border shadow-sm overflow-hidden">
          <CardHeader className="border-b border-admin-border-light bg-admin-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-admin-primary-soft text-admin-primary">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl text-admin-text">Imagens do Prompt</CardTitle>
                <CardDescription className="text-admin-text-muted">Faça upload dos melhores resultados para o bucket reidoprompt.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ImageUploader 
              maxImages={6} 
              name="images" 
              defaultValue={prompt.images || (prompt.image ? [prompt.image] : [])} 
            />
          </CardContent>
        </Card>

        <div className="flex justify-end items-center gap-4 pt-4">
          <Link href="/admin/prompts">
            <Button variant="ghost" className="text-admin-text-secondary hover:bg-admin-muted">
              Cancelar
            </Button>
          </Link>
          <SubmitToastButton message="Prompt atualizado com sucesso!" className="bg-admin-primary hover:bg-admin-primary-hover text-white h-12 px-8 rounded-xl shadow-md">
            <Save className="w-4 h-4 mr-2" />
            Atualizar Prompt
          </SubmitToastButton>
        </div>
      </form>
    </div>
  );
}
