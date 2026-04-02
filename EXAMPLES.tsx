/**
 * Example usage patterns for Blue Swan Travel Agent App
 *
 * This file demonstrates how to use the various services, stores, and hooks
 * in the application. Copy these patterns into your components as needed.
 */

// ============================================================================
// AUTHENTICATION EXAMPLES
// ============================================================================

/**
 * Example 1: Login Screen
 */
import { useAuthStore } from "@/store/auth-store";
import { useState } from "react";
import { Alert } from "react-native";

export function LoginExample() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login(email, password);
      // Navigation will happen automatically via auth state change
      console.log("Login successful");
    } catch (err) {
      Alert.alert("Login Failed", error || "Please try again");
    }
  };

  return { email, setEmail, password, setPassword, handleLogin, isLoading };
}

/**
 * Example 2: Register Screen
 */
export function RegisterExample() {
  const { register, isLoading } = useAuthStore();

  const handleRegister = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => {
    try {
      await register(firstName, lastName, email, password);
      console.log("Registration successful");
    } catch (err) {
      Alert.alert("Registration Failed", "Please try again");
    }
  };

  return { handleRegister, isLoading };
}

/**
 * Example 3: Logout
 */
export function LogoutExample() {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: async () => await logout() },
    ]);
  };

  return { handleLogout };
}

// ============================================================================
// DESTINATIONS EXAMPLES
// ============================================================================

/**
 * Example 4: Destinations List with Pagination
 */
import { useDestinations } from "@/hooks/use-destinations";

export function DestinationsListExample() {
  const { destinations, isLoading, hasMore, loadMore, refresh } =
    useDestinations({
      autoFetch: true,
      page: 1,
      limit: 20,
    });

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      loadMore();
    }
  };

  return {
    destinations,
    isLoading,
    hasMore,
    handleLoadMore,
    handleRefresh: refresh,
  };
}

/**
 * Example 5: Destination Detail
 */
import { useDestination } from "@/hooks/use-destinations";

export function DestinationDetailExample(destinationId: string) {
  const { destination, isLoading, error, refresh } =
    useDestination(destinationId);

  return { destination, isLoading, error, refresh };
}

/**
 * Example 6: Search Destinations
 */
import { useSearch } from "@/hooks/use-search";
import { destinationService } from "@/services/destination-service";

export function DestinationSearchExample() {
  const { query, results, isSearching, search, clearSearch } = useSearch({
    searchFn: destinationService.searchDestinations,
    minQueryLength: 2,
    debounceMs: 300,
  });

  const handleSearch = (text: string) => {
    if (text.length >= 2) {
      search(text);
    } else {
      clearSearch();
    }
  };

  return { query, results, isSearching, handleSearch, clearSearch };
}

// ============================================================================
// TOURS EXAMPLES
// ============================================================================

/**
 * Example 7: Tours List with Filters
 */
import { useTours } from "@/hooks/use-tours";

export function ToursListExample(destinationId?: string) {
  const { tours, isLoading, hasMore, loadMore, refresh } = useTours({
    autoFetch: true,
    filters: {
      destinationId,
      minPrice: 500,
      maxPrice: 5000,
      difficulty: "moderate",
    },
    limit: 20,
  });

  return { tours, isLoading, hasMore, loadMore, refresh };
}

/**
 * Example 8: Tour Detail
 */
import { useTour } from "@/hooks/use-tours";

export function TourDetailExample(tourId: string) {
  const { tour, isLoading, error, refresh } = useTour(tourId);

  return { tour, isLoading, error, refresh };
}

/**
 * Example 9: Search Tours
 */
import { tourService } from "@/services/tour-service";

export function TourSearchExample() {
  const { results, isSearching, search } = useSearch({
    searchFn: tourService.searchTours,
    minQueryLength: 2,
  });

  return { results, isSearching, search };
}

// ============================================================================
// BOOKINGS EXAMPLES
// ============================================================================

/**
 * Example 10: Create Booking
 */
import { useBookingStore } from "@/store/booking-store";

export function CreateBookingExample() {
  const { createBooking, isLoading } = useBookingStore();

  const handleCreateBooking = async (
    tourPackageId: string,
    startDate: string,
    numberOfTravelers: number,
    specialRequests?: string,
  ) => {
    try {
      const booking = await createBooking(
        tourPackageId,
        startDate,
        numberOfTravelers,
        specialRequests,
      );

      Alert.alert("Success", "Booking created successfully!");
      return booking;
    } catch (err) {
      Alert.alert("Error", "Failed to create booking");
      throw err;
    }
  };

  return { handleCreateBooking, isLoading };
}

/**
 * Example 11: View Bookings
 */
export function BookingsListExample() {
  const { bookings, upcomingBookings, isLoading, fetchMyBookings } =
    useBookingStore();

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  return { bookings, upcomingBookings, isLoading, refresh: fetchMyBookings };
}

/**
 * Example 12: Cancel Booking
 */
export function CancelBookingExample() {
  const { cancelBooking, isLoading } = useBookingStore();

  const handleCancelBooking = (bookingId: string) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelBooking(bookingId);
              Alert.alert("Success", "Booking cancelled");
            } catch (err) {
              Alert.alert("Error", "Failed to cancel booking");
            }
          },
        },
      ],
    );
  };

  return { handleCancelBooking, isLoading };
}

