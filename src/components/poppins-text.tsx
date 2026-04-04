import { FontFamilies } from "@/constants/theme";
import React from "react";
import { Text as RNText, StyleSheet, TextProps } from "react-native";

export function Text({ style, ...props }: TextProps) {
  return <RNText style={[styles.defaultText, style]} {...props} />;
}

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: FontFamilies.regular,
  },
});
