import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

const SHARED_SECRET = process.env.MERCADO_PAGO_WEBHOOK_SECRET || "";

function verifyRawBodySignature(rawBody: string, signature: string) {
  if (!signature) {
    return true;
  }

  return signature === SHARED_SECRET;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-mercadopago-signature") || "";

  if (!verifyRawBodySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Unauthorized webhook" }, { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody);
    const id = payload.id || payload.data?.id || payload.data?.topic_id;

    if (!id) {
      console.warn("[MercadoPago Webhook] ID não encontrado no payload", payload);
      return NextResponse.json({ received: true });
    }

    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN || process.env.NEXT_MERCADO_PAGO_ACCESS_TOKEN}`,
      },
    });

    if (!paymentResponse.ok) {
      console.error("[MercadoPago Webhook] Falha ao consultar pagamento", await paymentResponse.text());
      return NextResponse.json({ error: "payment lookup failed" }, { status: 500 });
    }

    const payment = await paymentResponse.json();
    const userId = payment.external_reference || payment.metadata?.user_id;
    const status = payment.status;
    const cause = payment.status_detail;

    if (!userId) {
      console.warn("[MercadoPago Webhook] Pagamento sem external_reference", payment);
      return NextResponse.json({ received: true });
    }

    if (status === "approved") {
      const supabase = createServiceRoleClient();
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: {
          subscription: "active",
          plan: "pro",
        },
      });

      if (error) {
        console.error("[MercadoPago Webhook] Erro ao atualizar usuário Pro", error);
        return NextResponse.json({ error: "failed to update user" }, { status: 500 });
      }
    }

    return NextResponse.json({ received: true, status, cause });
  } catch (error) {
    console.error("[MercadoPago Webhook] Erro tratando notificação:", error);
    return NextResponse.json({ error: "invalid webhook payload" }, { status: 400 });
  }
}
