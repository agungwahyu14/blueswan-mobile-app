import { useBookingStore } from "@/store/booking-store";
import type { Booking } from "@/types/booking";
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

interface BookingCardProps {
  booking: Booking;
  onPress: (booking: Booking) => void;
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

const BookingCard: React.FC<BookingCardProps> = ({ booking, onPress }) => {
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
      style={styles.card}
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

  useEffect(() => {
    fetchMyBookings();
    fetchUpcomingBookings();
  }, [fetchMyBookings, fetchUpcomingBookings]);

  const handleBookingPress = (booking: Booking) => {
    // Navigate to booking details
    console.log("Navigate to booking:", booking.id);
  };

  const renderBooking = ({ item }: { item: Booking }) => (
    <BookingCard booking={item} onPress={handleBookingPress} />
  );

  const renderHeader = () => {
    if (upcomingBookings.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Trips</Text>
        <FlatList
          horizontal
          data={upcomingBookings}
          renderItem={renderBooking}
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
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={() => {
          fetchMyBookings();
          fetchUpcomingBookings();
        }}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>✈️</Text>
              <Text style={styles.emptyTitle}>No bookings yet</Text>
              <Text style={styles.emptyText}>
                Start exploring and book your first adventure!
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
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
    color: "#333",
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
    color: "#333",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
