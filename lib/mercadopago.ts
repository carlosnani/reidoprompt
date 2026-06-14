import { createClient } from "@/lib/supabase/server";
import { fetchSiteSettings } from "@/lib/supabase/site-settings";

const MERCADO_PAGO_API_BASE = "https://api.mercadopago.com";

export function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export function getMercadoPagoAccessToken() {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN || process.env.NEXT_MERCADO_PAGO_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "MERCADO_PAGO_ACCESS_TOKEN ou NEXT_MERCADO_PAGO_ACCESS_TOKEN não estão definidas no ambiente. Defina a variável correta e reinicie o servidor.",
    );
  }
  return token;
}

export async function getPremiumPrice() {
  const supabase = await createClient();
  const settings = await fetchSiteSettings(supabase);
  return settings.monthly_price || 39.9;
}

export async function createPreference({
  userId,
  userEmail,
}: {
  userId: string;
  userEmail: string;
}) {
  const accessToken = getMercadoPagoAccessToken();
  const price = await getPremiumPrice();
  const useSandbox = process.env.MERCADO_PAGO_SANDBOX === "true";

  const response = await fetch(`${MERCADO_PAGO_API_BASE}/checkout/preferences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          id: "reidoprompt-pro",
          title: "Assinatura Pro - O Rei do Prompt",
          description: "Acesso premium à plataforma de prompts com recursos exclusivos.",
          quantity: 1,
          currency_id: "BRL",
          unit_price: Number(price),
        },
      ],
      payer: {
        email: userEmail,
      },
      external_reference: userId,
      metadata: {
        user_id: userId,
      },
      notification_url: `${getBaseUrl()}/api/webhooks/mercadopago`,
      back_urls: {
        success: `${getBaseUrl()}/conta`,
        failure: `${getBaseUrl()}/planos`,
        pending: `${getBaseUrl()}/conta`,
      },
      auto_return: "approved",
      statement_descriptor: "REIDOPROMPT",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Não foi possível iniciar o pagamento no Mercado Pago.");
  }

  return useSandbox ? data.sandbox_init_point || data.init_point : data.init_point || data.sandbox_init_point;
}
