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
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Notificações:** [Sonner](https://genau.io/sonner)

## 📂 Estrutura de Pastas Detalhada

### `app/` (Rotas e Páginas)
- `admin/`: Painel administrativo (Gestão de prompts, categorias, modelos, usuários e settings).
- `auth/`: Fluxos de autenticação (Login, Sign-up, etc).
- `prompts/`: Galeria principal com filtros e busca.
- `prompt/[id]/`: Detalhes de um prompt.
- `sitemap.ts`: Gerador dinâmico de Sitemap para SEO.
- `robots.ts`: Configurações de indexação para motores de busca.
- `conta/`, `favoritos/`, `planos/`: Áreas do usuário e precificação.
- `faq/`, `suporte/`, `sobre/`, `termos/`, `privacidade/`: Páginas institucionais e legais.

### `components/` (Componentes React)
- `admin/`: Componentes específicos do dashboard (Sidebar, Header, TablePagination - Legacy, ImageUploader, SubmitToastButton, DeleteAction, UserActionButtons, UserSearchInput).
- `auth/`: Formulários e containers de autenticação (LoginForm, RegisterForm, SocialLogin, AuthContainer).
- `AppPagination.tsx`: Componente de paginação universal com suporte a temas 'admin' e 'public'.
- `prompt-detail/`: Fragmentos da página de detalhes (PromptText, ImageGallery, RelatedPrompts, PromptDetails).
- `prompts/`: Elementos da galeria (PromptCard, GalleryGrid, GalleryHeader, GalleryPagination).
- `ui/`: Componentes base do shadcn/ui (Button, Input, Card, Select, Tabs, Textarea, Accordion, Alert-Dialog, etc.).
- `Header.tsx`, `Footer.tsx`: Layout principal com branding dinâmico.
- `Hero.tsx`, `PromptGallery.tsx`, `CategoryGrid.tsx`, `Automations.tsx`, `BlogReviews.tsx`, `ToolsGrid.tsx`, `PremiumPrompts.tsx`, `HowItWorks.tsx`, `CTA.tsx`: Seções da Landing Page.
- `auth-button.tsx`, `logout-button.tsx`, `theme-switcher.tsx`: Utilitários de UI.

### `lib/` (Lógica e Utilitários)
- `supabase/`:
  - `queries.ts`: CRUD otimizado com **seleção de colunas específica** e **React cache** para memoização.
  - `storage.ts`: Gestão de arquivos (Upload/Delete) com suporte a extração de caminhos via URL.
  - `auth.ts`, `client.ts`, `server.ts`, `site-settings.ts`: Gestão de auth e configurações globais.
- `utils/`:
  - `image.ts`: Utilitário de **compressão de imagem** (Client-side, 1200px, 80% qualidade).
- `data/`: Mock data.
- `utils.ts`: Utilitários gerais.

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

### DetailedPrompt
Extensão do Prompt com dados processados para a página de detalhes.
```typescript
interface DetailedPrompt extends Prompt {
  categories: Category[];
  author?: string;
  date?: string;
  promptText?: string;
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

## 🗄️ SQL Database Schema (Supabase)

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
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    ai_model_id UUID REFERENCES public.ai_models(id) ON DELETE SET NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Tabela `ai_models`
```sql
CREATE TABLE public.ai_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    provider TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Tabela `categories`
```sql
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Tabela `prompt_categories` (N:N)
```sql
CREATE TABLE public.prompt_categories (
    prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (prompt_id, category_id)
);
```

### Tabela `favorites`
```sql
CREATE TABLE public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, prompt_id)
);
```

### Índices de Performance Recomendados
```sql
CREATE INDEX idx_prompts_created_at ON prompts (created_at DESC);
CREATE INDEX idx_prompts_views ON prompts (views DESC);
CREATE INDEX idx_prompts_likes ON prompts (likes DESC);
CREATE INDEX idx_prompts_title_trgm ON prompts USING gin (title gin_trgm_ops); -- Requer pg_trgm
```

## 🎨 Design System e UI/UX
- **Tema:** Dark Mode (Next Themes).
- **Estética:** Premium, glassmorphism, gradientes neon (foco em `green-neon`).
- **Branding Dinâmico:** Nome da plataforma e metadados SEO são injetados em tempo real via banco de dados.
- **Feedback Visual:** `SubmitToastButton` aprimorado para exibir notificações automáticas via `sonner` após a conclusão de Server Actions.
- **Galeria de Imagens (Multi-image):** Suporte a múltiplas imagens por prompt (armazenadas em `TEXT[]`), com visualizador dinâmico e thumbnails na página de detalhes.
- **Estados de Carregamento:** Skeletons implementados via `loading.tsx` para transições suaves.
- **Cores Admin:** Paleta específica para o dashboard admin (ex: `admin-surface`, `admin-border`).

## 🛠️ Funcionalidades de Backend e SEO
1. **Server Actions:** Utilizadas para operações de escrita (admin e auth), incluindo `updateSiteSettingsAction` para configurações globais.
2. **Otimização de Performance:**
   - **Queries Seletivas:** Busca apenas colunas necessárias para reduzir o payload.
   - **Memoização:** Uso do `cache` do React para evitar múltiplas chamadas ao Supabase no mesmo render.
3. **Gestão Inteligente de Imagens:**
   - **Compressão no Cliente:** Redução de tamanho antes do upload (máx 1200px, 80% JPEG).
   - **Sincronização de Storage:** Limpeza automática de arquivos órfãos no Storage durante `update` e `delete` de prompts.
4. **Gestão de Usuários (Admin):**
   - **Ações Administrativas:** Deleção física de usuários do Supabase Auth (`deleteUserAction`), controle de banimento por tempo determinado (`toggleUserBanAction`) e controle de acesso PRO (`toggleProAccessAction`).
   - **UserActionButtons:** Painel interativo com diálogo de confirmação (Alert Dialog) para operações críticas de banimento.
   - **Busca Administrativa:** Busca em tempo real de usuários por nome ou e-mail (`UserSearchInput`), realizada no servidor com suporte a paginação integrada e preservação dos parâmetros de busca na URL.
5. **Controle de Acesso Seguro (Premium/PRO):**
   - **Bypass de Cache no Servidor:** Para garantir que a visualização do prompt premium seja imediata após o upgrade para PRO, a página `app/prompt/[id]/page.tsx` no servidor utiliza o cliente administrativo do Supabase (`createServiceRoleClient`) para buscar o status atualizado do usuário diretamente no banco de dados, ignorando tokens JWT potencialmente obsoletos contidos no cookie.
   - **Simplificação no Cliente:** O componente cliente `PromptText.tsx` baseia seu estado de bloqueio (`isRestricted`) unicamente no fato de o servidor ter fornecido ou não o `promptText`, já que a lógica de segurança e a omissão do texto real são processadas e aplicadas do lado do servidor.
6. **SEO & Marketing Dinâmico:**
   - **Metadata Dinâmico:** Títulos e descrições gerados em tempo real com base no banco e dados do prompt.
   - **OpenGraph:** Social cards dinâmicos que utilizam as imagens reais dos prompts.
   - **Sitemap & Robots:** Gerados dinamicamente para indexação total (`app/sitemap.ts` e `app/robots.ts`).

## 📝 Convenções de Desenvolvimento
- **Server Components:** Utilizar por padrão para buscar dados e SEO (Metadata dinâmico).
- **Client Components:** Apenas para interatividade (forms, sliders, botões de ação).
- **fetchSiteSettings:** Sempre utilizar este utilitário para acessar as configurações globais, passando o cliente Supabase adequado (server ou client).
- **Next.js 15+ Dynamic Routes:** Aguardar sempre `params` e `searchParams` antes do uso.
- **Revalidação:** Utilizar `revalidatePath` em Server Actions para manter o cache atualizado (especialmente em `/` e `/admin/settings`).
