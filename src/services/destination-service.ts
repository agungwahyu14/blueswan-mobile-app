import type { DestinationsResponse } from "@/types/destination";
import { apiClient } from "./api-client";

export const destinationService = {
  /**
   * Get all destinations
   */
  async getDestinations(): Promise<DestinationsResponse> {
    return apiClient.getFullResponse<DestinationsResponse>("/api/destinations");
  },
};
