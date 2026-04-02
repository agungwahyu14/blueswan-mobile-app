export interface TourPackage {
  id: string;
  title: string;
  destinationId: string;
  destinationName: string;
  description: string;
  duration: number; // in days
  price: number;
  currency: string;
  imageUrls: string[];
  rating: number;
  reviewCount: number;
  included: string[];
  excluded: string[];
  itinerary: Itinerary[];
  maxGroupSize: number;
  difficulty: "easy" | "moderate" | "challenging";
  availableDates: string[]; // ISO date strings
}

export interface Itinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

export interface TourFilters {
  destinationId?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: number;
  difficulty?: "easy" | "moderate" | "challenging";
  searchQuery?: string;
}
