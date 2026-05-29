'use server';

import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleFavoriteAction(promptId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Você precisa estar logado para favoritar.' };
  }

  const adminSupabase = createServiceRoleClient();

  // Verificar se já é favorito usando adminSupabase
  const { data: existing } = await adminSupabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('prompt_id', promptId)
    .maybeSingle();

  if (existing) {
    // Remover usando adminSupabase
    const { error } = await adminSupabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('prompt_id', promptId);

    if (error) throw error;
    
    // Atualizar contagem de likes no prompt usando adminSupabase
    const { data: prompt } = await adminSupabase
      .from('prompts')
      .select('likes')
      .eq('id', promptId)
      .single();
    
    if (prompt) {
      await adminSupabase
        .from('prompts')
        .update({ likes: Math.max(0, (prompt.likes || 0) - 1) })
        .eq('id', promptId);
    }
  } else {
    // Adicionar usando adminSupabase
    const { error } = await adminSupabase
      .from('favorites')
      .insert({ user_id: user.id, prompt_id: promptId });

    if (error) throw error;

    // Atualizar contagem de likes no prompt usando adminSupabase
    const { data: prompt } = await adminSupabase
      .from('prompts')
      .select('likes')
      .eq('id', promptId)
      .single();
    
    if (prompt) {
      await adminSupabase
        .from('prompts')
        .update({ likes: (prompt.likes || 0) + 1 })
        .eq('id', promptId);
    }
  }

  revalidatePath(`/prompt/${promptId}`);
  revalidatePath('/favoritos');
  revalidatePath('/prompts');
  
  return { success: true, isFavorite: !existing };
}
