import { Colors } from "@/constants/theme";
import { useAuthStore } from "@/store/auth-store";
import type { Booking } from "@/types/booking";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Dummy booking data (same as in bookings-screen)
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
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
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
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
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
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
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
        "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80",
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
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
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
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80",
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
        "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80",
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
        "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80",
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

const getStatusText = (status: string): string => {
  switch (status) {
    case "confirmed":
      return "Confirmed";
    case "pending":
      return "Pending Payment";
    case "cancelled":
      return "Cancelled";
    case "completed":
      return "Completed";
    default:
      return status;
  }
};

export default function BookingDetailScreen() {
  const params = useLocalSearchParams();
  const bookingId = params.id as string;
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

  const booking = DUMMY_BOOKINGS.find((b) => b.id === bookingId);

  if (!booking) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Detail</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Booking not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDuration = () => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    return `${days} Days ${days - 1} Nights`;
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Detail</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: booking.tourPackage.imageUrl }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <View style={styles.content}>
          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(booking.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusText(booking.status)}
            </Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{booking.tourPackage.title}</Text>
          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={18}
              color={Colors.primary}
            />
            <Text style={styles.location}>
              {booking.tourPackage.destinationName}
            </Text>
          </View>

          {/* Booking Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons
                    name="receipt-outline"
                    size={20}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Booking ID</Text>
                  <Text style={styles.infoValue}>{booking.id}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Booking Date</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(booking.createdAt)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Travel Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Travel Details</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Start Date</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(booking.startDate)}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>End Date</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(booking.endDate)}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Duration</Text>
                  <Text style={styles.infoValue}>{getDuration()}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons
                    name="people-outline"
                    size={20}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Number of Travelers</Text>
                  <Text style={styles.infoValue}>
                    {booking.numberOfTravelers} Person
                    {booking.numberOfTravelers > 1 ? "s" : ""}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Payment Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons
                    name="card-outline"
                    size={20}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Payment Status</Text>
                  <Text
                    style={[
                      styles.infoValue,
                      {
                        color:
                          booking.paymentStatus === "paid"
                            ? "#4CAF50"
                            : "#FF9800",
                      },
                    ]}
                  >
                    {booking.paymentStatus.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Total Price</Text>
                <Text style={styles.priceValue}>
                  {booking.currency}{" "}
                  {booking.totalPrice.toLocaleString("id-ID")}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          {booking.status === "pending" && (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Complete Payment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Cancel Booking</Text>
              </TouchableOpacity>
            </View>
          )}

          {booking.status === "confirmed" && (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.primaryButton}>
                <Ionicons name="download-outline" size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Download Voucher</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F3FD",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#F0F3FD",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
  placeholder: {
    width: 32,
  },
  heroImage: {
    width: "100%",
    height: 250,
  },
  content: {
    padding: 16,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F0FE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
  actionButtons: {
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F44336",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F44336",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: "#999",
  },
});
