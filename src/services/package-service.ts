import type { Package, PackagesResponse } from "@/types/package";
import { apiClient } from "./api-client";

interface GetPackagesParams {
  page?: number;
  limit?: number;
  search?: string;
  destination_id?: string;
  category_id?: string;
  type?: string;
  min_price?: number;
  max_price?: number;
  fitness_level?: "easy" | "moderate" | "hard";
}

export const packageService = {
  /**
   * Get packages with filters
   */
  async getPackages(params?: GetPackagesParams): Promise<PackagesResponse> {
    const cleanParams: Record<string, string | number> = {};

    if (params) {
      if (params.page !== undefined && params.page !== null) {
        cleanParams.page = params.page;
      }
      if (params.limit !== undefined && params.limit !== null) {
        cleanParams.limit = params.limit;
      }
      if (params.search && params.search.trim() !== "") {
        cleanParams.search = params.search.trim();
      }
      if (params.destination_id && params.destination_id.trim() !== "") {
        cleanParams.destination_id = params.destination_id.trim();
      }
      if (params.category_id && params.category_id.trim() !== "") {
        cleanParams.category_id = params.category_id.trim();
      }
      if (params.type && params.type.trim() !== "") {
        cleanParams.type = params.type.trim();
      }
      if (params.min_price !== undefined && params.min_price !== null) {
        cleanParams.min_price = params.min_price;
      }
      if (params.max_price !== undefined && params.max_price !== null) {
        cleanParams.max_price = params.max_price;
      }
      if (params.fitness_level && params.fitness_level.trim() !== "") {
        cleanParams.fitness_level = params.fitness_level.trim();
      }
    }

    return apiClient.getFullResponse<PackagesResponse>("/api/packages", {
      params: cleanParams,
    });
  },

  /**
   * Get package by slug
   */
  async getPackageBySlug(slug: string): Promise<Package> {
    return apiClient.get<Package>(`/api/packages/slug/${slug}`);
  },

  /**
   * Get package by ID
   */
  async getPackageById(id: string): Promise<Package> {
    return apiClient.get<Package>(`/api/packages/${id}`);
  },
};
