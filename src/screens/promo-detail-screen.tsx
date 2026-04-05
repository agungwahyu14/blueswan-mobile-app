import { Colors } from "@/constants/theme";
import type { Promo } from "@/types/home";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Same dummy data as promo screen
const DUMMY_PROMOS: Promo[] = [
  {
    id: "1",
    title: "Diskon Spesial Bali",
    title_en: "Special Bali Discount",
    description:
      "Dapatkan diskon hingga 30% untuk paket tour Bali. Nikmati keindahan pulau dewata dengan harga terjangkau!",
    description_en:
      "Get up to 30% discount for Bali tour packages. Enjoy the beauty of the island of gods at an affordable price!",
    image_url:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    discount_percentage: 30,
    valid_from: "2026-04-01T00:00:00Z",
    valid_until: "2026-06-30T23:59:59Z",
    is_active: true,
    created_at: "2026-03-15T10:00:00Z",
    updated_at: "2026-03-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Promo Raja Ampat Adventure",
    title_en: "Raja Ampat Adventure Promo",
    description:
      "Jelajahi keindahan bawah laut Raja Ampat dengan diskon 25%. Limited time offer!",
    description_en:
      "Explore the underwater beauty of Raja Ampat with 25% discount. Limited time offer!",
    image_url:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
    discount_percentage: 25,
    valid_from: "2026-04-01T00:00:00Z",
    valid_until: "2026-07-31T23:59:59Z",
    is_active: true,
    created_at: "2026-03-20T10:00:00Z",
    updated_at: "2026-03-20T10:00:00Z",
  },
  {
    id: "3",
    title: "Flash Sale Yogyakarta",
    title_en: "Yogyakarta Flash Sale",
    description:
      "Hemat 20% untuk paket wisata Yogyakarta. Kunjungi Candi Borobudur dan Prambanan!",
    description_en:
      "Save 20% on Yogyakarta tour packages. Visit Borobudur and Prambanan Temples!",
    image_url:
      "https://images.unsplash.com/photo-1591843336169-15eb8e252c64?w=800&q=80",
    discount_percentage: 20,
    valid_from: "2026-04-01T00:00:00Z",
    valid_until: "2026-05-31T23:59:59Z",
    is_active: true,
    created_at: "2026-03-25T10:00:00Z",
    updated_at: "2026-03-25T10:00:00Z",
  },
  {
    id: "4",
    title: "Promo Honeymoon Lombok",
    title_en: "Lombok Honeymoon Promo",
    description:
      "Paket spesial untuk pasangan baru! Diskon 35% untuk honeymoon di Lombok.",
    description_en:
      "Special package for newlyweds! 35% discount for honeymoon in Lombok.",
    image_url:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    discount_percentage: 35,
    valid_from: "2026-04-01T00:00:00Z",
    valid_until: "2026-08-31T23:59:59Z",
    is_active: true,
    created_at: "2026-03-28T10:00:00Z",
    updated_at: "2026-03-28T10:00:00Z",
  },
  {
    id: "5",
    title: "Early Bird Komodo Island",
    title_en: "Early Bird Komodo Island",
    description:
      "Booking lebih awal, hemat lebih banyak! Diskon 40% untuk tour Komodo Island.",
    description_en:
      "Book early, save more! 40% discount for Komodo Island tours.",
    image_url:
      "https://images.unsplash.com/photo-1606628015627-e0ca4d5cfacf?w=800&q=80",
    discount_percentage: 40,
    valid_from: "2026-04-01T00:00:00Z",
    valid_until: "2026-06-15T23:59:59Z",
    is_active: true,
    created_at: "2026-04-01T10:00:00Z",
    updated_at: "2026-04-01T10:00:00Z",
  },
];

export const PromoDetailScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Find the promo by id
  const promo = DUMMY_PROMOS.find((p) => p.id === id);

  if (!promo) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Promo</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
          <Text style={styles.errorText}>Promo tidak ditemukan</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const isPromoValid = () => {
    const now = new Date();
    const validFrom = new Date(promo.valid_from);
    const validUntil = new Date(promo.valid_until);
    return now >= validFrom && now <= validUntil;
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Promo</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: promo.image_url }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {promo.discount_percentage && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {promo.discount_percentage}% OFF
              </Text>
            </View>
          )}
          <View style={styles.statusBadge}>
            <Ionicons
              name={isPromoValid() ? "checkmark-circle" : "close-circle"}
              size={16}
              color="#fff"
            />
            <Text style={styles.statusText}>
              {isPromoValid() ? "Aktif" : "Tidak Aktif"}
            </Text>
          </View>
        </View>

        {/* Promo Content */}
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.section}>
            <Text style={styles.title}>{promo.title_en || promo.title}</Text>
          </View>

          {/* Validity Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={Colors.primary}
              />
              <Text style={styles.sectionTitle}>Periode Promo</Text>
            </View>
            <View style={styles.validityCard}>
              <View style={styles.validityRow}>
                <Text style={styles.validityLabel}>Mulai:</Text>
                <Text style={styles.validityValue}>
                  {formatDate(promo.valid_from)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.validityRow}>
                <Text style={styles.validityLabel}>Berakhir:</Text>
                <Text style={styles.validityValue}>
                  {formatDate(promo.valid_until)}
                </Text>
              </View>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={Colors.primary}
              />
              <Text style={styles.sectionTitle}>Deskripsi</Text>
            </View>
            <Text style={styles.description}>
              {promo.description_en || promo.description}
            </Text>
          </View>

          {/* Terms & Conditions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={Colors.primary}
              />
              <Text style={styles.sectionTitle}>Syarat & Ketentuan</Text>
            </View>
            <View style={styles.termsList}>
              <View style={styles.termItem}>
                <Ionicons name="checkmark-circle" size={18} color="#32cc0f" />
                <Text style={styles.termText}>
                  Promo berlaku untuk booking baru
                </Text>
              </View>
              <View style={styles.termItem}>
                <Ionicons name="checkmark-circle" size={18} color="#32cc0f" />
                <Text style={styles.termText}>
                  Tidak dapat digabungkan dengan promo lain
                </Text>
              </View>
              <View style={styles.termItem}>
                <Ionicons name="checkmark-circle" size={18} color="#32cc0f" />
                <Text style={styles.termText}>
                  Berlaku untuk semua metode pembayaran
                </Text>
              </View>
              <View style={styles.termItem}>
                <Ionicons name="checkmark-circle" size={18} color="#32cc0f" />
                <Text style={styles.termText}>
                  Promo dapat berubah sewaktu-waktu tanpa pemberitahuan
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.usePromoButton,
            !isPromoValid() && styles.disabledButton,
          ]}
          disabled={!isPromoValid()}
          onPress={() => {
            // Navigate to tours/packages screen
            router.push("/tours");
          }}
        >
          <Text style={styles.usePromoButtonText}>
            {isPromoValid() ? "Gunakan Promo" : "Promo Tidak Aktif"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F3FD",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F0F3FD",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 250,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  discountBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#FF4444",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  discountText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  statusBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    lineHeight: 32,
  },
  validityCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  validityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  validityLabel: {
    fontSize: 14,
    color: "#666",
  },
  validityValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 4,
  },
  description: {
    fontSize: 15,
    color: "#333",
    lineHeight: 24,
  },
  termsList: {
    gap: 12,
  },
  termItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  termText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  usePromoButton: {
    backgroundColor: "#32cc0f",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  usePromoButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
  },
});
