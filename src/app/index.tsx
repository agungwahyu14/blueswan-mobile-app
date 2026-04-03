import { useAuthStore } from "@/store/auth-store";
import { Redirect } from "expo-router";

export default function Index() {
  const { isAuthenticated } = useAuthStore();

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/login" />;
}
