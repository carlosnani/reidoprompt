'use server';

import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import { contactSchema } from '@/lib/validations';
import { headers } from 'next/headers';
import fs from 'fs';
import path from 'path';

let resendClient: Resend | null = null;

function getResendClient() {
  if (!resendClient) {
    let apiKey = process.env.RESEND_API_KEY;

    // Fallback: Lê o arquivo .env diretamente se o Next.js não tiver carregado a variável no process.env
    if (!apiKey) {
      try {
        const envPath = path.join(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, 'utf8');
          const match = envContent.match(/^RESEND_API_KEY\s*=\s*(.+)$/m);
          if (match) {
            apiKey = match[1].trim();
            console.log('[DEBUG sendContactEmailAction] RESEND_API_KEY carregada com sucesso via fallback do arquivo .env');
          }
        }
      } catch (err) {
        console.error('[DEBUG sendContactEmailAction] Erro no fallback ao ler arquivo .env:', err);
      }
    }

    if (!apiKey) {
      throw new Error("RESEND_API_KEY está faltando no process.env. Verifique se o arquivo .env está configurado e se o servidor foi reiniciado.");
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// In-memory rate limiting map: IP -> array of timestamps
const rateLimitMap = new Map<string, number[]>();

const LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutos
const MAX_ATTEMPTS = 3; // máximo de 3 tentativas por janela

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const attempts = rateLimitMap.get(ip) || [];
  
  // Filtra apenas as tentativas dentro da janela de tempo ativa
  const activeAttempts = attempts.filter(timestamp => now - timestamp < LIMIT_WINDOW_MS);
  
  if (activeAttempts.length >= MAX_ATTEMPTS) {
    return true;
  }
  
  activeAttempts.push(now);
  rateLimitMap.set(ip, activeAttempts);
  return false;
}

export async function sendContactEmailAction(formData: FormData) {
  console.log('[DEBUG sendContactEmailAction] Iniciando ação...');

  // 1. Verificação de Honeypot (Campo Invisível para evitar bots automatizados simples)
  const honeypot = formData.get('website');
  if (honeypot) {
    console.warn('[SECURITY sendContactEmailAction] Honeypot preenchido. Possível bot. Ignorando envio.');
    return { success: true }; // Retorna sucesso silencioso para enganar o bot
  }

  // 2. Limitação de Taxa (Rate Limit) por IP
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 
               headersList.get('x-real-ip') || 
               '127.0.0.1';

    if (isRateLimited(ip)) {
      console.warn(`[SECURITY sendContactEmailAction] Rate limit atingido para o IP: ${ip}`);
      return { error: 'Muitas mensagens enviadas do seu IP. Por favor, aguarde 5 minutos antes de enviar novamente.' };
    }
  } catch (error) {
    console.error('[DEBUG sendContactEmailAction] Erro ao obter headers para rate limit:', error);
  }

  console.log('[DEBUG sendContactEmailAction] RESEND_API_KEY definida?', !!process.env.RESEND_API_KEY);
  if (process.env.RESEND_API_KEY) {
    console.log('[DEBUG sendContactEmailAction] Prefixo da chave:', process.env.RESEND_API_KEY.substring(0, 7) + '...');
  }

  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  };

  const validated = contactSchema.safeParse(rawData);

  if (!validated.success) {
    console.log('[DEBUG sendContactEmailAction] Falha na validação do Zod:', validated.error.issues[0].message);
    // Seguindo a convenção do basecode.md para tratamento de erros do Zod
    return { error: validated.error.issues[0].message };
  }

  const { name, email, subject, message } = validated.data;

  try {
    const escapedName = escapeHtml(name);
    const escapedEmail = escapeHtml(email);
    const escapedSubject = escapeHtml(subject);
    const escapedMessage = escapeHtml(message).replace(/\n/g, '<br>');

    console.log('[DEBUG sendContactEmailAction] Tentando enviar e-mail via Resend...');

    const emailPromise = getResendClient().emails.send({
      from: 'O Rei do Prompt <contato@oreidoprompt.online>',
      to: 'carlosnani80@gmail.com',
      replyTo: email,
      subject: `[Contato] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px; border-radius: 8px;">
          <h2 style="color: #10b981;">Nova mensagem de contato</h2>
          <p><strong>Nome:</strong> ${escapedName}</p>
          <p><strong>E-mail:</strong> ${escapedEmail}</p>
          <p><strong>Assunto:</strong> ${escapedSubject}</p>
          <p><strong>Mensagem:</strong></p>
          <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981;">
            <p>${escapedMessage}</p>
          </div>
        </div>
      `,
    });

    // Timeout de 10 segundos
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout na requisição do Resend (10s)')), 10000)
    );

    const { error } = await Promise.race([emailPromise, timeoutPromise]) as any;

    console.log('[DEBUG sendContactEmailAction] Retorno do Resend obtido. Erro?', error);

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
