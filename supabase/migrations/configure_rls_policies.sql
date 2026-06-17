-- Enforce Row Level Security (RLS) on all database tables
alter table public.prompts enable row level security;
alter table public.categories enable row level security;
alter table public.ai_models enable row level security;
alter table public.favorites enable row level security;
alter table public.prompt_categories enable row level security;
alter table public.site_settings enable row level security;

-- ==========================================
-- PROMPTS SECURITY POLICIES
-- ==========================================

-- Select policy: Anyone can see public prompts. Admin users and service role can see all prompts.
create policy "Users can view public prompts, admins can view all"
  on public.prompts
  for select
  using (
    is_public = true 
    or auth.role() = 'service_role'
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Insert, Update, Delete policy: Only the backend service role or confirmed admin users can modify prompts.
create policy "Only service_role or admins can modify prompts"
  on public.prompts
  for all
  using (
    auth.role() = 'service_role'
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    auth.role() = 'service_role'
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ==========================================
-- CATEGORIES SECURITY POLICIES
-- ==========================================

create policy "Anyone can view categories"
  on public.categories
  for select
  using (true);

create policy "Only service_role or admins can modify categories"
  on public.categories
  for all
  using (
    auth.role() = 'service_role'
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    auth.role() = 'service_role'
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ==========================================
-- AI MODELS SECURITY POLICIES
-- ==========================================

create policy "Anyone can view ai_models"
  on public.ai_models
  for select
  using (true);

create policy "Only service_role or admins can modify ai_models"
  on public.ai_models
  for all
  using (
    auth.role() = 'service_role'
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    auth.role() = 'service_role'
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ==========================================
-- PROMPT CATEGORIES (JOIN TABLE) SECURITY POLICIES
-- ==========================================

create policy "Anyone can view prompt_categories"
  on public.prompt_categories
  for select
  using (true);

create policy "Only service_role or admins can modify prompt_categories"
  on public.prompt_categories
  for all
  using (
    auth.role() = 'service_role'
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    auth.role() = 'service_role'
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ==========================================
-- SITE SETTINGS SECURITY POLICIES
-- ==========================================

create policy "Anyone can view site_settings"
  on public.site_settings
  for select
  using (true);

create policy "Only service_role or admins can modify site_settings"
  on public.site_settings
  for all
  using (
    auth.role() = 'service_role'
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    auth.role() = 'service_role'
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ==========================================
-- FAVORITES (USER OWNED) SECURITY POLICIES
-- ==========================================

-- Select: A user can only view their own favorites list.
create policy "Users can view their own favorites"
  on public.favorites
  for select
  using (auth.uid() = user_id);

-- Insert: A user can only favorite prompts for their own user_id.
create policy "Users can insert their own favorites"
  on public.favorites
  for insert
  with check (auth.uid() = user_id);

-- Delete: A user can only delete favorites that belong to them.
create policy "Users can delete their own favorites"
  on public.favorites
  for delete
  using (auth.uid() = user_id);
