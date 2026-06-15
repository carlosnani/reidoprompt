import { SupabaseClient } from '@supabase/supabase-js';

export interface SiteSettings {
  id?: string;
  platform_name: string;
  support_email: string;
  default_meta_title: string;
  default_meta_description: string;
  monthly_price: number;
  yearly_price: number;
  allow_registration: boolean;
  updated_at?: string;
}

export const SITE_SETTINGS_DEFAULTS: SiteSettings = {
  platform_name: 'O Rei do Prompt',
  support_email: 'suporte@reidoprompt.com',
  default_meta_title: 'O Rei do Prompt - A maior galeria de Prompts',
  default_meta_description: 'Encontre e copie os melhores prompts testados para Midjourney, DALL-E, ChatGPT e muito mais.',
  monthly_price: 39.90,
  yearly_price: 399.00,
  allow_registration: true
};

export async function fetchSiteSettings(supabase: SupabaseClient) {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .maybeSingle();

    if (error || !data) {
      if (error) console.error('Error fetching site settings:', error);
      return SITE_SETTINGS_DEFAULTS;
    }
    return data as SiteSettings;
  } catch (err) {
    console.error('Unexpected error fetching site settings:', err);
    return SITE_SETTINGS_DEFAULTS;
  }
}
