import type {
    GalleriesResponse,
    HeroResponse,
    PromosResponse,
} from "@/types/home";
import { apiClient } from "./api-client";

export const homeService = {
  /**
   * Get hero section
   */
  async getHero(): Promise<HeroResponse> {
    return apiClient.getFullResponse<HeroResponse>("/api/home-page/hero");
  },

  /**
   * Get promo banners
   */
  async getPromos(): Promise<PromosResponse> {
    return apiClient.getFullResponse<PromosResponse>("/api/promo-banners");
  },

  /**
   * Get galleries
   */
  async getGalleries(): Promise<GalleriesResponse> {
    return apiClient.getFullResponse<GalleriesResponse>("/api/galleries");
  },
};
