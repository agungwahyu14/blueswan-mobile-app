import type { CategoriesResponse } from "@/types/category";
import { apiClient } from "./api-client";

export const categoryService = {
  /**
   * Get all categories
   */
  async getCategories(): Promise<CategoriesResponse> {
    return apiClient.getFullResponse<CategoriesResponse>("/api/categories");
  },
};
