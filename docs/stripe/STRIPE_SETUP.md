# 🎵 Guia de Integração do Stripe para Pagamentos Recorrentes

## 1. Setup Inicial - Conta Stripe

### Criar conta Stripe
1. Acesse [stripe.com](https://stripe.com/br)
2. Clique em "Comece Agora"
3. Complete o cadastro com seus dados

### Obter Chaves de API
1. Vá para [Dashboard Stripe](https://dashboard.stripe.com/)
2. Clique em "Desenvolvedores" → "Chaves de API"
3. Copie:
   - **Chave Publicável**: `pk_test_...` (modo teste)
   - **Chave Secreta**: `sk_test_...` (modo teste)

## 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Chaves do Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_aqui
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta_aqui

# URL Webhook (obtida ao criar webhook no dashboard)
STRIPE_WEBHOOK_SECRET=whsec_sua_chave_webhook

# IDs dos Preços (criados na etapa 3)
STRIPE_PRICE_ID_MONTHLY=price_sua_id_mensal
STRIPE_PRICE_ID_YEARLY=price_sua_id_anual

# URL Base
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Criar Produtos e Preços

### 1. Criar um Produto
1. No Dashboard → "Catálogo de Produtos" → "+ Novo Produto"
2. Nome: `Prompts Premium`
3. Salvar

### 2. Criar Preço Recorrente
1. Em "Preços", clique em "+ Novo"
2. Selecione o produto `Prompts Premium`
3. Configure:
   - **Tipo**: Recorrente
   - **Preço**: 4,99 (seu preço mensal)
   - **Frequência**: Mensal
   - **ID de Pesquisa** (lookup_key): `monthly` (opcional mas recomendado)
4. Salvar e copiar o `Price ID` (price_...)

### 3. Criar Preço Anual (Opcional)
- Siga os passos acima com preço anual (e.g., R$ 44,90)
- ID de Pesquisa: `yearly`

## 4. Configurar Webhooks

### Teste Local (Desenvolvimento)
```bash
# 1. Instale a CLI do Stripe
npm install -g @stripe/stripe-cli

# 2. Faça login
stripe login

# 3. Escute os webhooks locais
stripe listen --forward-to localhost:3000/api/stripe/webhooks

# 4. Copie o "Signing Secret" gerado
# Exemplo: whsec_test_BExx...
```

### Produção
1. Dashboard Stripe → "Desenvolvedores" → "Webhooks"
2. "+ Adicionar endpoint"
3. URL de endpoint: `https://seu-dominio.com/api/stripe/webhooks`
4. Selecione os eventos:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Copiar "Signing Secret"

## 5. Integrar no Frontend

### Na página de Planos (`app/planos/page.tsx`)

Substitua o botão de ação por:

```tsx
import { StripeCheckoutButton } from '@/components/stripe-checkout-button';
import { useUser } from '@/lib/supabase/hooks/use-user';

export default function PricingPage() {
  const { user } = useUser();
  
  return (
    // ... código da página
    
    {user ? (
      <StripeCheckoutButton
        priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY}
        userId={user.id}
        email={user.email}
        className="w-full bg-green-neon hover:bg-green-dark text-black font-bold"
      >
        Assinar Agora
      </StripeCheckoutButton>
    ) : (
      <Button 
        asChild 
        className="w-full bg-green-neon hover:bg-green-dark text-black font-bold"
      >
        <Link href="/auth/sign-up">Assinar Agora</Link>
      </Button>
    )}
  );
}
```

## 6. Estrutura de Arquivos Criada

```
app/
├── api/stripe/
│   ├── checkout/route.ts           # Criar sessão de checkout
│   ├── webhooks/route.ts           # Processar eventos do Stripe
│   ├── billing-portal/route.ts     # Portal de gestão de assinatura
│   └── cancel-subscription/route.ts # Cancelar assinatura
├── subscribe/
│   └── success/page.tsx            # Página de sucesso
│
lib/
├── stripe.ts                       # Instância do Stripe (servidor)
└── stripe-client.ts               # Carregamento do Stripe JS (cliente)

components/
├── stripe-checkout-button.tsx      # Botão de checkout
└── subscription-manager.tsx        # Gerenciador de assinatura

supabase/migrations/
└── add_stripe_subscriptions.sql   # Tabela de assinaturas
```

## 7. Aplicar Migrations

```bash
# Execute a migration do Supabase
supabase migration up

# Ou via dashboard do Supabase:
# SQL Editor → Novo → Cole o SQL da migration
```

## 8. Testar com Cartões de Teste

### Cartões de teste do Stripe

| Número | CVC | Data |
|--------|-----|------|
| 4242 4242 4242 4242 | Qualquer (3 dígitos) | Futura (MM/AA) |
| 4000 0000 0000 9995 | Qualquer | Futura |
| 5555 5555 5555 4444 | Qualquer | Futura |

### Testar Webhook Localmente

```bash
# Terminal 1: Iniciar app
npm run dev

# Terminal 2: Escutar webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhooks

# Terminal 3: Disparar evento de teste
stripe trigger payment_intent.succeeded
```

## 9. Fluxo de Pagamento Recorrente

1. **Usuário clica em "Assinar"**
   → `StripeCheckoutButton` chama `/api/stripe/checkout`

2. **Backend cria sessão de checkout**
   → Cria ou recupera customer no Stripe
   → Retorna `sessionId`

3. **Usuário é redirecionado ao Stripe Hosted Checkout**
   → Insere dados do cartão

4. **Após pagamento bem-sucedido**
   → Usuário redirecionado para `/subscribe/success`
   → Webhook `customer.subscription.created` é disparado

5. **Webhook atualiza banco de dados**
   → Salva assinatura no `stripe_subscriptions`
   → Atualiza status do usuário em `users`

6. **Renovação automática**
   → Todo mês, o Stripe cobra automaticamente
   → Dispara webhook `customer.subscription.updated` ou `invoice.paid`
   → Sistema atualiza dados

## 10. Endpoints Criados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/stripe/checkout` | Criar sessão de checkout |
| POST | `/api/stripe/webhooks` | Processar eventos do Stripe |
| POST | `/api/stripe/billing-portal` | Abrir portal de gestão |
| POST | `/api/stripe/cancel-subscription` | Cancelar assinatura |

## 11. Dados Armazenados

### Tabela `stripe_subscriptions`
```sql
id                      -- UUID único
user_id                 -- Referência ao usuário
stripe_customer_id      -- ID do customer no Stripe
stripe_subscription_id  -- ID da assinatura no Stripe
status                  -- Estado da assinatura
price_id                -- ID do preço
current_period_end      -- Próxima data de cobrança
cancel_at_period_end    -- Flag de cancelamento agendado
canceled_at             -- Data de cancelamento
created_at              -- Data de criação
updated_at              -- Última atualização
```

## 12. Próximos Passos

- [ ] Integrar verificação de assinatura ativa nas rotas protegidas
- [ ] Criar componente de gerenciamento de assinatura na conta
- [ ] Configurar e-mails de confirmação e renovação
- [ ] Adicionar retry de pagamentos falhados
- [ ] Implementar ofertas de desconto (coupons)
- [ ] Configurar alertas para pagamentos recorrentes

## 13. Resolução de Problemas

### Webhook não dispara em teste local
- Verifique se `stripe listen` está ativo
- Confirme que a URL no `.env.local` está correta
- Reinicie o app após atualizar `.env.local`

### "Missing required fields"
- Verifique se `userId` e `email` são passados ao botão
- Confirme que usuário está autenticado

### Erro "Invalid signature" em webhooks
- Confira o `STRIPE_WEBHOOK_SECRET`
- Certifique-se que é do ambiente correto (teste vs. produção)

## 14. Links Úteis

- [Documentação Stripe Node.js](https://stripe.com/docs/stripe-js)
- [Checkout Sessions API](https://stripe.com/docs/api/checkout/sessions)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Testing Stripe](https://stripe.com/docs/testing)
- [Dashboard Stripe](https://dashboard.stripe.com/)
