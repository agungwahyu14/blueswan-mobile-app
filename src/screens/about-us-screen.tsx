import { Colors } from "@/constants/theme";
import { aboutService, type AboutUs } from "@/services/about-service";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const AboutUsScreen: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutUs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      setIsLoading(true);
      const data = await aboutService.getAboutUs();
      setAboutData(data);
    } catch (err) {
      console.error("Failed to fetch about us data:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmail = () => {
    Linking.openURL("mailto:support@blueswan.com");
  };

  const handlePhone = () => {
    Linking.openURL("tel:+1234567890");
  };

  const handleWebsite = () => {
    Linking.openURL("https://blueswan.com");
  };

  const getValueIcon = (index: number): any => {
    const icons = [
      "heart-outline",
      "shield-checkmark-outline",
      "people-outline",
      "leaf-outline",
      "ribbon-outline",
      "star-outline",
    ];
    return icons[index % icons.length];
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About Us</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !aboutData) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About Us</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || "Failed to load data"}</Text>
          <TouchableOpacity onPress={fetchAboutUs} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>{aboutData.hero_title_en}</Text>
          <Text style={styles.heroSubtitle}>{aboutData.hero_subtitle_en}</Text>
        </View>

        {/* Story Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{aboutData.story_title_en}</Text>
          <Text style={styles.description}>
            {aboutData.story_description_en}
          </Text>
        </View>

        {/* Vision & Mission */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vision</Text>
          <Text style={styles.description}>{aboutData.vision_content_en}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mission</Text>
          {aboutData.missions.map((mission, index) => (
            <View key={mission.id} style={styles.missionItem}>
              <View style={styles.missionNumber}>
                <Text style={styles.missionNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.missionContent}>
                <Text style={styles.missionTitle}>{mission.title_en}</Text>
                <Text style={styles.missionDescription}>
                  {mission.description_en}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Values Section */}
        {aboutData.values && aboutData.values.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Values</Text>
            {aboutData.values.map((value, index) => (
              <View key={value.id} style={styles.valueItem}>
                <View style={styles.valueIconContainer}>
                  <Ionicons
                    name={getValueIcon(index)}
                    size={24}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.valueContent}>
                  <Text style={styles.valueTitle}>{value.title_en}</Text>
                  <Text style={styles.valueDescription}>
                    {value.description_en}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
            <Ionicons name="mail-outline" size={20} color={Colors.primary} />
            <Text style={styles.contactText}>support@blueswan.com</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactItem} onPress={handlePhone}>
            <Ionicons name="call-outline" size={20} color={Colors.primary} />
            <Text style={styles.contactText}>+1 (234) 567-890</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactItem} onPress={handleWebsite}>
            <Ionicons name="globe-outline" size={20} color={Colors.primary} />
            <Text style={styles.contactText}>www.blueswan.com</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 Blue Swan Travel. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F3FD",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#F0F3FD",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "#333",
  },
  missionItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  missionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  missionNumberText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  missionContent: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  missionDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
  },
  valueItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "flex-start",
  },
  valueIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8F0FE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  valueContent: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  valueDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  contactText: {
    fontSize: 15,
    color: "#333",
    marginLeft: 12,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
  },
});
