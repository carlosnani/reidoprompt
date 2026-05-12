export interface MockPrompt {
  id: string;
  tag: string;
  image: string;
  views: number;
  likes: number;
  category?: string;
  model?: string;
}

// Alias para compatibilidade com componentes de galeria
export type Prompt = MockPrompt;

export interface DetailedPrompt extends MockPrompt {
  title: string;
  categories: string[];
  author: string;
  date: string;
  description?: string;
  promptText?: string;
  images?: string[];
}

export const mockPrompts: MockPrompt[] = [
  {
    id: "prompt-1",
    tag: "Cinematic Sci-Fi",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80",
    views: 12400,
    likes: 832,
    category: "Cinematic",
    model: "Midjourney v6",
  },
  {
    id: "prompt-2",
    tag: "Cyberpunk City",
    image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&q=80",
    views: 9800,
    likes: 654,
    category: "Cyberpunk",
    model: "DALL-E 3",
  },
  {
    id: "prompt-3",
    tag: "Portrait Realism",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    views: 8200,
    likes: 510,
    category: "Portrait",
    model: "Stable Diffusion XL",
  },
  {
    id: "prompt-4",
    tag: "Anime Fantasy",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80",
    views: 15700,
    likes: 1203,
    category: "Anime",
    model: "Midjourney v6",
  },
  {
    id: "prompt-5",
    tag: "Gothic Architecture",
    image: "https://images.unsplash.com/photo-1548712765-b8d90f5a4c9d?w=400&q=80",
    views: 6300,
    likes: 389,
    category: "Architecture",
    model: "DALL-E 3",
  },
  {
    id: "prompt-6",
    tag: "Neon Dreamscape",
    image: "https://images.unsplash.com/photo-1608306448197-e83633f1261c?w=400&q=80",
    views: 11200,
    likes: 745,
    category: "Cyberpunk",
    model: "Midjourney v6",
  },
  {
    id: "prompt-7",
    tag: "Forest Spirit",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80",
    views: 7800,
    likes: 501,
    category: "Fantasy",
    model: "Stable Diffusion XL",
  },
  {
    id: "prompt-8",
    tag: "Vintage Portrait",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    views: 9100,
    likes: 612,
    category: "Portrait",
    model: "DALL-E 3",
  },
  {
    id: "prompt-9",
    tag: "Space Explorer",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80",
    views: 13500,
    likes: 920,
    category: "Sci-Fi",
    model: "Midjourney v6",
  },
  {
    id: "prompt-10",
    tag: "Ocean Depths",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
    views: 5400,
    likes: 298,
    category: "Nature",
    model: "Stable Diffusion XL",
  },
  {
    id: "prompt-11",
    tag: "Dragon Kingdom",
    image: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&q=80",
    views: 18900,
    likes: 1450,
    category: "Fantasy",
    model: "Midjourney v6",
  },
  {
    id: "prompt-12",
    tag: "Minimalist Interior",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    views: 4200,
    likes: 231,
    category: "Architecture",
    model: "DALL-E 3",
  },
];
