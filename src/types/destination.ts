export interface Destination {
  id: string;
  name: string;
  name_en: string;
  slug: string;
  country: string;
  city?: string;
  description?: string;
  description_en?: string;
  image_url?: string;
  is_active: boolean;
  package_count?: number;
  created_at: string;
  updated_at: string;
}

export interface DestinationsResponse {
  success: boolean;
  message: string;
  data: Destination[];
}

export interface DestinationFilters {
  country?: string;
  minRating?: number;
  searchQuery?: string;
}
