"use server"

import { revalidatePath } from "next/cache";
import { createAiModel, deleteAiModel, createCategory, deleteCategory, deletePrompt, createPrompt, updatePrompt, updateAiModel, deleteUser } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth";

export async function addAiModelAction(formData: FormData) {
  await requireAdmin();
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
  await requireAdmin();
  try {
    await deleteAiModel(id);
    revalidatePath("/admin/models");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Erro ao deletar modelo" };
  }
}

export async function addCategoryAction(formData: FormData) {
  await requireAdmin();
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
  await requireAdmin();
  try {
    await deleteCategory(id);
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Erro ao deletar categoria" };
  }
}

export async function deletePromptAction(id: string) {
  await requireAdmin();
  try {
    await deletePrompt(id);
    revalidatePath("/admin/prompts");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Erro ao deletar prompt" };
  }
}

export async function addPromptAction(formData: FormData) {
  await requireAdmin();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const prompt_text = formData.get("prompt_text") as string;
  const ai_model_id = formData.get("ai_model_id") as string;
  const is_premium = formData.get("is_premium") === "true";
  
  // Categorias (pode haver múltiplas)
  const categoryIds = formData.getAll("categories") as string[];
  
  // Imagens enviadas pelo ImageUploader (URLs do Supabase Storage)
  const images = formData.getAll("images") as string[];

  console.log("addPromptAction: received images:", images);

  if (!title || !prompt_text || !ai_model_id) {
    return { error: "Título, texto do prompt e modelo são obrigatórios" };
  }

  // Define a imagem principal como a primeira da lista, ou um placeholder
  const mainImage = images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&q=80";
  const tag = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    await createPrompt({
      title,
      tag,
      description,
      prompt_text,
      ai_model_id,
      is_premium,
      image: mainImage,
      images: images,
      views: 0,
      likes: 0
    }, categoryIds);
    
  } catch (err: any) {
    console.error("Erro ao criar prompt:", err);
    return { error: err.message || "Erro ao criar prompt" };
  }

  revalidatePath("/admin/prompts");
  redirect("/admin/prompts");
}

export async function editPromptAction(id: string, formData: FormData) {
  await requireAdmin();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const prompt_text = formData.get("prompt_text") as string;
  const ai_model_id = formData.get("ai_model_id") as string;
  const is_premium = formData.get("is_premium") === "true";
  
  // Categorias (pode haver múltiplas)
  const categoryIds = formData.getAll("categories") as string[];
  
  // Imagens
  const images = formData.getAll("images") as string[];

  console.log("editPromptAction: received images:", images);

  if (!title || !prompt_text || !ai_model_id) {
    return { error: "Título, texto do prompt e modelo são obrigatórios" };
  }

  const mainImage = images.length > 0 ? images[0] : undefined;
  const tag = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    await updatePrompt(id, {
      title,
      tag,
      description,
      prompt_text,
      ai_model_id,
      is_premium,
      ...(mainImage ? { image: mainImage } : {}),
      images: images
    }, categoryIds);
    
  } catch (err: any) {
    console.error("Erro ao editar prompt:", err);
    return { error: err.message || "Erro ao editar prompt" };
  }

  revalidatePath("/admin/prompts");
  redirect("/admin/prompts");
}

export async function editAiModelAction(id: string, formData: FormData) {
  await requireAdmin();
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

export async function deleteUserAction(id: string) {
  await requireAdmin();
  try {
    await deleteUser(id);
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Erro ao deletar usuário" };
  }
}
