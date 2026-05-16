-- Script para corrigir a tabela ai_models adicionando as colunas faltantes
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_models' AND column_name = 'provider') THEN
        ALTER TABLE public.ai_models ADD COLUMN provider TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_models' AND column_name = 'slug') THEN
        ALTER TABLE public.ai_models ADD COLUMN slug TEXT;
        UPDATE public.ai_models SET slug = lower(regexp_replace(name, '\s+', '-', 'g')) WHERE slug IS NULL;
        ALTER TABLE public.ai_models ADD CONSTRAINT ai_models_slug_key UNIQUE (slug);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_models' AND column_name = 'description') THEN
        ALTER TABLE public.ai_models ADD COLUMN description TEXT;
    END IF;
END $$;

-- Recarregar cache do esquema no Supabase
NOTIFY pgrst, 'reload schema';
