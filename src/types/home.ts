export interface HeroButton {
  id: string;
  button_text: string;
  button_text_en: string;
  link_url: string;
  order: number;
}

export interface HeroSection {
  id: string;
  title: string;
  title_en: string;
  subtitle: string;
  subtitle_en: string;
  background_image_url: string;
  buttons: HeroButton[];
  created_at: string;
  updated_at: string;
}

export interface Promo {
  id: string;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  image_url: string;
  discount_percentage?: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Gallery {
  id: string;
  title: string;
  title_en?: string;
  description?: string;
  description_en?: string;
  image_url: string;
  category?: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface HeroResponse {
  success: boolean;
  message: string;
  data: HeroSection;
}

export interface PromosResponse {
  success: boolean;
  message: string;
  data: Promo[];
}

export interface GalleriesResponse {
  success: boolean;
  message: string;
  data: Gallery[];
}
