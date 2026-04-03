import { homeService } from "@/services/home-service";
import type { Promo } from "@/types/home";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const PromoScreen: React.FC = () => {
  const router = useRouter();
  const [promos, setPromos] = useState<Promo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("\n🎉 Fetching promos...");
      const response = await homeService.getPromos();

      setPromos(response.data.filter((p) => p.is_active));
      console.log(`✅ Found ${response.data.length} promos\n`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memuat promo";
      setError(errorMessage);
      console.error("❌ Error fetching promos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPromoCard = ({ item }: { item: Promo }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
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
          <Text style={styles.claimButtonText}>Gunakan Promo</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Promo Spesial</Text>
            <Text style={styles.headerSubtitle}>
              Jangan lewatkan penawaran menarik kami
            </Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#11468F" />
          <Text style={styles.loadingText}>Memuat promo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Promo Spesial</Text>
            <Text style={styles.headerSubtitle}>
              Jangan lewatkan penawaran menarik kami
            </Text>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchPromos}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
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
        refreshing={isLoading}
        onRefresh={fetchPromos}
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
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
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
    color: "#333",
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
    color: "#333",
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
