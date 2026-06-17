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
- `admin/`: Painel administrativo (Gestão de prompts, categorias, modelos, usuários e settings).
- `api/`: Endpoints para Webhooks (Stripe) e operações de Checkout.
- `auth/`: Fluxos de autenticação (Login, Sign-up, etc).
- `prompts/`: Galeria principal com filtros e busca.
- `prompt/[id]/`: Detalhes de um prompt.
- `sitemap.ts`: Gerador dinâmico de Sitemap para SEO.
- `robots.ts`: Configurações de indexação para motores de busca.
- `conta/`, `favoritos/`, `planos/`: Áreas do usuário e precificação.
- `faq/`, `suporte/`, `sobre/`, `termos/`, `privacidade/`: Páginas institucionais e legais.

### `components/` (Componentes React)
- `admin/`: Componentes específicos do dashboard (Sidebar, Header, TablePagination - Legacy, ImageUploader, SubmitToastButton, DeleteAction, UserActionButtons, UserSearchInput, EditCategoryDialog).
- `auth/`: Formulários e containers de autenticação (LoginForm, RegisterForm, SocialLogin, AuthContainer).
- `AppPagination.tsx`: Componente de paginação universal com suporte a temas 'admin' e 'public'.
- `prompt-detail/`: Fragmentos da página de detalhes (PromptText, ImageGallery, RelatedPrompts, PromptDetails).
- `prompts/`: Elementos da galeria (PromptCard, GalleryGrid, GalleryHeader, GalleryPagination).
- `ui/`: Componentes base do shadcn/ui (Button, Input, Card, Select, Tabs, Textarea, Accordion, Alert-Dialog, etc.).
- `Header.tsx`, `Footer.tsx`: Layout principal com branding dinâmico.
- `Hero.tsx`, `PromptGallery.tsx`, `CategoryGrid.tsx`, `Automations.tsx`, `BlogReviews.tsx`, `ToolsGrid.tsx`, `PremiumPrompts.tsx`, `HowItWorks.tsx`, `CTA.tsx`: Seções da Landing Page.
- `stripe-checkout-button.tsx`, `subscription-manager.tsx`: Gestão de assinaturas e pagamentos via Stripe.
- `auth-button.tsx`, `logout-button.tsx`, `theme-switcher.tsx`: Utilitários de UI.

### `lib/` (Lógica e Utilitários)
- `supabase/`:
  - `queries.ts`: CRUD otimizado com **seleção de colunas específica** e **React cache** para memoização.
  - `storage.ts`: Gestão de arquivos (Upload/Delete) com suporte a extração de caminhos via URL.
  - `auth.ts`, `client.ts`, `server.ts`, `site-settings.ts`: Gestão de auth e configurações globais.
- `stripe.ts`, `stripe-client.ts`: Integração com Stripe para pagamentos e assinaturas.
- `utils/`:
  - `image.ts`: Utilitário de **compressão de imagem** (Client-side, 1200px, 80% qualidade).
- `data/`: Mock data.
- `utils.ts`, `validations.ts`: Utilitários gerais e schemas de validação centralizados com Zod.

## 📊 Modelos de Dados (Tipagens)

### SiteSettings
Configurações globais da plataforma gerenciadas via Admin.
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
Representa um item de IA no banco de dados.
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
  ai_model_id?: string; // Foreign key
  author_id?: string;
  created_at?: string;
  updated_at?: string;
  // Relacionamentos (via Joins)
  ai_model?: AiModel;
  prompt_categories?: { category: Category }[];
}
```

### AiModel
Modelos de IA suportados.
```typescript
interface AiModel {
  id: string;
  name: string;
  slug: string;
  provider?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}
```

### Category
Categorias para organização de prompts.
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
}
```

### StripeSubscription
Representa o status da assinatura sincronizado com o Stripe.
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
Todas as tabelas possuem RLS habilitado por padrão para garantir a integridade e segurança dos dados.
- **Tabelas Públicas (`prompts`, `categories`, `ai_models`, `site_settings`):** Leitura pública permitida; escrita restrita ao `service_role` ou usuários com role `admin` em `app_metadata`.
- **Tabelas de Usuário (`favorites`, `stripe_subscriptions`):** Acesso de leitura/escrita restrito ao próprio usuário (`auth.uid() = user_id`) ou `service_role`.

