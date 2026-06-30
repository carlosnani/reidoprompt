import { 
  Palette, Camera, Megaphone, PenTool, Ghost, Trophy, Briefcase, Box,
  Sparkles, Code, Zap, Music, BookOpen, Heart, Star} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface CategoryConfig {
  icon: LucideIcon;
  image: string;
}

/**
 * Mapeamento de categorias para ícones e imagens
 * Mantém a consistência visual do site
 */
export const categoryConfig: Record<string, CategoryConfig> = {
  // Categorias existentes
  "Arte & Design": {
    icon: Palette,
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=800&q=80"
  },
  "Fotografia": {
    icon: Camera,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"
  },
  "Marketing Digital": {
    icon: Megaphone,
    image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80"
  },
  "Logo Design": {
    icon: PenTool,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80"
  },
  "Personagens": {
    icon: Ghost,
    image: "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=800&q=80"
  },
  "Futebol": {
    icon: Trophy,
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80"
  },
  "Negócios": {
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"
  },
  "Efeitos 3D": {
    icon: Box,
    image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=800&q=80"
  },
  
  // Categorias adicionais com ícones alternativos
  "IA & Tecnologia": {
    icon: Code,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
  },
  "Criatividade": {
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
  },
  "Produção": {
    icon: Zap,
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80"
  },
  "Música": {
    icon: Music,
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80"
  },
  "Educação": {
    icon: BookOpen,
    image: "https://images.unsplash.com/photo-1427504494785-cdaa41d57ae3?auto=format&fit=crop&w=800&q=80"
  },
  "Lifestyle": {
    icon: Heart,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
  },
};

/**
 * Obtém o ícone e imagem para uma categoria
 * Se não encontrar, retorna valores padrão
 */
export function getCategoryConfig(categoryName: string): CategoryConfig {
  return categoryConfig[categoryName] || {
    icon: Star,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"
  };
}
