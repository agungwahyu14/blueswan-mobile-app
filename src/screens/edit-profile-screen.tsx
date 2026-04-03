import { Colors } from "@/constants/theme";
import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const EditProfileScreen: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || "");
  const [nationality, setNationality] = useState(user?.nationality || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    user?.date_of_birth
      ? new Date(user.date_of_birth).toISOString().split("T")[0]
      : "",
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert("Error", "Name and email are required");
      return;
    }

    setIsLoading(true);

    try {
      const updatedUser = await authService.updateProfile({
        name,
        email,
        phone_number: phoneNumber,
        nationality,
        date_of_birth: dateOfBirth,
      });

      setUser(updatedUser);
      Alert.alert("Success", "Profile updated successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to update profile",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    // Convert YYYY-MM-DD to DD/MM/YYYY for display
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            { borderBottomColor: colors.backgroundElement },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Edit Profile
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.form}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.backgroundElement }]}
              placeholder="Enter your name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              editable={!isLoading}
            />

            <Text style={[styles.label, styles.labelSpaced]}>Email *</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.backgroundElement }]}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />

            <Text style={[styles.label, styles.labelSpaced]}>Phone Number</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.backgroundElement }]}
              placeholder="Enter your phone number"
              placeholderTextColor="#999"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              editable={!isLoading}
            />

            <Text style={[styles.label, styles.labelSpaced]}>Nationality</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.backgroundElement }]}
              placeholder="Enter your nationality"
              placeholderTextColor="#999"
              value={nationality}
              onChangeText={setNationality}
              editable={!isLoading}
            />

            <Text style={[styles.label, styles.labelSpaced]}>
              Date of Birth
            </Text>
            <TextInput
              style={[styles.input, { borderColor: colors.backgroundElement }]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#999"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              editable={!isLoading}
            />
            <Text style={styles.hint}>
              Format: YYYY-MM-DD (e.g., 1990-01-15)
            </Text>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: colors.primary },
              isLoading && styles.buttonDisabled,
            ]}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  labelSpaced: {
    marginTop: 16,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#F8F8F8",
  },
  hint: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  saveButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
