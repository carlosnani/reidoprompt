# 💾 Snippets de Código - Prontos para Usar

## 🎯 1. Integrar Stripe no `app/planos/page.tsx`

### Código Completo Exemplo

```tsx
'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useUser } from '@/lib/supabase/hooks/use-user';
import { StripeCheckoutButton } from '@/components/stripe-checkout-button';

export default function PricingPage() {
  const { user } = useUser();
  const [monthlyPrice, setMonthlyPrice] = useState<string>("4,99");

  const features = [
    { feature: "Prompts Premium", free: false, premium: true },
    { feature: "Acesso Ilimitado", free: false, premium: true },
    { feature: "Suporte Prioritário", free: false, premium: true },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#050505]">
      <Header />
      
      <main className="flex-1 relative pb-24 pt-40">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          {/* Título */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-neon/10 border border-green-neon/20 text-green-neon text-xs font-bold uppercase">
              <Sparkles className="w-3 h-3" />
              Preços Imbatíveis
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white">
              Desbloqueie o Poder da IA
            </h1>
            
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Acesso à maior biblioteca de prompts premium validados do Brasil
            </p>
          </motion.div>

          {/* Grid de Planos */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Free Plan */}
            <Card className="h-full flex flex-col border-white/5 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription className="text-3xl text-white font-bold mt-2">
                  R$ <span>0</span>/mês
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {features.map((item) => (
                    <li key={item.feature} className="flex items-center gap-2">
                      {item.free ? (
                        <Check className="w-4 h-4 text-green-neon" />
                      ) : (
                        <X className="w-4 h-4 text-gray-600" />
                      )}
                      <span className={item.free ? "text-white" : "text-gray-500"}>
                        {item.feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                {user ? (
                  <Button variant="outline" className="w-full" disabled>
                    Você está no plano Free
                  </Button>
                ) : (
                  <Button asChild className="w-full">
                    <Link href="/auth/sign-up">Começar Grátis</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className="h-full flex flex-col border-green-neon/30 bg-green-neon/5 backdrop-blur-xl relative">
              <div className="absolute top-4 right-4 bg-green-neon/20 text-green-neon px-3 py-1 rounded-full text-xs font-bold uppercase">
                Popular
              </div>

              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <CardDescription className="text-3xl text-white font-bold mt-2">
                  R$ <span>{monthlyPrice}</span>/mês
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {features.map((item) => (
                    <li key={item.feature} className="flex items-center gap-2">
                      {item.premium ? (
                        <Check className="w-4 h-4 text-green-neon" />
                      ) : (
                        <X className="w-4 h-4 text-gray-600" />
                      )}
                      <span className={item.premium ? "text-white" : "text-gray-500"}>
                        {item.feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                {user ? (
                  <StripeCheckoutButton
                    priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY!}
                    userId={user.id}
                    email={user.email || ''}
                    className="w-full bg-green-neon hover:bg-green-dark text-black font-bold"
                  >
                    Assinar por R$ {monthlyPrice}/mês
                  </StripeCheckoutButton>
                ) : (
                  <Button asChild className="w-full bg-green-neon hover:bg-green-dark text-black font-bold">
                    <Link href="/auth/sign-up">Assinar Agora</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
```

---

## 📝 2. Página de Conta com Gerenciamento de Assinatura

```tsx
'use client';

import { useUser } from '@/lib/supabase/hooks/use-user';
import { useSubscription } from '@/lib/supabase/hooks/use-subscription';
import { SubscriptionManager } from '@/components/subscription-manager';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AccountPage() {
  const { user, loading: userLoading } = useUser();
  const { subscription, loading: subscriptionLoading } = useSubscription();

  if (userLoading || subscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-neon" />
      </div>
    );
  }

  if (!user) {
    return <div>Usuário não autenticado</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050505]">
      <Header />

      <main className="flex-1 pb-24 pt-40">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Informações do Usuário */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl mb-8">
            <CardHeader>
              <CardTitle>Minha Conta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">ID</p>
                <p className="text-white font-mono text-sm">{user.id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Gerenciar Assinatura */}
          {subscription && (
            <SubscriptionManager subscription={subscription} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
```

---

## 🔒 3. Proteger Conteúdo Premium

```tsx
'use client';

import { ProtectedContent } from '@/components/protected-content';

export default function PaginaPremium() {
  return (
    <ProtectedContent>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-white">
          Prompts Premium Exclusivos
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Seus prompts premium aqui */}
        </div>
      </div>
    </ProtectedContent>
  );
}
```

---

## 🎯 4. Verificar Assinatura em Componente

