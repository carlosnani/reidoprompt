# ✅ Checklist de Implementação - Stripe Recorrente

## 📋 Fase 1: Configuração Stripe

- [ ] Criar conta em [stripe.com/br](https://stripe.com/br)
- [ ] Verificar email da conta
- [ ] Acessar [Dashboard Stripe](https://dashboard.stripe.com/)
- [ ] Navegar para "Desenvolvedores" → "Chaves de API"
- [ ] Copiar **Chave Publicável** (pk_test_...)
- [ ] Copiar **Chave Secreta** (sk_test_...)
- [ ] Instalar Stripe CLI: `npm install -g @stripe/stripe-cli`
- [ ] Fazer login: `stripe login`
- [ ] Rodar: `stripe listen --forward-to localhost:3000/api/stripe/webhooks`
- [ ] Copiar **Signing Secret** (whsec_...)

## 📦 Fase 2: Configuração do Projeto

- [ ] Dependências já instaladas ✅
- [ ] Criar `.env.local` com as chaves do Stripe
- [ ] Copiar template de `.env.local.example`
- [ ] Preencher os valores:
  ```
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
  STRIPE_SECRET_KEY=sk_test_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  ```

## 💳 Fase 3: Criar Produtos no Stripe

- [ ] Ir para "Catálogo de Produtos"
- [ ] Criar novo produto: "Prompts Premium"
- [ ] Criar preço mensal (R$ 4,99)
  - [ ] Copiar **Price ID**: `price_...`
  - [ ] Adicionar ao `.env.local` como `STRIPE_PRICE_ID_MONTHLY`
- [ ] (Opcional) Criar preço anual (R$ 44,90)
  - [ ] Copiar **Price ID**: `price_...`
  - [ ] Adicionar ao `.env.local` como `STRIPE_PRICE_ID_YEARLY`

## 🗄️ Fase 4: Banco de Dados

- [ ] Criar tabela no Supabase:
  - [ ] Ir para SQL Editor
  - [ ] Criar nova query
  - [ ] Copiar SQL de `supabase/migrations/add_stripe_subscriptions.sql`
  - [ ] Executar
- [ ] Verificar se tabela foi criada em "Public" schema
- [ ] Verificar RLS policies
- [ ] Testar conexão

## 🔌 Fase 5: Testar Webhooks Localmente

- [ ] Terminal 1: Rodar app `npm run dev`
- [ ] Terminal 2: Rodar `stripe listen --forward-to localhost:3000/api/stripe/webhooks`
- [ ] Confirmar webhook conectado
- [ ] Fazer teste:
  ```bash
  stripe trigger payment_intent.succeeded
  ```
- [ ] Verificar se webhook foi recebido no app

## 🎨 Fase 6: Integrar no Frontend

- [ ] Importar `StripeCheckoutButton` na página de planos
- [ ] Substituir botão de ação pela integração
- [ ] Passar `priceId`, `userId`, `email`
- [ ] Testar clique no botão
- [ ] Verificar redirecionamento para Stripe Checkout

## 💳 Fase 7: Testar Pagamento

- [ ] Usar cartão de teste: `4242 4242 4242 4242`
- [ ] CVC qualquer (3 dígitos)
- [ ] Data futura (MM/AA)
- [ ] Email qualquer
- [ ] Completar pagamento
- [ ] Verificar redirecionamento para `/subscribe/success`
- [ ] Verificar webhook foi disparado
- [ ] Conferir dados em Supabase:
  - [ ] Nova linha em `stripe_subscriptions`
  - [ ] Status = "active"
  - [ ] `stripe_customer_id` preenchido
  - [ ] `stripe_subscription_id` preenchido

## 🔒 Fase 8: Proteger Conteúdo

- [ ] Importar `ProtectedContent` onde necessário
- [ ] Wrappear conteúdo premium
- [ ] Testar com usuário não assinante (deve ver lock)
- [ ] Testar com usuário assinante (deve ver conteúdo)
- [ ] Testar após cancelar assinatura

## ⚙️ Fase 9: Funcionalidades Extras

- [ ] Implementar `useSubscription()` hook
- [ ] Criar página de conta com `SubscriptionManager`
- [ ] Testar botão "Atualizar Forma de Pagamento"
- [ ] Testar botão "Cancelar Assinatura"
- [ ] Verificar que cancelamento funciona

## 🌐 Fase 10: Preparar para Produção

- [ ] Mudar Stripe para modo LIVE
- [ ] Obter chaves LIVE (pk_live_..., sk_live_...)
- [ ] Criar webhook endpoint em produção
- [ ] Testar pagamento real (valor mínimo)
- [ ] Verificar webhook foi recebido
- [ ] Configurar alertas de erro
- [ ] Documentar processo de suporte

## 🚀 Fase 11: Deploy

- [ ] Build passou: `npm run build` ✅
- [ ] Sem erros de lint: `npm run lint`
- [ ] Push para produção
- [ ] Verificar variáveis de ambiente no hosting
- [ ] Testar checkout em produção
- [ ] Monitorar primeiras transações

## 📊 Fase 12: Monitoramento

- [ ] Configurar alertas no Stripe
- [ ] Monitorar webhooks falhados
- [ ] Verificar status de pagamentos
- [ ] Analisar taxa de conversão
- [ ] Rastrear churn (cancelamentos)

---

## 🧪 Checklist de Testes

### Teste de Checkout ✓
- [ ] Usuário não logado → Redireciona para login
- [ ] Usuário novo → Cria customer no Stripe
- [ ] Usuário existente → Usa customer existente
- [ ] Cartão válido → Pagamento aprovado
- [ ] Cartão inválido → Erro
- [ ] Página de sucesso mostra corretamente
- [ ] Webhook atualiza banco

### Teste de Assinatura ✓
- [ ] Status muda para "active"
- [ ] `current_period_end` está correto
- [ ] RLS permite ao usuário ler sua assinatura
- [ ] RLS impede ver assinatura de outro usuário

### Teste de Cancelamento ✓
- [ ] Botão "Cancelar" funciona
- [ ] `cancel_at_period_end` muda para true
- [ ] Acesso ainda liberado até fim do período
- [ ] Webhook `customer.subscription.deleted` dispara
- [ ] Status muda para "canceled"

### Teste de Renovação ✓
- [ ] Webhook `invoice.paid` dispara
- [ ] `current_period_end` é atualizado
- [ ] Acesso continua liberado

### Teste de Erro ✓
- [ ] Pagamento falhado → Status `past_due`
- [ ] Retry automático funciona
- [ ] Notificação de erro é enviada
- [ ] Usuário consegue atualizar forma de pagamento

---

## 📞 URLs Importantes

- 🔗 [Dashboard Stripe](https://dashboard.stripe.com)
- 🔗 [Stripe API Keys](https://dashboard.stripe.com/apikeys)
- 🔗 [Stripe Products](https://dashboard.stripe.com/products)
- 🔗 [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
- 🔗 [Stripe Testing Cards](https://stripe.com/docs/testing)
- 🔗 [Stripe Docs](https://stripe.com/docs)

---

## 🆘 Se algo deu errado

| Erro | Solução |
|------|---------|
| "Invalid signature" | Verifique `STRIPE_WEBHOOK_SECRET` |
| "Missing priceId" | Verifique `STRIPE_PRICE_ID_MONTHLY` |
| Webhook não chega | Verifique `stripe listen` ativo |
| Checkout vazio | Verifique `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| Banco não atualiza | Verifique RLS policies do Supabase |
| Email não encontrado | Certifique que `user.email` existe |

---

## ✨ Status Final

Após completar este checklist, você terá:

✅ Sistema de pagamentos recorrentes funcionando
✅ Webhooks sincronizando dados
✅ Conteúdo protegido por assinatura
✅ Portal de gerenciamento de assinatura
✅ Pronto para produção

Bom trabalho! 🎉
