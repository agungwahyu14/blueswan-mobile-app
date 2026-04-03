import type {
    TransportDetailResponse,
    TransportsResponse,
} from "@/types/transport";
import { apiClient } from "./api-client";

interface GetTransportsParams {
  transport_type?: string;
  vehicle_type_id?: string;
  search?: string;
}

export const transportService = {
  /**
   * Get all transports with optional filters
   */
  async getTransports(
    params?: GetTransportsParams,
  ): Promise<TransportsResponse> {
    const cleanParams: Record<string, string> = {};

    if (params?.transport_type && params.transport_type.trim() !== "") {
      cleanParams.transport_type = params.transport_type.trim();
    }
    if (params?.vehicle_type_id && params.vehicle_type_id.trim() !== "") {
      cleanParams.vehicle_type_id = params.vehicle_type_id.trim();
    }
    if (params?.search && params.search.trim() !== "") {
      cleanParams.search = params.search.trim();
    }

    return apiClient.getFullResponse<TransportsResponse>("/api/transports", {
      params: cleanParams,
    });
  },

  /**
   * Get transport by ID
   */
  async getTransportById(id: string): Promise<TransportDetailResponse> {
    return apiClient.getFullResponse<TransportDetailResponse>(
      `/api/transports/${id}`,
    );
  },
};
