import { bookingService } from "@/services/booking-service";
import type { Booking } from "@/types/booking";
import { create } from "zustand";

interface BookingState {
  bookings: Booking[];
  upcomingBookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
}

interface BookingActions {
  fetchMyBookings: () => Promise<void>;
  fetchUpcomingBookings: () => Promise<void>;
  fetchBookingById: (id: string) => Promise<void>;
  createBooking: (
    tourPackageId: string,
    startDate: string,
    numberOfTravelers: number,
    specialRequests?: string,
  ) => Promise<Booking>;
  cancelBooking: (id: string) => Promise<void>;
  clearError: () => void;
  clearCurrentBooking: () => void;
}

type BookingStore = BookingState & BookingActions;

export const useBookingStore = create<BookingStore>((set) => ({
  // State
  bookings: [],
  upcomingBookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,

  // Actions
  fetchMyBookings: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await bookingService.getMyBookings({
        page: 1,
        limit: 50,
      });
      set({ bookings: response.data, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch bookings",
        isLoading: false,
      });
    }
  },

  fetchUpcomingBookings: async () => {
    set({ isLoading: true, error: null });

    try {
      const upcomingBookings = await bookingService.getUpcomingBookings();
      set({ upcomingBookings, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch upcoming bookings",
        isLoading: false,
      });
    }
  },

  fetchBookingById: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const booking = await bookingService.getBookingById(id);
      set({ currentBooking: booking, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch booking",
        isLoading: false,
      });
    }
  },

  createBooking: async (
    tourPackageId: string,
    startDate: string,
    numberOfTravelers: number,
    specialRequests?: string,
  ) => {
    set({ isLoading: true, error: null });

    try {
      const booking = await bookingService.createBooking({
        tourPackageId,
        startDate,
        numberOfTravelers,
        specialRequests,
      });

      set((state) => ({
        bookings: [booking, ...state.bookings],
        currentBooking: booking,
        isLoading: false,
      }));

      return booking;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to create booking",
        isLoading: false,
      });
      throw error;
    }
  },

  cancelBooking: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const cancelledBooking = await bookingService.cancelBooking(id);

      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking.id === id ? cancelledBooking : booking,
        ),
        upcomingBookings: state.upcomingBookings.filter(
          (booking) => booking.id !== id,
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to cancel booking",
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  clearCurrentBooking: () => set({ currentBooking: null }),
}));
