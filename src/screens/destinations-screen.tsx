import { useExploreStore } from "@/store/explore-store";
import type { Destination } from "@/types/destination";
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

interface DestinationCardProps {
  destination: Destination;
  onPress: (destination: Destination) => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => onPress(destination)}
    activeOpacity={0.8}
  >
    <Image
      source={{ uri: destination.imageUrl }}
      style={styles.cardImage}
      resizeMode="cover"
    />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {destination.name}
      </Text>
      <Text style={styles.cardSubtitle} numberOfLines={1}>
        {destination.city}, {destination.country}
      </Text>
      <View style={styles.cardFooter}>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>
            ⭐ {destination.rating.toFixed(1)}
          </Text>
          <Text style={styles.reviewCount}>({destination.reviewCount})</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export const DestinationsScreen: React.FC = () => {
  const {
    destinations,
    popularDestinations,
    isLoadingDestinations,
    fetchDestinations,
    fetchPopularDestinations,
  } = useExploreStore();

  useEffect(() => {
    fetchPopularDestinations();
    fetchDestinations();
  }, [fetchPopularDestinations, fetchDestinations]);

  const handleDestinationPress = (destination: Destination) => {
    // Navigate to destination details
    console.log("Navigate to destination:", destination.id);
  };

  const renderDestination = ({ item }: { item: Destination }) => (
    <DestinationCard destination={item} onPress={handleDestinationPress} />
  );

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <Text style={styles.sectionTitle}>Popular Destinations</Text>
      <FlatList
        horizontal
        data={popularDestinations}
        renderItem={renderDestination}
        keyExtractor={(item) => `popular-${item.id}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
      <Text style={styles.sectionTitle}>All Destinations</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Destinations</Text>
      </View>

      <FlatList
        data={destinations}
        renderItem={renderDestination}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshing={isLoadingDestinations}
        onRefresh={() => {
          fetchPopularDestinations();
          fetchDestinations();
        }}
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
  headerSection: {
    marginBottom: 16,
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
    height: 200,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
});
