import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";

export default function Index() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure everything is initialized
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Wait for initialization
  if (!isReady) {
    return null;
  }

  // Redirect to home page (accessible without login)
  return <Redirect href="/home" />;
}
