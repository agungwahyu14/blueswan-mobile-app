import { apiClient } from "@/services/api-client";
import { authService } from "@/services/auth-service";
import type { AuthResponse, User } from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string,
    phone: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response: AuthResponse = await authService.login({
            email,
            password,
          });

          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (
        fullName: string,
        email: string,
        password: string,
        phone: string,
      ) => {
        set({ isLoading: true, error: null });

        try {
          const response: AuthResponse = await authService.register({
            fullName,
            email,
            password,
            phone,
          });

          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Registration failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      refreshAuth: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        try {
          const response: AuthResponse =
            await authService.refreshToken(refreshToken);

          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
          });
        } catch (error) {
          // If refresh fails, logout the user
          get().logout();
          throw error;
        }
      },

      getCurrentUser: async () => {
        set({ isLoading: true, error: null });

        try {
          const user = await authService.me();
          set({
            user,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to get user data",
            isLoading: false,
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),

      setUser: (user: User) => set({ user }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Restore API token on hydration
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          apiClient.setAuthToken(state.token);
        }
      },
    },
  ),
);
