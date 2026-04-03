import { Colors } from "@/constants/theme";
import { useAuthStore } from "@/store/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const RegisterScreen: React.FC = () => {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nationality, setNationality] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const { register, isLoading, error } = useAuthStore();

  const handleRegister = async () => {
    // Validation
    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber ||
      !nationality ||
      !birthDate
    ) {
      Alert.alert("Error", "Mohon isi semua field");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Password tidak cocok");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password minimal 8 karakter");
      return;
    }

    if (!agreeToTerms) {
      Alert.alert("Error", "Silakan setujui Syarat & Ketentuan");
      return;
    }

    try {
      await register(fullName, email, password, phoneNumber);
      router.replace("/home");
    } catch (err) {
      Alert.alert(
        "Pendaftaran Gagal",
        error || "Tidak dapat membuat akun. Silakan coba lagi.",
      );
    }
  };

  const handleLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          style={styles.scrollView}
        >
          <View style={styles.content}>
            {/* Logo Section */}
            <View style={styles.logoSection}>
              <Image
                source={require("@/assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={[styles.appName, { color: colors.primary }]}>
                Daftar Akun Baru
              </Text>
              <Text style={styles.welcomeText}>Blue Swan Bali</Text>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Nama Lengkap</Text>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: colors.backgroundElement },
                ]}
                placeholder="Masukkan nama lengkap"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                editable={!isLoading}
              />

              <Text style={[styles.label, styles.labelSpaced]}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: colors.backgroundElement },
                ]}
                placeholder="Masukkan email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!isLoading}
              />

              <Text style={[styles.label, styles.labelSpaced]}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    { borderColor: colors.backgroundElement },
                  ]}
                  placeholder="Buat password (min. 8 karakter)"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>

              <Text style={[styles.label, styles.labelSpaced]}>
                Konfirmasi Password
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    { borderColor: colors.backgroundElement },
                  ]}
                  placeholder="Masukkan ulang password"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={24}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>

              <Text style={[styles.label, styles.labelSpaced]}>
                Nomor Telepon
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: colors.backgroundElement },
                ]}
                placeholder="Masukkan nomor telepon"
                placeholderTextColor="#999"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                editable={!isLoading}
              />

              <Text style={[styles.label, styles.labelSpaced]}>
                Kewarganegaraan
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: colors.backgroundElement },
                ]}
                placeholder="Masukkan kewarganegaraan"
                placeholderTextColor="#999"
                value={nationality}
                onChangeText={setNationality}
                autoCapitalize="words"
                editable={!isLoading}
              />

              <Text style={[styles.label, styles.labelSpaced]}>
                Tanggal Lahir
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: colors.backgroundElement },
                ]}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#999"
                value={birthDate}
                onChangeText={setBirthDate}
                keyboardType="numeric"
                editable={!isLoading}
              />
            </View>
          </View>
        </ScrollView>

        {/* Fixed Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Terms Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreeToTerms(!agreeToTerms)}
            disabled={isLoading}
          >
            <View
              style={[
                styles.checkbox,
                { borderColor: colors.primary },
                agreeToTerms && { backgroundColor: colors.primary },
              ]}
            >
              {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>
              Saya setuju dengan{" "}
              <Text style={[styles.checkboxLink, { color: colors.accent }]}>
                Syarat & Ketentuan
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity
            style={[
              styles.registerButton,
              { backgroundColor: colors.primary },
              isLoading && styles.buttonDisabled,
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>Daftar</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={handleLogin} disabled={isLoading}>
              <Text style={[styles.loginLink, { color: colors.accent }]}>
                Masuk
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  logoSection: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 24,
  },
  logo: {
    width: 180,
    height: 160,
  },
  appName: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
  formSection: {
    paddingBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  labelSpaced: {
    marginTop: 16,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#F8F8F8",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 14,
    padding: 4,
  },
  bottomSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
  },
  checkboxLink: {
    fontWeight: "600",
  },
  registerButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#666",
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});
