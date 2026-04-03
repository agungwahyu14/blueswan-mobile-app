import { transportService } from "@/services/transport-service";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TransportationItem {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
  priceRange: string;
  capacity: string;
  features: string[];
  rating: number;
  reviewCount: number;
}

interface TransportationCardProps {
  item: TransportationItem;
  onPress: (item: TransportationItem) => void;
}

const TransportationCard: React.FC<TransportationCardProps> = ({
  item,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => onPress(item)}
    activeOpacity={0.8}
  >
    <Image
      source={{ uri: item.image }}
      style={styles.cardImage}
      resizeMode="cover"
    />
    <View style={styles.cardContent}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.typeContainer}>
            <Ionicons
              name={
                item.type === "Bus"
                  ? "bus"
                  : item.type === "Car"
                    ? "car"
                    : item.type === "Boat"
                      ? "boat"
                      : "bicycle"
              }
              size={14}
              color="#11468F"
            />
            <Text style={styles.type}>{item.type}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFB800" />
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({item.reviewCount})</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.infoRow}>
        <Ionicons name="people" size={16} color="#666" />
        <Text style={styles.infoText}>{item.capacity}</Text>
      </View>

      <View style={styles.featuresContainer}>
        {item.features.slice(0, 3).map((feature, index) => (
          <View key={index} style={styles.featureBadge}>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
        {item.features.length > 3 && (
          <View style={styles.featureBadge}>
            <Text style={styles.featureText}>+{item.features.length - 3}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.priceRange}>{item.priceRange}</Text>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => onPress(item)}
        >
          <Text style={styles.bookButtonText}>Pesan</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

// Transport types - adjust based on your API
const TRANSPORT_TYPES = [
  { id: "TRANSFER_IN_OUT", label: "Transfer In/Out" },
  { id: "FULL_DAY", label: "Full Day" },
];

interface TransportationScreenProps {
  showBackButton?: boolean;
}

export const TransportationScreen: React.FC<TransportationScreenProps> = ({
  showBackButton = false,
}) => {
  const router = useRouter();
  const [transports, setTransports] = useState<TransportationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTransportType, setSelectedTransportType] = useState<
    string | undefined
  >();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchTransports();
  }, [selectedTransportType, debouncedSearch]);

  const fetchTransports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params: { transport_type?: string; search?: string } = {};
      if (selectedTransportType) {
        params.transport_type = selectedTransportType;
      }
      if (debouncedSearch && debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      console.log("\n🚗 Fetching transports...");
      console.log("Filters:", {
        transport_type: params.transport_type || "none",
        search: params.search || "none",
      });

      const response = await transportService.getTransports(params);
      console.log(`✅ Found ${response.data.length} transports\n`);

      // Map API data to component interface
      const mappedData: TransportationItem[] = response.data.map(
        (transport) => {
          const primaryPhoto =
            transport.transport_photos.find((p) => p.is_primary) ||
            transport.transport_photos[0];
          const priceIdr = parseInt(transport.price_idr, 10);

          return {
            id: transport.id,
            name: transport.name_en || transport.name,
            type:
              transport.vehicle_types.name_en || transport.vehicle_types.name,
            description:
              transport.vehicle_types.description_en ||
              transport.vehicle_types.description ||
              "",
            image:
              primaryPhoto?.image_url ||
              "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=400&q=80",
            priceRange: `Rp ${priceIdr.toLocaleString("id-ID")} / ${transport.max_distance_km} km`,
            capacity: `${transport.capacity} passengers`,
            features: transport.transport_features.map(
              (f) => f.feature_name_en || f.feature_name,
            ),
            rating: transport.average_rating,
            reviewCount: transport.total_review,
          };
        },
      );

      setTransports(mappedData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memuat transportasi";
      setError(errorMessage);
      console.error("❌ Error fetching transports:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTransportType, debouncedSearch]);

  const handleTransportationPress = (item: TransportationItem) => {
    console.log("🔗 Navigating to transport detail:", item.id);
    router.push({
      pathname: "/transport-detail",
      params: { id: item.id },
    });
  };

  const handleRefresh = () => {
    fetchTransports();
  };

  const renderItem = ({ item }: { item: TransportationItem }) => (
    <TransportationCard item={item} onPress={handleTransportationPress} />
  );

  if (error && transports.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.headerSection}>
          {showBackButton && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          )}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Transportasi</Text>
            <Text style={styles.headerSubtitle}>
              Pilih transportasi terbaik untuk perjalanan Anda
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari transportasi berdasarkan nama atau tipe"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterContainer}
          >
            {TRANSPORT_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.filterChip,
                  selectedTransportType === type.id && styles.filterChipActive,
                ]}
                onPress={() =>
                  setSelectedTransportType(
                    selectedTransportType === type.id ? undefined : type.id,
                  )
                }
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedTransportType === type.id &&
                      styles.filterChipTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.headerSection}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        )}
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Transportasi</Text>
          <Text style={styles.headerSubtitle}>
            Pilih transportasi terbaik untuk perjalanan Anda
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari transportasi berdasarkan nama atau tipe"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          {TRANSPORT_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.filterChip,
                selectedTransportType === type.id && styles.filterChipActive,
              ]}
              onPress={() =>
                setSelectedTransportType(
                  selectedTransportType === type.id ? undefined : type.id,
                )
              }
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedTransportType === type.id &&
                    styles.filterChipTextActive,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={transports}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#11468F" />
              <Text style={styles.loadingText}>Memuat transportasi...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="car-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>
                Belum ada transportasi tersedia
              </Text>
            </View>
          )
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
  headerSection: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 4,
    marginBottom: 12,
  },
  headerTextContainer: {
    marginBottom: 0,
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    padding: 0,
  },
  filterScroll: {
    marginTop: 12,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  filterChipActive: {
    backgroundColor: "#11468F",
    borderColor: "#11468F",
  },
  filterChipText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: "#fff",
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
    height: 180,
  },
  cardContent: {
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  type: {
    fontSize: 12,
    color: "#11468F",
    fontWeight: "600",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  reviewCount: {
    fontSize: 12,
    color: "#666",
    marginLeft: 2,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
  },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  featureBadge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featureText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  priceRange: {
    fontSize: 14,
    fontWeight: "600",
    color: "#11468F",
  },
  bookButton: {
    backgroundColor: "#32cc0f",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 12,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
});
