import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  onPress?: () => void;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, onPress }) => (
  <TouchableOpacity
    style={styles.infoRow}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
    disabled={!onPress}
  >
    <View style={styles.iconContainer}>
      <Text style={styles.icon}>{icon}</Text>
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, onPress && styles.infoValueLink]}>
        {value}
      </Text>
    </View>
  </TouchableOpacity>
);

export const AboutUsScreen: React.FC = () => {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  const handleEmail = () => {
    Linking.openURL("mailto:support@blueswan.com");
  };

  const handlePhone = () => {
    Linking.openURL("tel:+1234567890");
  };

  const handleWebsite = () => {
    Linking.openURL("https://blueswan.com");
  };

  const handleSocialMedia = (platform: string) => {
    const urls: Record<string, string> = {
      facebook: "https://facebook.com/blueswan",
      instagram: "https://instagram.com/blueswan",
      twitter: "https://twitter.com/blueswan",
    };
    Linking.openURL(urls[platform]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <SymbolView
            name="chevron.left"
            size={24}
            tintColor={colors.primary}
            type="hierarchical"
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          About Us
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.logoSection}>
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoText}>BS</Text>
          </View>
          <Text style={[styles.appName, { color: colors.primary }]}>
            Blue Swan
          </Text>
          <Text style={styles.tagline}>Your Ultimate Travel Companion</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Story</Text>
          <View style={styles.card}>
            <Text style={styles.description}>
              Blue Swan is a premier travel booking platform dedicated to making
              your dream destinations accessible. We connect travelers with
              amazing tour experiences, from breathtaking beach getaways to
              cultural city tours.
            </Text>
            <Text style={[styles.description, styles.descriptionSpaced]}>
              Founded in 2024, we've helped thousands of travelers discover new
              places and create unforgettable memories. Our mission is to
              provide seamless booking experiences with the best destinations
              worldwide.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.card}>
            <InfoRow
              icon="📧"
              label="Email"
              value="support@blueswan.com"
              onPress={handleEmail}
            />
            <View style={styles.divider} />
            <InfoRow
              icon="📱"
              label="Phone"
              value="+1 (234) 567-890"
              onPress={handlePhone}
            />
            <View style={styles.divider} />
            <InfoRow
              icon="🌐"
              label="Website"
              value="www.blueswan.com"
              onPress={handleWebsite}
            />
            <View style={styles.divider} />
            <InfoRow
              icon="📍"
              label="Address"
              value="123 Travel Street, Singapore"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[styles.socialButton, { borderColor: colors.primary }]}
              onPress={() => handleSocialMedia("facebook")}
            >
              <Text style={styles.socialIcon}>f</Text>
              <Text style={[styles.socialText, { color: colors.primary }]}>
                Facebook
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, { borderColor: colors.primary }]}
              onPress={() => handleSocialMedia("instagram")}
            >
              <Text style={styles.socialIcon}>📷</Text>
              <Text style={[styles.socialText, { color: colors.primary }]}>
                Instagram
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, { borderColor: colors.primary }]}
              onPress={() => handleSocialMedia("twitter")}
            >
              <Text style={styles.socialIcon}>🐦</Text>
              <Text style={[styles.socialText, { color: colors.primary }]}>
                Twitter
              </Text>
            </TouchableOpacity>
          </View>
        </View>

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
  logoSection: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginHorizontal: 16,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
  descriptionSpaced: {
    marginTop: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  iconContainer: {
    width: 40,
    alignItems: "center",
  },
  icon: {
    fontSize: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: "#333",
  },
  infoValueLink: {
    color: "#11468F",
    textDecorationLine: "underline",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginLeft: 40,
  },
  socialContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  socialIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  socialText: {
    fontSize: 14,
    fontWeight: "600",
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
