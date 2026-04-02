import type { PaginatedResponse, PaginationParams } from "@/types/api";
import type {
    Booking,
    CreateBookingPayload,
    UpdateBookingPayload,
} from "@/types/booking";
import { apiClient } from "./api-client";

export const bookingService = {
  /**
   * Fetch user's bookings with pagination
   */
  getMyBookings: async (
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<Booking>> => {
    return apiClient.get<PaginatedResponse<Booking>>("/bookings/me", {
      params: pagination as Record<
        string,
        string | number | boolean | undefined
      >,
    });
  },

  /**
   * Fetch a single booking by ID
   */
  getBookingById: async (id: string): Promise<Booking> => {
    return apiClient.get<Booking>(`/bookings/${id}`);
  },

  /**
   * Create a new booking
   */
  createBooking: async (payload: CreateBookingPayload): Promise<Booking> => {
    return apiClient.post<Booking>("/bookings", payload);
  },

  /**
   * Update an existing booking
   */
  updateBooking: async (
    id: string,
    payload: UpdateBookingPayload,
  ): Promise<Booking> => {
    return apiClient.patch<Booking>(`/bookings/${id}`, payload);
  },

  /**
   * Cancel a booking
   */
  cancelBooking: async (id: string): Promise<Booking> => {
    return apiClient.patch<Booking>(`/bookings/${id}/cancel`);
  },

  /**
   * Get upcoming bookings
   */
  getUpcomingBookings: async (): Promise<Booking[]> => {
    return apiClient.get<Booking[]>("/bookings/me/upcoming");
  },

  /**
   * Get past bookings
   */
  getPastBookings: async (
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<Booking>> => {
    return apiClient.get<PaginatedResponse<Booking>>("/bookings/me/past", {
      params: pagination as Record<
        string,
        string | number | boolean | undefined
      >,
    });
  },
};
