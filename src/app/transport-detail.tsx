import { transportService } from "@/services/transport-service";
import type { Transport } from "@/types/transport";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransportDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [transportData, setTransportData] = useState<Transport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTransportDetail();
    }
  }, [id]);

  const fetchTransportDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("\n🔍 Fetching transport detail for ID:", id);

      const response = await transportService.getTransportById(id);
      console.log("✅ Transport loaded:", response.data.name);

      setTransportData(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memuat detail transportasi";
      setError(errorMessage);
      console.error("❌ Error fetching transport detail:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Transportasi</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#11468F" />
          <Text style={styles.loadingText}>Memuat detail transportasi...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !transportData) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Transportasi</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
          <Text style={styles.errorText}>
            {error || "Transportasi tidak ditemukan"}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchTransportDetail}
          >
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const primaryPhoto =
    transportData.transport_photos.find((p) => p.is_primary) ||
    transportData.transport_photos[0];
  const priceIdr = parseInt(transportData.price_idr, 10);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Transportasi</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Hero Image */}
        <Image
          source={{
            uri:
              primaryPhoto?.image_url ||
              "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
          }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Photo Gallery */}
        {transportData.transport_photos.length > 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Foto Kendaraan</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.photoGallery}
            >
              {transportData.transport_photos.map((photo, index) => (
                <Image
                  key={photo.id}
                  source={{
                    uri:
                      photo.image_url ||
                      `https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=400&q=80`,
                  }}
                  style={[
                    styles.galleryPhoto,
                    index === 0 && styles.firstPhoto,
                  ]}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Main Info */}
        <View style={styles.mainInfo}>
          <Text style={styles.title}>
            {transportData.name_en || transportData.name}
          </Text>

          <View style={styles.typeRow}>
            <Ionicons name="car" size={18} color="#11468F" />
            <Text style={styles.typeText}>
              {transportData.vehicle_types.name_en ||
                transportData.vehicle_types.name}
            </Text>
          </View>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#FFB800" />
            <Text style={styles.ratingText}>
              {transportData.average_rating.toFixed(1)}
            </Text>
            <Text style={styles.reviewCount}>
              ({transportData.total_review} ulasan)
            </Text>
          </View>

          {/* Quick Info */}
          <View style={styles.quickInfo}>
            <View style={styles.quickInfoItem}>
              <Ionicons name="people" size={20} color="#11468F" />
              <Text style={styles.quickInfoLabel}>Kapasitas</Text>
              <Text style={styles.quickInfoValue}>
                {transportData.capacity} orang
              </Text>
            </View>

            <View style={styles.quickInfoItem}>
              <Ionicons name="briefcase" size={20} color="#11468F" />
              <Text style={styles.quickInfoLabel}>Bagasi</Text>
              <Text style={styles.quickInfoValue}>
                {transportData.baggage_en || transportData.baggage}
              </Text>
            </View>

            <View style={styles.quickInfoItem}>
              <Ionicons name="map" size={20} color="#11468F" />
              <Text style={styles.quickInfoLabel}>Jarak Max</Text>
              <Text style={styles.quickInfoValue}>
                {transportData.max_distance_km} km
              </Text>
            </View>
          </View>
        </View>

        {/* Vehicle Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deskripsi Kendaraan</Text>
          <Text style={styles.description}>
            {transportData.vehicle_types.description_en ||
              transportData.vehicle_types.description ||
              "Kendaraan yang nyaman untuk perjalanan Anda"}
          </Text>
        </View>

        {/* Features */}
        {transportData.transport_features.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fasilitas</Text>
            <View style={styles.featuresList}>
              {transportData.transport_features.map((feature) => (
                <View key={feature.id} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#32cc0f" />
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureName}>
                      {feature.feature_name_en || feature.feature_name}
                    </Text>
                    {feature.description_en && (
                      <Text style={styles.featureDescription}>
                        {feature.description_en || feature.description}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Area Coverage */}
        {transportData.transport_area_coverages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Area Jangkauan</Text>
            {transportData.transport_area_coverages.map((area) => (
              <View key={area.id} style={styles.areaItem}>
                <Ionicons name="location" size={18} color="#666" />
                <View style={styles.areaTextContainer}>
                  <Text style={styles.areaName}>
                    {area.area_name_en || area.area_name}
                  </Text>
                  {area.description_en && (
                    <Text style={styles.areaDescription}>
                      {area.description_en || area.description}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Additional Services */}
        {transportData.transport_additional_services.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Layanan Tambahan</Text>
            {transportData.transport_additional_services.map((service) => (
              <View key={service.id} style={styles.serviceItem}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceName}>
                    {service.service_name_en || service.service_name}
                  </Text>
                  <Text style={styles.servicePrice}>
                    +Rp{" "}
                    {parseInt(service.price_idr, 10).toLocaleString("id-ID")}
                  </Text>
                </View>
                {service.description_en && (
                  <Text style={styles.serviceDescription}>
                    {service.description_en || service.description}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Terms & Conditions */}
        {transportData.transport_terms.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Syarat & Ketentuan</Text>
            {transportData.transport_terms.map((term, index) => (
              <View key={term.id} style={styles.termItem}>
                <Text style={styles.termNumber}>{index + 1}.</Text>
                <Text style={styles.termText}>{term.term_en || term.term}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Reviews */}
        {transportData.reviews && transportData.reviews.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Ulasan ({transportData.reviews.length})
            </Text>
            {transportData.reviews.slice(0, 3).map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>{review.user.name}</Text>
                  <View style={styles.reviewRating}>
                    <Ionicons name="star" size={14} color="#FFB800" />
                    <Text style={styles.reviewRatingText}>{review.rating}</Text>
                  </View>
                </View>
                <Text style={styles.reviewText}>{review.review_text}</Text>
                <Text style={styles.reviewDate}>
                  {new Date(review.created_at).toLocaleDateString("id-ID")}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Spacing for bottom button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Price Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceLabel}>Harga mulai dari</Text>
          <Text style={styles.price}>
            Rp {priceIdr.toLocaleString("id-ID")}
          </Text>
          <Text style={styles.priceNote}>
            per {transportData.max_distance_km} km
          </Text>
        </View>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Pesan Sekarang</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
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
    marginTop: 12,
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#11468F",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  heroImage: {
    width: "100%",
    height: 300,
  },
  photoGallery: {
    marginTop: 12,
  },
  galleryPhoto: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginLeft: 12,
    backgroundColor: "#f0f0f0",
  },
  firstPhoto: {
    marginLeft: 0,
  },
  mainInfo: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 16,
    color: "#11468F",
    fontWeight: "600",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  reviewCount: {
    fontSize: 14,
    color: "#999",
  },
  quickInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  quickInfoItem: {
    alignItems: "center",
    gap: 6,
  },
  quickInfoLabel: {
    fontSize: 12,
    color: "#999",
  },
  quickInfoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  section: {
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#555",
    lineHeight: 24,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    color: "#666",
  },
  areaItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },
  areaTextContainer: {
    flex: 1,
  },
  areaName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  areaDescription: {
    fontSize: 13,
    color: "#666",
  },
  serviceItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#32cc0f",
  },
  serviceDescription: {
    fontSize: 13,
    color: "#666",
  },
  termItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },
  termNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  termText: {
    flex: 1,
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reviewRatingText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  reviewText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: "#999",
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  priceInfo: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#11468F",
  },
  priceNote: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  bookButton: {
    backgroundColor: "#32cc0f",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    marginLeft: 16,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
