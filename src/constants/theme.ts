/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  text: "#11468F",
  background: "#FFFFFF",
  backgroundElement: "#F0F0F3",
  backgroundSelected: "#E8F5FF",
  textSecondary: "#60646C",
  primary: "#11468F",
  accent: "#32cc0f",
  tint: "#11468F",
} as const;

export type ThemeColor = keyof typeof Colors;

export const Fonts = Platform.select({
  ios: {
    /** Poppins Regular */
    sans: "Poppins_400Regular",
    serif: "Poppins_400Regular",
    /** Poppins SemiBold for rounded appearance */
    rounded: "Poppins_600SemiBold",
    /** Poppins Regular for monospace fallback */
    mono: "Poppins_400Regular",
  },
  android: {
    sans: "Poppins_400Regular",
    serif: "Poppins_400Regular",
    rounded: "Poppins_600SemiBold",
    mono: "Poppins_400Regular",
  },
  default: {
    sans: "Poppins_400Regular",
    serif: "Poppins_400Regular",
    rounded: "Poppins_600SemiBold",
    mono: "Poppins_400Regular",
  },
  web: {
    sans: "Poppins, var(--font-display), sans-serif",
    serif: "Poppins, var(--font-serif), serif",
    rounded: "Poppins, var(--font-rounded), sans-serif",
    mono: "Poppins, var(--font-mono), monospace",
  },
});

// Font weight mapping for Poppins
export const FontWeights = {
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

// Font family mapping for React Native
export const FontFamilies = {
  light: "Poppins_300Light",
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semibold: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
