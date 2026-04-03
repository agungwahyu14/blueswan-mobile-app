export interface PackagePhoto {
  id: string;
  photo_url: string;
  is_primary: boolean;
  order: number;
}

export interface PackageDestination {
  id: string;
  name: string;
  name_en: string;
}

export interface PackageCategory {
  id: string;
  name: string;
  name_en: string;
}

export interface Package {
  id: string;
  destination: PackageDestination;
  category: PackageCategory;
  name: string;
  name_en: string;
  slug: string;
  type: "open_trip" | "private_trip";
  description: string;
  description_en: string;
  duration_days: number;
  duration_nights: number;
  price_idr: number;
  price_usd: number;
  price: number;
  meeting_point: string;
  meeting_point_en: string;
  meeting_time: string;
  min_age: number;
  min_participant: number;
  max_participant: number;
  fitness_level: "easy" | "moderate" | "hard";
  dress_code: string;
  dress_code_en: string;
  health_advisory: string;
  health_advisory_en: string;
  average_rating: number;
  total_review: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  photos: PackagePhoto[];
}

export interface PackagesResponse {
  success: boolean;
  message: string;
  data: Package[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
