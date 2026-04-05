import { Colors } from "@/constants/theme";
import { useAuthStore } from "@/store/auth-store";
import { useBookingStore } from "@/store/booking-store";
import type { Booking } from "@/types/booking";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Dummy booking data
const DUMMY_BOOKINGS: Booking[] = [
  {
    id: "BK001",
    userId: "user123",
    tourPackageId: "pkg001",
    tourPackage: {
      id: "pkg001",
      title: "Bali Paradise Adventure",
      destinationName: "Bali, Indonesia",
      imageUrl:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80",
    },
    startDate: "2026-05-15",
    endDate: "2026-05-20",
    numberOfTravelers: 2,
    totalPrice: 15000000,
    currency: "IDR",
    status: "confirmed",
    createdAt: "2026-04-01",
    updatedAt: "2026-04-01",
    paymentStatus: "paid",
  },
  {
    id: "BK002",
    userId: "user123",
    tourPackageId: "pkg002",
    tourPackage: {
      id: "pkg002",
      title: "Raja Ampat Diving Expedition",
      destinationName: "Raja Ampat, Papua",
      imageUrl:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80",
    },
    startDate: "2026-06-10",
    endDate: "2026-06-17",
    numberOfTravelers: 4,
    totalPrice: 32000000,
    currency: "IDR",
    status: "pending",
    createdAt: "2026-04-03",
    updatedAt: "2026-04-03",
    paymentStatus: "pending",
  },
  {
    id: "BK003",
    userId: "user123",
    tourPackageId: "pkg003",
    tourPackage: {
      id: "pkg003",
      title: "Komodo Island Explorer",
      destinationName: "Komodo, NTT",
      imageUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    },
    startDate: "2026-03-20",
    endDate: "2026-03-24",
    numberOfTravelers: 3,
    totalPrice: 18500000,
    currency: "IDR",
    status: "completed",
    createdAt: "2026-02-15",
    updatedAt: "2026-02-15",
    paymentStatus: "paid",
  },
  {
    id: "BK004",
    userId: "user123",
    tourPackageId: "pkg004",
    tourPackage: {
      id: "pkg004",
      title: "Yogyakarta Cultural Tour",
      destinationName: "Yogyakarta, Java",
      imageUrl:
        "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80",
    },
    startDate: "2026-04-20",
    endDate: "2026-04-23",
    numberOfTravelers: 2,
    totalPrice: 8500000,
    currency: "IDR",
    status: "confirmed",
    createdAt: "2026-03-25",
    updatedAt: "2026-03-25",
    paymentStatus: "paid",
  },
  {
    id: "BK005",
    userId: "user123",
    tourPackageId: "pkg005",
    tourPackage: {
      id: "pkg005",
      title: "Lombok Beach Getaway",
      destinationName: "Lombok, NTB",
      imageUrl:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80",
    },
    startDate: "2026-07-05",
    endDate: "2026-07-10",
    numberOfTravelers: 3,
    totalPrice: 12000000,
    currency: "IDR",
    status: "confirmed",
    createdAt: "2026-03-28",
    updatedAt: "2026-03-28",
    paymentStatus: "paid",
  },
  {
    id: "BK006",
    userId: "user123",
    tourPackageId: "pkg006",
    tourPackage: {
      id: "pkg006",
      title: "Bromo Sunrise Trek",
      destinationName: "Mount Bromo, East Java",
      imageUrl:
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=400&q=80",
    },
    startDate: "2026-08-12",
    endDate: "2026-08-15",
    numberOfTravelers: 4,
    totalPrice: 9500000,
    currency: "IDR",
    status: "confirmed",
    createdAt: "2026-04-02",
    updatedAt: "2026-04-02",
    paymentStatus: "paid",
  },
  {
    id: "BK007",
    userId: "user123",
    tourPackageId: "pkg007",
    tourPackage: {
      id: "pkg007",
      title: "Sumatra Wildlife Safari",
      destinationName: "Sumatra, Indonesia",
      imageUrl:
        "https://images.unsplash.com/photo-1549366021-9f761d450615?w=400&q=80",
    },
    startDate: "2026-09-18",
    endDate: "2026-09-25",
    numberOfTravelers: 2,
    totalPrice: 22000000,
    currency: "IDR",
    status: "confirmed",
    createdAt: "2026-03-30",
    updatedAt: "2026-03-30",
    paymentStatus: "paid",
  },
  {
    id: "BK008",
    userId: "user123",
    tourPackageId: "pkg008",
    tourPackage: {
      id: "pkg008",
      title: "Wakatobi Diving Paradise",
      destinationName: "Wakatobi, Southeast Sulawesi",
      imageUrl:
        "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&q=80",
    },
    startDate: "2026-10-05",
    endDate: "2026-10-12",
    numberOfTravelers: 3,
    totalPrice: 28000000,
    currency: "IDR",
    status: "confirmed",
    createdAt: "2026-04-01",
    updatedAt: "2026-04-01",
    paymentStatus: "paid",
  },
];

