export interface Destination {
  id: string;
  name: string;
  country: string;
  city: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  popularActivities: string[];
  bestTimeToVisit: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface DestinationFilters {
  country?: string;
  minRating?: number;
  searchQuery?: string;
}
