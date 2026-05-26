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
      *,
      ai_model:ai_models(*),
      prompt_categories${categoryId ? '!inner' : ''}(category:categories(*))
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
  const supabase = await createClient();

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
  const supabase = await createClient();

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
  const supabase = await createClient();

  // Delete category associations first
  await supabase.from('prompt_categories').delete().eq('prompt_id', id);

  const { error } = await supabase
    .from('prompts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==================== CATEGORIES ====================

export async function getCategories(limit = 100, offset = 0) {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from('categories')
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1)
    .order('name');

  if (error) throw error;
  return { data: data as Category[], count: count || 0 };
}

export async function createCategory(category: Omit<Category, 'id'>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function updateCategory(id: string, updates: Partial<Category>) {
  const supabase = await createClient();

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
  const supabase = await createClient();

  // Delete prompt_categories associations first
  await supabase.from('prompt_categories').delete().eq('category_id', id);

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==================== AI MODELS ====================

export async function getAiModels(limit = 100, offset = 0) {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from('ai_models')
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1)
    .order('name');

  if (error) throw error;
  return { data: data as AiModel[], count: count || 0 };
}

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

export async function getAiModelById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ai_models')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as AiModel;
}

// ==================== USERS ====================

export async function getUsers(limit = 10, page = 1) {
  const supabase = createServiceRoleClient();

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

// ==================== FAVORITES ====================

export async function getUserFavorites(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('favorites')
    .select('prompt_id, prompts(*)')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

export async function addFavorite(userId: string, promptId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, prompt_id: promptId });

  if (error) throw error;
  return data;
}

export async function removeFavorite(userId: string, promptId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('prompt_id', promptId);

  if (error) throw error;
}