interface BookingCardProps {
  booking: Booking;
  onPress: (booking: Booking) => void;
  isHorizontal?: boolean;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case "confirmed":
      return "#4CAF50";
    case "pending":
      return "#FF9800";
    case "cancelled":
      return "#F44336";
    case "completed":
      return "#2196F3";
    default:
      return "#999";
  }
};

const getStatusEmoji = (status: string): string => {
  switch (status) {
    case "confirmed":
      return "✅";
    case "pending":
      return "⏳";
    case "cancelled":
      return "❌";
    case "completed":
      return "🎉";
    default:
      return "📋";
  }
};

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onPress,
  isHorizontal,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <TouchableOpacity
      style={[styles.card, isHorizontal && styles.horizontalCard]}
      onPress={() => onPress(booking)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: booking.tourPackage.imageUrl }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(booking.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {getStatusEmoji(booking.status)} {booking.status.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.cardTitle} numberOfLines={2}>
          {booking.tourPackage.title}
        </Text>
        <Text style={styles.destination} numberOfLines={1}>
          📍 {booking.tourPackage.destinationName}
        </Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📅 Travel Date:</Text>
            <Text style={styles.detailValue}>
              {formatDate(booking.startDate)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>👥 Travelers:</Text>
            <Text style={styles.detailValue}>{booking.numberOfTravelers}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>💰 Total:</Text>
            <Text style={styles.priceValue}>
              {booking.currency} {booking.totalPrice.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const BookingsScreen: React.FC = () => {
  const {
    bookings,
    upcomingBookings,
    isLoading,
    fetchMyBookings,
    fetchUpcomingBookings,
  } = useBookingStore();

  const { isAuthenticated } = useAuthStore();

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("🔒 User not authenticated, redirecting to login...");
      router.replace("/login" as any);
    }
  }, [isAuthenticated]);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Use dummy data for now
  const displayBookings = DUMMY_BOOKINGS;
  const displayUpcoming = DUMMY_BOOKINGS.filter(
    (b) => b.status === "confirmed" && new Date(b.startDate) > new Date(),
  );

  useEffect(() => {
    // fetchMyBookings();
    // fetchUpcomingBookings();
  }, []);

  const handleBookingPress = (booking: Booking) => {
    router.push({
      pathname: "/booking-detail" as any,
      params: { id: booking.id },
    });
  };

  const renderBooking = ({ item }: { item: Booking }) => (
    <BookingCard booking={item} onPress={handleBookingPress} />
  );

  const renderHorizontalBooking = ({ item }: { item: Booking }) => (
    <BookingCard booking={item} onPress={handleBookingPress} isHorizontal />
  );

  const renderHeader = () => {
    if (displayUpcoming.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Trips</Text>
        <FlatList
          horizontal
          data={displayUpcoming}
          renderItem={renderHorizontalBooking}
          keyExtractor={(item) => `upcoming-${item.id}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
        <Text style={styles.sectionTitle}>All Bookings</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      <FlatList
        data={displayBookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshing={false}
        onRefresh={() => {
          // fetchMyBookings();
          // fetchUpcomingBookings();
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>✈️</Text>
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptyText}>
              Start exploring and book your first adventure!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F3FD",
  },
  header: {
    padding: 16,
    backgroundColor: "#F0F3FD",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.primary,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  horizontalList: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  horizontalCard: {
    width: 320,
    marginHorizontal: 0,
    marginRight: 16,
  },
  cardImage: {
    width: "100%",
    height: 160,
  },
  cardContent: {
    padding: 12,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 4,
  },
  destination: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 13,
    color: "#666",
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2196F3",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
