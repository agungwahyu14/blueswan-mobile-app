import { useExploreStore } from "@/store/explore-store";
import type { TourPackage } from "@/types/tour";
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

interface TourCardProps {
  tour: TourPackage;
  onPress: (tour: TourPackage) => void;
}

const TourCard: React.FC<TourCardProps> = ({ tour, onPress }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => onPress(tour)}
    activeOpacity={0.8}
  >
    <Image
      source={{ uri: tour.imageUrls[0] }}
      style={styles.cardImage}
      resizeMode="cover"
    />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {tour.title}
      </Text>
      <Text style={styles.destination} numberOfLines={1}>
        📍 {tour.destinationName}
      </Text>

      <View style={styles.detailsRow}>
        <Text style={styles.duration}>🕒 {tour.duration} days</Text>
        <Text style={styles.difficulty}>
          {tour.difficulty === "easy"
            ? "🟢"
            : tour.difficulty === "moderate"
              ? "🟡"
              : "🔴"}{" "}
          {tour.difficulty}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>⭐ {tour.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({tour.reviewCount})</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>From</Text>
          <Text style={styles.price}>
            {tour.currency} {tour.price.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export const ToursScreen: React.FC = () => {
  const { featuredTours, isLoadingTours, fetchFeaturedTours } =
    useExploreStore();

  useEffect(() => {
    fetchFeaturedTours();
  }, [fetchFeaturedTours]);

  const handleTourPress = (tour: TourPackage) => {
    // Navigate to tour details
    console.log("Navigate to tour:", tour.id);
  };

  const renderTour = ({ item }: { item: TourPackage }) => (
    <TourCard tour={item} onPress={handleTourPress} />
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tour Packages</Text>
        <Text style={styles.headerSubtitle}>Find your perfect adventure</Text>
      </View>

      <FlatList
        data={featuredTours}
        renderItem={renderTour}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={isLoadingTours}
        onRefresh={fetchFeaturedTours}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tours available</Text>
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
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  destination: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  duration: {
    fontSize: 13,
    color: "#555",
  },
  difficulty: {
    fontSize: 13,
    color: "#555",
    textTransform: "capitalize",
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
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginRight: 4,
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196F3",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