### Tabela `site_settings`
```sql
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_name TEXT NOT NULL DEFAULT 'O Rei do Prompt',
    support_email TEXT NOT NULL DEFAULT 'suporte@reidoprompt.com',
    default_meta_title TEXT NOT NULL DEFAULT 'O Rei do Prompt - A maior galeria de Prompts',
    default_meta_description TEXT NOT NULL DEFAULT 'Encontre e copie os melhores prompts testados para Midjourney, DALL-E, ChatGPT e muito mais.',
    monthly_price NUMERIC(10, 2) NOT NULL DEFAULT 39.90,
    yearly_price NUMERIC(10, 2) NOT NULL DEFAULT 399.00,
    allow_registration BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Tabela `prompts`
```sql
CREATE TABLE public.prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    tag TEXT NOT NULL,
    image TEXT NOT NULL,
    images TEXT[],
    description TEXT,
    prompt_text TEXT,
    is_premium BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    ai_model_id UUID REFERENCES public.ai_models(id) ON DELETE SET NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Tabela `stripe_subscriptions`
```sql
CREATE TABLE public.stripe_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL UNIQUE,
  stripe_subscription_id TEXT,
  status TEXT CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'trialing')),
  price_id TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);
```

## 🎨 Design System e UI/UX
- **Tema:** Dark Mode (Next Themes).
- **Estética:** Premium, glassmorphism, gradientes neon (foco em `green-neon`).
- **Branding Dinâmico:** Nome da plataforma e metadados SEO são injetados em tempo real via banco de dados.
- **Feedback Visual:** `SubmitToastButton` aprimorado para exibir notificações automáticas via `sonner` após a conclusão de Server Actions.
- **Galeria de Imagens (Multi-image):** Suporte a múltiplas imagens por prompt (armazenadas em `TEXT[]`), com visualizador dinâmico e thumbnails na página de detalhes.
- **Estados de Carregamento:** Skeletons implementados via `loading.tsx` para transições suaves.
- **Cores Admin:** Paleta específica para o dashboard admin (ex: `admin-surface`, `admin-border`).

## 🛠️ Funcionalidades de Backend e Segurança
1. **Server Actions Protegidas:** Todas as operações de escrita (admin) utilizam `requireAdmin()`, que valida o papel do usuário no `app_metadata` (protegido contra edição via cliente).
2. **Row Level Security (RLS):** Implementação rigorosa de políticas RLS para garantir que usuários não possam acessar ou modificar dados de terceiros.
3. **Ofuscação de Conteúdo Premium:** O `prompt_text` de prompts premium é omitido no servidor para usuários sem assinatura ativa, garantindo proteção total contra vazamento de conteúdo via devtools ou interceptação de rede.
4. **Sincronização de Auth & DB:** O status de assinatura (PRO) é sincronizado entre os metadados do Supabase Auth e a tabela `stripe_subscriptions` para garantir consistência e performance.
5. **Busca Administrativa Segura:** Busca de usuários realizada no servidor via API Admin do Supabase, evitando exposição de dados sensíveis no cliente.
6. **Gestão Inteligente de Imagens:**
   - **Compressão no Cliente:** Redução de tamanho antes do upload (máx 1200px, 80% JPEG).
   - **Sincronização de Storage:** Limpeza automática de arquivos órfãos no Storage durante `update` e `delete` de prompts.
7. **Pagamentos e Assinaturas:**
   - **Foco Exclusivo no Stripe:** Gestão de assinaturas e pagamentos recorrentes via Stripe.
   - **Gestão de Assinaturas:** Interface para cancelamento e troca de planos integrada ao Stripe Billing Portal.
8. **Comunicação e Suporte:** Implementação de formulário de contato integrado com **Resend**, utilizando Server Actions para envio de e-mails com rate limiting por IP e validação rigorosa com Zod.

## 📝 Convenções de Desenvolvimento
- **Segurança Primeiro:** Nunca confiar em metadados vindos do cliente para permissões críticas. Sempre validar no servidor usando `requireAdmin()` ou `requireUser()`.
- **Server Components:** Utilizar por padrão para buscar dados e SEO (Metadata dinâmico).
- **Client Components:** Apenas para interatividade (forms, sliders, botões de ação).
- **fetchSiteSettings:** Sempre utilizar este utilitário para acessar as configurações globais.
- **Revalidação:** Utilizar `revalidatePath` em Server Actions para manter o cache atualizado (especialmente em `/`, `/prompts` e `/admin/settings`).

## 🛡️ Validação de Dados
- **Zod Schemas:** Centralizados em `lib/validations.ts` para garantir consistência entre Client e Server.
- **Tratamento de Erros:** Ao utilizar `safeParse`, os erros de validação devem ser acessados via `validated.error.issues`, seguindo a tipagem oficial do Zod.
