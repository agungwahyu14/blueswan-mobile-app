import { Colors } from "@/constants/theme";
import { homeService } from "@/services/home-service";
import { packageService } from "@/services/package-service";
import { transportService } from "@/services/transport-service";
import type { Gallery, HeroSection, Promo } from "@/types/home";
import type { Package } from "@/types/package";
import type { Transport } from "@/types/transport";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80",
];

export const DestinationsScreen: React.FC = () => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroData, setHeroData] = useState<HeroSection | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [transports, setTransports] = useState<Transport[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchHomeData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("\n🏠 Fetching home data...");

      const [heroRes, packagesRes, transportsRes, promosRes, galleriesRes] =
        await Promise.all([
          homeService.getHero(),
          packageService.getPackages({ limit: 10 }),
          transportService.getTransports().catch(() => ({ data: [] }) as any),
          homeService.getPromos().catch(() => ({ data: [] }) as any),
          homeService.getGalleries().catch(() => ({ data: [] }) as any),
        ]);

      setHeroData(heroRes.data);
      setPackages(packagesRes.data);
      setTransports(transportsRes.data || []);
      setPromos(promosRes.data || []);
      setGalleries(galleriesRes.data || []);

      console.log("✅ Home data loaded");
      console.log(
        "   - Hero image URL:",
        heroRes.data?.background_image_url || "No URL",
      );
      console.log("   - Packages:", packagesRes.data.length);
      console.log("   - Transports:", (transportsRes.data || []).length);
      console.log("   - Promos:", (promosRes.data || []).length);
      console.log("   - Galleries:", (galleriesRes.data || []).length, "\n");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memuat data";
      setError(errorMessage);
      console.error("❌ Error fetching home data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPackageItem = ({ item }: { item: Package }) => {
    const primaryPhoto =
      item.photos.find((p) => p.is_primary) || item.photos[0];

    return (
      <TouchableOpacity
        style={styles.packageCard}
        onPress={() =>
          router.push({ pathname: "/package-detail", params: { id: item.id } })
        }
      >
        <Image
          source={{
            uri:
              primaryPhoto?.photo_url ||
              "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=240&q=80",
          }}
          style={styles.packageImage}
          resizeMode="cover"
        />
        <View style={styles.packageOverlay}>
          <View style={styles.packageRatingBadge}>
            <Ionicons name="star" size={12} color="#FFB800" />
            <Text style={styles.packageRatingBadgeText}>
              {item.average_rating.toFixed(1)}
            </Text>
          </View>
          <View style={styles.packageTextContainer}>
            <Text style={styles.packageTitle} numberOfLines={2}>
              {item.name_en || item.name}
            </Text>
            <View style={styles.packageLocation}>
              <Ionicons name="location-outline" size={12} color="#fff" />
              <Text style={styles.packageLocationText} numberOfLines={1}>
                {item.destination.name_en || item.destination.name}
              </Text>
            </View>
            <Text style={styles.packagePrice}>
              Rp {item.price_idr.toLocaleString("id-ID")}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#11468F" />
          <Text style={styles.loadingText}>Memuat halaman...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !heroData) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
          <Text style={styles.errorText}>
            {error || "Data tidak ditemukan"}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchHomeData}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image
            source={{
              uri: HERO_IMAGES[currentImageIndex],
            }}
            style={styles.heroImage}
            resizeMode="cover"
            // onLoadStart={() => {
            //   console.log("🖼️ Hero image loading...");
            // }}
            // onLoad={() => {
            //   console.log("✅ Hero image loaded successfully");
            // }}
            // onError={(error) => {
            //   console.error("❌ Hero image failed to load:");
            //   console.error("   Error:", error.nativeEvent.error);
            // }}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              {heroData.title_en || heroData.title}
            </Text>
            <Text style={styles.heroSubtitle}>
              {heroData.subtitle_en || heroData.subtitle}
            </Text>

            {/* Hero Button */}
            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => router.push("/tours")}
            >
              <Text style={styles.heroButtonText}>View Packages</Text>
            </TouchableOpacity>
          </View>

          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {HERO_IMAGES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentImageIndex === index && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Additional Content Placeholder */}
        {/* <View style={styles.contentSection}>
          <Text style={styles.contentTitle}>Jelajahi Lebih Lanjut</Text>
          <Text style={styles.contentDescription}>
            Temukan berbagai paket wisata menarik, destinasi eksotis, dan
            layanan transportasi terbaik untuk perjalanan Anda.
          </Text>
        </View> */}

        {/* Travel Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kategori Travel</Text>
          </View>
          <View style={styles.categoryGrid}>
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => router.push("/tours")}
            >
              <View style={styles.categoryIconContainer}>
                <Ionicons name="earth" size={32} color="#11468F" />
              </View>
              <Text style={styles.categoryName}>Paket</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => router.push("/transportation")}
            >
              <View style={styles.categoryIconContainer}>
                <Ionicons name="car" size={32} color="#11468F" />
              </View>
              <Text style={styles.categoryName}>Transportasi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => router.push("/promo")}
            >
              <View style={styles.categoryIconContainer}>
                <Ionicons name="pricetag" size={32} color="#11468F" />
              </View>
              <Text style={styles.categoryName}>Promosi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => router.push("/gallery")}
            >
              <View style={styles.categoryIconContainer}>
                <Ionicons name="images" size={32} color="#11468F" />
              </View>
              <Text style={styles.categoryName}>Galeri</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Promos Section - Dummy Layout */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Promo Spesial</Text>
            <TouchableOpacity
              onPress={() => router.push("/promo")}
              style={styles.seeAllButton}
            >
              <Text style={styles.seeAllText}>Lihat Semua</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.accent} />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sliderContainer}
          >
            {/* Dummy Promo Card 1 */}
            <TouchableOpacity style={styles.promoCard} activeOpacity={0.8}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&q=80",
                }}
                style={styles.promoImage}
                resizeMode="cover"
              />
              <View style={styles.promoOverlay}>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>30% OFF</Text>
                </View>
                <View style={styles.promoTextContainer}>
                  <Text style={styles.promoTitle}>Special Holiday Package</Text>
                  <Text style={styles.promoSubtitle}>
                    Hemat hingga 30% untuk paket liburan pilihan
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Dummy Promo Card 2 */}
            <TouchableOpacity style={styles.promoCard} activeOpacity={0.8}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80",
                }}
                style={styles.promoImage}
                resizeMode="cover"
              />
              <View style={styles.promoOverlay}>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>20% OFF</Text>
                </View>
                <View style={styles.promoTextContainer}>
                  <Text style={styles.promoTitle}>Early Bird Discount</Text>
                  <Text style={styles.promoSubtitle}>
                    Pesan sekarang dan hemat 20%
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Dummy Promo Card 3 */}
            <TouchableOpacity style={styles.promoCard} activeOpacity={0.8}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300&q=80",
                }}
                style={styles.promoImage}
                resizeMode="cover"
              />
              <View style={styles.promoOverlay}>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>25% OFF</Text>
                </View>
                <View style={styles.promoTextContainer}>
                  <Text style={styles.promoTitle}>Weekend Getaway</Text>
                  <Text style={styles.promoSubtitle}>
                    Promo spesial akhir pekan 25% off
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Packages Section */}
        {packages.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Paket Wisata Populer</Text>
              <TouchableOpacity
                onPress={() => router.push("/tours")}
                style={styles.seeAllButton}
              >
                <Text style={styles.seeAllText}>Lihat Semua</Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={Colors.accent}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={packages.slice(0, 8)}
              renderItem={renderPackageItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sliderContainer}
            />
          </View>
        )}

        {/* Transportation Section */}
        {transports.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Transportasi Populer</Text>
              <TouchableOpacity
                onPress={() => router.push("/transportation")}
                style={styles.seeAllButton}
              >
                <Text style={styles.seeAllText}>Lihat Semua</Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={Colors.accent}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={transports.slice(0, 8)}
              renderItem={({ item }) => {
                const primaryPhoto =
                  item.transport_photos.find((p) => p.is_primary) ||
                  item.transport_photos[0];

                return (
                  <TouchableOpacity
                    style={styles.transportCard}
                    onPress={() =>
                      router.push({
                        pathname: "/transport-detail",
                        params: { id: item.id },
                      })
                    }
                  >
                    <Image
                      source={{
                        uri:
                          primaryPhoto?.image_url ||
                          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=240&q=80",
                      }}
                      style={styles.transportImage}
                      resizeMode="cover"
                    />
                    <View style={styles.transportOverlay}>
                      <View style={styles.transportRatingBadge}>
                        <Ionicons name="star" size={12} color="#FFB800" />
                        <Text style={styles.transportRatingBadgeText}>
                          {item.average_rating.toFixed(1)}
                        </Text>
                      </View>
                      <View style={styles.transportTextContainer}>
                        <Text style={styles.transportTitle} numberOfLines={2}>
                          {item.name_en || item.name}
                        </Text>
                        <View style={styles.transportDetails}>
                          <View style={styles.transportDetailItem}>
                            <Ionicons
                              name="people-outline"
                              size={12}
                              color="#fff"
                            />
                            <Text style={styles.transportDetailText}>
                              {item.capacity} orang
                            </Text>
                          </View>
                          <View style={styles.transportDetailItem}>
                            <Ionicons
                              name="briefcase-outline"
                              size={12}
                              color="#fff"
                            />
                            <Text style={styles.transportDetailText}>
                              {item.baggage_en || item.baggage}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.transportPrice}>
                          Rp {Number(item.price_idr).toLocaleString("id-ID")}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sliderContainer}
            />
          </View>
        )}

        {/* Galleries Section */}
        {galleries.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Galeri</Text>
              <TouchableOpacity
                onPress={() => router.push("/gallery")}
                style={styles.seeAllButton}
              >
                <Text style={styles.seeAllText}>Lihat Semua</Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={Colors.accent}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.galleryGrid}>
              {galleries
                .filter((g) => g.is_active)
                .sort((a, b) => a.order - b.order)
                .slice(0, 6)
                .map((gallery) => (
                  <TouchableOpacity
                    key={gallery.id}
                    style={styles.galleryItem}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{
                        uri:
                          gallery.image_url ||
                          "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80",
                      }}
                      style={styles.galleryImage}
                      resizeMode="cover"
                    />
                    <View style={styles.galleryOverlay}>
                      <Text style={styles.galleryTitle} numberOfLines={2}>
                        {gallery.title_en || gallery.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F3FD",
  },
  scrollView: {
    flex: 1,
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
  // Hero
  heroContainer: {
    width,
    height: 500,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  heroContent: {
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 40,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#fff",
    marginBottom: 24,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    lineHeight: 22,
  },
  heroButton: {
    backgroundColor: "#32cc0f",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  heroButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  // Image Indicators
  imageIndicators: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  activeIndicator: {
    backgroundColor: "#fff",
    width: 24,
  },
  // Content
  contentSection: {
    // backgroundColor: "#fff",
    padding: 24,
    marginTop: 16,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 12,
  },
  contentDescription: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  // Section
  section: {
    backgroundColor: "#F0F3FD",
    marginTop: 16,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: "600",
  },
  sliderContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  // Packages
  packageCard: {
    width: 300,
    height: 300,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  packageImage: {
    width: "100%",
    height: "100%",
  },
  packageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "space-between",
    padding: 12,
  },
  packageTextContainer: {
    gap: 4,
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  packageLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  packageLocationText: {
    fontSize: 12,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  packageRatingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-end",
  },
  packageRatingBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  packagePrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  // Transportation
  transportCard: {
    width: 240,
    height: 180,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  transportImage: {
    width: "100%",
    height: "100%",
  },
  transportOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "space-between",
    padding: 12,
  },
  transportTextContainer: {
    gap: 4,
  },
  transportTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  transportDetails: {
    flexDirection: "row",
    gap: 12,
  },
  transportDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  transportDetailText: {
    fontSize: 11,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  transportRatingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-end",
  },
  transportRatingBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  transportPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  // Promos
  promoCard: {
    width: 300,
    height: 180,
    backgroundColor: "#E0E7FF",
    borderRadius: 12,
    overflow: "hidden",
  },
  promoImage: {
    width: "100%",
    height: "100%",
  },
  promoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "space-between",
    padding: 12,
  },
  promoTextContainer: {
    gap: 4,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  promoSubtitle: {
    fontSize: 13,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  discountBadge: {
    backgroundColor: "#FF4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-end",
  },
  discountText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  // Galleries
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  galleryItem: {
    width: (width - 44) / 2, // 2 columns with gaps
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },
  galleryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
    padding: 12,
  },
  galleryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  // Category Grid
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    width: (width - 44) / 2,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    // elevation: 2,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});
