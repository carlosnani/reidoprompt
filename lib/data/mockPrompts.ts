import { getPrompts, getCategories, Prompt, Category } from '../supabase/queries';

// Re-export types for compatibility
export type { Prompt, Category };

// Alias para compatibilidade com componentes de galeria
export type MockPrompt = Prompt;

export interface DetailedPrompt extends Prompt {
  title: string;
  categories: string[];
  author: string;
  date: string;
  description?: string;
  promptText?: string;
  images?: string[];
}

// Funções para obter dados reais do Supabase
export async function fetchPrompts(limit = 50, offset = 0): Promise<Prompt[]> {
  return await getPrompts(limit, offset);
}

export async function fetchCategories(): Promise<Category[]> {
  return await getCategories();
}

// Dados mock mantidos para fallback ou desenvolvimento
export const mockPrompts: MockPrompt[] = [
  {
    id: "prompt-1",
    title: "Cinematic Sci-Fi",
    is_premium: false,
    tag: "Cinematic Sci-Fi",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80",
    views: 12400,
    likes: 832,
    category: "Cinematic",
    model: "Midjourney v6",
  },
  {
    id: "prompt-2",
    title: "Cyberpunk City",
    is_premium: false,
    tag: "Cyberpunk City",
    image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&q=80",
    views: 9800,
    likes: 654,
    category: "Cyberpunk",
    model: "DALL-E 3",
  },
  {
    id: "prompt-3",
    title: "Portrait Realism",
    is_premium: false,
    tag: "Portrait Realism",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    views: 8200,
    likes: 510,
    category: "Portrait",
    model: "Stable Diffusion XL",
  },
  {
    id: "prompt-4",
    title: "Anime Fantasy",
    is_premium: false,
    tag: "Anime Fantasy",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80",
    views: 15700,
    likes: 1203,
    category: "Anime",
    model: "Midjourney v6",
  },
  {
    id: "prompt-5",
    title: "Gothic Architecture",
    is_premium: false,
    tag: "Gothic Architecture",
    image: "https://images.unsplash.com/photo-1548712765-b8d90f5a4c9d?w=400&q=80",
    views: 6300,
    likes: 389,
    category: "Architecture",
    model: "DALL-E 3",
  },
  {
    id: "prompt-6",
    title: "Neon Dreamscape",
    is_premium: false,
    tag: "Neon Dreamscape",
    image: "https://images.unsplash.com/photo-1608306448197-e83633f1261c?w=400&q=80",
    views: 11200,
    likes: 745,
    category: "Cyberpunk",
    model: "Midjourney v6",
  },
  {
    id: "prompt-7",
    title: "Forest Spirit",
    is_premium: false,
    tag: "Forest Spirit",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80",
    views: 7800,
    likes: 501,
    category: "Fantasy",
    model: "Stable Diffusion XL",
  },
  {
    id: "prompt-8",
    title: "Vintage Portrait",
    is_premium: false,
    tag: "Vintage Portrait",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    views: 9100,
    likes: 612,
    category: "Portrait",
    model: "DALL-E 3",
  },
  {
    id: "prompt-9",
    title: "Space Explorer",
    is_premium: false,
    tag: "Space Explorer",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80",
    views: 10500,
    likes: 789,
    category: "Cinematic",
    model: "Midjourney v6",
  },
];

export function getPromptById(id: string): DetailedPrompt | undefined {
  const prompt = mockPrompts.find((p) => p.id === id);
  if (!prompt) return undefined;

  // Augmenting MockPrompt to DetailedPrompt for the detail page
  return {
    ...prompt,
    title: prompt.tag,
    categories: prompt.category ? [prompt.category, "AI Art"] : ["AI Art", "Digital"],
    author: "Prompt Master",
    date: "24 Mai 2024",
    description: "Um prompt profissional e altamente otimizado para gerar imagens de altíssima qualidade. Este prompt foi testado exaustivamente em múltiplos modelos para garantir o melhor resultado possível.",
    promptText: "A highly detailed cinematic portrait of a " + prompt.tag.toLowerCase() + " character, masterpiece, 8k resolution, photorealistic, volumetric lighting, ray tracing, sharp focus, intricate details.",
    images: [
      prompt.image,
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
      "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&q=80",
    ],
  };
}