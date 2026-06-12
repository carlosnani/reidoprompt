'use server';

import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import { contactSchema } from '@/lib/validations';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmailAction(formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  };

  const validated = contactSchema.safeParse(rawData);

  if (!validated.success) {
    // Seguindo a convenção do basecode.md para tratamento de erros do Zod
    return { error: validated.error.issues[0].message };
  }

  const { name, email, subject, message } = validated.data;

  try {
    const { error } = await resend.emails.send({

      from: 'O Rei do Prompt <contato@oreidoprompt.online>',

      to: 'carlosnani80@gmail.com',

      replyTo: email,
      subject: `[Contato] ${subject}`,

      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px; border-radius: 8px;">
          <h2 style="color: #10b981;">Nova mensagem de contato</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Assunto:</strong> ${subject}</p>
          <p><strong>Mensagem:</strong></p>
          <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981;">
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Erro Resend:', error);
      return { error: 'Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Erro de e-mail:', err);
    return { error: 'Ocorreu um erro inesperado. Tente novamente mais tarde.' };
  }
}

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
