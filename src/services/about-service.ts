import { apiClient } from "./api-client";

export interface Mission {
  id: string;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  order: number;
}

export interface Value {
  id: string;
  title: string;
  title_en: string;
  icon: string;
  description: string;
  description_en: string;
  order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  role_en: string;
  photo_url: string;
  order: number;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
  label_en: string;
  icon: string;
  order: number;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  order: number;
}

export interface CTAButton {
  id: string;
  name: string;
  name_en: string;
  url: string;
  class_name: string;
  order: number;
}

export interface AboutUs {
  id: string;
  hero_title: string;
  hero_title_en: string;
  hero_subtitle: string;
  hero_subtitle_en: string;
  hero_image_url: string;
  story_title: string;
  story_title_en: string;
  story_description: string;
  story_description_en: string;
  story_image_url: string;
  vm_title: string;
  vm_title_en: string;
  vm_subtitle: string;
  vm_subtitle_en: string;
  vision_title: string;
  vision_title_en: string;
  vision_content: string;
  vision_content_en: string;
  missions: Mission[];
  values_title: string;
  values_title_en: string;
  values_subtitle: string;
  values_subtitle_en: string;
  values: Value[];
  team_title: string;
  team_title_en: string;
  team_subtitle: string;
  team_subtitle_en: string;
  team_members: TeamMember[];
  stats: Stat[];
  partners_title: string;
  partners_title_en: string;
  partners_subtitle: string;
  partners_subtitle_en: string;
  partners: Partner[];
  cta_title: string;
  cta_title_en: string;
  cta_subtitle: string;
  cta_subtitle_en: string;
  cta_buttons: CTAButton[];
  created_at: string;
  updated_at: string;
}

export const aboutService = {
  /**
   * Get About Us page data
   */
  getAboutUs: async (): Promise<AboutUs> => {
    const response = await apiClient.get<AboutUs>("/api/about");
    return response;
  },
};
