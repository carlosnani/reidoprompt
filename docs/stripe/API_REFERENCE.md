# 📚 API Reference - Stripe Integration

## 🔄 Endpoints Disponíveis

### POST `/api/stripe/checkout`
Criar uma sessão de checkout para iniciar o pagamento recorrente.

**Request:**
```json
{
  "priceId": "price_1234567890",
  "userId": "user-uuid-here",
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_1234567890",
  "url": "https://checkout.stripe.com/pay/cs_test_1234567890"
}
```

**Uso:**
```tsx
const response = await fetch('/api/stripe/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    priceId: 'price_123...',
    userId: user.id,
    email: user.email,
  }),
});

const { sessionId, url } = await response.json();
// Redirecionar usuário para url ou usar sessionId com Stripe.js
```

---

### POST `/api/stripe/billing-portal`
Abrir o portal de gerenciamento de assinatura do Stripe.

**Request:**
```json
{
  "customerId": "cus_1234567890"
}
```

**Response:**
```json
{
  "url": "https://billing.stripe.com/p/session/cs_test_1234567890"
}
```

**Uso:**
```tsx
const response = await fetch('/api/stripe/billing-portal', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerId: subscription.stripe_customer_id,
  }),
});

const { url } = await response.json();
window.location.href = url;
```

---

### POST `/api/stripe/cancel-subscription`
Cancelar uma assinatura ao final do período de cobrança.

**Request:**
```json
{
  "subscriptionId": "sub_1234567890"
}
```

**Response:**
```json
{
  "message": "Subscription will be canceled at the end of the billing period",
  "subscription": { /* Stripe Subscription Object */ }
}
```

**Uso:**
```tsx
const response = await fetch('/api/stripe/cancel-subscription', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subscriptionId: subscription.stripe_subscription_id,
  }),
});

// Assinatura será cancelada ao final do período
```

---

### POST `/api/stripe/webhooks`
Recebe eventos do Stripe para sincronizar dados.

**Eventos Processados:**
- `customer.subscription.created` - Nova assinatura criada
- `customer.subscription.updated` - Assinatura atualizada
- `customer.subscription.deleted` - Assinatura cancelada
- `invoice.paid` - Fatura paga (renovação)
- `invoice.payment_failed` - Falha de pagamento

**Resposta:**
```json
{
  "received": true
}
```

---

## 🪝 Hooks Disponíveis

### `useSubscription()`
Hook para obter informações de assinatura do usuário.

**Retorno:**
```typescript
{
  subscription: Subscription | null;  // Objeto completo da assinatura
  isSubscribed: boolean;              // Se usuário é assinante
  loading: boolean;                   // Se está carregando
  isActive: boolean;                  // Se assinatura está ativa
  isPastDue: boolean;                 // Se pagamento está atrasado
  isCanceled: boolean;                // Se foi cancelada
}
```

**Exemplo:**
```tsx
import { useSubscription } from '@/lib/supabase/hooks/use-subscription';

export function MinhaApp() {
  const { isSubscribed, subscription, loading } = useSubscription();

  if (loading) return <div>Carregando...</div>;

  if (isSubscribed) {
    return (
      <div>
        <p>Bem-vindo, assinante!</p>
        <p>Renovação: {new Date(subscription.current_period_end).toLocaleDateString()}</p>
      </div>
    );
  }

  return <div>Você não é assinante</div>;
}
```

---

## 🧩 Componentes Disponíveis

### `<StripeCheckoutButton />`
Botão que inicia o processo de checkout.

**Props:**
```typescript
{
  priceId: string;          // ID do preço no Stripe
  userId: string;           // ID do usuário
  email: string;            // Email do usuário
  children: React.ReactNode; // Texto do botão
  className?: string;       // Classes Tailwind
}
```

**Exemplo:**
```tsx
<StripeCheckoutButton
  priceId="price_123..."
  userId={user.id}
  email={user.email}
  className="w-full bg-green-neon text-black"
>
  Assinar por R$ 4,99/mês
</StripeCheckoutButton>
```

---

### `<SubscriptionManager />`
Componente para gerenciar assinatura (atualizar pagamento, cancelar).

**Props:**
```typescript
{
  subscription: StripeSubscription; // Objeto da assinatura
}
```

**Exemplo:**
```tsx
import { SubscriptionManager } from '@/components/subscription-manager';

export function MinhaConta() {
  return (
    <SubscriptionManager subscription={subscription} />
  );
}
```

---

### `<ProtectedContent />`
Componente para proteger conteúdo premium.

**Props:**
```typescript
{
  children: React.ReactNode;     // Conteúdo protegido
  fallback?: React.ReactNode;   // O que mostrar se não assinante
}
```

