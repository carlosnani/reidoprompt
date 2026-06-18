# Basecode - Definições do Projeto

Este arquivo contém as definições fundamentais, arquitetura e diretrizes do projeto **O Rei do Prompt**.

## 🚀 Tecnologias e Stack
- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript 5+](https://www.typescriptlang.org/)
- **Frontend:** [React 19](https://react.dev/)
- **Estilização:** [Tailwind CSS 3.4+](https://tailwindcss.com/)
- **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Animações:** [Framer Motion 12+](https://www.framer.com/motion/)
- **Backend/Banco de Dados:** [Supabase](https://supabase.com/)
- **Autenticação:** Supabase Auth (Cookie-based / SSR via `@supabase/ssr`)
- **Pagamentos:** [Stripe](https://stripe.com/) (Assinaturas e Checkout)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Notificações:** [Sonner](https://genau.io/sonner)
- **Validação:** [Zod](https://zod.dev/)
- **E-mails:** [Resend](https://resend.com/)

## 📂 Estrutura de Pastas Detalhada

### `app/` (Rotas e Páginas)
- `admin/`: Painel administrativo completo (Gestão de prompts, categorias, modelos, usuários e configurações globais).
- `api/`: Endpoints para Webhooks (Stripe) e operações de Checkout.
- `auth/`: Fluxos de autenticação (Login, Sign-up, Recuperação de Senha, Confirmação de E-mail).
- `prompts/`: Galeria principal com filtros dinâmicos, busca e paginação.
- `prompt/[id]/`: Página de detalhes do prompt com proteção de conteúdo premium.
- `sitemap.ts` & `robots.ts`: SEO dinâmico automatizado.
- `conta/`, `favoritos/`, `planos/`: Áreas do usuário logado e fluxo de upgrade.
- `faq/`, `suporte/`, `sobre/`, `termos/`, `privacidade/`: Páginas institucionais.

### `components/` (Componentes React)
- `admin/`: Componentes do Dashboard (Sidebar, Header, ImageUploader, UserActionButtons, EditCategoryDialog, etc.).
- `auth/`: Formulários de autenticação (`LoginForm`, `RegisterForm`, `SocialLogin`).
- `prompt-detail/`: Fragmentos da página de detalhes (`PromptText`, `ImageGallery`, `RelatedPrompts`).
- `prompts/`: Elementos da galeria (`PromptCard`, `GalleryGrid`, `GalleryHeader`).
- `ui/`: Componentes base do shadcn/ui.
- `Header.tsx` & `Footer.tsx`: Layout principal.
- `stripe-checkout-button.tsx` & `subscription-manager.tsx`: Gestão de assinaturas.

### `lib/` (Lógica e Utilitários)
- `supabase/`:
  - `queries.ts`: CRUD centralizado com **seleção de colunas específica** e **React cache**.
  - `storage.ts`: Gestão de upload/delete de imagens com suporte a limpeza automática.
  - `auth.ts`, `client.ts`, `server.ts`, `site-settings.ts`: Gestão de auth e configurações globais.
- `stripe.ts` & `stripe-client.ts`: Integração com o ecossistema Stripe.
- `validations.ts`: Schemas de validação Zod para todas as entradas de dados.
- `utils/`: Utilitários como compressão de imagens (`image.ts`) e formatação geral.

## 📊 Modelos de Dados (Tipagens)

### SiteSettings
```typescript
interface SiteSettings {
  id?: string;
  platform_name: string;
  support_email: string;
  default_meta_title: string;
  default_meta_description: string;
  monthly_price: number;
  yearly_price: number;
  allow_registration: boolean;
  updated_at?: string;
}
```

### Prompt
```typescript
interface Prompt {
  id: string;
  title: string;
  tag: string;
  image: string;
  images?: string[];
  description?: string;
  prompt_text?: string;
  is_premium: boolean;
  is_public?: boolean;
  views: number;
  likes: number;
  ai_model_id?: string;
  author_id?: string;
  created_at?: string;
  updated_at?: string;
  ai_model?: AiModel;
  prompt_categories?: { category: Category }[];
}
```

### StripeSubscription
```typescript
interface StripeSubscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id?: string;
  status: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing';
  price_id?: string;
  current_period_end?: Date;
  cancel_at_period_end: boolean;
  canceled_at?: Date;
  created_at: Date;
  updated_at: Date;
}
```

## 🗄️ SQL Database Schema & Security (Supabase)

### Row Level Security (RLS)
Todas as tabelas possuem RLS habilitado. As políticas são configuradas para:
- **Público:** Leitura em tabelas de conteúdo (`prompts` onde `is_public=true`, `categories`, `ai_models`, `site_settings`).
- **Autenticado:** Gestão de favoritos e visualização da própria assinatura.
- **Admin:** Escrita total permitida apenas via `service_role` (Server Actions) ou usuários com role `admin` no `app_metadata`.

### Esquema de Tabelas Principais
- `site_settings`: Configurações globais da plataforma.
- `prompts`: Armazena os dados dos prompts e metadados.
- `categories` & `ai_models`: Tabelas de apoio para organização.
- `prompt_categories`: Tabela de junção (N:N) entre prompts e categorias.
- `favorites`: Relacionamento entre usuários e prompts favoritos.
- `stripe_subscriptions`: Sincronização em tempo real do status de pagamento do Stripe.

## 🛡️ Segurança e Proteção de Dados
1. **Proteção de Roles:** O acesso administrativo é validado via `app_metadata`, que é protegido contra modificações pelo cliente, garantindo que usuários não possam se tornar administradores ou PRO maliciosamente.
2. **Zero-Leak Premium:** O `prompt_text` é omitido no servidor para usuários não autorizados. Nenhum dado premium é enviado ao navegador antes da validação da assinatura.
3. **Validação de Entrada:** Uso sistemático de Zod para sanitização de `FormData` em Server Actions.
4. **Segurança de Storage:** Uploads comprimidos e limitados a tipos de imagem, com limpeza automática de arquivos órfãos no banco durante deleções ou edições.
5. **Rate Limiting:** Implementado em fluxos sensíveis (como formulários de contato) para evitar abuso.

## 🎨 Design System e UI/UX
- **Aesthetic:** Dark Premium com glassmorphism e acentos neon (`green-neon`).
- **Feedback:** Notificações instantâneas via `sonner` integradas às Server Actions.
- **Loading:** Experiência fluida com Skeletons e `loading.tsx` para todas as rotas dinâmicas.
- **Responsividade:** Interface adaptada para Mobile, Tablet e Desktop com foco em usabilidade.

## 📝 Convenções de Desenvolvimento
- **Segurança em Primeiro Lugar:** Use sempre `requireAdmin()` ou `requireUser()` em Server Actions.
- **Queries Eficientes:** Busque apenas as colunas necessárias e utilize `memoization` (React cache) para queries repetitivas.
- **Componentização:** Mantenha componentes UI puros em `components/ui` e componentes de negócio organizados por domínio.
- **Revalidação:** Acione `revalidatePath` após qualquer operação de mutação para manter o cache do Next.js sincronizado.

## 🛡️ Validação de Dados (Zod)
Centralizado em `lib/validations.ts`. Siga rigorosamente os schemas definidos para manter a integridade dos dados e evitar erros de tipagem no servidor.
