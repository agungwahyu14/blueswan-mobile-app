import type { PaginatedResponse, PaginationParams } from "@/types/api";
import type { TourFilters, TourPackage } from "@/types/tour";
import { apiClient } from "./api-client";

export const tourService = {
  /**
   * Fetch paginated list of tour packages with optional filters
   */
  getTours: async (
    filters?: TourFilters,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<TourPackage>> => {
    return apiClient.get<PaginatedResponse<TourPackage>>("/tours", {
      params: {
        ...filters,
        ...pagination,
      },
    });
  },

  /**
   * Fetch a single tour package by ID
   */
  getTourById: async (id: string): Promise<TourPackage> => {
    return apiClient.get<TourPackage>(`/tours/${id}`);
  },

  /**
   * Fetch tours by destination ID
   */
  getToursByDestination: async (
    destinationId: string,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<TourPackage>> => {
    return apiClient.get<PaginatedResponse<TourPackage>>("/tours", {
      params: {
        destinationId,
        ...pagination,
      },
    });
  },

  /**
   * Fetch featured tour packages
   */
  getFeaturedTours: async (limit: number = 10): Promise<TourPackage[]> => {
    return apiClient.get<TourPackage[]>("/tours/featured", {
      params: { limit },
    });
  },

  /**
   * Search tour packages by query string
   */
  searchTours: async (query: string): Promise<TourPackage[]> => {
    return apiClient.get<TourPackage[]>("/tours/search", {
      params: { q: query },
    });
  },
};
