import type { ApiError, ApiResponse } from "@/types/api";
import { Platform } from "react-native";

// API Base URL configuration
// Untuk iOS simulator: localhost bisa digunakan
// Untuk Android emulator: gunakan 10.0.2.2 (untuk AVD) atau IP lokal komputer
// Untuk device fisik: gunakan IP address komputer di network yang sama
const getApiBaseUrl = () => {
  if (__DEV__) {
    // Development environment
    if (Platform.OS === "android") {
      return "http://192.168.1.3:3000"; // Android emulator
      // Atau gunakan IP lokal: return "http://192.168.x.x:3000";
    }
    return "http://192.168.1.3:3000"; // iOS simulator atau web
  }
  // Production environment
  return "https://api.blueswan.com"; // Ganti dengan production URL
};

const API_BASE_URL = getApiBaseUrl();

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseURL: string;
  private authToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  private buildURL(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): string {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      const errorData: ApiError = isJson
        ? await response.json()
        : {
            success: false,
            error: "Request failed",
            message: response.statusText,
            statusCode: response.status,
          };

      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    if (isJson) {
      const data: ApiResponse<T> = await response.json();
      return data.data;
    }

    throw new Error("Invalid response format");
  }

  private async handleFullResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      let errorData: ApiError;

      try {
        errorData = isJson
          ? await response.json()
          : {
              success: false,
              error: "Request failed",
              message: response.statusText,
              statusCode: response.status,
            };
      } catch (parseError) {
        errorData = {
          success: false,
          error: "Parse error",
          message: "Failed to parse error response",
          statusCode: response.status,
        };
      }

      if (__DEV__) {
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          errorData,
        });
      }

      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    if (isJson) {
      const data: T = await response.json();
      return data;
    }

    throw new Error("Invalid response format");
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    try {
      const url = this.buildURL(endpoint, config?.params);

      const response = await fetch(url, {
        ...config,
        method: "GET",
        headers: this.getHeaders(),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (
        error instanceof TypeError &&
        error.message.includes("Network request failed")
      ) {
        throw new Error(
          "Tidak dapat terhubung ke server. Pastikan server berjalan dan cek koneksi internet Anda.",
        );
      }
      throw error;
    }
  }

  async getFullResponse<T>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<T> {
    try {
      const url = this.buildURL(endpoint, config?.params);

      if (__DEV__) {
        console.log("API Request:", url);
        console.log("Params:", config?.params);
      }

      const response = await fetch(url, {
        ...config,
        method: "GET",
        headers: this.getHeaders(),
      });

      return this.handleFullResponse<T>(response);
    } catch (error) {
      if (
        error instanceof TypeError &&
        error.message.includes("Network request failed")
      ) {
        throw new Error(
          "Tidak dapat terhubung ke server. Pastikan server berjalan dan cek koneksi internet Anda.",
        );
      }
      throw error;
    }
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    try {
      const url = this.buildURL(endpoint, config?.params);

      const response = await fetch(url, {
        ...config,
        method: "POST",
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (
        error instanceof TypeError &&
        error.message.includes("Network request failed")
      ) {
        throw new Error(
          "Tidak dapat terhubung ke server. Pastikan server berjalan dan cek koneksi internet Anda.",
        );
      }
      throw error;
    }
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    try {
      const url = this.buildURL(endpoint, config?.params);

      const response = await fetch(url, {
        ...config,
        method: "PUT",
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (
        error instanceof TypeError &&
        error.message.includes("Network request failed")
      ) {
        throw new Error(
          "Tidak dapat terhubung ke server. Pastikan server berjalan dan cek koneksi internet Anda.",
        );
      }
      throw error;
    }
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    try {
      const url = this.buildURL(endpoint, config?.params);

      const response = await fetch(url, {
        ...config,
        method: "PATCH",
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (
        error instanceof TypeError &&
        error.message.includes("Network request failed")
      ) {
        throw new Error(
          "Tidak dapat terhubung ke server. Pastikan server berjalan dan cek koneksi internet Anda.",
        );
      }
      throw error;
    }
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    try {
      const url = this.buildURL(endpoint, config?.params);

      const response = await fetch(url, {
        ...config,
        method: "DELETE",
        headers: this.getHeaders(),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (
        error instanceof TypeError &&
        error.message.includes("Network request failed")
      ) {
        throw new Error(
          "Tidak dapat terhubung ke server. Pastikan server berjalan dan cek koneksi internet Anda.",
        );
      }
      throw error;
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
