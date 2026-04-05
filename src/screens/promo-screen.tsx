import { Colors } from "@/constants/theme";
import type { Promo } from "@/types/home";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Dummy promo data
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

export const PromoScreen: React.FC = () => {
  const router = useRouter();
  const [promos, setPromos] = useState<Promo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use dummy data instead of API
    setPromos(DUMMY_PROMOS);
  }, []);

  const renderPromoCard = ({ item }: { item: Promo }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => router.push(`/promo-detail?id=${item.id}` as any)}
    >
      <Image
        source={{
          uri:
            item.image_url ||
            "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&q=80",
        }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      {item.discount_percentage && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>
            {item.discount_percentage}% OFF
          </Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title_en || item.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={3}>
          {item.description_en || item.description}
        </Text>

        <View style={styles.validityContainer}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.validityText}>
            Valid: {new Date(item.valid_from).toLocaleDateString("id-ID")} -{" "}
            {new Date(item.valid_until).toLocaleDateString("id-ID")}
          </Text>
        </View>

        <TouchableOpacity style={styles.claimButton}>
          <Text style={styles.claimButtonText}>Lihat Detail</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Promo Spesial</Text>
          <Text style={styles.headerSubtitle}>
            Jangan lewatkan penawaran menarik kami
          </Text>
        </View>
      </View>

      <FlatList
        data={promos}
        renderItem={renderPromoCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="pricetag-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Belum ada promo tersedia</Text>
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
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
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
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    paddingVertical: 16,
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
    height: 200,
  },
  discountBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#FF4444",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  discountText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  validityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  validityText: {
    fontSize: 13,
    color: "#666",
  },
  claimButton: {
    backgroundColor: "#32cc0f",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  claimButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 12,
  },
});
