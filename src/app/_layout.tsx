import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Text, TextInput } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";

// Keep splash screen visible while loading fonts
SplashScreen.preventAutoHideAsync();

// Set global default font for all Text components
// @ts-ignore - defaultProps exists at runtime
if (Text.defaultProps == null) {
  // @ts-ignore
  Text.defaultProps = {};
}
// @ts-ignore
Text.defaultProps.style = { fontFamily: "Poppins_400Regular" };

// Set global default font for all TextInput components
// @ts-ignore - defaultProps exists at runtime
if (TextInput.defaultProps == null) {
  // @ts-ignore
  TextInput.defaultProps = {};
}
// @ts-ignore
TextInput.defaultProps.style = { fontFamily: "Poppins_400Regular" };

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="about-us" />
        <Stack.Screen name="package-detail" />
        <Stack.Screen name="transport-detail" />
        <Stack.Screen name="promo" />
        <Stack.Screen name="promo-detail" />
        <Stack.Screen name="gallery" />
        <Stack.Screen name="tours" />
        <Stack.Screen name="transportation" />
        <Stack.Screen name="change-password" />
        <Stack.Screen name="terms-conditions" />
        <Stack.Screen name="booking-detail" />
      </Stack>
    </ThemeProvider>
  );
}
