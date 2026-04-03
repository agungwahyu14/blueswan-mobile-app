export interface VehicleType {
  id: string;
  name: string;
  name_en: string;
  description?: string;
  description_en?: string;
  created_at: string;
  updated_at: string;
}

export interface TransportFeature {
  id: string;
  feature_name: string;
  feature_name_en: string;
  description?: string;
  description_en?: string;
  created_at: string;
}

export interface TransportAreaCoverage {
  id: string;
  area_name: string;
  area_name_en: string;
  description?: string;
  description_en?: string;
  created_at: string;
}

export interface TransportTerm {
  id: string;
  term: string;
  term_en: string;
  created_at: string;
}

export interface TransportPhoto {
  id: string;
  image_url: string;
  is_primary: boolean;
  created_at: string;
}

export interface TransportAdditionalService {
  id: string;
  service_name: string;
  service_name_en: string;
  description?: string;
  description_en?: string;
  price_idr: string;
  price_usd: string;
  created_at: string;
}

export interface TransportReview {
  id: string;
  user_id: string;
  transport_id: string;
  transport_reservation_id: string;
  rating: number;
  review_text: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Transport {
  id: string;
  vehicle_type_id: string;
  name: string;
  name_en: string | null;
  transport_type: string;
  capacity: number;
  price_idr: string;
  price_usd: string;
  max_distance_km: string;
  baggage: string;
  baggage_en: string;
  license_plate: string;
  meta_title?: string | null;
  meta_title_en?: string | null;
  meta_keywords?: string | null;
  meta_keywords_en?: string | null;
  meta_description?: string | null;
  meta_description_en?: string | null;
  is_active: boolean;
  average_rating: number;
  total_review: number;
  created_at: string;
  updated_at: string;
  vehicle_types: VehicleType;
  transport_features: TransportFeature[];
  transport_area_coverages: TransportAreaCoverage[];
  transport_terms: TransportTerm[];
  transport_photos: TransportPhoto[];
  transport_additional_services: TransportAdditionalService[];
  reviews?: TransportReview[];
  _count: {
    transport_reviews: number;
  };
}

export interface TransportsResponse {
  success: boolean;
  message: string;
  data: Transport[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TransportDetailResponse {
  success: boolean;
  message: string;
  data: Transport;
}
