export interface Category {
  id: string;
  name: string;
  name_en: string;
  slug: string;
  description?: string;
  description_en?: string;
  icon?: string;
  is_active: boolean;
  package_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}
