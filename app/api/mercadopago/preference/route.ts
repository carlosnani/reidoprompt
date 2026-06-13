import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPreference } from "@/lib/mercadopago";

// Removido o parâmetro 'request' e a importação de 'NextRequest'
export async function POST() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
    }

    const user = data.user;
    if (!user.email) {
      return NextResponse.json({ error: "O usuário não possui e-mail válido." }, { status: 400 });
    }

    const checkoutUrl = await createPreference({
      userId: user.id,
      userEmail: user.email,
    });

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("[MercadoPago] Erro ao criar preferência de pagamento:", error);
    const message = error instanceof Error ? error.message : "Erro interno ao criar preferência.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}