```tsx
'use client';

import { useSubscription } from '@/lib/supabase/hooks/use-subscription';
import { Badge } from '@/components/ui/badge';

export function UserBadge() {
  const { isSubscribed } = useSubscription();

  return (
    <div className="flex items-center gap-2">
      <span>João Silva</span>
      {isSubscribed && (
        <Badge className="bg-green-neon text-black">Premium ✨</Badge>
      )}
    </div>
  );
}
```

---

## 💳 5. Middleware para Rotas Protegidas

```tsx
// middleware.ts

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/prompts/premium', '/dashboard'];

export async function middleware(request: NextRequest) {
  const supabase = await createClient();
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Se não tem sessão, redireciona para login
  if (!session && protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Se tem sessão mas route é protegida por assinatura
  if (session && request.nextUrl.pathname.startsWith('/prompts/premium')) {
    const { data: subscription } = await supabase
      .from('stripe_subscriptions')
      .select('status')
      .eq('user_id', session.user.id)
      .single();

    if (!subscription || subscription.status !== 'active') {
      return NextResponse.redirect(new URL('/planos', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/prompts/:path*', '/dashboard/:path*'],
};
```

---

## 📧 6. Email de Bem-vindo Após Pagamento (com Resend)

```tsx
// lib/email.ts

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string) {
  return resend.emails.send({
    from: 'noreply@seusite.com',
    to: email,
    subject: 'Bem-vindo aos Prompts Premium! 🎉',
    html: `
      <h1>Bem-vindo ao Prompts Premium!</h1>
      <p>Sua assinatura foi ativada com sucesso.</p>
      <p>Agora você tem acesso a:</p>
      <ul>
        <li>📚 Mais de 10.000 prompts premium</li>
        <li>⚡ Atualizações diárias</li>
        <li>💬 Suporte prioritário</li>
      </ul>
      <a href="https://seusite.com/prompts">Acessar Prompts</a>
    `,
  });
}

// No webhook em app/api/stripe/webhooks/route.ts
import { sendWelcomeEmail } from '@/lib/email';

case 'customer.subscription.created':
  const customer = await stripe.customers.retrieve(subscription.customer as string);
  await sendWelcomeEmail(customer.email!);
  break;
```

---

## 📊 7. Dashboard com Estatísticas de Assinatura

```tsx
'use client';

import { useSubscription } from '@/lib/supabase/hooks/use-subscription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, DollarSign } from 'lucide-react';

export function SubscriptionStats() {
  const { subscription } = useSubscription();

  const daysUntilRenewal = subscription
    ? Math.ceil(
        (new Date(subscription.current_period_end).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
          <Users className="h-4 w-4 text-green-neon" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">
            {subscription?.status || 'Free'}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Próxima Renovação</CardTitle>
          <Calendar className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{daysUntilRenewal} dias</div>
          <p className="text-xs text-gray-400">
            {subscription?.current_period_end 
              ? new Date(subscription.current_period_end).toLocaleDateString('pt-BR')
              : 'N/A'
            }
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Plano</CardTitle>
          <DollarSign className="h-4 w-4 text-green-neon" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Premium</div>
          <p className="text-xs text-gray-400">R$ 4,99/mês</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🧪 8. Testar Webhook Localmente

```bash
#!/bin/bash
# test-webhook.sh

# 1. Iniciar app em um terminal
npm run dev

# 2. Em outro terminal, fazer login no Stripe
stripe login

# 3. Escutar webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhooks

# 4. Em um terceiro terminal, disparar eventos de teste
stripe trigger customer.subscription.created
stripe trigger invoice.paid
stripe trigger customer.subscription.deleted

# Ou criar um arquivo events.json:
# {
#   "type": "customer.subscription.created",
#   "data": {
#     "object": { /* sua payload */ }
#   }
# }
# stripe trigger --file ./events.json
```

---

## 🔐 9. Validar Token JWT (Segurança)

```tsx
// middleware para validar JWT
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyAuth(token: string) {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload;
  } catch (error) {
    return null;
  }
}

// Usar em APIs protegidas
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const payload = await verifyAuth(token);
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }

  // Continuar com a requisição...
}
```

---

## 🎨 10. Animação de Checkout Completo

```tsx
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export function CheckoutSuccess() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="flex flex-col items-center justify-center space-y-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <CheckCircle2 className="w-16 h-16 text-green-neon" />
      </motion.div>
      <h2 className="text-2xl font-bold text-white">Pagamento Confirmado!</h2>
      <p className="text-gray-400">Sua assinatura está ativa</p>
    </motion.div>
  );
}
```

---

Todos esses snippets estão prontos para copiar e colar! 🚀
