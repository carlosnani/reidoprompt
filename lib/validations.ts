import { z } from "zod";

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const registerSchema = z.object({
  fullName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

// Admin Schemas
export const siteSettingsSchema = z.object({
  platformName: z.string().min(1, "Nome da plataforma é obrigatório"),
  supportEmail: z.string().email("E-mail de suporte inválido"),
  seoTitle: z.string().min(1, "Título SEO é obrigatório"),
  seoDesc: z.string().min(1, "Descrição SEO é obrigatória"),
  monthlyPrice: z.coerce.number().min(0, "Preço mensal deve ser positivo"),
  yearlyPrice: z.coerce.number().min(0, "Preço anual deve ser positivo"),
});

export const aiModelSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  provider: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
});

export const promptSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  prompt_text: z.string().min(1, "Texto do prompt é obrigatório"),
  ai_model_id: z.string().uuid("Modelo de IA inválido"),
  is_premium: z.boolean().default(false),
  categories: z.array(z.string().uuid()).min(1, "Selecione pelo menos uma categoria"),
  images: z.array(z.string().url()).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  subject: z.string().min(5, "O assunto deve ter pelo menos 5 caracteres"),
  message: z.string().min(10, "A mensagem deve ter pelo menos 10 caracteres"),
});
