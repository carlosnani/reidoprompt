# Basecode - Definições do Projeto

Este arquivo contém as definições fundamentais, arquitetura e diretrizes do projeto.

## 🚀 Tecnologias e Stack
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Frontend:** [React 19](https://react.dev/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Animações:** [Framer Motion](https://www.framer.com/motion/)
- **Backend/Banco de Dados:** [Supabase](https://supabase.com/)
- **Autenticação:** Supabase Auth (Cookie-based / SSR)
- **Ícones:** [Lucide React](https://lucide.dev/)

## 📂 Estrutura de Pastas Principal
- `app/`: Rotas e páginas da aplicação.
  - `admin/`: Painel administrativo (Gestão de prompts, usuários, categorias).
  - `auth/`: Fluxos de autenticação (Login, Cadastro, Recuperação de senha).
  - `prompts/`: Galeria principal de prompts.
  - `prompt/[id]/`: Página de detalhes de um prompt específico.
  - `conta/`: Área do usuário (Perfil, atalhos, gestão de conta).
  - `favoritos/`: Área de itens salvos pelo usuário.
  - `planos/`: Página de precificação e assinaturas.
  - `faq/`: Central de ajuda com perguntas frequentes.
  - `suporte/`: Canal de atendimento ao cliente.
  - `sobre/`: Informações institucionais sobre a plataforma.
  - `termos/`: Central Legal (página agregadora de links jurídicos e suporte).
  - `termos-de-uso/`: Termos de serviço detalhados.
  - `privacidade/`: Política de privacidade e tratamento de dados.
- `components/`: Componentes React reutilizáveis.
  - `admin/`: Componentes exclusivos do painel administrativo.
  - `auth/`: Componentes de formulários e containers de autenticação.
  - `prompt-detail/`: Partes da página de detalhes (Galeria, Texto, Relacionados).
  - `prompts/`: Componentes da galeria (Cards, Filtros, Paginação).
  - `ui/`: Componentes base do shadcn/ui.
- `lib/`: Utilitários e configurações.
  - `supabase/`: Configurações do cliente e servidor Supabase.
  - `data/`: Mock data e definições de tipos para desenvolvimento.

## 📊 Modelos de Dados (Tipagens)

### Prompt (Básico/Galeria)
```typescript
interface Prompt {
  id: string;
  tag: string;
  image: string;
  views: number;
  likes: number;
  category?: string;
  model?: string;
}
```

### DetailedPrompt (Detalhes Completos)
```typescript
interface DetailedPrompt extends Prompt {
  title: string;
  categories: string[];
  author: string;
  date: string;
  description?: string;
  promptText?: string;
  images?: string[];
}
```

## 🎨 Design System
- **Tema:** Dark Mode predominante.
- **Cores Principais:** 
  - `green-neon`: Usado para calls-to-action e destaques.
  - `black/deep-gray`: Cores de fundo e superfícies.
- **Estilo:** Visual premium, moderno, com uso extensivo de glassmorphism (backdrop-blur), sombras suaves e gradientes neon.

## 🛠️ Funcionalidades Principais
1. **Galeria de Prompts:** Busca, filtros por categoria e paginação de prompts de IA (Midjourney, ChatGPT, etc).
2. **Visualização de Detalhes:** Ver o prompt original, descrição, autor e imagens relacionadas.
3. **Sistema de Favoritos:** Usuários autenticados podem salvar prompts.
4. **Painel Administrativo:** Controle total sobre o conteúdo da plataforma (CRUD de prompts, categorias e modelos).
5. **Gestão de Assinaturas (Página de Planos):** A página de planos (`/planos`) deve ser pública e visível para todos os usuários (logados ou não). Diferenciação entre usuários gratuitos e premium através de planos.
6. **Autenticação Completa:** Cadastro, login social e gestão de perfil via Supabase.
7. **Páginas Institucionais e Suporte:** Sistema de FAQ, suporte ao usuário, termos de uso e políticas de privacidade integrados via Footer.

## 📝 Convenções de Desenvolvimento
- Utilizar Server Components por padrão para performance, e Client Components (`"use client"`) apenas quando necessário para interatividade.
- Seguir o padrão de componentes do shadcn/ui para manter a consistência visual.
- Manter as regras de Tailwind no arquivo `tailwind.config.ts`.
- Tipagem rigorosa com TypeScript para evitar bugs em tempo de execução.
