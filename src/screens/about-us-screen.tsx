import { Colors } from "@/constants/theme";
import { aboutService, type AboutUs } from "@/services/about-service";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const AboutUsScreen: React.FC = () => {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            About Us
          </Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !aboutData) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            About Us
          </Text>
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
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {aboutData.hero_title_en}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Hero Section */}
        {aboutData.hero_image_url && (
          <Image
            source={{ uri: aboutData.hero_image_url }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.heroContent}>
          <Text style={[styles.heroTitle, { color: colors.primary }]}>
            {aboutData.hero_title_en}
          </Text>
          <Text style={styles.heroSubtitle}>{aboutData.hero_subtitle_en}</Text>
        </View>

        {/* Story Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{aboutData.story_title_en}</Text>
          <View style={styles.card}>
            {aboutData.story_image_url && (
              <Image
                source={{ uri: aboutData.story_image_url }}
                style={styles.storyImage}
                resizeMode="cover"
              />
            )}
            <Text style={styles.description}>
              {aboutData.story_description_en}
            </Text>
          </View>
        </View>

        {/* Vision & Mission */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{aboutData.vm_title_en}</Text>
          <Text style={styles.sectionSubtitle}>{aboutData.vm_subtitle_en}</Text>

          <View style={styles.card}>
            <Text style={styles.vmTitle}>{aboutData.vision_title_en}</Text>
            <Text style={styles.description}>
              {aboutData.vision_content_en}
            </Text>
          </View>

          {aboutData.missions.map((mission, index) => (
            <View key={mission.id} style={[styles.card, styles.cardSpaced]}>
              <Text style={styles.vmTitle}>
                {index + 1}. {mission.title_en}
              </Text>
              <Text style={styles.description}>{mission.description_en}</Text>
            </View>
          ))}
        </View>

        {/* Values Section */}
        {aboutData.values && aboutData.values.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{aboutData.values_title_en}</Text>
            <Text style={styles.sectionSubtitle}>
              {aboutData.values_subtitle_en}
            </Text>

            {aboutData.values.map((value) => (
              <View key={value.id} style={[styles.card, styles.valueCard]}>
                <Text style={styles.valueIcon}>{value.icon}</Text>
                <Text style={styles.valueTitle}>{value.title_en}</Text>
                <Text style={styles.valueDescription}>
                  {value.description_en}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Stats Section */}
        {aboutData.stats && aboutData.stats.length > 0 && (
          <View style={styles.section}>
            <View style={styles.statsContainer}>
              {aboutData.stats.map((stat) => (
                <View key={stat.id} style={styles.statCard}>
                  <Text style={[styles.statValue, { color: colors.primary }]}>
                    {stat.value}
                  </Text>
                  <Text style={styles.statLabel}>{stat.label_en}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Team Section */}
        {aboutData.team_members && aboutData.team_members.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{aboutData.team_title_en}</Text>
            <Text style={styles.sectionSubtitle}>
              {aboutData.team_subtitle_en}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.teamScroll}
            >
              {aboutData.team_members.map((member) => (
                <View key={member.id} style={styles.teamCard}>
                  {member.photo_url ? (
                    <Image
                      source={{ uri: member.photo_url }}
                      style={styles.teamPhoto}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.teamPhotoPlaceholder,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <Text style={styles.teamPhotoText}>{member.name[0]}</Text>
                    </View>
                  )}
                  <Text style={styles.teamName}>{member.name}</Text>
                  <Text style={styles.teamRole}>{member.role_en}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.contactRow} onPress={handleEmail}>
              <Ionicons name="mail" size={24} color={colors.primary} />
              <Text style={styles.contactText}>support@blueswan.com</Text>
            </TouchableOpacity>
            <View style={styles.contactDivider} />
            <TouchableOpacity style={styles.contactRow} onPress={handlePhone}>
              <Ionicons name="call" size={24} color={colors.primary} />
              <Text style={styles.contactText}>+1 (234) 567-890</Text>
            </TouchableOpacity>
            <View style={styles.contactDivider} />
            <TouchableOpacity style={styles.contactRow} onPress={handleWebsite}>
              <Ionicons name="globe" size={24} color={colors.primary} />
              <Text style={styles.contactText}>www.blueswan.com</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.footerText}>
              © 2024 Blue Swan. All rights reserved.
            </Text>
            <Text style={styles.version}>Version 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
    backgroundColor: "#11468F",
    borderRadius: 8,
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
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  heroImage: {
    width: "100%",
    height: 200,
  },
  heroContent: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 16,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardSpaced: {
    marginTop: 12,
  },
  storyImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
  vmTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  valueCard: {
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  valueIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  valueTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  valueDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  teamScroll: {
    marginLeft: 16,
  },
  teamCard: {
    width: 140,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  teamPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  teamPhotoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  teamPhotoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  teamName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  teamRole: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  contactText: {
    fontSize: 15,
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },
  contactDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
  },
  footerText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  version: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});
