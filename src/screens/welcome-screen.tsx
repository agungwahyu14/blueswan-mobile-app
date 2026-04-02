import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const WelcomeScreen: React.FC = () => {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  const handleLogin = () => {
    router.push("/login" as any);
  };

  const handleRegister = () => {
    router.push("/register" as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoText}>BS</Text>
          </View>
          <Text style={[styles.appName, { color: colors.primary }]}>
            Blue Swan
          </Text>
          <Text style={styles.tagline}>Your Ultimate Travel Companion</Text>
        </View>

        {/* Illustration/Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🌍</Text>
            <Text style={styles.featureTitle}>Explore Destinations</Text>
            <Text style={styles.featureDescription}>
              Discover amazing places around the world
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎫</Text>
            <Text style={styles.featureTitle}>Book Tours</Text>
            <Text style={styles.featureDescription}>
              Easy booking for unforgettable experiences
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✨</Text>
            <Text style={styles.featureTitle}>Manage Trips</Text>
            <Text style={styles.featureDescription}>
              Keep track of all your bookings in one place
            </Text>
          </View>
        </View>

        {/* CTA Buttons */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={handleRegister}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.primary }]}
            onPress={handleLogin}
          >
            <Text
              style={[styles.secondaryButtonText, { color: colors.primary }]}
            >
              I Already Have an Account
            </Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing, you agree to our{"\n"}
            <Text style={[styles.termsLink, { color: colors.primary }]}>
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text style={[styles.termsLink, { color: colors.primary }]}>
              Privacy Policy
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  logoSection: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  logoText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  featuresSection: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  feature: {
    alignItems: "center",
    marginBottom: 32,
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  ctaSection: {
    paddingBottom: 20,
  },
  primaryButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryButton: {
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  termsText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    fontWeight: "600",
  },
});
