import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Platform, useColorScheme } from "react-native";
import { BookingsScreen } from "./bookings-screen";
import { DestinationsScreen } from "./destinations-screen";
import { ProfileScreen } from "./profile-screen";

const Tab = createBottomTabNavigator();

export const HomeScreen: React.FC = () => {
  const scheme = useColorScheme();
  const colors = Colors;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          height: Platform.OS === "ios" ? 100 : 80,
          paddingBottom: Platform.OS === "ios" ? 30 : 15,
          paddingTop: 12,
          borderTopWidth: 0, // Hapus garis agar lebih clean
          elevation: 8, // Bayangan untuk Android
          shadowColor: "#000", // Bayangan untuk iOS
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,

          textTransform: "uppercase",
          fontWeight: "600",
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tab.Screen
        name="Jelajah"
        component={DestinationsScreen}
        options={{
          title: "Jelajah",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Pesanan"
        component={BookingsScreen}
        options={{
          title: "Pesanan",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
