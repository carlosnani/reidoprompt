import { createClient } from './client';

export interface Prompt {
  id: string;
  title: string;
  tag: string;
  image: string;
  views: number;
  likes: number;
  category?: string;
  model?: string;
  author_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  prompt_id: string;
  created_at: string;
}

const supabase = createClient();

export async function getPrompts(limit = 50, offset = 0) {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Prompt[];
}

export async function getPromptById(id: string) {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Prompt;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data as Category[];
}

export async function getUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('prompt_id, prompts(*)')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

export async function addFavorite(userId: string, promptId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, prompt_id: promptId });

  if (error) throw error;
  return data;
}

export async function removeFavorite(userId: string, promptId: string) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('prompt_id', promptId);

  if (error) throw error;
}

export async function createPrompt(prompt: Omit<Prompt, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('prompts')
    .insert(prompt)
    .select()
    .single();

  if (error) throw error;
  return data as Prompt;
}

export async function updatePrompt(id: string, updates: Partial<Prompt>) {
  const { data, error } = await supabase
    .from('prompts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Prompt;
}

export async function deletePrompt(id: string) {
  const { error } = await supabase
    .from('prompts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}