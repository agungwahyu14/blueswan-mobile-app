import type {
    AuthCredentials,
    AuthResponse,
    RegisterPayload,
    UpdateUserPayload,
    User,
} from "@/types/user";
import { apiClient } from "./api-client";

export const authService = {
  /**
   * Login with email and password
   */
  login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/api/auth/login",
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
      "/api/auth/register",
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
    try {
      await apiClient.post<void>("/api/auth/logout");
    } finally {
      // Always clear token even if API call fails
      apiClient.setAuthToken(null);
    }
  },

  /**
   * Get current user data
   */
  me: async (): Promise<User> => {
    const response = await apiClient.get<User>("/api/auth/me");
    return response;
  },

  /**
   * Update user profile
   */
  updateProfile: async (payload: UpdateUserPayload): Promise<User> => {
    const response = await apiClient.put<User>("/api/auth/profile", payload);
    return response;
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/api/auth/refresh", {
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
    await apiClient.post<void>("/api/auth/password-reset/request", { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post<void>("/api/auth/password-reset/confirm", {
      token,
      newPassword,
    });
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post<void>("/api/auth/verify-email", { token });
  },

  /**
   * Change user password
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<void> => {
    await apiClient.put<void>("/api/auth/change-password", {
      currentPassword,
      newPassword,
    });
  },
};
