import type { UpdateUserPayload, User } from "@/types/user";
import { apiClient } from "./api-client";

export const userService = {
  /**
   * Fetch current user profile
   */
  getProfile: async (): Promise<User> => {
    return apiClient.get<User>("/users/me");
  },

  /**
   * Update current user profile
   */
  updateProfile: async (payload: UpdateUserPayload): Promise<User> => {
    return apiClient.patch<User>("/users/me", payload);
  },

  /**
   * Upload user avatar
   */
  uploadAvatar: async (imageUri: string): Promise<User> => {
    // Create FormData for file upload
    const formData = new FormData();

    // Extract file extension and create file object
    const filename = imageUri.split("/").pop() || "avatar.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("avatar", {
      uri: imageUri,
      name: filename,
      type,
    } as unknown as Blob);

    const response = await fetch(`${apiClient["baseURL"]}/users/me/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiClient.getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload avatar");
    }

    const data = await response.json();
    return data.data;
  },

  /**
   * Delete user avatar
   */
  deleteAvatar: async (): Promise<User> => {
    return apiClient.delete<User>("/users/me/avatar");
  },

  /**
   * Change user password
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<void> => {
    await apiClient.post<void>("/users/me/change-password", {
      currentPassword,
      newPassword,
    });
  },

  /**
   * Delete user account
   */
  deleteAccount: async (): Promise<void> => {
    await apiClient.delete<void>("/users/me");
  },
};
