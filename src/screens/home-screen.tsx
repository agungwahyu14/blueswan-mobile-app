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
  const colors = Colors[scheme ?? "light"];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.backgroundElement,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 100 : 80,
          paddingBottom: Platform.OS === "ios" ? 30 : 15,
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "600",
        },
        tabBarIconStyle: {
          marginTop: 4,
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
