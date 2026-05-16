-- Criar tabela de AI Models
CREATE TABLE IF NOT EXISTS public.ai_models (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS (opcional, dependendo de como você gerencia permissões)
ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para ai_models (Público pode ler, Autenticados podem gerenciar - Ajuste conforme sua regra de negócios)
CREATE POLICY "AI Models are viewable by everyone." ON public.ai_models FOR SELECT USING (true);
CREATE POLICY "AI Models are insertable by authenticated users." ON public.ai_models FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "AI Models are updatable by authenticated users." ON public.ai_models FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "AI Models are deletable by authenticated users." ON public.ai_models FOR DELETE USING (auth.role() = 'authenticated');

-- Adicionar ai_model_id na tabela prompts
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS ai_model_id UUID REFERENCES public.ai_models(id) ON DELETE SET NULL;

-- Criar tabela associativa para Prompts e Categorias (Relacionamento N:N)
CREATE TABLE IF NOT EXISTS public.prompt_categories (
    prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (prompt_id, category_id)
);

-- Ativar RLS
ALTER TABLE public.prompt_categories ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para prompt_categories
CREATE POLICY "Prompt categories are viewable by everyone." ON public.prompt_categories FOR SELECT USING (true);
CREATE POLICY "Prompt categories are manageable by authenticated users." ON public.prompt_categories FOR ALL USING (auth.role() = 'authenticated');

-- (Opcional) Migrar dados antigos caso existam. Se não, você pode ignorar estas linhas:
-- Você pode depois rodar: ALTER TABLE public.prompts DROP COLUMN category;
-- E: ALTER TABLE public.prompts DROP COLUMN model;
