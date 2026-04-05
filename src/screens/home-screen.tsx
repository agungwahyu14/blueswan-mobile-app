import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookingsScreen } from "./bookings-screen";
import { DestinationsScreen } from "./destinations-screen";
import { ProfileScreen } from "./profile-screen";

type TabName = "explore" | "bookings" | "profile";

export const HomeScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>("explore");
  const tabAnimation = useRef(new Animated.Value(0)).current;
  const [tabBarWidth, setTabBarWidth] = useState(0);

  // Animate tab indicator when activeTab changes
  useEffect(() => {
    const tabIndex =
      activeTab === "explore" ? 0 : activeTab === "bookings" ? 1 : 2;
    Animated.spring(tabAnimation, {
      toValue: tabIndex,
      useNativeDriver: true,
      damping: 20,
      stiffness: 300,
    }).start();
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "explore":
        return <DestinationsScreen />;
      case "bookings":
        return <BookingsScreen />;
      case "profile":
        return <ProfileScreen />;
      default:
        return <DestinationsScreen />;
    }
  };

  const tabs = [
    { name: "explore" as TabName, label: "Jelajah", icon: "compass" },
    { name: "bookings" as TabName, label: "Pesanan", icon: "calendar" },
    { name: "profile" as TabName, label: "Profil", icon: "person" },
  ];

  return (
    <View style={styles.container}>
      {/* Content Area */}
      <View style={styles.content}>{renderContent()}</View>

      {/* Custom Animated Tab Bar */}
      <SafeAreaView edges={["bottom"]} style={styles.tabBarWrapper}>
        <View
          style={styles.tabBar}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setTabBarWidth(width);
          }}
        >
          {/* Animated Indicator */}
          {tabBarWidth > 0 && (
            <Animated.View
              style={[
                styles.tabIndicator,
                {
                  width: tabBarWidth / 3,
                  transform: [
                    {
                      translateX: tabAnimation.interpolate({
                        inputRange: [0, 1, 2],
                        outputRange: [
                          0,
                          tabBarWidth / 3,
                          (tabBarWidth / 3) * 2,
                        ],
                      }),
                    },
                  ],
                },
              ]}
            />
          )}

          {/* Tab Buttons */}
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.name;
            const tabIndex = index;

            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.tabButton}
                onPress={() => setActiveTab(tab.name)}
                activeOpacity={0.7}
              >
                {/* Animated Background for Active Tab */}
                <Animated.View
                  style={[
                    styles.tabBackground,
                    {
                      opacity: tabAnimation.interpolate({
                        inputRange: [tabIndex - 0.5, tabIndex, tabIndex + 0.5],
                        outputRange: [0, 1, 0],
                        extrapolate: "clamp",
                      }),
                      transform: [
                        {
                          scale: tabAnimation.interpolate({
                            inputRange: [
                              tabIndex - 0.5,
                              tabIndex,
                              tabIndex + 0.5,
                            ],
                            outputRange: [0.8, 1, 0.8],
                            extrapolate: "clamp",
                          }),
                        },
                      ],
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.tabIconContainer,
                    {
                      transform: [
                        {
                          scale: tabAnimation.interpolate({
                            inputRange: [tabIndex - 1, tabIndex, tabIndex + 1],
                            outputRange: [1, 1.1, 1],
                            extrapolate: "clamp",
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Animated.View
                    style={{
                      opacity: tabAnimation.interpolate({
                        inputRange: [tabIndex - 0.5, tabIndex, tabIndex + 0.5],
                        outputRange: [0.5, 1, 0.5],
                        extrapolate: "clamp",
                      }),
                    }}
                  >
                    <Ionicons
                      name={tab.icon as any}
                      size={24}
                      color={isActive ? Colors.primary : Colors.textSecondary}
                    />
                  </Animated.View>
                </Animated.View>
                <Animated.Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isActive ? Colors.primary : Colors.textSecondary,
                      fontWeight: isActive ? "600" : "500",
                      opacity: tabAnimation.interpolate({
                        inputRange: [tabIndex - 0.5, tabIndex, tabIndex + 0.5],
                        outputRange: [0.6, 1, 0.6],
                        extrapolate: "clamp",
                      }),
                    },
                  ]}
                >
                  {tab.label}
                </Animated.Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  tabBarWrapper: {
    backgroundColor: "#fff",
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 8 : 12,
    position: "relative",
  },
  tabIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    position: "relative",
  },
  tabBackground: {
    position: "absolute",
    top: 4,
    bottom: 4,
    left: 8,
    right: 8,
    backgroundColor: "#E8F5FF",
    borderRadius: 12,
  },
  tabIconContainer: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
