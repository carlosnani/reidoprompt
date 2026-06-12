"use server"

import { revalidatePath } from "next/cache";
import { createAiModel, deleteAiModel, createCategory, deleteCategory, deletePrompt, createPrompt, updatePrompt, updateAiModel, deleteUser, toggleProAccess, toggleUserBan } from "@/lib/supabase/queries";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth";
import { SiteSettings } from "@/lib/supabase/site-settings";
import { siteSettingsSchema, aiModelSchema, categorySchema, promptSchema } from "@/lib/validations";

export async function updateSiteSettingsAction(formData: FormData) {
  await requireAdmin();

  const rawData = {
    platformName: formData.get("platformName"),
    supportEmail: formData.get("supportEmail"),
    seoTitle: formData.get("seoTitle"),
    seoDesc: formData.get("seoDesc"),
    monthlyPrice: formData.get("monthlyPrice"),
    yearlyPrice: formData.get("yearlyPrice"),
  };

  const validated = siteSettingsSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { platformName, supportEmail, seoTitle, seoDesc, monthlyPrice, yearlyPrice } = validated.data;

  try {
    const supabase = createServiceRoleClient();
    const { data: current } = await supabase.from('site_settings').select('id').maybeSingle();
    
    const updates: Partial<SiteSettings> = {
      platform_name: platformName,
      support_email: supportEmail,
      default_meta_title: seoTitle,
      default_meta_description: seoDesc,
      monthly_price: monthlyPrice,
      yearly_price: yearlyPrice,
    };

    if (current) {
      await supabase
        .from('site_settings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', current.id);
    } else {
      await supabase
        .from('site_settings')
        .insert(updates);
    }

    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err: any) {
    console.error("Erro ao atualizar configurações:", err);
    return { error: err.message || "Erro ao atualizar configurações" };
  }
}

export async function addAiModelAction(formData: FormData) {
  await requireAdmin();
  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    provider: formData.get("provider"),
  };

  const validated = aiModelSchema.safeParse(rawData);
  
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { name, slug, provider } = validated.data;

  try {
    await createAiModel({ name, slug, provider });
    revalidatePath("/admin/models");
    return { success: true };
  } catch (err: any) {
    console.error("Erro no addAiModelAction:", err);
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
  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
  };

  const validated = categorySchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { name, slug } = validated.data;

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
  
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    prompt_text: formData.get("prompt_text"),
    ai_model_id: formData.get("ai_model_id"),
    is_premium: formData.get("is_premium") === "true",
    categories: formData.getAll("categories"),
    images: formData.getAll("images"),
  };

  const validated = promptSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { title, description, prompt_text, ai_model_id, is_premium, categories: categoryIds, images } = validated.data;

  // Define a imagem principal como a primeira da lista, ou um placeholder
  const mainImage = images && images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&q=80";
  const tag = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    await createPrompt({
      title,
      tag,
      description: description || "",
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
  
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    prompt_text: formData.get("prompt_text"),
    ai_model_id: formData.get("ai_model_id"),
    is_premium: formData.get("is_premium") === "true",
    categories: formData.getAll("categories"),
    images: formData.getAll("images"),
  };

  const validated = promptSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { title, description, prompt_text, ai_model_id, is_premium, categories: categoryIds, images } = validated.data;

  const mainImage = images && images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&q=80";
  const tag = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    await updatePrompt(id, {
      title,
      tag,
      description: description || "",
      prompt_text,
      ai_model_id,
      is_premium,
      image: mainImage,
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
  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    provider: formData.get("provider"),
  };

  const validated = aiModelSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { name, slug, provider } = validated.data;

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

export async function toggleProAccessAction(userId: string, isCurrentlyPro: boolean) {
  await requireAdmin();
  try {
    await toggleProAccess(userId, isCurrentlyPro);
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Erro ao alterar acesso Pro" };
  }
}

export async function toggleUserBanAction(userId: string, isCurrentlyBanned: boolean) {
  await requireAdmin();
  try {
    await toggleUserBan(userId, isCurrentlyBanned);
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Erro ao alterar status de banimento" };
  }
}
