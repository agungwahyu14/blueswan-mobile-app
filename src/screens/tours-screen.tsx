import { Colors } from "@/constants/theme";
import { categoryService } from "@/services/category-service";
import { destinationService } from "@/services/destination-service";
import { packageService } from "@/services/package-service";
import type { Category } from "@/types/category";
import type { Destination } from "@/types/destination";
import type { Package } from "@/types/package";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
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

interface TourCardProps {
  tour: Package;
  onPress: (tour: Package) => void;
}

const TourCard: React.FC<TourCardProps> = ({ tour, onPress }) => {
  const primaryPhoto = tour.photos.find((p) => p.is_primary) || tour.photos[0];
  const fitnessIcon =
    tour.fitness_level === "easy"
      ? "🟢"
      : tour.fitness_level === "moderate"
        ? "🟡"
        : "🔴";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(tour)}
      activeOpacity={0.8}
    >
      <Image
        source={{
          uri:
            primaryPhoto?.photo_url ||
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80",
        }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {tour.name}
        </Text>
        <View style={styles.destinationRow}>
          <Ionicons name="location" size={14} color="#666" />
          <Text style={styles.destination} numberOfLines={1}>
            {tour.destination.name}
          </Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.duration}>
              {tour.duration_days}D{tour.duration_nights}N
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.fitnessIcon}>{fitnessIcon}</Text>
            <Text style={styles.difficulty}>{tour.fitness_level}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={14} color="#666" />
            <Text style={styles.participantText}>
              {tour.min_participant}-{tour.max_participant}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFB800" />
            <Text style={styles.ratingText}>
              {tour.average_rating.toFixed(1)}
            </Text>
            <Text style={styles.reviewCount}>({tour.total_review})</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Mulai dari</Text>
            <Text style={styles.price}>
              Rp {tour.price_idr.toLocaleString("id-ID")}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface ToursScreenProps {
  showBackButton?: boolean;
}

