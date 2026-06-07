import { MetadataRoute } from 'next';
import { getPrompts, getCategories } from '@/lib/supabase/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reidoprompt.com.br';

  // 1. Páginas estáticas
  const routes = [
    '',
    '/prompts',
    '/planos',
    '/faq',
    '/sobre',
    '/termos',
    '/privacidade',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Páginas de Prompts (dinâmicas)
  const { data: prompts } = await getPrompts({ limit: 1000 });
  const promptRoutes = prompts.map((prompt) => ({
    url: `${baseUrl}/prompt/${prompt.id}`,
    lastModified: new Date(prompt.updated_at || prompt.created_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // 3. Páginas de Categorias (dinâmicas)
  const { data: categories } = await getCategories();
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/prompts?category=${category.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [...routes, ...promptRoutes, ...categoryRoutes];
}
