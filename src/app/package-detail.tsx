import { packageService } from "@/services/package-service";
import type { Package } from "@/types/package";
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

export default function PackageDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPackageDetail();
    }
  }, [id]);

  const fetchPackageDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("\n🔍 Fetching package detail for ID:", id);

      const response = await packageService.getPackageById(id);
      console.log("✅ Package loaded:", response.name_en);

      setPackageData(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memuat detail paket";
      setError(errorMessage);
      console.error("❌ Error fetching package detail:", err);
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
          <Text style={styles.headerTitle}>Detail Paket</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#11468F" />
          <Text style={styles.loadingText}>Memuat detail paket...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !packageData) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Paket</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
          <Text style={styles.errorText}>
            {error || "Paket tidak ditemukan"}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchPackageDetail}
          >
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const primaryPhoto =
    packageData.photos.find((p) => p.is_primary) || packageData.photos[0];
  const fitnessIcon =
    packageData.fitness_level === "easy"
      ? "🟢"
      : packageData.fitness_level === "moderate"
        ? "🟡"
        : "🔴";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Paket</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Hero Image */}
        {primaryPhoto && (
          <Image
            source={{
              uri:
                primaryPhoto.photo_url ||
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        )}

        {/* Photo Gallery */}
        {packageData.photos.length > 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Foto Paket</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.photoGallery}
            >
              {packageData.photos.map((photo, index) => (
                <Image
                  key={photo.id}
                  source={{
                    uri:
                      photo.photo_url ||
                      `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80`,
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

        {/* Type Badge */}
        {packageData.type === "open_trip" && (
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>Open Trip</Text>
          </View>
        )}

        {/* Main Info */}
        <View style={styles.mainInfo}>
          <Text style={styles.title}>{packageData.name_en}</Text>

          <View style={styles.locationRow}>
            <Ionicons name="location" size={18} color="#666" />
            <Text style={styles.location}>
              {packageData.destination.name_en}
            </Text>
          </View>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#FFB800" />
            <Text style={styles.ratingText}>
              {packageData.average_rating.toFixed(1)}
            </Text>
            <Text style={styles.reviewCount}>
              ({packageData.total_review} ulasan)
            </Text>
          </View>

          {/* Quick Info */}
          <View style={styles.quickInfo}>
            <View style={styles.quickInfoItem}>
              <Ionicons name="time-outline" size={20} color="#11468F" />
              <Text style={styles.quickInfoLabel}>Durasi</Text>
              <Text style={styles.quickInfoValue}>
                {packageData.duration_days}D{packageData.duration_nights}N
              </Text>
            </View>

            <View style={styles.quickInfoItem}>
              <Text style={styles.fitnessIconLarge}>{fitnessIcon}</Text>
              <Text style={styles.quickInfoLabel}>Kesulitan</Text>
              <Text style={styles.quickInfoValue}>
                {packageData.fitness_level}
              </Text>
            </View>

            <View style={styles.quickInfoItem}>
              <Ionicons name="people-outline" size={20} color="#11468F" />
              <Text style={styles.quickInfoLabel}>Peserta</Text>
              <Text style={styles.quickInfoValue}>
                {packageData.min_participant}-{packageData.max_participant}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.description}>{packageData.description_en}</Text>
        </View>

        {/* Meeting Point */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Titik Kumpul</Text>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.infoText}>
              {packageData.meeting_point_en || packageData.meeting_point}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{packageData.meeting_time}</Text>
          </View>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Persyaratan</Text>

          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.infoText}>
              Usia minimum: {packageData.min_age} tahun
            </Text>
          </View>

          {packageData.dress_code_en && (
            <View style={styles.infoRow}>
              <Ionicons name="shirt-outline" size={20} color="#666" />
              <Text style={styles.infoText}>
                Dress code: {packageData.dress_code_en}
              </Text>
            </View>
          )}

          {packageData.health_advisory_en && (
            <View style={styles.infoRow}>
              <Ionicons name="medkit-outline" size={20} color="#666" />
              <Text style={styles.infoText}>
                {packageData.health_advisory_en}
              </Text>
            </View>
          )}
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategori</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {packageData.category.name_en}
            </Text>
          </View>
        </View>

        {/* Spacing for bottom button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Price Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceLabel}>Harga mulai dari</Text>
          <Text style={styles.price}>
            Rp {packageData.price_idr.toLocaleString("id-ID")}
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
  typeBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#32cc0f",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  typeBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
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
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: "#666",
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
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textTransform: "capitalize",
  },
  fitnessIconLarge: {
    fontSize: 20,
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
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
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
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#11468F",
  },
  bookButton: {
    backgroundColor: "#11468F",
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
