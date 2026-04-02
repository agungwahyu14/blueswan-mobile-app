import type { PaginatedResponse, PaginationParams } from "@/types/api";
import type { Destination, DestinationFilters } from "@/types/destination";
import { apiClient } from "./api-client";

export const destinationService = {
  /**
   * Fetch paginated list of destinations with optional filters
   */
  getDestinations: async (
    filters?: DestinationFilters,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<Destination>> => {
    return apiClient.get<PaginatedResponse<Destination>>("/destinations", {
      params: {
        ...filters,
        ...pagination,
      },
    });
  },

  /**
   * Fetch a single destination by ID
   */
  getDestinationById: async (id: string): Promise<Destination> => {
    return apiClient.get<Destination>(`/destinations/${id}`);
  },

  /**
   * Fetch popular destinations
   */
  getPopularDestinations: async (
    limit: number = 10,
  ): Promise<Destination[]> => {
    return apiClient.get<Destination[]>("/destinations/popular", {
      params: { limit },
    });
  },

  /**
   * Search destinations by query string
   */
  searchDestinations: async (query: string): Promise<Destination[]> => {
    return apiClient.get<Destination[]>("/destinations/search", {
      params: { q: query },
    });
  },
};
