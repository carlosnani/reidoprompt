"use server"

import { revalidatePath } from "next/cache";
import { createAiModel, deleteAiModel, createCategory, deleteCategory, deletePrompt, createPrompt, updatePrompt, updateAiModel } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";

export async function addAiModelAction(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const provider = formData.get("provider") as string;

   console.log("📦 Dados recebidos:", { name, slug, provider });
  
  if (!name || !slug) {
    return { error: "Nome e Slug são obrigatórios" };
  }

  try {
    console.log("🔄 Chamando createAiModel...");
    await createAiModel({ name, slug, provider });
    revalidatePath("/admin/models");
    return { success: true };
  } catch (err: any) {
    console.error("Erro no addAiModelAction:", err);
    console.error("❌ Erro no addAiModelAction:", err);
    return { error: err.message || "Erro ao criar modelo" };
  }
}

export async function deleteAiModelAction(id: string) {
  try {
    await deleteAiModel(id);
    revalidatePath("/admin/models");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Erro ao deletar modelo" };
  }
}

export async function addCategoryAction(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  if (!name || !slug) {
    return { error: "Nome e Slug são obrigatórios" };
  }

  try {
    await createCategory({ name, slug });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Erro ao criar categoria" };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await deleteCategory(id);
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Erro ao deletar categoria" };
  }
}

export async function deletePromptAction(id: string) {
  try {
    await deletePrompt(id);
    revalidatePath("/admin/prompts");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Erro ao deletar prompt" };
  }
}

export async function addPromptAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const prompt_text = formData.get("prompt_text") as string;
  const ai_model_id = formData.get("ai_model_id") as string;
  const is_premium = formData.get("is_premium") === "true";
  
  // Categorias (pode haver múltiplas)
  const categoryIds = formData.getAll("categories") as string[];

  if (!title || !prompt_text || !ai_model_id) {
    return { error: "Título, texto do prompt e modelo são obrigatórios" };
  }

  // To do a real creation we need to handle image uploading if it was submitted via formData, 
  // but let's assume image URL is handled client side and passed, or just hardcode a placeholder for now
  // since ImageUploader doesn't natively integrate with standard FormData without hidden inputs.
  const image = "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&q=80"; // Placeholder
  const tag = title.toLowerCase().replace(/ /g, '-');

  try {
    await createPrompt({
      title,
      tag,
      description,
      prompt_text,
      ai_model_id,
      is_premium,
      image,
      views: 0,
      likes: 0
    }, categoryIds);
    
  } catch (err: any) {
    return { error: err.message || "Erro ao criar prompt" };
  }

  // Redirect should be outside try-catch
  revalidatePath("/admin/prompts");
  redirect("/admin/prompts");
}

export async function editPromptAction(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const prompt_text = formData.get("prompt_text") as string;
  const ai_model_id = formData.get("ai_model_id") as string;
  const is_premium = formData.get("is_premium") === "true";
  
  // Categorias (pode haver múltiplas)
  const categoryIds = formData.getAll("categories") as string[];

  if (!title || !prompt_text || !ai_model_id) {
    return { error: "Título, texto do prompt e modelo são obrigatórios" };
  }

  // Placeholder image (if no real handling yet)
  // we could keep the old image if not updated, but we'll assume we pass it or ignore for now.
  const tag = title.toLowerCase().replace(/ /g, '-');

  try {
    await updatePrompt(id, {
      title,
      tag,
      description,
      prompt_text,
      ai_model_id,
      is_premium,
    }, categoryIds);
    
  } catch (err: any) {
    return { error: err.message || "Erro ao editar prompt" };
  }

  // Redirect should be outside try-catch
  revalidatePath("/admin/prompts");
  redirect("/admin/prompts");
}

export async function editAiModelAction(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const provider = formData.get("provider") as string;

  if (!name || !slug) {
    return { error: "Nome e Slug são obrigatórios" };
  }

  try {
    await updateAiModel(id, { name, slug, provider });
    revalidatePath("/admin/models");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Erro ao editar modelo" };
  }
}
