import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import { useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.primary,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: colors.backgroundElement,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Destinations",
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name="map.fill"
              size={size}
              tintColor={color}
              type="hierarchical"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Tours",
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name="camera.metering.multispot"
              size={size}
              tintColor={color}
              type="hierarchical"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name="calendar.badge.checkmark"
              size={size}
              tintColor={color}
              type="hierarchical"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name="person.crop.circle.fill"
              size={size}
              tintColor={color}
              type="hierarchical"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="about-us"
        options={{
          href: null, // Hide from tabs
        }}
      />

      <Tabs.Screen
        name="welcome"
        options={{
          href: null, // Hide from tabs
        }}
      />

      <Tabs.Screen
        name="login"
        options={{
          href: null, // Hide from tabs
        }}
      />

      <Tabs.Screen
        name="register"
        options={{
          href: null, // Hide from tabs
        }}
      />
    </Tabs>
  );
}
