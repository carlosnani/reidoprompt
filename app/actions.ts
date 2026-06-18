'use server';

import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import stripe from '@/lib/stripe';
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

export async function getSubscriptionDetailsAction(sessionId: string) {
  try {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }
    const stripe = (await import('@/lib/stripe')).default;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.subscription) {
      const sub = await stripe.subscriptions.retrieve(session.subscription as string);
      const periodEnd = (sub as any).current_period_end || sub.items.data[0]?.current_period_end || 0;
      
      const userId = session.metadata?.userId || sub.metadata?.userId;
      if (userId) {
        const adminSupabase = createServiceRoleClient();
        
        // 1. Sync database row
        await adminSupabase
          .from('stripe_subscriptions')
          .upsert(
            {
              user_id: userId,
              stripe_customer_id: sub.customer as string,
              stripe_subscription_id: sub.id,
              status: sub.status,
              current_period_end: new Date(periodEnd * 1000),
              cancel_at_period_end: sub.cancel_at_period_end,
              price_id: sub.items.data[0]?.price.id,
              updated_at: new Date(),
            },
            { onConflict: 'user_id' }
          );

        // 2. Sync auth metadata
        try {
          const { data: userObject, error: getError } = await adminSupabase.auth.admin.getUserById(userId);
          if (!getError && userObject?.user) {
            const currentMetadata = userObject.user.user_metadata || {};
            const isStatusActive = sub.status === 'active' || sub.status === 'trialing';
            const newMetadata = {
              ...currentMetadata,
              subscription: isStatusActive ? 'active' : 'inactive',
              plan: isStatusActive ? 'pro' : 'free'
            };
            await adminSupabase.auth.admin.updateUserById(userId, {
              user_metadata: newMetadata,
              app_metadata: {
                plan: isStatusActive ? 'pro' : 'free',
                subscription: isStatusActive ? 'active' : 'inactive'
              }
            });
            console.log(`[Success Page Sync] Updated user ${userId} auth metadata (user_metadata + app_metadata) to plan: ${newMetadata.plan}, subscription: ${newMetadata.subscription}`);
          }
        } catch (err) {
          console.error('[Success Page Sync] Error updating user auth metadata:', err);
        }
      }

      return {
        success: true,
        subscription: {
          id: sub.id,
          status: sub.status,
          current_period_end: periodEnd,
        }
      };
    }
    return { success: false, error: 'No subscription found for session' };
  } catch (error: any) {
    console.error('getSubscriptionDetailsAction error:', error);
    return { success: false, error: error.message || 'Failed to retrieve subscription details' };
  }
}

export async function getStripePricesAction() {
  try {
    const monthlyPriceId = process.env.STRIPE_PRICE_ID_MONTHLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY;
    const yearlyPriceId = process.env.STRIPE_PRICE_ID_YEARLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY;

    let monthlyFormatted = "39,90";
    let yearlyFormatted = "399,00";

    if (monthlyPriceId) {
      const price = await stripe.prices.retrieve(monthlyPriceId);
      if (price.unit_amount) {
        monthlyFormatted = (price.unit_amount / 100).toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }
    }

    if (yearlyPriceId) {
      const price = await stripe.prices.retrieve(yearlyPriceId);
      if (price.unit_amount) {
        yearlyFormatted = (price.unit_amount / 100).toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }
    }

    return {
      success: true,
      monthly: monthlyFormatted,
      yearly: yearlyFormatted,
    };
  } catch (err: any) {
    console.error("Error retrieving Stripe prices:", err);
    return {
      success: false,
      error: err.message || "Failed to retrieve prices",
    };
  }
}

