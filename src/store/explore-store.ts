import { destinationService } from "@/services/destination-service";
import { tourService } from "@/services/tour-service";
import type { Destination } from "@/types/destination";
import type { TourPackage } from "@/types/tour";
import { create } from "zustand";

interface ExploreState {
  destinations: Destination[];
  popularDestinations: Destination[];
  featuredTours: TourPackage[];
  currentDestination: Destination | null;
  currentTour: TourPackage | null;
  isLoadingDestinations: boolean;
  isLoadingTours: boolean;
  error: string | null;
}

interface ExploreActions {
  fetchDestinations: (page?: number) => Promise<void>;
  fetchPopularDestinations: () => Promise<void>;
  fetchDestinationById: (id: string) => Promise<void>;
  fetchFeaturedTours: () => Promise<void>;
  fetchTourById: (id: string) => Promise<void>;
  searchDestinations: (query: string) => Promise<Destination[]>;
  searchTours: (query: string) => Promise<TourPackage[]>;
  clearError: () => void;
  clearCurrentDestination: () => void;
  clearCurrentTour: () => void;
}

type ExploreStore = ExploreState & ExploreActions;

export const useExploreStore = create<ExploreStore>((set) => ({
  // State
  destinations: [],
  popularDestinations: [],
  featuredTours: [],
  currentDestination: null,
  currentTour: null,
  isLoadingDestinations: false,
  isLoadingTours: false,
  error: null,

  // Actions
  fetchDestinations: async (page = 1) => {
    set({ isLoadingDestinations: true, error: null });

    try {
      const response = await destinationService.getDestinations(undefined, {
        page,
        limit: 20,
      });
      set((state) => ({
        destinations:
          page === 1
            ? response.data
            : [...state.destinations, ...response.data],
        isLoadingDestinations: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch destinations",
        isLoadingDestinations: false,
      });
    }
  },

  fetchPopularDestinations: async () => {
    set({ isLoadingDestinations: true, error: null });

    try {
      const popularDestinations =
        await destinationService.getPopularDestinations(10);
      set({ popularDestinations, isLoadingDestinations: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch popular destinations",
        isLoadingDestinations: false,
      });
    }
  },

  fetchDestinationById: async (id: string) => {
    set({ isLoadingDestinations: true, error: null });

    try {
      const destination = await destinationService.getDestinationById(id);
      set({ currentDestination: destination, isLoadingDestinations: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch destination",
        isLoadingDestinations: false,
      });
    }
  },

  fetchFeaturedTours: async () => {
    set({ isLoadingTours: true, error: null });

    try {
      const featuredTours = await tourService.getFeaturedTours(10);
      set({ featuredTours, isLoadingTours: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch featured tours",
        isLoadingTours: false,
      });
    }
  },

  fetchTourById: async (id: string) => {
    set({ isLoadingTours: true, error: null });

    try {
      const tour = await tourService.getTourById(id);
      set({ currentTour: tour, isLoadingTours: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch tour",
        isLoadingTours: false,
      });
    }
  },

  searchDestinations: async (query: string) => {
    set({ isLoadingDestinations: true, error: null });

    try {
      const results = await destinationService.searchDestinations(query);
      set({ isLoadingDestinations: false });
      return results;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Search failed",
        isLoadingDestinations: false,
      });
      return [];
    }
  },

  searchTours: async (query: string) => {
    set({ isLoadingTours: true, error: null });

    try {
      const results = await tourService.searchTours(query);
      set({ isLoadingTours: false });
      return results;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Search failed",
        isLoadingTours: false,
      });
      return [];
    }
  },

  clearError: () => set({ error: null }),

  clearCurrentDestination: () => set({ currentDestination: null }),

  clearCurrentTour: () => set({ currentTour: null }),
}));
