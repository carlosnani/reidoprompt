-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. AI MODELS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ai_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    provider TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for ai_models
ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;

-- Everyone can view models
CREATE POLICY "Enable read access for all users" ON public.ai_models
    FOR SELECT USING (true);

-- Only authenticated users can insert/update/delete (or you can restrict to admins)
CREATE POLICY "Enable insert for authenticated users only" ON public.ai_models
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    
CREATE POLICY "Enable update for authenticated users only" ON public.ai_models
    FOR UPDATE USING (auth.role() = 'authenticated');
    
CREATE POLICY "Enable delete for authenticated users only" ON public.ai_models
    FOR DELETE USING (auth.role() = 'authenticated');


-- ==========================================
-- 2. CATEGORIES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add missing columns if table already existed without them
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'slug') THEN
        ALTER TABLE public.categories ADD COLUMN slug TEXT UNIQUE;
        -- Generate slugs for existing categories
        UPDATE public.categories SET slug = lower(regexp_replace(name, '\s+', '-', 'g')) WHERE slug IS NULL;
        ALTER TABLE public.categories ALTER COLUMN slug SET NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'description') THEN
        ALTER TABLE public.categories ADD COLUMN description TEXT;
    END IF;
END $$;

-- RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.categories FOR DELETE USING (auth.role() = 'authenticated');


-- ==========================================
-- 3. PROMPTS TABLE UPDATES
-- ==========================================
-- Add missing columns to prompts if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prompts' AND column_name = 'description') THEN
        ALTER TABLE public.prompts ADD COLUMN description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prompts' AND column_name = 'ai_model_id') THEN
        ALTER TABLE public.prompts ADD COLUMN ai_model_id UUID REFERENCES public.ai_models(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prompts' AND column_name = 'prompt_text') THEN
        ALTER TABLE public.prompts ADD COLUMN prompt_text TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prompts' AND column_name = 'is_premium') THEN
        ALTER TABLE public.prompts ADD COLUMN is_premium BOOLEAN DEFAULT false;
    END IF;
END $$;

-- RLS for prompts (just to ensure it allows admin updates)
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.prompts;
CREATE POLICY "Enable read access for all users" ON public.prompts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.prompts;
CREATE POLICY "Enable insert for authenticated users only" ON public.prompts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.prompts;
CREATE POLICY "Enable update for authenticated users only" ON public.prompts FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.prompts;
CREATE POLICY "Enable delete for authenticated users only" ON public.prompts FOR DELETE USING (auth.role() = 'authenticated');


-- ==========================================
-- 4. PROMPT_CATEGORIES (N:N RELATIONSHIP)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.prompt_categories (
    prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (prompt_id, category_id)
);

-- RLS for prompt_categories
ALTER TABLE public.prompt_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.prompt_categories FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.prompt_categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.prompt_categories FOR DELETE USING (auth.role() = 'authenticated');

-- ==========================================
-- 5. REFRESH SCHEMA CACHE
-- ==========================================
NOTIFY pgrst, 'reload schema';