**Exemplo:**
```tsx
import { ProtectedContent } from '@/components/protected-content';

export function PaginaPremium() {
  return (
    <ProtectedContent>
      <h1>Este é conteúdo exclusivo para assinantes</h1>
      <PromptsPremium />
    </ProtectedContent>
  );
}
```

---

## 💾 Tipos TypeScript

### Subscription
```typescript
interface Subscription {
  id: string;                    // UUID único
  user_id: string;               // Referência ao usuário
  stripe_customer_id: string;    // ID do customer no Stripe
  stripe_subscription_id: string; // ID da assinatura no Stripe
  status: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing';
  price_id: string;              // ID do preço
  current_period_end: string;    // Data/hora da próxima cobrança
  cancel_at_period_end: boolean; // Se está agendado para cancelar
  canceled_at: string | null;    // Data do cancelamento
  created_at: string;            // Data de criação
  updated_at: string;            // Última atualização
}
```

---

## 🔐 Variáveis de Ambiente Necessárias

```bash
# Chaves do Stripe (obtidas no Dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Webhook Secret (obtido ao criar webhook)
STRIPE_WEBHOOK_SECRET=whsec_...

# IDs de Preços (obtidos ao criar preços)
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_YEARLY=price_...

# URL Base (para redirecionamentos)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📝 Exemplo Completo

### Página de Planos Integrada

```tsx
'use client';

import { useUser } from '@/lib/supabase/hooks/use-user';
import { useSubscription } from '@/lib/supabase/hooks/use-subscription';
import { StripeCheckoutButton } from '@/components/stripe-checkout-button';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function PricingPage() {
  const { user } = useUser();
  const { isSubscribed } = useSubscription();

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {/* Free Plan */}
      <Card>
        <h2>Free</h2>
        <p>R$ 0/mês</p>
        {user ? (
          <Button disabled variant="outline">
            Você está no plano Free
          </Button>
        ) : (
          <Button asChild>
            <Link href="/auth/sign-up">Começar</Link>
          </Button>
        )}
      </Card>

      {/* Premium Plan */}
      <Card>
        <h2>Premium</h2>
        <p>R$ 4,99/mês</p>
        {user && !isSubscribed ? (
          <StripeCheckoutButton
            priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY!}
            userId={user.id}
            email={user.email || ''}
            className="w-full"
          >
            Assinar Agora
          </StripeCheckoutButton>
        ) : isSubscribed ? (
          <Button disabled>Você é assinante</Button>
        ) : (
          <Button asChild>
            <Link href="/auth/sign-up">Assinar Agora</Link>
          </Button>
        )}
      </Card>
    </div>
  );
}
```

---

## 🧪 Testando APIs com cURL

### Criar Checkout
```bash
curl -X POST http://localhost:3000/api/stripe/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "priceId": "price_test_123",
    "userId": "user-uuid-here",
    "email": "test@example.com"
  }'
```

### Abrir Billing Portal
```bash
curl -X POST http://localhost:3000/api/stripe/billing-portal \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cus_test_123"
  }'
```

### Cancelar Assinatura
```bash
curl -X POST http://localhost:3000/api/stripe/cancel-subscription \
  -H "Content-Type: application/json" \
  -d '{
    "subscriptionId": "sub_test_123"
  }'
```

---

## 📊 Status dos Webhooks

Você pode acompanhar status dos webhooks em:
1. [Dashboard Stripe](https://dashboard.stripe.com/webhooks)
2. Clique no seu endpoint
3. Veja "Events" para histórico de deliveries

---

## 🚨 Tratamento de Erros

### No Frontend
```tsx
try {
  const response = await fetch('/api/stripe/checkout', { ... });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('Erro:', error.message);
    alert('Erro ao processar pagamento. Tente novamente.');
  }
  
  const data = await response.json();
  // Processar data
} catch (error) {
  console.error('Erro de rede:', error);
  alert('Erro de conexão. Verifique sua internet.');
}
```

### No Backend
```tsx
try {
  // Operação do Stripe
} catch (error) {
  console.error('Stripe error:', error);
  
  if (error.type === 'StripeCardError') {
    // Erro do cartão
  } else if (error.type === 'StripeRateLimitError') {
    // Rate limit
  } else if (error.type === 'StripeAPIError') {
    // Erro da API
  }
  
  return NextResponse.json(
    { error: 'Erro ao processar' },
    { status: 500 }
  );
}
```

---

## 📞 Suporte

- 📖 [Documentação Stripe](https://stripe.com/docs)
- 💬 [Forum Stripe](https://github.com/stripe/stripe-node)
- 🐛 [Issues & Bugs](https://github.com/stripe/stripe-node/issues)
- 📧 [Suporte Stripe](https://support.stripe.com)
