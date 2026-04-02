export interface Booking {
  id: string;
  userId: string;
  tourPackageId: string;
  tourPackage: {
    id: string;
    title: string;
    destinationName: string;
    imageUrl: string;
  };
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  numberOfTravelers: number;
  totalPrice: number;
  currency: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

export interface CreateBookingPayload {
  tourPackageId: string;
  startDate: string;
  numberOfTravelers: number;
  specialRequests?: string;
}

export interface UpdateBookingPayload {
  numberOfTravelers?: number;
  specialRequests?: string;
  status?: BookingStatus;
}
