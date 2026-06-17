import { cache } from 'react';
import { createClient, createServiceRoleClient } from './server';

export interface Prompt {
  id: string;
  title: string;
  tag: string;
  image: string;
  images?: string[];
  description?: string;
  prompt_text?: string;
  is_premium: boolean;
  is_public?: boolean;
  views: number;
  likes: number;
  category?: string; // Legacy
  model?: string;    // Legacy
  ai_model_id?: string; // New foreign key
  author_id?: string;
  created_at?: string;
  updated_at?: string;
  // Included via Joins
  ai_model?: AiModel;
  prompt_categories?: { category: Category }[];
}

export interface AiModel {
  id: string;
  name: string;
  slug: string;
  provider?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DetailedPrompt extends Prompt {
  categories: Category[];
  author?: string;
  date?: string;
  promptText?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  prompt_id: string;
  created_at: string;
}

// ==================== PROMPTS ====================

export async function getPrompts(options: {
  limit?: number;
  offset?: number;
  categoryId?: string;
  search?: string;
  orderBy?: 'recentes' | 'populares' | 'favoritos';
} = {}) {
  const { limit = 12, offset = 0, categoryId, search, orderBy = 'recentes' } = options;
  const supabase = await createClient();

  let query = supabase
    .from('prompts')
    .select(`
      id,
      title,
      tag,
      image,
      is_premium,
      is_public,
      views,
      likes,
      created_at,
      ai_model:ai_models(id, name, slug),
      prompt_categories${categoryId ? '!inner' : ''}(category:categories(id, name, slug))
    `, { count: 'exact' });

  if (categoryId) {
    query = query.eq('prompt_categories.category_id', categoryId);
  }

  if (search) {
    // Busca simples no título ou tag
    query = query.or(`title.ilike.%${search}%,tag.ilike.%${search}%`);
  }

  // Ordenação
  if (orderBy === 'recentes') {
    query = query.order('created_at', { ascending: false });
  } else if (orderBy === 'populares') {
    query = query.order('views', { ascending: false });
  } else if (orderBy === 'favoritos') {
    query = query.order('likes', { ascending: false });
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching prompts:', error);
    return { data: [], count: 0 };
  }
  return { data: data as unknown as Prompt[], count: count || 0 };
}

export async function getPromptById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('prompts')
    .select(`
      *,
      ai_model:ai_models(*),
      prompt_categories(category:categories(*))
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as unknown as Prompt;
}

export async function createPrompt(
  prompt: Omit<Prompt, 'id' | 'created_at' | 'updated_at' | 'ai_model' | 'prompt_categories'>,
  categoryIds?: string[]
) {
  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    supabase = await createClient();
  }

  console.log('createPrompt: inserting prompt payload:', {
    ...prompt,
    images: Array.isArray(prompt.images) ? prompt.images : prompt.images
  });

  const { data, error } = await supabase
    .from('prompts')
    .insert(prompt)
    .select()
    .single();

  if (error) {
    console.error('createPrompt: insert error', error);
    throw error;
  }
  
  const createdPrompt = data as Prompt;

  if (categoryIds && categoryIds.length > 0) {
    const promptCategories = categoryIds.map(categoryId => ({
      prompt_id: createdPrompt.id,
      category_id: categoryId
    }));
    
    const { error: catError } = await supabase
      .from('prompt_categories')
      .insert(promptCategories);
      
    if (catError) {
      console.error('Error adding categories to prompt:', catError);
    }
  }

  return createdPrompt;
}

export async function updatePrompt(
  id: string, 
  updates: Partial<Omit<Prompt, 'ai_model' | 'prompt_categories'>>,
  categoryIds?: string[]
) {
  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    supabase = await createClient();
  }

  // 1. Otimização: Se houver atualização de imagens, limpar as antigas do Storage
  if (updates.image !== undefined || updates.images !== undefined) {
    const { data: oldPrompt } = await supabase
      .from('prompts')
      .select('image, images')
      .eq('id', id)
      .single();

    if (oldPrompt) {
      const oldUrls = new Set<string>();
      if (oldPrompt.image) oldUrls.add(oldPrompt.image);
      if (Array.isArray(oldPrompt.images)) {
        oldPrompt.images.forEach((url: string) => oldUrls.add(url));
      }

      const newUrls = new Set<string>();
      if (updates.image) newUrls.add(updates.image);
      if (Array.isArray(updates.images)) {
        updates.images.forEach((url: string) => newUrls.add(url));
      }

      // URLs que estavam no antigo mas não estão no novo
      const urlsToDelete = Array.from(oldUrls).filter(url => !newUrls.has(url));

      if (urlsToDelete.length > 0) {
        const bucket = "reidoprompt";
        const paths = urlsToDelete
          .map(url => {
            const searchString = `/storage/v1/object/public/${bucket}/`;
            const index = url.indexOf(searchString);
            return index !== -1 ? url.substring(index + searchString.length) : null;
          })
          .filter((p): p is string => !!p);

        if (paths.length > 0) {
          console.log(`Cleaning up ${paths.length} orphaned images for prompt ${id}`);
          await supabase.storage.from(bucket).remove(paths);
        }
      }
    }
  }

  const { data, error } = await supabase
    .from('prompts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  if (categoryIds !== undefined) {
    // Replace all categories: Delete existing, then insert new ones
    await supabase.from('prompt_categories').delete().eq('prompt_id', id);
    
    if (categoryIds.length > 0) {
      const promptCategories = categoryIds.map(categoryId => ({
        prompt_id: id,
        category_id: categoryId
      }));
      
      const { error: catError } = await supabase
        .from('prompt_categories')
        .insert(promptCategories);
        
      if (catError) {
        console.error('Error updating prompt categories:', catError);
      }
    }
  }

  return data as Prompt;
}

export async function deletePrompt(id: string) {
  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    supabase = await createClient();
  }

  // 1. Buscar o prompt para pegar as URLs das imagens
  const { data: prompt } = await supabase
    .from('prompts')
    .select('image, images')
    .eq('id', id)
    .single();

  if (prompt) {
    // 2. Coletar todas as URLs
    const urlsToDelete = new Set<string>();
    if (prompt.image) urlsToDelete.add(prompt.image);
    if (Array.isArray(prompt.images)) {
      prompt.images.forEach((url: string) => urlsToDelete.add(url));
    }

    // 3. Extrair caminhos e deletar do Storage
    const bucket = "reidoprompt";
    const paths = Array.from(urlsToDelete)
      .map(url => {
        const searchString = `/storage/v1/object/public/${bucket}/`;
        const index = url.indexOf(searchString);
        return index !== -1 ? url.substring(index + searchString.length) : null;
      })
      .filter((p): p is string => !!p);

    if (paths.length > 0) {
      console.log(`Deleting ${paths.length} images from storage for prompt ${id}`);
      await supabase.storage.from(bucket).remove(paths);
    }
  }

  // Delete category associations first
  await supabase.from('prompt_categories').delete().eq('prompt_id', id);

  const { error } = await supabase
    .from('prompts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==================== CATEGORIES ====================

export const getCategories = cache(async (limit = 100, offset = 0) => {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from('categories')
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1)
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return { data: [], count: 0 };
  }
  return { data: data as Category[], count: count || 0 };
});

export async function createCategory(category: Omit<Category, 'id'>) {
  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    supabase = await createClient();
  }

  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function updateCategory(id: string, updates: Partial<Category>) {
  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    supabase = await createClient();
  }

  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function deleteCategory(id: string) {
  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    supabase = await createClient();
  }

  // Delete prompt_categories associations first
  await supabase.from('prompt_categories').delete().eq('category_id', id);

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==================== AI MODELS ====================

export const getAiModels = cache(async (limit = 100, offset = 0) => {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from('ai_models')
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1)
    .order('name');

  if (error) throw error;
  return { data: data as AiModel[], count: count || 0 };
});

export async function createAiModel(model: Omit<AiModel, 'id' | 'created_at' | 'updated_at'>) {
  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    supabase = await createClient();
  }

  const { data, error } = await supabase
    .from('ai_models')
    .insert(model)
    .select()
    .single();

  if (error) throw error;
  return data as AiModel;
}

export async function updateAiModel(id: string, updates: Partial<AiModel>) {
  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    supabase = await createClient();
  }

  const { data, error } = await supabase
    .from('ai_models')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as AiModel;
}

export async function deleteAiModel(id: string) {
  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    supabase = await createClient();
  }

  const { error } = await supabase
    .from('ai_models')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export const getAiModelById = cache(async (id: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ai_models')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as AiModel;
});

// ==================== USERS ====================

export async function getUsers(limit = 10, page = 1, search?: string) {
  const supabase = createServiceRoleClient();

  if (search) {
    // Busca administrativa: traz uma lista maior de usuários e filtra em memória
    // O Supabase Auth Admin API não suporta filtros complexos ou buscas textuais diretamente por parâmetro.
    // Para simplificar e evitar queries em esquemas protegidos (auth.users) sem configurações extras,
    // buscamos uma quantidade maior de usuários (máx 1000) e aplicamos o filtro.
    const { data, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    });

    if (error) {
      console.error('Error fetching users for search:', error);
      return { data: [], count: 0 };
    }

    const query = search.toLowerCase();
    const filteredUsers = data.users.filter(user => {
      const name = (user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      return name.includes(query) || email.includes(query);
    });

    const totalCount = filteredUsers.length;
    const offset = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(offset, offset + limit);

    return { data: paginatedUsers, count: totalCount };
  }

  const { data, error } = await supabase.auth.admin.listUsers({
    page,
    perPage: limit
  });

  if (error) {
    console.error('Error fetching users:', error);
    return { data: [], count: 0 };
  }
  
  return { data: data.users, count: (data as any).total || data.users.length };
}

export async function deleteUser(id: string) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase.auth.admin.deleteUser(id);

  if (error) throw error;
}

export async function toggleProAccess(userId: string, isCurrentlyPro: boolean) {
  const supabase = createServiceRoleClient();

  const { data: user, error: getError } = await supabase.auth.admin.getUserById(userId);
  if (getError) throw getError;

  const currentMetadata = user.user.user_metadata || {};
  const newMetadata = {
    ...currentMetadata,
    subscription: isCurrentlyPro ? 'inactive' : 'active',
    plan: isCurrentlyPro ? 'free' : 'pro'
  };

  const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: newMetadata,
    app_metadata: {
      plan: isCurrentlyPro ? 'free' : 'pro',
      subscription: isCurrentlyPro ? 'inactive' : 'active'
    }
  });

  if (updateError) throw updateError;
}

export async function toggleUserBan(userId: string, isCurrentlyBanned: boolean) {
  const supabase = createServiceRoleClient();

  // Ban duration "none" means unbanned. Any other value (like a long time) means banned.
  // Alternatively, we can use user_metadata to track banned status if we want more control.
  // But Auth ban is more robust.
  const banDuration = isCurrentlyBanned ? 'none' : '876000h'; // 100 years

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    ban_duration: banDuration
  });

  if (error) throw error;
}

// ==================== FAVORITES ====================

export async function getUserFavorites(userId: string) {
  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    supabase = await createClient();
  }

  const { data, error } = await supabase
    .from('favorites')
    .select('prompt_id, prompts(*)')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
  return data;
}

export async function addFavorite(userId: string, promptId: string) {
  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    supabase = await createClient();
  }

  const { data, error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, prompt_id: promptId });

  if (error) throw error;
  return data;
}

export async function removeFavorite(userId: string, promptId: string) {
  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    supabase = await createClient();
  }

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('prompt_id', promptId);

  if (error) throw error;
}

export async function isFavorite(userId: string, promptId: string) {
  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    supabase = await createClient();
  }

  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('prompt_id', promptId)
    .maybeSingle();

  if (error) return false;
  return !!data;
}

export async function incrementPromptViews(id: string) {
  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    supabase = await createClient();
  }

  // Tenta usar a função RPC do Supabase para incremento atômico
  const { error: rpcError } = await supabase.rpc('increment_prompt_views', { prompt_id: id });

  if (rpcError) {
    // Se o RPC não estiver instalado, faz o fallback seguro de busca e atualização
    const { data, error: selectError } = await supabase
      .from('prompts')
      .select('views')
      .eq('id', id)
      .single();

    if (!selectError && data) {
      await supabase
        .from('prompts')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id);
    }
  }
}