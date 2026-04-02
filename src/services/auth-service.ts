import type {
    AuthCredentials,
    AuthResponse,
    RegisterPayload,
    User
} from "@/types/user";
import { apiClient } from "./api-client";

export const authService = {
  /**
   * Login with email and password
   */
  login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials,
    );

    // Set auth token for subsequent requests
    if (response.token) {
      apiClient.setAuthToken(response.token);
    }

    return response;
  },

  /**
   * Register a new user
   */
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      payload,
    );

    // Set auth token for subsequent requests
    if (response.token) {
      apiClient.setAuthToken(response.token);
    }

    return response;
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    await apiClient.post<void>("/auth/logout");
    apiClient.setAuthToken(null);
  },

  /**
   * Get current user data
   */
  me: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/me");
    return response;
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/refresh", {
      refreshToken,
    });

    if (response.token) {
      apiClient.setAuthToken(response.token);
    }

    return response;
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post<void>("/auth/password-reset/request", { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post<void>("/auth/password-reset/confirm", {
      token,
      newPassword,
    });
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post<void>("/auth/verify-email", { token });
  },
};