// ============================================================================
// USER PROFILE EXAMPLES
// ============================================================================

/**
 * Example 13: Get User Profile
 */
import { useAsync } from "@/hooks/use-async";
import { userService } from "@/services/user-service";
import { useEffect } from "react";

export function ProfileExample() {
  const {
    execute,
    data: user,
    isLoading,
    error,
  } = useAsync(userService.getProfile);

  useEffect(() => {
    execute();
  }, [execute]);

  return { user, isLoading, error, refresh: execute };
}

/**
 * Example 14: Update Profile
 */
export function UpdateProfileExample() {
  const { execute: updateProfile, isLoading } = useAsync(
    userService.updateProfile,
  );
  const { setUser } = useAuthStore();

  const handleUpdateProfile = async (updates: UpdateUserPayload) => {
    try {
      const updatedUser = await updateProfile(updates);
      setUser(updatedUser); // Update auth store
      Alert.alert("Success", "Profile updated successfully");
    } catch (err) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  return { handleUpdateProfile, isLoading };
}

/**
 * Example 15: Upload Avatar
 */
import * as ImagePicker from "expo-image-picker";

export function UploadAvatarExample() {
  const { execute: uploadAvatar, isLoading } = useAsync(
    userService.uploadAvatar,
  );
  const { setUser } = useAuthStore();

  const handlePickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need camera roll permissions");
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        const updatedUser = await uploadAvatar(result.assets[0].uri);
        setUser(updatedUser);
        Alert.alert("Success", "Avatar updated");
      } catch (err) {
        Alert.alert("Error", "Failed to upload avatar");
      }
    }
  };

  return { handlePickImage, isLoading };
}

// ============================================================================
// ADVANCED PATTERNS
// ============================================================================

/**
 * Example 16: Optimistic UI Updates
 */
export function OptimisticBookingExample() {
  const [localBookings, setLocalBookings] = useState<Booking[]>([]);
  const { createBooking } = useBookingStore();

  const handleOptimisticBooking = async (bookingData: CreateBookingPayload) => {
    // Create temporary booking with optimistic ID
    const tempBooking: Booking = {
      id: "temp-" + Date.now(),
      ...bookingData,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // ... other required fields
    };

    // Immediately update UI
    setLocalBookings((prev) => [tempBooking, ...prev]);

    try {
      // Create actual booking
      const realBooking = await createBooking(
        bookingData.tourPackageId,
        bookingData.startDate,
        bookingData.numberOfTravelers,
        bookingData.specialRequests,
      );

      // Replace temp booking with real one
      setLocalBookings((prev) =>
        prev.map((b) => (b.id === tempBooking.id ? realBooking : b)),
      );
    } catch (err) {
      // Remove temp booking on error
      setLocalBookings((prev) => prev.filter((b) => b.id !== tempBooking.id));
      Alert.alert("Error", "Failed to create booking");
    }
  };

  return { localBookings, handleOptimisticBooking };
}

/**
 * Example 17: Infinite Scroll Pattern
 */
import { FlatList } from "react-native";

export function InfiniteScrollExample() {
  const { destinations, loadMore, hasMore, isLoading } = useDestinations();
  const [page, setPage] = useState(1);

  const handleEndReached = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
      loadMore();
    }
  };

  return (
    <FlatList
      data={destinations}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
    />
  );
}

/**
 * Example 18: Real-time Search with Debounce
 */
import { useCallback } from "react";

export function DebouncedSearchExample() {
  const [searchQuery, setSearchQuery] = useState("");
  const { search, results, isSearching } = useSearch({
    searchFn: destinationService.searchDestinations,
    minQueryLength: 2,
    debounceMs: 300,
  });

  // Debounced search function
  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchQuery(text);
      if (text.length >= 2) {
        search(text);
      }
    },
    [search],
  );

  return { searchQuery, handleSearchChange, results, isSearching };
}

/**
 * Example 19: Form Validation Pattern
 */
export function FormValidationExample() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateBookingForm = (data: CreateBookingPayload) => {
    const newErrors: Record<string, string> = {};

    if (!data.tourPackageId) {
      newErrors.tour = "Please select a tour package";
    }

    if (!data.startDate) {
      newErrors.date = "Please select a travel date";
    }

    if (data.numberOfTravelers < 1 || data.numberOfTravelers > 10) {
      newErrors.travelers = "Number of travelers must be between 1 and 10";
    }

    const selectedDate = new Date(data.startDate);
    const today = new Date();
    if (selectedDate < today) {
      newErrors.date = "Travel date must be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, validateBookingForm };
}

/**
 * Example 20: Error Boundary Pattern
 */
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundaryExample extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Something went wrong</Text>
            <Button
              title="Try Again"
              onPress={() => this.setState({ hasError: false })}
            />
          </View>
        )
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// TYPE IMPORTS (for reference)
// ============================================================================

import type {
    Booking,
    CreateBookingPayload,
    UpdateUserPayload
} from "@/types";

// These are just examples - use the patterns in your actual components!
