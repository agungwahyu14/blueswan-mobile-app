import { Colors } from "@/constants/theme";
import { useAuthStore } from "@/store/auth-store";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProfileRowProps {
  icon: string;
  label: string;
  value?: string;
}

const ProfileRow: React.FC<ProfileRowProps> = ({ icon, label, value }) => (
  <View style={styles.row}>
    <View style={styles.rowLeft}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
    <View style={styles.rowRight}>
      {value && <Text style={styles.rowValue}>{value}</Text>}
    </View>
  </View>
);

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuthStore();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  const handleEditProfile = () => {
    router.push("/edit-profile" as any);
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleAbout = () => {
    router.push("/about-us" as any);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login" as any);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <View
                style={[
                  styles.avatarPlaceholder,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.name || "User"}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {user?.is_verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.editButton, { borderColor: colors.accent }]}
            onPress={handleEditProfile}
          >
            <Text style={[styles.editButtonText, { color: colors.accent }]}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.card}>
            <ProfileRow
              icon="👤"
              label="Name"
              value={user?.name || "Not set"}
            />
            <View style={styles.divider} />
            <ProfileRow icon="📧" label="Email" value={user?.email} />
            <View style={styles.divider} />
            <ProfileRow
              icon="📱"
              label="Phone Number"
              value={user?.phone_number || "Not set"}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon="🌍"
              label="Nationality"
              value={user?.nationality || "Not set"}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon="🎂"
              label="Date of Birth"
              value={
                user?.date_of_birth
                  ? new Date(user.date_of_birth).toLocaleDateString()
                  : "Not set"
              }
            />
          </View>
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <ProfileRow
              icon="👥"
              label="Role"
              value={user?.role?.name || "User"}
            />
          </View>
        </View> */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.row}
              onPress={handleAbout}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <Text style={styles.rowIcon}>ℹ️</Text>
                <Text style={styles.rowLabel}>About</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.chevron}>›</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
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
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  verifiedBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  verifiedText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  editButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    marginTop: 16,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
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
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rowIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 16,
    color: "#333",
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowValue: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  chevron: {
    fontSize: 24,
    color: "#ccc",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 48,
  },
  logoutButton: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F44336",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F44336",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    marginTop: 24,
    marginBottom: 32,
  },
});
