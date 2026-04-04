import { Colors } from "@/constants/theme";
import { useAuthStore } from "@/store/auth-store";
import { Ionicons } from "@expo/vector-icons";
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
  const colors = Colors;

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

  const handleLanguage = () => {
    // TODO: Implement language selection
    Alert.alert("Language", "Language selection coming soon");
  };

  const handleTerms = () => {
    router.push("/terms-conditions" as any);
  };

  const handleChangePassword = () => {
    router.push("/change-password" as any);
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
        </View>

        <TouchableOpacity
          style={styles.personalInfoButton}
          onPress={handleEditProfile}
        >
          <Ionicons name="person-outline" size={20} color="#FFFFFF" />
          <Text style={styles.personalInfoText}>Personal Information</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={handleLanguage}>
          <Ionicons name="language-outline" size={20} color={Colors.primary} />
          <Text style={styles.menuButtonText}>Language</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#999"
            style={styles.chevronIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={handleAbout}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={Colors.primary}
          />
          <Text style={styles.menuButtonText}>About</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#999"
            style={styles.chevronIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={handleTerms}>
          <Ionicons
            name="document-text-outline"
            size={20}
            color={Colors.primary}
          />
          <Text style={styles.menuButtonText}>Terms & Conditions</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#999"
            style={styles.chevronIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleChangePassword}
        >
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={Colors.primary}
          />
          <Text style={styles.menuButtonText}>Change Password</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#999"
            style={styles.chevronIcon}
          />
        </TouchableOpacity>
        {/* 
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

        {/* <View style={styles.section}>
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
        </View> */}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out of Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F3FD",
  },
  header: {
    backgroundColor: "#F0F3FD",
    alignItems: "center",
    paddingVertical: 24,
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
  personalInfoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 12,
  },
  personalInfoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 12,
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  chevronIcon: {
    marginLeft: "auto",
  },
  logoutButton: {
    backgroundColor: "#F4433633", // CC setara dengan 80% opacity
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
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
