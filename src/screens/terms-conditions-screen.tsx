import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsConditionsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: April 4, 2026</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            Welcome to Blue Swan Travel. By accessing or using our mobile
            application, you agree to be bound by these Terms and Conditions.
            Please read them carefully before using our services.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Services</Text>
          <Text style={styles.paragraph}>
            Blue Swan Travel provides travel booking services including tour
            packages, transportation, and related travel services. We act as an
            intermediary between customers and service providers.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
          <Text style={styles.paragraph}>You agree to:</Text>
          <Text style={styles.bulletPoint}>
            • Provide accurate and complete information
          </Text>
          <Text style={styles.bulletPoint}>
            • Keep your account credentials secure
          </Text>
          <Text style={styles.bulletPoint}>
            • Comply with all applicable laws and regulations
          </Text>
          <Text style={styles.bulletPoint}>
            • Not misuse our services or platform
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Booking and Payment</Text>
          <Text style={styles.paragraph}>
            All bookings are subject to availability. Payment must be made in
            full at the time of booking unless otherwise agreed. Prices are
            subject to change without notice.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Cancellation and Refunds</Text>
          <Text style={styles.paragraph}>
            Cancellation policies vary by service provider. Please review the
            specific cancellation terms for each booking. Refunds, if
            applicable, will be processed according to the service provider's
            policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            Blue Swan Travel is not liable for any indirect, incidental,
            special, or consequential damages arising from the use of our
            services. Our liability is limited to the amount paid for the
            specific service in question.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Privacy</Text>
          <Text style={styles.paragraph}>
            Your use of our services is also governed by our Privacy Policy. We
            collect and process personal data in accordance with applicable
            privacy laws.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Modifications</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify these Terms and Conditions at any
            time. Changes will be effective immediately upon posting. Your
            continued use of our services constitutes acceptance of the modified
            terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about these Terms and Conditions, please
            contact us at:
          </Text>
          <Text style={styles.contactInfo}>
            Email: support@blueswantravel.com
          </Text>
          <Text style={styles.contactInfo}>Phone: +62 123 4567 890</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using Blue Swan Travel, you acknowledge that you have read,
            understood, and agree to be bound by these Terms and Conditions.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F3FD",
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
    paddingHorizontal: 16,
  },
  lastUpdated: {
    fontSize: 12,
    color: "#999",
    marginBottom: 24,
    fontStyle: "italic",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
    marginLeft: 8,
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 14,
    color: Colors.primary,
    lineHeight: 22,
    marginTop: 4,
  },
  footer: {
    backgroundColor: "#E8F0FE",
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  footerText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
    textAlign: "center",
  },
});