export const ToursScreen: React.FC<ToursScreenProps> = ({
  showBackButton = false,
}) => {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDestinationId, setSelectedDestinationId] = useState<
    string | undefined
  >();
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >();
  const [activeTab, setActiveTab] = useState<
    "all" | "destinations" | "categories"
  >("all");

  // Animation for tab indicator
  const tabAnimation = useRef(new Animated.Value(0)).current;
  const [tabBarWidth, setTabBarWidth] = useState(0);

  // Animate tab indicator when activeTab changes
  useEffect(() => {
    const tabIndex =
      activeTab === "all" ? 0 : activeTab === "destinations" ? 1 : 2;
    Animated.spring(tabAnimation, {
      toValue: tabIndex,
      useNativeDriver: true,
      damping: 20,
      stiffness: 300,
    }).start();
  }, [activeTab]);

  // Fetch categories and destinations on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        console.log("\n🔍 Fetching filters...\n");
        const [categoriesRes, destinationsRes] = await Promise.all([
          categoryService.getCategories(),
          destinationService.getDestinations(),
        ]);

        console.log("📦 Categories:", categoriesRes.data.length, "items");
        categoriesRes.data.forEach((cat, idx) =>
          console.log(
            `  ${idx + 1}. ${cat.name} (${cat.package_count} packages)`,
          ),
        );

        console.log("\n🌍 Destinations:", destinationsRes.data.length, "items");
        destinationsRes.data.forEach((dest, idx) =>
          console.log(
            `  ${idx + 1}. ${dest.name} (${dest.package_count} packages)`,
          ),
        );

        setCategories(categoriesRes.data);
        setDestinations(destinationsRes.data);
        console.log("\n✅ Filters loaded successfully\n");
      } catch (err) {
        console.error("❌ Error fetching filters:", err);
      }
    };
    fetchFilters();
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchPackages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params: {
        search?: string;
        destination_id?: string;
        category_id?: string;
      } = {};

      if (debouncedSearch && debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }
      if (selectedDestinationId) {
        params.destination_id = selectedDestinationId;
      }
      if (selectedCategoryId) {
        params.category_id = selectedCategoryId;
      }

      console.log("\n📦 Fetching packages with filters:", {
        search: params.search || "none",
        destination: params.destination_id || "none",
        category: params.category_id || "none",
      });

      const response = await packageService.getPackages(params);

      console.log(`✅ Found ${response.data.length} packages\n`);
      setPackages(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memuat paket wisata";
      setError(errorMessage);
      console.error("❌ Error fetching packages:", err);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedDestinationId, selectedCategoryId]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleTourPress = (tour: Package) => {
    console.log("🔗 Navigating to package detail:", tour.id);
    router.push({
      pathname: "/package-detail",
      params: { id: tour.id },
    });
  };

  const handleRefresh = () => {
    fetchPackages();
  };

  const renderTour = ({ item }: { item: Package }) => (
    <TourCard tour={item} onPress={handleTourPress} />
  );

  if (error && packages.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          {showBackButton && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.primary} />
            </TouchableOpacity>
          )}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Paket Wisata</Text>
            <Text style={styles.headerSubtitle}>
              Temukan petualangan sempurna Anda
            </Text>
          </View>
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
      <View style={styles.header}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
        )}
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Paket Wisata</Text>
          <Text style={styles.headerSubtitle}>
            Temukan petualangan sempurna Anda
          </Text>
        </View>
      </View>
      <View style={styles.searchAndFilterContainer}>
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
            placeholder="Cari paket tour berdasarkan nama, destinasi, atau kategori"
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
        {/* Animated Tab Bar */}
        <View
          style={styles.tabBar}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setTabBarWidth(width);
          }}
        >
          {tabBarWidth > 0 && (
            <Animated.View
              style={[
                styles.tabIndicator,
                {
                  width: (tabBarWidth - 8) / 3, // Subtract padding and divide by 3 tabs
                  transform: [
                    {
                      translateX: tabAnimation.interpolate({
                        inputRange: [0, 1, 2],
                        outputRange: [
                          0,
                          (tabBarWidth - 8) / 3,
                          ((tabBarWidth - 8) / 3) * 2,
                        ],
                      }),
                    },
                  ],
                },
              ]}
            />
          )}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab("all")}
            activeOpacity={0.7}
          >
            <Animated.Text
              style={[
                styles.tabText,
                {
                  color: tabAnimation.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: ["#fff", "#666", "#666"],
                  }),
                  fontWeight: activeTab === "all" ? "600" : "500",
                },
              ]}
            >
              All
            </Animated.Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab("destinations")}
            activeOpacity={0.7}
          >
            <Animated.Text
              style={[
                styles.tabText,
                {
                  color: tabAnimation.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: ["#666", "#fff", "#666"],
                  }),
                  fontWeight: activeTab === "destinations" ? "600" : "500",
                },
              ]}
            >
              Destinations
            </Animated.Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab("categories")}
            activeOpacity={0.7}
          >
            <Animated.Text
              style={[
                styles.tabText,
                {
                  color: tabAnimation.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: ["#666", "#666", "#fff"],
                  }),
                  fontWeight: activeTab === "categories" ? "600" : "500",
                },
              ]}
            >
              Categories
            </Animated.Text>
          </TouchableOpacity>
        </View>

        {/* Filter Content */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          {activeTab === "all" && (
            <>
              {/* Destination Filters */}
              {destinations.slice(0, 5).map((destination) => (
                <TouchableOpacity
                  key={destination.id}
                  style={[
                    styles.filterChip,
                    selectedDestinationId === destination.id &&
                      styles.filterChipActive,
                  ]}
                  onPress={() =>
                    setSelectedDestinationId(
                      selectedDestinationId === destination.id
                        ? undefined
                        : destination.id,
                    )
                  }
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedDestinationId === destination.id &&
                        styles.filterChipTextActive,
                    ]}
                  >
                    📍 {destination.name}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Category Filters */}
              {categories.slice(0, 5).map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.filterChip,
                    selectedCategoryId === category.id &&
                      styles.filterChipActive,
                  ]}
                  onPress={() =>
                    setSelectedCategoryId(
                      selectedCategoryId === category.id
                        ? undefined
                        : category.id,
                    )
                  }
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedCategoryId === category.id &&
                        styles.filterChipTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          {activeTab === "destinations" && (
            <>
              {/* Destination Filters */}
              {destinations.map((destination) => (
                <TouchableOpacity
                  key={destination.id}
                  style={[
                    styles.filterChip,
                    selectedDestinationId === destination.id &&
                      styles.filterChipActive,
                  ]}
                  onPress={() =>
                    setSelectedDestinationId(
                      selectedDestinationId === destination.id
                        ? undefined
                        : destination.id,
                    )
                  }
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedDestinationId === destination.id &&
                        styles.filterChipTextActive,
                    ]}
                  >
                    📍 {destination.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          {activeTab === "categories" && (
            <>
              {/* Category Filters */}
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.filterChip,
                    selectedCategoryId === category.id &&
                      styles.filterChipActive,
                  ]}
                  onPress={() =>
                    setSelectedCategoryId(
                      selectedCategoryId === category.id
                        ? undefined
                        : category.id,
                    )
                  }
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedCategoryId === category.id &&
                        styles.filterChipTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>
      </View>

      <FlatList
        data={packages}
        renderItem={renderTour}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="map-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Belum ada paket wisata</Text>
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
    backgroundColor: "#F0F3FD",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#F0F3FD",
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTextContainer: {
    flex: 1,
  },
  searchAndFilterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#F0F3FD",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
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
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 16,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 4,
    marginBottom: 12,
    position: "relative",
  },
  tabIndicator: {
    position: "absolute",
    top: 4,
    left: 4,
    height: 32, // Fixed height for the indicator
    backgroundColor: Colors.primary,
    borderRadius: 6,
    zIndex: 0,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    zIndex: 1,
  },
  tabActive: {
    backgroundColor: "transparent",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
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
    height: 220,
  },
  cardContent: {
    padding: 12,
  },
  typeBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#32cc0f",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 6,
  },
  destinationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  destination: {
    fontSize: 14,
    color: "#666",
  },
  detailsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  duration: {
    fontSize: 13,
    color: "#555",
  },
  fitnessIcon: {
    fontSize: 12,
  },
  difficulty: {
    fontSize: 13,
    color: "#555",
    textTransform: "capitalize",
  },
  participantText: {
    fontSize: 13,
    color: "#555",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  reviewCount: {
    fontSize: 12,
    color: "#999",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  priceLabel: {
    fontSize: 11,
    color: "#999",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
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
});
