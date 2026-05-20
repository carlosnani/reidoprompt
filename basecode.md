# Basecode - Definições do Projeto

Este arquivo contém as definições fundamentais, arquitetura e diretrizes do projeto **Rei do Prompt**.

## 🚀 Tecnologias e Stack
- **Framework:** [Next.js 16+](https://nextjs.org/) (App Router)
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
- `admin/`: Painel administrativo.
  - `categories/`: Gestão de categorias.
  - `models/`: Gestão de modelos de IA.
  - `prompts/`: Listagem e edição de prompts (CRUD completo).
  - `users/`: Visualização de usuários.
  - `settings/`: Configurações do sistema.
- `auth/`: Fluxos de autenticação.
  - `login/`, `sign-up/`, `forgot-password/`, `update-password/`.
  - `confirm/`: Rota de confirmação de e-mail/auth.
- `prompts/`: Galeria principal com filtros e busca.
- `prompt/[id]/`: Detalhes de um prompt (inclui texto original, autor e relacionados).
- `conta/`: Perfil do usuário e preferências.
- `favoritos/`: Prompts salvos pelo usuário.
- `planos/`: Página de precificação.
- `faq/`, `suporte/`, `sobre/`: Páginas institucionais.
- `termos/`, `termos-de-uso/`, `privacidade/`: Documentação legal.

### `components/` (Componentes React)
- `admin/`: Componentes específicos do dashboard (Sidebar, Header, TablePagination, ImageUploader, SubmitToastButton, DeleteAction).
- `auth/`: Formulários e containers de autenticação (LoginForm, RegisterForm, SocialLogin, AuthContainer).
- `prompt-detail/`: Fragmentos da página de detalhes (PromptText, ImageGallery, RelatedPrompts, PromptDetails).
- `prompts/`: Elementos da galeria (PromptCard, GalleryGrid, GalleryHeader, GalleryPagination).
- `ui/`: Componentes base do shadcn/ui (Button, Input, Card, Select, Tabs, Textarea, Accordion, Alert-Dialog, etc.).
- `Header.tsx`, `Footer.tsx`: Layout principal.
- `Hero.tsx`, `PromptGallery.tsx`, `CategoryGrid.tsx`, `Automations.tsx`, `BlogReviews.tsx`, `ToolsGrid.tsx`, `PremiumPrompts.tsx`, `HowItWorks.tsx`, `CTA.tsx`: Seções da Landing Page.
- `auth-button.tsx`, `logout-button.tsx`, `theme-switcher.tsx`: Utilitários de UI.

### `lib/` (Lógica e Utilitários)
- `middleware.ts`: Lógica de gerenciamento de sessão e proteção de rotas (localizado na raiz).
  - `auth.ts`: Utilitários de autenticação.
  - `client.ts`: Cliente para Client Components.
  - `server.ts`: Cliente para Server Components / Server Actions.
  - `queries.ts`: Funções de acesso ao banco de dados (CRUD).
  - `hooks.ts`: Custom hooks para integração com Supabase.
  - `storage.ts`: Lógica de gerenciamento de arquivos no bucket.
- `data/`: Mock data (ex: `mockPrompts.ts`).
- `utils.ts`: Utilitários gerais (ex: formatação de classes com `clsx` e `tailwind-merge`).

## 📊 Modelos de Dados (Tipagens)

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
  category?: string;    // Legacy
  model?: string;       // Legacy
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
Modelos de IA suportados (ex: GPT-4, Midjourney v6).
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

### DetailedPrompt
Extensão para visualização detalhada.
```typescript
interface DetailedPrompt extends Prompt {
  categories: Category[];
  author: string;
  date: string;
  promptText?: string;
}
```

## 🗄️ SQL Database Schema (Supabase)

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

## 🎨 Design System e UI/UX
- **Tema:** Dark Mode (Next Themes).
- **Estética:** Premium, glassmorphism, gradientes neon (foco em `green-neon`).
- **Componentes:** Altamente baseados em Radix UI para acessibilidade.
- **Responsividade:** Mobile-first, utilizando containers do Tailwind.
- **Cores Admin:** Paleta específica para o dashboard admin (ex: `admin-surface`, `admin-border`).

## 🛠️ Funcionalidades de Backend
1. **Server Actions:** Utilizadas para operações de escrita (admin e auth) em `app/admin/actions.ts` e fluxos de auth.
2. **RLS (Row Level Security):** Configurado no Supabase para proteger dados de usuários e restringir acesso administrativo via função `requireAdmin`.
3. **Joins Complexos:** O arquivo `queries.ts` realiza fetches relacionais (ex: prompt + model + categorias em uma única query).
4. **Gestão de Imagens (Supabase Storage):**
   - Bucket: `reidoprompt`.
   - Upload realizado via `ImageUploader` (Client Component) integrado com `lib/supabase/storage.ts`.
   - Suporte a múltiplas imagens por prompt.
   - Deleção automática do storage ao remover imagens no admin.

## 📝 Convenções de Desenvolvimento
- **Server Components:** Utilizar por padrão para buscar dados e SEO.
- **Client Components:** Apenas para interatividade (forms, sliders, botões de ação).
- **TypeScript:** Tipagem estrita em todas as funções de `queries.ts`.
- **Commits:** Seguir o padrão de commits semânticos se possível.
- **Supabase:** Sempre usar `createClient` do arquivo `lib/supabase/server.ts` dentro de Server Components e `client.ts` em Client Components.
- **Revalidação:** Utilizar `revalidatePath` em Server Actions para manter o cache atualizado.
