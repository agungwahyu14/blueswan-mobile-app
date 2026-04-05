import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const DURATION = 1500;

export function AnimatedSplashOverlay() {
  const [isComplete, setIsComplete] = useState(false);

  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    // Logo animation
    scale.value = withSequence(
      withTiming(1.1, { duration: 500, easing: Easing.out(Easing.back(1.5)) }),
      withTiming(0.95, { duration: 200 }),
      withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) }),
    );

    opacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.ease),
    });

    // Fade out container after delay
    containerOpacity.value = withDelay(
      1200,
      withTiming(0, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      }),
    );

    // Complete animation
    const timer = setTimeout(() => {
      setIsComplete(true);
    }, DURATION);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  if (isComplete) return null;

  return (
    <Animated.View style={[styles.splashContainer, containerAnimatedStyle]}>
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <Image
          style={styles.logo}
          source={require("@/assets/images/logo.png")}
          contentFit="contain"
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffff",
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 200,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
});
